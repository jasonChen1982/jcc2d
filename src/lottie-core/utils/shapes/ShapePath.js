import {createSizedArray} from '../helpers/arrays';
import PointPool from '../pooling/PointPool';

/**
 * a shape path
 */
export default class ShapePath {
  /**
   * shape path constructor
   */
  constructor() {
    this.c = false;
    this._length = 0;
    this._maxLength = 8;
    this.v = createSizedArray(this._maxLength);
    this.o = createSizedArray(this._maxLength);
    this.i = createSizedArray(this._maxLength);
  }

  /**
   * set path data
   * @param {*} closed path is closed ?
   * @param {*} len path vertex data length
   */
  setPathData(closed, len) {
    this.c = closed;
    this.setLength(len);
    let i = 0;
    while (i < len) {
      this.v[i] = PointPool.newElement();
      this.o[i] = PointPool.newElement();
      this.i[i] = PointPool.newElement();
      i += 1;
    }
  }

  /**
   * set array pool size
   * @param {*} len array length
   */
  setLength(len) {
    while (this._maxLength < len) {
      this.doubleArrayLength();
    }
    this._length = len;
  }

  /**
   * double array pool size
   */
  doubleArrayLength() {
    this.v = this.v.concat(createSizedArray(this._maxLength));
    this.i = this.i.concat(createSizedArray(this._maxLength));
    this.o = this.o.concat(createSizedArray(this._maxLength));
    this._maxLength *= 2;
  }

  /**
   * set x y to this.v | this.i | this.o
   * @param {*} x x component
   * @param {*} y y component
   * @param {*} type data type v | i | o
   * @param {*} pos data index
   * @param {*} replace need replace a new point
   */
  setXYAt(x, y, type, pos, replace) {
    let arr;
    this._length = Math.max(this._length, pos + 1);
    if (this._length >= this._maxLength) {
      this.doubleArrayLength();
    }
    switch (type) {
    case 'v':
      arr = this.v;
      break;
    case 'i':
      arr = this.i;
      break;
    case 'o':
      arr = this.o;
      break;
    }
    if (!arr[pos] || (arr[pos] && !replace)) {
      arr[pos] = PointPool.newElement();
    }
    arr[pos][0] = x;
    arr[pos][1] = y;
  }

  /**
   * setTripleAt
   * @param {*} vX vertex x
   * @param {*} vY vertex y
   * @param {*} oX out control x
   * @param {*} oY out control y
   * @param {*} iX in control x
   * @param {*} iY in control x
   * @param {*} pos index of pool
   * @param {*} replace replace point
   */
  setTripleAt(vX, vY, oX, oY, iX, iY, pos, replace) {
    this.setXYAt(vX, vY, 'v', pos, replace);
    this.setXYAt(oX, oY, 'o', pos, replace);
    this.setXYAt(iX, iY, 'i', pos, replace);
  }

  /**
   * reverse point
   * @return {*} renturn new shape path
   */
  reverse() {
    const newPath = new ShapePath();
    newPath.setPathData(this.c, this._length);
    const vertices = this.v;
    const outPoints = this.o;
    const inPoints = this.i;
    let init = 0;
    if (this.c) {
      newPath.setTripleAt(vertices[0][0], vertices[0][1], inPoints[0][0], inPoints[0][1], outPoints[0][0], outPoints[0][1], 0, false);
      init = 1;
    }
    let cnt = this._length - 1;
    const len = this._length;

    for (let i = init; i < len; i += 1) {
      newPath.setTripleAt(vertices[cnt][0], vertices[cnt][1], inPoints[cnt][0], inPoints[cnt][1], outPoints[cnt][0], outPoints[cnt][1], i, false);
      cnt -= 1;
    }
    return newPath;
  }
}
