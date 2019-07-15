import {createTypedArray} from './helpers/arrays';
import BezierFactory from './lib/BezierEaser';
import bez from './bez';

const initFrame = -999999;
const mathAbs = Math.abs;
const degToRads = Math.PI/180;

/**
 * based on @Toji's https://github.com/toji/gl-matrix/
 * @param {*} a a
 * @param {*} b a
 * @param {*} t a
 * @return {*}
 */
function slerp(a, b, t) {
  const out = [];
  const ax = a[0];
  const ay = a[1];
  const az = a[2];
  const aw = a[3];
  let bx = b[0];
  let by = b[1];
  let bz = b[2];
  let bw = b[3];

  let omega;
  let cosom;
  let sinom;
  let scale0;
  let scale1;

  cosom = ax * bx + ay * by + az * bz + aw * bw;
  if (cosom < 0.0) {
    cosom = -cosom;
    bx = -bx;
    by = -by;
    bz = -bz;
    bw = -bw;
  }
  if ((1.0 - cosom) > 0.000001) {
    omega = Math.acos(cosom);
    sinom = Math.sin(omega);
    scale0 = Math.sin((1.0 - t) * omega) / sinom;
    scale1 = Math.sin(t * omega) / sinom;
  } else {
    scale0 = 1.0 - t;
    scale1 = t;
  }
  out[0] = scale0 * ax + scale1 * bx;
  out[1] = scale0 * ay + scale1 * by;
  out[2] = scale0 * az + scale1 * bz;
  out[3] = scale0 * aw + scale1 * bw;

  return out;
}

/**
 * a
 * @param {*} out a
 * @param {*} quat a
 */
function quaternionToEuler(out, quat) {
  const qx = quat[0];
  const qy = quat[1];
  const qz = quat[2];
  const qw = quat[3];
  const heading = Math.atan2(2 * qy * qw - 2 * qx * qz, 1 - 2 * qy * qy - 2 * qz * qz);
  const attitude = Math.asin(2 * qx * qy + 2 * qz * qw);
  const bank = Math.atan2(2 * qx * qw - 2 * qy * qz, 1 - 2 * qx * qx - 2 * qz * qz);
  out[0] = heading / degToRads;
  out[1] = attitude / degToRads;
  out[2] = bank / degToRads;
}

/**
 * a
 * @param {*} values a
 * @return {*}
 */
function createQuaternion(values) {
  const heading = values[0] * degToRads;
  const attitude = values[1] * degToRads;
  const bank = values[2] * degToRads;
  const c1 = Math.cos(heading / 2);
  const c2 = Math.cos(attitude / 2);
  const c3 = Math.cos(bank / 2);
  const s1 = Math.sin(heading / 2);
  const s2 = Math.sin(attitude / 2);
  const s3 = Math.sin(bank / 2);
  const w = c1 * c2 * c3 - s1 * s2 * s3;
  const x = s1 * s2 * c3 + c1 * c2 * s3;
  const y = s1 * c2 * c3 + c1 * s2 * s3;
  const z = c1 * s2 * c3 - s1 * c2 * s3;

  return [x, y, z, w];
}

/**
 * a
 */
class BaseProperty {
  /**
   * a
   */
  constructor() {
    this.offsetTime = 0;
    this.keyframes = null;
    this.propType = '';
  }

