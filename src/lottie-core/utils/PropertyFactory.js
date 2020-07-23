import {createTypedArray} from './helpers/arrays';
import BezierFactory from './lib/BezierEaser';
import bez from './bez';
import {degToRads, initialDefaultFrame as initFrame} from '../constant/index';
import Expression from './expression/Expression';

/**
 * based on @Toji's https://github.com/toji/gl-matrix/
 * slerp with quaternion
 * @param {*} a from a
 * @param {*} b to b
 * @param {*} t progress
 * @return {Array}
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
 * quaternion to euler
 * @param {Array} out out euler pointer
 * @param {Array} quat origin quaternion
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
 * create a quaternion from euler
 * @param {Array} values origin euler
 * @return {Array} quaternion
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
 * basic property for animate property unit
 */
class BaseProperty {
  /**
   * interpolate value
   * @param {Number} frameNum now frame
   * @param {Object} caching caching object
   * @return {Array} newValue
   */
  interpolateValue(frameNum, caching) {
    // const offsetTime = this.offsetTime;
    let newValue;
    if (this.propType === 'multidimensional') {
      newValue = createTypedArray('float32', this.pv.length);
    }
    let iterationIndex = caching.lastIndex;
    let i = iterationIndex;
    let len = this.keyframes.length - 1;
    let flag = true;
    let keyData; let nextKeyData;

    while (flag) {
      keyData = this.keyframes[i];
      nextKeyData = this.keyframes[i + 1];
      if (i === len - 1 && frameNum >= nextKeyData.t) {
        if (keyData.h) {
          keyData = nextKeyData;
        }
        iterationIndex = 0;
        break;
      }
      if (nextKeyData.t > frameNum) {
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

    let k; let kLen; let perc; let jLen; let j; let fnc;
    let nextKeyTime = nextKeyData.t;
    let keyTime = keyData.t;
    let endValue;
    if (keyData.to) {
      if (!keyData.bezierData) {
        keyData.bezierData = bez.buildBezierData(keyData.s, nextKeyData.s || keyData.e, keyData.to, keyData.ti);
      }
      let bezierData = keyData.bezierData;
      if (frameNum >= nextKeyTime || frameNum < keyTime) {
        let ind = frameNum >= nextKeyTime ? bezierData.points.length - 1 : 0;
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
        let distanceInLine = bezierData.segmentLength*perc;

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
      let outX; let outY; let inX; let inY; let keyValue;
      len = keyData.s.length;
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
          let quatStart = createQuaternion(keyData.s);
          let quatEnd = createQuaternion(endValue);
          let time = (frameNum - keyTime) / (nextKeyTime - keyTime);
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
              perc = fnc((frameNum - keyTime) / (nextKeyTime - keyTime ));
            }
          }

          endValue = nextKeyData.s || keyData.e;
          keyValue = keyData.h === 1 ? keyData.s[i] : keyData.s[i] + (endValue[i] - keyData.s[i]) * perc;

          if (this.propType === 'multidimensional') {
            newValue[i] = keyValue;
          } else {
            newValue = keyValue;
          }
        }
      }
    }
    caching.lastIndex = iterationIndex;
    return newValue;
  }

  /**
   * get value at comp frame
   * @param {*} frameNum a
   * @return {Array|Number}
   */
  getValueAtCurrentTime(frameNum) {
    // let frameNum = this.comp.renderedFrame;
    let initTime = this.keyframes[0].t;
    let endTime = this.keyframes[this.keyframes.length- 1].t;
    if (!(frameNum === this._caching.lastFrame || (this._caching.lastFrame !== initFrame && ((this._caching.lastFrame >= endTime && frameNum >= endTime) || (this._caching.lastFrame < initTime && frameNum < initTime))))) {
      if (this._caching.lastFrame >= frameNum) {
        this._caching._lastKeyframeIndex = -1;
        this._caching.lastIndex = 0;
      }

      let renderResult = this.interpolateValue(frameNum, this._caching);
      this.pv = renderResult;
    }
    this._caching.lastFrame = frameNum;
    return this.pv;
  }

  /**
   * set value to this.v prop
   * @param {Array|Number} val value
   */
  setVValue(val) {
    let multipliedValue;
    if (this.propType === 'unidimensional') {
      multipliedValue = val * this.mult;
      if (Math.abs(this.v - multipliedValue) > 0.00001) {
        this.v = multipliedValue;
        this._mdf = true;
      }
    } else {
      let i = 0;
      const len = this.v.length;
      while (i < len) {
        multipliedValue = val[i] * this.mult;
        if (Math.abs(this.v[i] - multipliedValue) > 0.00001) {
          this.v[i] = multipliedValue;
          this._mdf = true;
        }
        i += 1;
      }
    }
  }

  /**
   * process effects sequence
   * @param {*} frameNum a
   */
  processEffectsSequence(frameNum) {
    if (this.expression) {
      frameNum = this.expression.update(frameNum);
    }
    if (frameNum === this.frameId || !this.effectsSequence.length) {
      return;
    }
    if (this.lock) {
      this.setVValue(this.pv);
      return;
    }
    this.lock = true;
    this._mdf = this._isFirstFrame;
    // let multipliedValue;
    let i; let len = this.effectsSequence.length;
    let finalValue = this.kf ? this.pv : this.data.k;
    for (i = 0; i < len; i += 1) {
      finalValue = this.effectsSequence[i](frameNum);
    }
    this.setVValue(finalValue);
    this._isFirstFrame = false;
    this.lock = false;
    this.frameId = frameNum;
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
 * unidimensional value property
 */
class ValueProperty extends BaseProperty {
  /**
   * constructor unidimensional value property
   * @param {*} elem element node
   * @param {*} data unidimensional value property data
   * @param {*} mult data mult scale
   * @param {*} container value property container
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
 * multidimensional value property
 */
class MultiDimensionalProperty extends BaseProperty {
  /**
   * constructor multidimensional value property
   * @param {*} elem element node
   * @param {*} data multidimensional value property data
   * @param {*} mult data mult scale
   * @param {*} container value property container
   */
  constructor(elem, data, mult, container) {
    super();
    this.propType = 'multidimensional';
    this.mult = mult || 1;
    this.data = data;
    this._mdf = false;
    this.elem = elem;
    this.container = container;
    this.comp = elem.comp;
    this.k = false;
    this.kf = false;
    this.frameId = -1;
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
  }
}

/**
 * keyframed unidimensional value property
 */
class KeyframedValueProperty extends BaseProperty {
  /**
   * constructor keyframed unidimensional value property
   * @param {*} elem element node
   * @param {*} data keyframed unidimensional value property data
   * @param {*} mult data mult scale
   * @param {*} container value property container
   */
  constructor(elem, data, mult, container) {
    super();
    this.propType = 'unidimensional';
    this.keyframes = data.k;
    // this.offsetTime = elem.data.st;
    this.frameId = -1;
    this._caching = {lastFrame: initFrame, lastIndex: 0, value: 0, _lastKeyframeIndex: -1};
    this.k = true;
    this.kf = true;
    this.data = data;
    this.mult = mult || 1;
    this.elem = elem;
    this.container = container;
    this.comp = elem.comp;
    this.v = initFrame;
    this.pv = initFrame;
    this._isFirstFrame = true;
    this.getValue = this.processEffectsSequence;
    // this.setVValue = setVValue;
    // this.interpolateValue = interpolateValue;
    this.effectsSequence = [this.getValueAtCurrentTime.bind(this)];
    // this.addEffect = addEffect;

    this._hasOutTypeExpression = false;
    if (Expression.hasSupportExpression(data)) {
      this.expression = Expression.getExpression(data);
      this._hasOutTypeExpression = this.expression.type === 'out';
    }
  }
}

/**
 * keyframed multidimensional value property
 */
class KeyframedMultidimensionalProperty extends BaseProperty {
  /**
   * constructor keyframed multidimensional value property
   * @param {*} elem element node
   * @param {*} data keyframed multidimensional value property data
   * @param {*} mult data mult scale
   * @param {*} container value property container
   */
  constructor(elem, data, mult, container) {
    super();
    this.propType = 'multidimensional';
    let i; let len = data.k.length;
    let s; let e; let to; let ti;
    for (i = 0; i < len - 1; i += 1) {
      if (data.k[i].to && data.k[i].s && data.k[i + 1] && data.k[i + 1].s) {
        s = data.k[i].s;
        e = data.k[i + 1].s;
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
    // this.offsetTime = elem.data.st;
    this.k = true;
    this.kf = true;
    this._isFirstFrame = true;
    this.mult = mult || 1;
    this.elem = elem;
    this.container = container;
    this.comp = elem.comp;
    this.getValue = this.processEffectsSequence;
    // this.setVValue = setVValue;
    // this.interpolateValue = interpolateValue;
    this.frameId = -1;
    let arrLen = data.k[0].s.length;
    this.v = createTypedArray('float32', arrLen);
    this.pv = createTypedArray('float32', arrLen);
    for (i = 0; i < arrLen; i += 1) {
      this.v[i] = initFrame;
      this.pv[i] = initFrame;
    }
    this._caching = {lastFrame: initFrame, lastIndex: 0, value: createTypedArray('float32', arrLen)};
    // this.addEffect = addEffect;

    this._hasOutTypeExpression = false;
    if (Expression.hasSupportExpression(data)) {
      this.expression = Expression.getExpression(data);
      this._hasOutTypeExpression = this.expression.type === 'out';
    }
  }
}

/**
 * getProp by data
 * @param {*} elem element node
 * @param {*} data keyframed multidimensional value property data
 * @param {*} type keyframed type or not
 * @param {*} mult data mult scale
 * @param {*} container value property container
 * @return {ValueProperty|MultiDimensionalProperty|KeyframedValueProperty|KeyframedMultidimensionalProperty}
 */
function getProp(elem, data, type, mult, container) {
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

export default {getProp};
