import BezierFactory from '../lib/BezierEaser';
import shape_pool from '../pooling/shape_pool';
import shapeCollection_pool from '../pooling/shapeCollection_pool';
import DynamicPropertyContainer from '../helpers/dynamicProperties';
import PropertyFactory from '../PropertyFactory';

const initFrame = -999999;
const degToRads = Math.PI/180;

/**
 * a
 */
class BaseShapeProperty {
  /**
   * a
   * @param {*} frameNum a
   * @param {*} previousValue a
   * @param {*} caching a
   */
  interpolateShape(frameNum, previousValue, caching) {
    let iterationIndex = caching.lastIndex;
    let keyPropS;
    let keyPropE;
    let isHold;
    let perc;
    const kf = this.keyframes;
    if (frameNum < kf[0].t-this.offsetTime) {
      keyPropS = kf[0].s[0];
      isHold = true;
      iterationIndex = 0;
    } else if (frameNum >= kf[kf.length - 1].t-this.offsetTime) {
      keyPropS = kf[kf.length - 1].s ? kf[kf.length - 1].s[0] : kf[kf.length - 2].e[0];
      // /*if(kf[kf.length - 1].s){
      //     keyPropS = kf[kf.length - 1].s[0];
      // }else{
      //     keyPropS = kf[kf.length - 2].e[0];
      // }*/
      isHold = true;
    } else {
      let i = iterationIndex;
      const len = kf.length- 1;
      let flag = true;
      let keyData;
      let nextKeyData;
      while (flag) {
        keyData = kf[i];
        nextKeyData = kf[i+1];
        if ((nextKeyData.t - this.offsetTime) > frameNum) {
          break;
        }
        if (i < len - 1) {
          i += 1;
        } else {
          flag = false;
        }
      }
      isHold = keyData.h === 1;
      iterationIndex = i;
      if (!isHold) {
        if (frameNum >= nextKeyData.t-this.offsetTime) {
          perc = 1;
        } else if (frameNum < keyData.t-this.offsetTime) {
          perc = 0;
        } else {
          let fnc;
          if (keyData.__fnct) {
            fnc = keyData.__fnct;
          } else {
            fnc = BezierFactory.getBezierEasing(keyData.o.x, keyData.o.y, keyData.i.x, keyData.i.y).get;
            keyData.__fnct = fnc;
          }
          perc = fnc((frameNum-(keyData.t-this.offsetTime))/((nextKeyData.t-this.offsetTime)-(keyData.t-this.offsetTime)));
        }
        keyPropE = nextKeyData.s ? nextKeyData.s[0] : keyData.e[0];
      }
      keyPropS = keyData.s[0];
    }
    const jLen = previousValue._length;
    const kLen = keyPropS.i[0].length;
    let vertexValue;
    caching.lastIndex = iterationIndex;

    for (let j = 0; j < jLen; j++) {
      for (let k = 0; k < kLen; k++) {
        vertexValue = isHold ? keyPropS.i[j][k] : keyPropS.i[j][k]+(keyPropE.i[j][k]-keyPropS.i[j][k])*perc;
        previousValue.i[j][k] = vertexValue;
        vertexValue = isHold ? keyPropS.o[j][k] : keyPropS.o[j][k]+(keyPropE.o[j][k]-keyPropS.o[j][k])*perc;
        previousValue.o[j][k] = vertexValue;
        vertexValue = isHold ? keyPropS.v[j][k] : keyPropS.v[j][k]+(keyPropE.v[j][k]-keyPropS.v[j][k])*perc;
        previousValue.v[j][k] = vertexValue;
      }
    }
  }

  /**
   * a
   * @return {*}
   */
  interpolateShapeCurrentTime(_frameNum) {
    const frameNum = _frameNum - this.offsetTime;
    const initTime = this.keyframes[0].t - this.offsetTime;
    const endTime = this.keyframes[this.keyframes.length - 1].t - this.offsetTime;
    const lastFrame = this._caching.lastFrame;
    if (!(lastFrame !== initFrame && ((lastFrame < initTime && frameNum < initTime) || (lastFrame > endTime && frameNum > endTime)))) {
      this._caching.lastIndex = lastFrame < frameNum ? this._caching.lastIndex : 0;
      this.interpolateShape(frameNum, this.pv, this._caching);
    }
    this._caching.lastFrame = frameNum;
    return this.pv;
  }

  /**
   * a
   */
  resetShape() {
    this.paths = this.localShapeCollection;
  }

