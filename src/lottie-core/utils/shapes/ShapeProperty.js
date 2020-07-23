import BezierFactory from '../lib/BezierEaser';
import ShapePool from '../pooling/ShapePool';
import ShapeCollectionPool from '../pooling/ShapeCollectionPool';
import DynamicPropertyContainer from '../helpers/dynamicProperties';
import PropertyFactory from '../PropertyFactory';
import {degToRads, initialDefaultFrame as initFrame} from '../../constant/index';
import Expression from '../expression/Expression';
// import { hasExpression, getExpression } from '../../utils/Expression';
// const initFrame = -999999;
// const degToRads = Math.PI/180;

/**
 * basic shape property
 */
class BaseShapeProperty {
  /**
   * interpolate shape
   * @param {*} frameNum frame number
   * @param {*} previousValue previous value
   * @param {*} caching caching object
   */
  interpolateShape(frameNum, previousValue, caching) {
    let iterationIndex = caching.lastIndex;
    let keyPropS; let keyPropE; let isHold; let j; let k; let jLen; let kLen; let perc; let vertexValue;
    let kf = this.keyframes;
    if (frameNum < kf[0].t) {
      keyPropS = kf[0].s[0];
      isHold = true;
      iterationIndex = 0;
    } else if (frameNum >= kf[kf.length - 1].t) {
      keyPropS = kf[kf.length - 1].s ? kf[kf.length - 1].s[0] : kf[kf.length - 2].e[0];
      /* if(kf[kf.length - 1].s){
                keyPropS = kf[kf.length - 1].s[0];
            }else{
                keyPropS = kf[kf.length - 2].e[0];
            }*/
      isHold = true;
    } else {
      let i = iterationIndex;
      let len = kf.length- 1; let flag = true; let keyData; let nextKeyData;
      while (flag) {
        keyData = kf[i];
        nextKeyData = kf[i+1];
        if (nextKeyData.t > frameNum) {
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
        if (frameNum >= nextKeyData.t) {
          perc = 1;
        } else if (frameNum < keyData.t) {
          perc = 0;
        } else {
          let fnc;
          if (keyData.__fnct) {
            fnc = keyData.__fnct;
          } else {
            fnc = BezierFactory.getBezierEasing(keyData.o.x, keyData.o.y, keyData.i.x, keyData.i.y).get;
            keyData.__fnct = fnc;
          }
          perc = fnc((frameNum-keyData.t)/(nextKeyData.t-keyData.t));
        }
        keyPropE = nextKeyData.s ? nextKeyData.s[0] : keyData.e[0];
      }
      keyPropS = keyData.s[0];
    }
    jLen = previousValue._length;
    kLen = keyPropS.i[0].length;
    caching.lastIndex = iterationIndex;

    for (j=0; j<jLen; j+=1) {
      for (k=0; k<kLen; k+=1) {
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
   * interpolate shape with currentTime
   * @param {*} frameNum frame number
   * @return {*}
   */
  interpolateShapeCurrentTime(frameNum) {
    let initTime = this.keyframes[0].t;
    let endTime = this.keyframes[this.keyframes.length - 1].t;
    let lastFrame = this._caching.lastFrame;
    if (!(lastFrame !== initFrame && ((lastFrame < initTime && frameNum < initTime) || (lastFrame > endTime && frameNum > endTime)))) {
      // //
      this._caching.lastIndex = lastFrame < frameNum ? this._caching.lastIndex : 0;
      this.interpolateShape(frameNum, this.pv, this._caching);
      // //
    }
    this._caching.lastFrame = frameNum;
    return this.pv;
  }

  /**
   * reset shape
   */
  resetShape() {
    this.paths = this.localShapeCollection;
  }

  /**
   * is shapes is equal
   * @param {*} shape1 shape1
   * @param {*} shape2 shape2
   * @return {*}
   */
  shapesEqual(shape1, shape2) {
    if (shape1._length !== shape2._length || shape1.c !== shape2.c) {
      return false;
    }
    let i; let len = shape1._length;
    for (i = 0; i < len; i += 1) {
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
   * set new path to this.v
   * @param {*} newPath new path
   */
  setVValue(newPath) {
    if (!this.shapesEqual(this.v, newPath)) {
      this.v = ShapePool.clone(newPath);
      this.localShapeCollection.releaseShapes();
      this.localShapeCollection.addShape(this.v);
      this._mdf = true;
      this.paths = this.localShapeCollection;
    }
  }

  /**
   * process effects sequence
   * @param {*} frameNum frame number
   */
  processEffectsSequence(frameNum) {
    if (frameNum === this.frameId) {
      return;
    } else if (!this.effectsSequence.length) {
      this._mdf = false;
      return;
    }
    if (this.lock) {
      this.setVValue(this.pv);
      return;
    }
    this.lock = true;
    this._mdf = false;
    let finalValue = this.kf ? this.pv : this.data.ks ? this.data.ks.k : this.data.pt.k;
    let i; let len = this.effectsSequence.length;
    for (i = 0; i < len; i += 1) {
      finalValue = this.effectsSequence[i](frameNum);
    }
    this.setVValue(finalValue);
    this.lock = false;
    this.frameId = frameNum;
  }

  /**
   * add effect
   * @param {*} effectFunction effect funstion
   */
  addEffect(effectFunction) {
    console.log('addEffect', effectFunction);
    this.effectsSequence.push(effectFunction);
    this.container.addDynamicProperty(this);
  }
}

/**
 * shape property
 */
class ShapeProperty extends BaseShapeProperty {
  /**
   * constructor shape property
   * @param {*} elem element node
   * @param {*} data shape value property data
   * @param {*} type shape propType
   */
  constructor(elem, data, type) {
    super();
    this.propType = 'shape';
    this.comp = elem.comp;
    this.container = elem;
    this.elem = elem;
    this.data = data;
    this.k = false;
    this.kf = false;
    this._mdf = false;
    let pathData = type === 3 ? data.pt.k : data.ks.k;
    this.v = ShapePool.clone(pathData);
    this.pv = ShapePool.clone(this.v);
    this.localShapeCollection = ShapeCollectionPool.newShapeCollection();
    this.paths = this.localShapeCollection;
    this.paths.addShape(this.v);
    this.reset = this.resetShape;
    this.effectsSequence = [];
    this.getValue = this.processEffectsSequence;
  }
}

/**
 * keyframed shape property
 */
class KeyframedShapeProperty extends BaseShapeProperty {
  /**
   * constructor keyframed shape property
   * @param {*} elem element node
   * @param {*} data shape value property data
   * @param {*} type shape propType
   */
  constructor(elem, data, type) {
    super();
    this.propType = 'shape';
    this.comp = elem.comp;
    this.elem = elem;
    this.container = elem;
    // this.offsetTime = elem.data.st;
    this.keyframes = type === 3 ? data.pt.k : data.ks.k;
    this.k = true;
    this.kf = true;
    let len = this.keyframes[0].s[0].i.length;
    // let jLen = this.keyframes[0].s[0].i[0].length;
    this.v = ShapePool.newElement();
    this.v.setPathData(this.keyframes[0].s[0].c, len);
    this.pv = ShapePool.clone(this.v);
    this.localShapeCollection = ShapeCollectionPool.newShapeCollection();
    this.paths = this.localShapeCollection;
    this.paths.addShape(this.v);
    this.lastFrame = initFrame;
    this.reset = this.resetShape;
    this._caching = {lastFrame: initFrame, lastIndex: 0};
    this.effectsSequence = [this.interpolateShapeCurrentTime.bind(this)];
    this.getValue = this.processEffectsSequence;

    this._hasOutTypeExpression = false;
    if (Expression.hasSupportExpression(data)) {
      this.expression = Expression.getExpression(data);
      this._hasOutTypeExpression = this.expression.type === 'out';
    }
  }
}

/**
 * ellipse shape property
 */
class EllShapeProperty extends DynamicPropertyContainer {
  /**
   * constructor ellipse shape property
   * @param {*} elem element node
   * @param {*} data shape value property data
   */
  constructor(elem, data) {
    super();
    // this.v = {
    //   v: createSizedArray(4),
    //   i: createSizedArray(4),
    //   o: createSizedArray(4),
    //   c: true
    // };
    this.v = ShapePool.newElement();
    this.v.setPathData(true, 4);
    this.localShapeCollection = ShapeCollectionPool.newShapeCollection();
    this.paths = this.localShapeCollection;
    this.localShapeCollection.addShape(this.v);
    this.d = data.d;
    this.elem = elem;
    this.comp = elem.comp;
    this.frameId = -1;
    this.initDynamicPropertyContainer(elem);
    this.p = PropertyFactory.getProp(elem, data.p, 1, 0, this);
    this.s = PropertyFactory.getProp(elem, data.s, 1, 0, this);
    if (this.dynamicProperties.length) {
      this.k = true;
    } else {
      this.k = false;
      this.convertEllToPath();
    }
  }

  /**
   * reset shape
   */
  reset() {
    this.paths = this.localShapeCollection;
  }

  /**
   * get point with frameId
   * @param {*} frameNum frame number
   */
  getValue(frameNum) {
    if (frameNum === this.frameId) {
      return;
    }
    this.iterateDynamicProperties(frameNum);
    this.frameId = frameNum;

    if (this._mdf) {
      this.convertEllToPath();
    }
  }

  /**
   * convert ellipse to path
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
 * star shape property
 */
class StarShapeProperty extends DynamicPropertyContainer {
  /**
   * constructor star shape property
   * @param {*} elem element node
   * @param {*} data shape value property data
   */
  constructor(elem, data) {
    super();
    this.v = ShapePool.newElement();
    this.v.setPathData(true, 0);
    this.elem = elem;
    this.comp = elem.comp;
    this.data = data;
    this.frameId = -1;
    this.d = data.d;
    this.initDynamicPropertyContainer(elem);
    if (data.sy === 1) {
      this.ir = PropertyFactory.getProp(elem, data.ir, 0, 0, this);
      this.is = PropertyFactory.getProp(elem, data.is, 0, 0.01, this);
      this.convertToPath = this.convertStarToPath;
    } else {
      this.convertToPath = this.convertPolygonToPath;
    }
    this.pt = PropertyFactory.getProp(elem, data.pt, 0, 0, this);
    this.p = PropertyFactory.getProp(elem, data.p, 1, 0, this);
    this.r = PropertyFactory.getProp(elem, data.r, 0, degToRads, this);
    this.or = PropertyFactory.getProp(elem, data.or, 0, 0, this);
    this.os = PropertyFactory.getProp(elem, data.os, 0, 0.01, this);
    this.localShapeCollection = ShapeCollectionPool.newShapeCollection();
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
   * reset shape
   */
  reset() {
    this.paths = this.localShapeCollection;
  }

  /**
   * get point with frameId
   * @param {*} frameNum frame number
   */
  getValue(frameNum) {
    if (frameNum === this.frameId) {
      return;
    }
    this.frameId = frameNum;
    this.iterateDynamicProperties(frameNum);

    if (this._mdf) {
      this.convertToPath();
    }
  }

  /**
   * convert star to path
   */
  convertStarToPath() {
    let numPts = Math.floor(this.pt.v)*2;
    let angle = Math.PI*2/numPts;
    /* this.v.v.length = numPts;
            this.v.i.length = numPts;
            this.v.o.length = numPts;*/
    let longFlag = true;
    let longRad = this.or.v;
    let shortRad = this.ir.v;
    let longRound = this.os.v;
    let shortRound = this.is.v;
    let longPerimSegment = 2*Math.PI*longRad/(numPts*2);
    let shortPerimSegment = 2*Math.PI*shortRad/(numPts*2);
    let i; let rad; let roundness; let perimSegment; let currentAng = -Math.PI/ 2;
    currentAng += this.r.v;
    let dir = this.data.d === 3 ? -1 : 1;
    this.v._length = 0;
    for (i=0; i<numPts; i+=1) {
      rad = longFlag ? longRad : shortRad;
      roundness = longFlag ? longRound : shortRound;
      perimSegment = longFlag ? longPerimSegment : shortPerimSegment;
      let x = rad * Math.cos(currentAng);
      let y = rad * Math.sin(currentAng);
      let ox = x === 0 && y === 0 ? 0 : y/Math.sqrt(x*x + y*y);
      let oy = x === 0 && y === 0 ? 0 : -x/Math.sqrt(x*x + y*y);
      x += + this.p.v[0];
      y += + this.p.v[1];
      this.v.setTripleAt(x, y, x-ox*perimSegment*roundness*dir, y-oy*perimSegment*roundness*dir, x+ox*perimSegment*roundness*dir, y+oy*perimSegment*roundness*dir, i, true);

      /* this.v.v[i] = [x,y];
                this.v.i[i] = [x+ox*perimSegment*roundness*dir,y+oy*perimSegment*roundness*dir];
                this.v.o[i] = [x-ox*perimSegment*roundness*dir,y-oy*perimSegment*roundness*dir];
                this.v._length = numPts;*/
      longFlag = !longFlag;
      currentAng += angle*dir;
    }
  }

  /**
   * convert polygon to path
   */
  convertPolygonToPath() {
    let numPts = Math.floor(this.pt.v);
    let angle = Math.PI*2/numPts;
    let rad = this.or.v;
    let roundness = this.os.v;
    let perimSegment = 2*Math.PI*rad/(numPts*4);
    let i; let currentAng = -Math.PI/ 2;
    let dir = this.data.d === 3 ? -1 : 1;
    currentAng += this.r.v;
    this.v._length = 0;
    for (i=0; i<numPts; i+=1) {
      let x = rad * Math.cos(currentAng);
      let y = rad * Math.sin(currentAng);
      let ox = x === 0 && y === 0 ? 0 : y/Math.sqrt(x*x + y*y);
      let oy = x === 0 && y === 0 ? 0 : -x/Math.sqrt(x*x + y*y);
      x += + this.p.v[0];
      y += + this.p.v[1];
      this.v.setTripleAt(x, y, x-ox*perimSegment*roundness*dir, y-oy*perimSegment*roundness*dir, x+ox*perimSegment*roundness*dir, y+oy*perimSegment*roundness*dir, i, true);
      currentAng += angle*dir;
    }
    this.paths.length = 0;
    this.paths[0] = this.v;
  }
}

const roundCorner = 0.5519;
const cPoint = roundCorner;

/**
 * rect shape property
 */
class RectShapeProperty extends DynamicPropertyContainer {
  /**
   * constructor rect shape property
   * @param {*} elem element node
   * @param {*} data shape value property data
   */
  constructor(elem, data) {
    super();
    this.v = ShapePool.newElement();
    this.v.c = true;
    this.localShapeCollection = ShapeCollectionPool.newShapeCollection();
    this.localShapeCollection.addShape(this.v);
    this.paths = this.localShapeCollection;
    this.elem = elem;
    this.comp = elem.comp;
    this.frameId = -1;
    this.d = data.d;
    this.initDynamicPropertyContainer(elem);
    this.p = PropertyFactory.getProp(elem, data.p, 1, 0, this);
    this.s = PropertyFactory.getProp(elem, data.s, 1, 0, this);
    this.r = PropertyFactory.getProp(elem, data.r, 0, 0, this);
    if (this.dynamicProperties.length) {
      this.k = true;
    } else {
      this.k = false;
      this.convertRectToPath();
    }
  }

  /**
   * reset shape
   */
  reset() {
    this.paths = this.localShapeCollection;
  }

  /**
   * get point with frameId
   * @param {*} frameNum frame number
   */
  getValue(frameNum) {
    if (frameNum === this.frameId) {
      return;
    }
    this.frameId = frameNum;
    this.iterateDynamicProperties(frameNum);

    if (this._mdf) {
      this.convertRectToPath();
    }
  }

  /**
   * convert rect to path
   */
  convertRectToPath() {
    let p0 = this.p.v[0]; let p1 = this.p.v[1]; let v0 = this.s.v[0]/2; let v1 = this.s.v[1]/2;
    let round = Math.min(v0, v1, this.r.v);
    let cPoint = round*(1-roundCorner);
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
}

/**
 * get shape prop with data
 * @param {*} elem element node
 * @param {*} data shape value property data
 * @param {*} type lottie shape type
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
    // FIXME: maybe not needed
    elem.addDynamicProperty(prop);
  }
  return prop;
}

/**
 * get ShapeProperty class
 * @return {ShapeProperty}
 */
function getConstructorFunction() {
  return ShapeProperty;
}

/**
 * get KeyframedShapeProperty class
 * @return {KeyframedShapeProperty}
 */
function getKeyframedConstructorFunction() {
  return KeyframedShapeProperty;
}

export default {getShapeProp, getConstructorFunction, getKeyframedConstructorFunction};