  /**
   * a
   * @param {*} frameNum a
   * @param {*} caching a
   * @return {*}
   */
  interpolateValue(frameNum, caching) {
    const offsetTime = this.offsetTime;
    let newValue;
    if (this.propType === 'multidimensional') {
      newValue = createTypedArray('float32', this.pv.length);
    }
    let iterationIndex = caching.lastIndex;
    let i = iterationIndex;
    const len = this.keyframes.length - 1;
    let flag = true;
    let keyData;
    let nextKeyData;

    while (flag) {
      keyData = this.keyframes[i];
      nextKeyData = this.keyframes[i + 1];
      if (i === len - 1 && frameNum >= nextKeyData.t - offsetTime) {
        if (keyData.h) {
          keyData = nextKeyData;
        }
        iterationIndex = 0;
        break;
      }
      if ((nextKeyData.t - offsetTime) > frameNum) {
        iterationIndex = i;
        break;
      }
      if (i < len - 1) {
        i += 1;
      } else {
        iterationIndex = 0;
        flag = false;
      }
    }

    let k;
    let kLen;
    let perc;
    let jLen;
    let j;
    let fnc;
    const nextKeyTime = nextKeyData.t - offsetTime;
    const keyTime = keyData.t - offsetTime;
    let endValue;
    if (keyData.to) {
      if (!keyData.bezierData) {
        keyData.bezierData = bez.buildBezierData(keyData.s, nextKeyData.s || keyData.e, keyData.to, keyData.ti);
      }
      const bezierData = keyData.bezierData;
      if (frameNum >= nextKeyTime || frameNum < keyTime) {
        const ind = frameNum >= nextKeyTime ? bezierData.points.length - 1 : 0;
        kLen = bezierData.points[ind].point.length;
        for (k = 0; k < kLen; k += 1) {
          newValue[k] = bezierData.points[ind].point[k];
        }
        // caching._lastKeyframeIndex = -1;
      } else {
        if (keyData.__fnct) {
          fnc = keyData.__fnct;
        } else {
          fnc = BezierFactory.getBezierEasing(keyData.o.x, keyData.o.y, keyData.i.x, keyData.i.y, keyData.n).get;
          keyData.__fnct = fnc;
        }
        perc = fnc((frameNum - keyTime) / (nextKeyTime - keyTime));
        const distanceInLine = bezierData.segmentLength * perc;

        let segmentPerc;
        let addedLength = (caching.lastFrame < frameNum && caching._lastKeyframeIndex === i) ? caching._lastAddedLength : 0;
        j = (caching.lastFrame < frameNum && caching._lastKeyframeIndex === i) ? caching._lastPoint : 0;
        flag = true;
        jLen = bezierData.points.length;
        while (flag) {
          addedLength += bezierData.points[j].partialLength;
          if (distanceInLine === 0 || perc === 0 || j === bezierData.points.length - 1) {
            kLen = bezierData.points[j].point.length;
            for (k = 0; k < kLen; k += 1) {
              newValue[k] = bezierData.points[j].point[k];
            }
            break;
          } else if (distanceInLine >= addedLength && distanceInLine < addedLength + bezierData.points[j + 1].partialLength) {
            segmentPerc = (distanceInLine - addedLength) / bezierData.points[j + 1].partialLength;
            kLen = bezierData.points[j].point.length;
            for (k = 0; k < kLen; k += 1) {
              newValue[k] = bezierData.points[j].point[k] + (bezierData.points[j + 1].point[k] - bezierData.points[j].point[k]) * segmentPerc;
            }
            break;
          }
          if (j < jLen - 1) {
            j += 1;
          } else {
            flag = false;
          }
        }
        caching._lastPoint = j;
        caching._lastAddedLength = addedLength - bezierData.points[j].partialLength;
        caching._lastKeyframeIndex = i;
      }
    } else {
      let outX;
      let outY;
      let inX;
      let inY;
      let keyValue;
      const len = keyData.s.length;
      endValue = nextKeyData.s || keyData.e;
      if (this.sh && keyData.h !== 1) {
        if (frameNum >= nextKeyTime) {
          newValue[0] = endValue[0];
          newValue[1] = endValue[1];
          newValue[2] = endValue[2];
        } else if (frameNum <= keyTime) {
          newValue[0] = keyData.s[0];
          newValue[1] = keyData.s[1];
          newValue[2] = keyData.s[2];
        } else {
          const quatStart = createQuaternion(keyData.s);
          const quatEnd = createQuaternion(endValue);
          const time = (frameNum - keyTime) / (nextKeyTime - keyTime);
          quaternionToEuler(newValue, slerp(quatStart, quatEnd, time));
        }
      } else {
        for (i = 0; i < len; i += 1) {
          if (keyData.h !== 1) {
            if (frameNum >= nextKeyTime) {
              perc = 1;
            } else if (frameNum < keyTime) {
              perc = 0;
            } else {
              if (keyData.o.x.constructor === Array) {
                if (!keyData.__fnct) {
                  keyData.__fnct = [];
                }
                if (!keyData.__fnct[i]) {
                  outX = (typeof keyData.o.x[i] === 'undefined') ? keyData.o.x[0] : keyData.o.x[i];
                  outY = (typeof keyData.o.y[i] === 'undefined') ? keyData.o.y[0] : keyData.o.y[i];
                  inX = (typeof keyData.i.x[i] === 'undefined') ? keyData.i.x[0] : keyData.i.x[i];
                  inY = (typeof keyData.i.y[i] === 'undefined') ? keyData.i.y[0] : keyData.i.y[i];
                  fnc = BezierFactory.getBezierEasing(outX, outY, inX, inY).get;
                  keyData.__fnct[i] = fnc;
                } else {
                  fnc = keyData.__fnct[i];
                }
              } else {
                if (!keyData.__fnct) {
                  outX = keyData.o.x;
                  outY = keyData.o.y;
                  inX = keyData.i.x;
                  inY = keyData.i.y;
                  fnc = BezierFactory.getBezierEasing(outX, outY, inX, inY).get;
                  keyData.__fnct = fnc;
                } else {
                  fnc = keyData.__fnct;
                }
              }
              perc = fnc((frameNum - keyTime) / (nextKeyTime - keyTime));
            }
          }

          endValue = nextKeyData.s || keyData.e;
          keyValue = keyData.h === 1 ? keyData.s[i] : keyData.s[i] + (endValue[i] - keyData.s[i]) * perc;

          if (len === 1) {
            newValue = keyValue;
          } else {
            newValue[i] = keyValue;
          }
        }
      }
    }
    caching.lastIndex = iterationIndex;
    return newValue;
  }