  /**
   * a
   * @param {*} shape1 a
   * @param {*} shape2 a
   * @return {*}
   */
  shapesEqual(shape1, shape2) {
    if (shape1._length !== shape2._length || shape1.c !== shape2.c) {
      return false;
    }
    const len = shape1._length;
    for (let i = 0; i < len; i += 1) {
      if (shape1.v[i][0] !== shape2.v[i][0]
      || shape1.v[i][1] !== shape2.v[i][1]
      || shape1.o[i][0] !== shape2.o[i][0]
      || shape1.o[i][1] !== shape2.o[i][1]
      || shape1.i[i][0] !== shape2.i[i][0]
      || shape1.i[i][1] !== shape2.i[i][1]) {
        return false;
      }
    }
    return true;
  }

  /**
   * a
   * @param {*} newPath a
   */
  setVValue(newPath) {
    if (!this.shapesEqual(this.v, newPath)) {
      this.v = shape_pool.clone(newPath);
      this.localShapeCollection.releaseShapes();
      this.localShapeCollection.addShape(this.v);
      this._mdf = true;
      this.paths = this.localShapeCollection;
    }
  }

  /**
   * a
   */
  processEffectsSequence() {
    if (!this.effectsSequence.length) {
      return;
    }
    if (this.lock) {
      this.setVValue(this.pv);
      return;
    }
    this.lock = true;
    this._mdf = false;
    let finalValue = this.kf ? this.pv : this.data.ks ? this.data.ks.k : this.data.pt.k;
    const len = this.effectsSequence.length;
    for (let i = 0; i < len; i += 1) {
      finalValue = this.effectsSequence[i](finalValue);
    }
    this.setVValue(finalValue);
    this.lock = false;
  }
}

/**
 * a
 */
class ShapeProperty extends BaseShapeProperty {
  /**
   * a
   * @param {*} elem a
   * @param {*} data a
   * @param {*} type a
   */
  constructor(elem, data, type) {
    super();
    this.propType = 'shape';
    this.container = elem;
    this.elem = elem;
    this.data = data;
    this.k = false;
    this.kf = false;
    this._mdf = false;
    const pathData = type === 3 ? data.pt.k : data.ks.k;
    this.v = shape_pool.clone(pathData);
    this.pv = shape_pool.clone(this.v);
    this.localShapeCollection = shapeCollection_pool.newShapeCollection();
    this.paths = this.localShapeCollection;
    this.paths.addShape(this.v);
    this.reset = this.resetShape;
    this.effectsSequence = [];
    this.getValue = this.processEffectsSequence;
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
class KeyframedShapeProperty extends BaseShapeProperty {
  /**
   * a
   * @param {*} elem a
   * @param {*} data a
   * @param {*} type a
   */
  constructor(elem, data, type) {
    super();
    this.propType = 'shape';
    this.elem = elem;
    this.container = elem;
    this.offsetTime = elem.data.st;
    this.keyframes = type === 3 ? data.pt.k : data.ks.k;
    this.k = true;
    this.kf = true;
    const len = this.keyframes[0].s[0].i.length;
    this.v = shape_pool.newElement();
    this.v.setPathData(this.keyframes[0].s[0].c, len);
    this.pv = shape_pool.clone(this.v);
    this.localShapeCollection = shapeCollection_pool.newShapeCollection();
    this.paths = this.localShapeCollection;
    this.paths.addShape(this.v);
    this.lastFrame = initFrame;
    this.reset = this.resetShape;
    this._caching = { lastFrame: initFrame, lastIndex: 0 };
    this.effectsSequence = [this.interpolateShapeCurrentTime.bind(this)];
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

const roundCorner = 0.5519;
const cPoint = roundCorner;

/**
 * a
 */
class EllShapeProperty extends DynamicPropertyContainer {
  /**
   * a
   * @param {*} elem a
   * @param {*} data a
   */
  constructor(elem, data) {
    super();
    // /*this.v = {
    //     v: createSizedArray(4),
    //     i: createSizedArray(4),
    //     o: createSizedArray(4),
    //     c: true
    // };*/
    this.v = shape_pool.newElement();
    this.v.setPathData(true, 4);
    this.localShapeCollection = shapeCollection_pool.newShapeCollection();
    this.paths = this.localShapeCollection;
    this.localShapeCollection.addShape(this.v);
    this.d = data.d;
    this.elem = elem;
    this.initDynamicPropertyContainer(elem);
    this.p = PropertyFactory(elem, data.p, 1, 0, this);
    this.s = PropertyFactory(elem, data.s, 1, 0, this);
    if (this.dynamicProperties.length) {
      this.k = true;
    } else {
      this.k = false;
      this.convertEllToPath();
    }
  }

  /**
   * a
   */
  reset() {
    this.paths = this.localShapeCollection;
  }

  /**
   * a
   */
  getValue(frameNum) {
    this.iterateDynamicProperties(frameNum);

    if (this._mdf) {
      this.convertEllToPath();
    }
  }

  /**
   * a
   */
  convertEllToPath() {
    const p0 = this.p.v[0];
    const p1 = this.p.v[1];
    const s0 = this.s.v[0]/2;
    const s1 = this.s.v[1]/2;
    const _cw = this.d !== 3;
    const _v = this.v;
    _v.v[0][0] = p0;
    _v.v[0][1] = p1 - s1;
    _v.v[1][0] = _cw ? p0 + s0 : p0 - s0;
    _v.v[1][1] = p1;
    _v.v[2][0] = p0;
    _v.v[2][1] = p1 + s1;
    _v.v[3][0] = _cw ? p0 - s0 : p0 + s0;
    _v.v[3][1] = p1;
    _v.i[0][0] = _cw ? p0 - s0 * cPoint : p0 + s0 * cPoint;
    _v.i[0][1] = p1 - s1;
    _v.i[1][0] = _cw ? p0 + s0 : p0 - s0;
    _v.i[1][1] = p1 - s1 * cPoint;
    _v.i[2][0] = _cw ? p0 + s0 * cPoint : p0 - s0 * cPoint;
    _v.i[2][1] = p1 + s1;
    _v.i[3][0] = _cw ? p0 - s0 : p0 + s0;
    _v.i[3][1] = p1 + s1 * cPoint;
    _v.o[0][0] = _cw ? p0 + s0 * cPoint : p0 - s0 * cPoint;
    _v.o[0][1] = p1 - s1;
    _v.o[1][0] = _cw ? p0 + s0 : p0 - s0;
    _v.o[1][1] = p1 + s1 * cPoint;
    _v.o[2][0] = _cw ? p0 - s0 * cPoint : p0 + s0 * cPoint;
    _v.o[2][1] = p1 + s1;
    _v.o[3][0] = _cw ? p0 - s0 : p0 + s0;
    _v.o[3][1] = p1 - s1 * cPoint;
  }
}

/**
 * a
 */
class StarShapeProperty extends DynamicPropertyContainer {
  /**
   * a
   * @param {*} elem a
   * @param {*} data a
   */
  constructor(elem, data) {
    super();
    this.v = shape_pool.newElement();
    this.v.setPathData(true, 0);
    this.elem = elem;
    this.data = data;
    this.d = data.d;
    this.initDynamicPropertyContainer(elem);
    if (data.sy === 1) {
      this.ir = PropertyFactory(elem, data.ir, 0, 0, this);
      this.is = PropertyFactory(elem, data.is, 0, 0.01, this);
      this.convertToPath = this.convertStarToPath;
    } else {
      this.convertToPath = this.convertPolygonToPath;
    }
    this.pt = PropertyFactory(elem, data.pt, 0, 0, this);
    this.p = PropertyFactory(elem, data.p, 1, 0, this);
    this.r = PropertyFactory(elem, data.r, 0, degToRads, this);
    this.or = PropertyFactory(elem, data.or, 0, 0, this);
    this.os = PropertyFactory(elem, data.os, 0, 0.01, this);
    this.localShapeCollection = shapeCollection_pool.newShapeCollection();
    this.localShapeCollection.addShape(this.v);
    this.paths = this.localShapeCollection;
    if (this.dynamicProperties.length) {
      this.k = true;
    } else {
      this.k = false;
      this.convertToPath();
    }
  }

  /**
   * a
   */
  reset() {
    this.paths = this.localShapeCollection;
  }

  /**
   * a
   */
  getValue(frameNum) {
    this.iterateDynamicProperties(frameNum);
    if (this._mdf) {
      this.convertToPath();
    }
  }

  /**
   * a
   */
  convertStarToPath() {
    const numPts = Math.floor(this.pt.v)*2;
    const angle = Math.PI*2/numPts;
    // /*this.v.v.length = numPts;
    // this.v.i.length = numPts;
    // this.v.o.length = numPts;*/
    let longFlag = true;
    const longRad = this.or.v;
    const shortRad = this.ir.v;
    const longRound = this.os.v;
    const shortRound = this.is.v;
    const longPerimSegment = 2*Math.PI*longRad/(numPts*2);
    const shortPerimSegment = 2*Math.PI*shortRad/(numPts*2);
    let currentAng = -Math.PI/ 2;
    currentAng += this.r.v;
    const dir = this.data.d === 3 ? -1 : 1;
    this.v._length = 0;
    for (let i = 0; i < numPts; i++) {
      const rad = longFlag ? longRad : shortRad;
      const roundness = longFlag ? longRound : shortRound;
      const perimSegment = longFlag ? longPerimSegment : shortPerimSegment;
      let x = rad * Math.cos(currentAng);
      let y = rad * Math.sin(currentAng);
      const ox = x === 0 && y === 0 ? 0 : y/Math.sqrt(x*x + y*y);
      const oy = x === 0 && y === 0 ? 0 : -x/Math.sqrt(x*x + y*y);
      x += + this.p.v[0];
      y += + this.p.v[1];
      this.v.setTripleAt(x, y, x-ox*perimSegment*roundness*dir, y-oy*perimSegment*roundness*dir, x+ox*perimSegment*roundness*dir, y+oy*perimSegment*roundness*dir, i, true);

      // /*this.v.v[i] = [x,y];
      // this.v.i[i] = [x+ox*perimSegment*roundness*dir,y+oy*perimSegment*roundness*dir];
      // this.v.o[i] = [x-ox*perimSegment*roundness*dir,y-oy*perimSegment*roundness*dir];
      // this.v._length = numPts;*/
      longFlag = !longFlag;
      currentAng += angle*dir;
    }
  }

  /**
   * a
   */
  convertPolygonToPath() {
    const numPts = Math.floor(this.pt.v);
    const angle = Math.PI*2/numPts;
    const rad = this.or.v;
    const roundness = this.os.v;
    const perimSegment = 2*Math.PI*rad/(numPts*4);
    let currentAng = -Math.PI/ 2;
    const dir = this.data.d === 3 ? -1 : 1;
    currentAng += this.r.v;
    this.v._length = 0;
    for (let i = 0; i < numPts; i++) {
      let x = rad * Math.cos(currentAng);
      let y = rad * Math.sin(currentAng);
      const ox = x === 0 && y === 0 ? 0 : y/Math.sqrt(x*x + y*y);
      const oy = x === 0 && y === 0 ? 0 : -x/Math.sqrt(x*x + y*y);
      x += + this.p.v[0];
      y += + this.p.v[1];
      this.v.setTripleAt(x, y, x-ox*perimSegment*roundness*dir, y-oy*perimSegment*roundness*dir, x+ox*perimSegment*roundness*dir, y+oy*perimSegment*roundness*dir, i, true);
      currentAng += angle*dir;
    }
    this.paths.length = 0;
    this.paths[0] = this.v;
  }
}


/**
 * a
 */
class RectShapeProperty extends DynamicPropertyContainer {
  /**
   * a
   * @param {*} elem a
   * @param {*} data a
   */
  constructor(elem, data) {
    super();
    this.v = shape_pool.newElement();
    this.v.c = true;
    this.localShapeCollection = shapeCollection_pool.newShapeCollection();
    this.localShapeCollection.addShape(this.v);
    this.paths = this.localShapeCollection;
    this.elem = elem;
    this.d = data.d;
    this.initDynamicPropertyContainer(elem);
    this.p = PropertyFactory(elem, data.p, 1, 0, this);
    this.s = PropertyFactory(elem, data.s, 1, 0, this);
    this.r = PropertyFactory(elem, data.r, 0, 0, this);
    if (this.dynamicProperties.length) {
      this.k = true;
    } else {
      this.k = false;
      this.convertRectToPath();
    }
  }

  /**
   * a
   */
  reset() {
    this.paths = this.localShapeCollection;
  }

  /**
   * a
   */
  convertRectToPath() {
    const p0 = this.p.v[0];
    const p1 = this.p.v[1];
    const v0 = this.s.v[0]/2;
    const v1 = this.s.v[1]/2;
    const round = Math.min(v0, v1, this.r.v);
    const cPoint = round*(1-roundCorner);
    this.v._length = 0;

    if (this.d === 2 || this.d === 1) {
      this.v.setTripleAt(p0+v0, p1-v1+round, p0+v0, p1-v1+round, p0+v0, p1-v1+cPoint, 0, true);
      this.v.setTripleAt(p0+v0, p1+v1-round, p0+v0, p1+v1-cPoint, p0+v0, p1+v1-round, 1, true);
      if (round!== 0) {
        this.v.setTripleAt(p0+v0-round, p1+v1, p0+v0-round, p1+v1, p0+v0-cPoint, p1+v1, 2, true);
        this.v.setTripleAt(p0-v0+round, p1+v1, p0-v0+cPoint, p1+v1, p0-v0+round, p1+v1, 3, true);
        this.v.setTripleAt(p0-v0, p1+v1-round, p0-v0, p1+v1-round, p0-v0, p1+v1-cPoint, 4, true);
        this.v.setTripleAt(p0-v0, p1-v1+round, p0-v0, p1-v1+cPoint, p0-v0, p1-v1+round, 5, true);
        this.v.setTripleAt(p0-v0+round, p1-v1, p0-v0+round, p1-v1, p0-v0+cPoint, p1-v1, 6, true);
        this.v.setTripleAt(p0+v0-round, p1-v1, p0+v0-cPoint, p1-v1, p0+v0-round, p1-v1, 7, true);
      } else {
        this.v.setTripleAt(p0-v0, p1+v1, p0-v0+cPoint, p1+v1, p0-v0, p1+v1, 2);
        this.v.setTripleAt(p0-v0, p1-v1, p0-v0, p1-v1+cPoint, p0-v0, p1-v1, 3);
      }
    } else {
      this.v.setTripleAt(p0+v0, p1-v1+round, p0+v0, p1-v1+cPoint, p0+v0, p1-v1+round, 0, true);
      if (round!== 0) {
        this.v.setTripleAt(p0+v0-round, p1-v1, p0+v0-round, p1-v1, p0+v0-cPoint, p1-v1, 1, true);
        this.v.setTripleAt(p0-v0+round, p1-v1, p0-v0+cPoint, p1-v1, p0-v0+round, p1-v1, 2, true);
        this.v.setTripleAt(p0-v0, p1-v1+round, p0-v0, p1-v1+round, p0-v0, p1-v1+cPoint, 3, true);
        this.v.setTripleAt(p0-v0, p1+v1-round, p0-v0, p1+v1-cPoint, p0-v0, p1+v1-round, 4, true);
        this.v.setTripleAt(p0-v0+round, p1+v1, p0-v0+round, p1+v1, p0-v0+cPoint, p1+v1, 5, true);
        this.v.setTripleAt(p0+v0-round, p1+v1, p0+v0-cPoint, p1+v1, p0+v0-round, p1+v1, 6, true);
        this.v.setTripleAt(p0+v0, p1+v1-round, p0+v0, p1+v1-round, p0+v0, p1+v1-cPoint, 7, true);
      } else {
        this.v.setTripleAt(p0-v0, p1-v1, p0-v0+cPoint, p1-v1, p0-v0, p1-v1, 1, true);
        this.v.setTripleAt(p0-v0, p1+v1, p0-v0, p1+v1-cPoint, p0-v0, p1+v1, 2, true);
        this.v.setTripleAt(p0+v0, p1+v1, p0+v0-cPoint, p1+v1, p0+v0, p1+v1, 3, true);
      }
    }
  }

  /**
   * a
   * @param {*} frameNum a
   */
  getValue(frameNum) {
    this.iterateDynamicProperties(frameNum);
    if (this._mdf) {
      this.convertRectToPath();
    }
  }
}

/**
 * a
 * @param {*} elem a
 * @param {*} data a
 * @param {*} type a
 * @return {*}
 */
function getShapeProp(elem, data, type) {
  let prop;
  if (type === 3 || type === 4) {
    const dataProp = type === 3 ? data.pt : data.ks;
    const keys = dataProp.k;
    if (keys.length) {
      prop = new KeyframedShapeProperty(elem, data, type);
    } else {
      prop = new ShapeProperty(elem, data, type);
    }
  } else if (type === 5) {
    prop = new RectShapeProperty(elem, data);
  } else if (type === 6) {
    prop = new EllShapeProperty(elem, data);
  } else if (type === 7) {
    prop = new StarShapeProperty(elem, data);
  }
  if (prop.k) {
    elem.addDynamicProperty(prop);
  }
  return prop;
}

/**
 * a
 * @return {*}
 */
function getConstructorFunction() {
  return ShapeProperty;
}

/**
 * a
 * @return {*}
 */
function getKeyframedConstructorFunction() {
  return KeyframedShapeProperty;
}


export default { getShapeProp, getConstructorFunction, getKeyframedConstructorFunction };