  /**
   * a
   * @param {*} _frameNum a
   * @return {*}
   */
  getValueAtCurrentTime(_frameNum) {
    const frameNum = _frameNum - this.offsetTime;
    const initTime = this.keyframes[0].t - this.offsetTime;
    const endTime = this.keyframes[this.keyframes.length - 1].t - this.offsetTime;
    if (!(frameNum === this._caching.lastFrame || (this._caching.lastFrame !== initFrame && ((this._caching.lastFrame >= endTime && frameNum >= endTime) || (this._caching.lastFrame < initTime && frameNum < initTime))))) {
      if (this._caching.lastFrame >= frameNum) {
        this._caching._lastKeyframeIndex = -1;
        this._caching.lastIndex = 0;
      }

      const renderResult = this.interpolateValue(frameNum, this._caching);
      this.pv = renderResult;
    }
    this._caching.lastFrame = frameNum;
    return this.pv;
  }

  /**
   * a
   * @param {*} val a
   */
  setVValue(val) {
    let multipliedValue;
    if (this.propType === 'unidimensional') {
      multipliedValue = val * this.mult;
      if (mathAbs(this.v - multipliedValue) > 0.00001) {
        this.v = multipliedValue;
        this._mdf = true;
      }
    } else {
      let i = 0;
      const len = this.v.length;
      while (i < len) {
        multipliedValue = val[i] * this.mult;
        if (mathAbs(this.v[i] - multipliedValue) > 0.00001) {
          this.v[i] = multipliedValue;
          this._mdf = true;
        }
        i += 1;
      }
    }
  }

  /**
   * a
   * @param {*} frameNum a
   */
  processEffectsSequence(frameNum) {
    if (!this.effectsSequence.length) {
      return;
    }
    if (this.lock) {
      this.setVValue(this.pv);
      return;
    }
    this.lock = true;
    this._mdf = this._isFirstFrame;
    // var multipliedValue;
    const len = this.effectsSequence.length;
    let finalValue = this.kf ? this.pv : this.data.k;
    for (let i = 0; i < len; i += 1) {
      finalValue = this.effectsSequence[i](frameNum);
    }
    this.setVValue(finalValue);
    this._isFirstFrame = false;
    this.lock = false;
  }

  /**
   * a
   * @param {*} effectFunction a
   */
  addEffect(effectFunction) {
    this.effectsSequence.push(effectFunction);
    this.container.addDynamicProperty(this);
  }
}


/**
 * a
 */
class ValueProperty extends BaseProperty {
  /**
   * a
   * @param {*} elem a
   * @param {*} data a
   * @param {*} mult a
   * @param {*} container a
   */
  constructor(elem, data, mult, container) {
    super();
    this.propType = 'unidimensional';
    this.mult = mult || 1;
    this.data = data;
    this.v = mult ? data.k * mult : data.k;
    this.pv = data.k;
    this._mdf = false;
    this.elem = elem;
    this.container = container;
    this.k = false;
    this.kf = false;
    this.vel = 0;
    this.effectsSequence = [];
    this._isFirstFrame = true;
    this.getValue = this.processEffectsSequence;
  }
}

/**
 * a
 */
class MultiDimensionalProperty extends BaseProperty {
  /**
   * a
   * @param {*} elem a
   * @param {*} data a
   * @param {*} mult a
   * @param {*} container a
   */
  constructor(elem, data, mult, container) {
    super();
    this.propType = 'multidimensional';
    this.mult = mult || 1;
    this.data = data;
    this._mdf = false;
    this.elem = elem;
    this.container = container;
    this.k = false;
    this.kf = false;
    const len = data.k.length;
    this.v = createTypedArray('float32', len);
    this.pv = createTypedArray('float32', len);
    // var arr = createTypedArray('float32', len);
    this.vel = createTypedArray('float32', len);
    for (let i = 0; i < len; i += 1) {
      this.v[i] = data.k[i] * this.mult;
      this.pv[i] = data.k[i];
    }
    this._isFirstFrame = true;
    this.effectsSequence = [];
    this.getValue = this.processEffectsSequence;
    // this.setVValue = setVValue;
    // this.addEffect = addEffect;
  }
}

/**
 * a
 */
class KeyframedValueProperty extends BaseProperty {
  /**
   * a
   * @param {*} elem a
   * @param {*} data a
   * @param {*} mult a
   * @param {*} container a
   */
  constructor(elem, data, mult, container) {
    super();
    this.propType = 'unidimensional';
    this.keyframes = data.k;
    this.offsetTime = elem.data.st;
    this._caching = {
      lastFrame: initFrame,
      lastIndex: 0,
      value: 0,
      _lastKeyframeIndex: -1,
    };
    this.k = true;
    this.kf = true;
    this.data = data;
    this.mult = mult || 1;
    this.elem = elem;
    this.container = container;
    this.v = initFrame;
    this.pv = initFrame;
    this._isFirstFrame = true;
    this.getValue = this.processEffectsSequence;
    this.effectsSequence = [this.getValueAtCurrentTime.bind(this)];
  }
}


/**
 * a
 */
class KeyframedMultidimensionalProperty extends BaseProperty {
  /**
   * a
   * @param {*} elem a
   * @param {*} data a
   * @param {*} mult a
   * @param {*} container a
   */
  constructor(elem, data, mult, container) {
    super();
    this.propType = 'multidimensional';
    const len = data.k.length;
    let s;
    let e;
    let to;
    let ti;
    for (let i = 0; i < len - 1; i += 1) {
      if (data.k[i].to && data.k[i].s && data.k[i].e) {
        s = data.k[i].s;
        e = data.k[i].e;
        to = data.k[i].to;
        ti = data.k[i].ti;
        if ((s.length === 2 && !(s[0] === e[0] && s[1] === e[1]) && bez.pointOnLine2D(s[0], s[1], e[0], e[1], s[0] + to[0], s[1] + to[1]) && bez.pointOnLine2D(s[0], s[1], e[0], e[1], e[0] + ti[0], e[1] + ti[1])) || (s.length === 3 && !(s[0] === e[0] && s[1] === e[1] && s[2] === e[2]) && bez.pointOnLine3D(s[0], s[1], s[2], e[0], e[1], e[2], s[0] + to[0], s[1] + to[1], s[2] + to[2]) && bez.pointOnLine3D(s[0], s[1], s[2], e[0], e[1], e[2], e[0] + ti[0], e[1] + ti[1], e[2] + ti[2]))) {
          data.k[i].to = null;
          data.k[i].ti = null;
        }
        if (s[0] === e[0] && s[1] === e[1] && to[0] === 0 && to[1] === 0 && ti[0] === 0 && ti[1] === 0) {
          if (s.length === 2 || (s[2] === e[2] && to[2] === 0 && ti[2] === 0)) {
            data.k[i].to = null;
            data.k[i].ti = null;
          }
        }
      }
    }
    this.effectsSequence = [this.getValueAtCurrentTime.bind(this)];
    this.keyframes = data.k;
    this.offsetTime = elem.data.st;
    this.k = true;
    this.kf = true;
    this._isFirstFrame = true;
    this.mult = mult || 1;
    this.elem = elem;
    this.container = container;
    this.getValue = this.processEffectsSequence;
    const arrLen = data.k[0].s.length;
    this.v = createTypedArray('float32', arrLen);
    this.pv = createTypedArray('float32', arrLen);
    for (let i = 0; i < arrLen; i += 1) {
      this.v[i] = initFrame;
      this.pv[i] = initFrame;
    }
    this._caching = {
      lastFrame: initFrame,
      lastIndex: 0,
      value: createTypedArray('float32', arrLen),
    };
  }
}

/**
 * a
 * @param {*} elem a
 * @param {*} data a
 * @param {*} type a
 * @param {*} mult a
 * @param {*} container a
 * @return {*}
 */
function PropertyFactory(elem, data, type, mult, container) {
  let p;
  if (!data.k.length) {
    p = new ValueProperty(elem, data, mult, container);
  } else if (typeof (data.k[0]) === 'number') {
    p = new MultiDimensionalProperty(elem, data, mult, container);
  } else {
    switch (type) {
    case 0:
      p = new KeyframedValueProperty(elem, data, mult, container);
      break;
    case 1:
      p = new KeyframedMultidimensionalProperty(elem, data, mult, container);
      break;
    }
  }
  if (p.effectsSequence.length) {
    container.addDynamicProperty(p);
  }
  return p;
}

export default PropertyFactory;
