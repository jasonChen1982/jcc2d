import { Quaternion } from './Quaternion';
import { Vector3 } from './Vector3';
import { Matrix4 } from './Matrix4';
import { _Math } from './Math';

/**
 * Euler
 * @param {*} x
 * @param {*} y
 * @param {*} z
 * @param {*} order
 */
function Euler(x, y, z, order) {
  this._x = x || 0;
  this._y = y || 0;
  this._z = z || 0;
  this._order = order || Euler.DefaultOrder;
}

Euler.RotationOrders = ['XYZ', 'YZX', 'ZXY', 'XZY', 'YXZ', 'ZYX'];

Euler.DefaultOrder = 'XYZ';

Euler.prototype = {

  constructor: Euler,

  isEuler: true,

  get x() {
    return this._x;
  },

  set x(value) {
    this._x = value;
    this.onChangeCallback();
  },

  get y() {
    return this._y;
  },

  set y(value) {
    this._y = value;
    this.onChangeCallback();
  },

  get z() {
    return this._z;
  },

  set z(value) {
    this._z = value;
    this.onChangeCallback();
  },

  get order() {
    return this._order;
  },

  set order(value) {
    this._order = value;
    this.onChangeCallback();
  },

  set: function set(x, y, z, order) {
    this._x = x;
    this._y = y;
    this._z = z;
    this._order = order || this._order;

    this.onChangeCallback();

    return this;
  },

  clone: function clone() {
    return new this.constructor(this._x, this._y, this._z, this._order);
  },

  copy: function copy(euler) {
    this._x = euler._x;
    this._y = euler._y;
    this._z = euler._z;
    this._order = euler._order;

    this.onChangeCallback();

    return this;
  },

  setFromRotationMatrix: function setFromRotationMatrix(m, order, update) {
    var clamp = _Math.clamp;

    // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

    var te = m.elements;
    var m11 = te[0];
    var m12 = te[4];
    var m13 = te[8];
    var m21 = te[1];
    var m22 = te[5];
    var m23 = te[9];
    var m31 = te[2];
    var m32 = te[6];
    var m33 = te[10];

    order = order || this._order;

    if (order === 'XYZ') {
      this._y = Math.asin(clamp(m13, -1, 1));

      if (Math.abs(m13) < 0.99999) {
        this._x = Math.atan2(-m23, m33);
        this._z = Math.atan2(-m12, m11);
      } else {
        this._x = Math.atan2(m32, m22);
        this._z = 0;
      }
    } else if (order === 'YXZ') {
      this._x = Math.asin(-clamp(m23, -1, 1));

      if (Math.abs(m23) < 0.99999) {
        this._y = Math.atan2(m13, m33);
        this._z = Math.atan2(m21, m22);
      } else {
        this._y = Math.atan2(-m31, m11);
        this._z = 0;
      }
    } else if (order === 'ZXY') {
      this._x = Math.asin(clamp(m32, -1, 1));

      if (Math.abs(m32) < 0.99999) {
        this._y = Math.atan2(-m31, m33);
        this._z = Math.atan2(-m12, m22);
      } else {
        this._y = 0;
        this._z = Math.atan2(m21, m11);
      }
    } else if (order === 'ZYX') {
      this._y = Math.asin(-clamp(m31, -1, 1));

      if (Math.abs(m31) < 0.99999) {
        this._x = Math.atan2(m32, m33);
        this._z = Math.atan2(m21, m11);
      } else {
        this._x = 0;
        this._z = Math.atan2(-m12, m22);
      }
    } else if (order === 'YZX') {
      this._z = Math.asin(clamp(m21, -1, 1));

      if (Math.abs(m21) < 0.99999) {
        this._x = Math.atan2(-m23, m22);
        this._y = Math.atan2(-m31, m11);
      } else {
        this._x = 0;
        this._y = Math.atan2(m13, m33);
      }
    } else if (order === 'XZY') {
      this._z = Math.asin(-clamp(m12, -1, 1));

      if (Math.abs(m12) < 0.99999) {
        this._x = Math.atan2(m32, m22);
        this._y = Math.atan2(m13, m11);
      } else {
        this._x = Math.atan2(-m23, m33);
        this._y = 0;
      }
    } else {
      console.warn('Euler: unsupported order: ' + order);
    }

    this._order = order;

    if (update !== false) this.onChangeCallback();

    return this;
  },

  setFromQuaternion: function () {
    var matrix = void 0;

    return function setFromQuaternion(q, order, update) {
      if (matrix === undefined) matrix = new Matrix4();

      matrix.makeRotationFromQuaternion(q);

      return this.setFromRotationMatrix(matrix, order, update);
    };
  }(),

  setFromVector3: function setFromVector3(v, order) {
    return this.set(v.x, v.y, v.z, order || this._order);
  },

  reorder: function () {
    // WARNING: this discards revolution information -bhouston

    var q = new Quaternion();

    return function reorder(newOrder) {
      q.setFromEuler(this);

      return this.setFromQuaternion(q, newOrder);
    };
  }(),

  equals: function equals(euler) {
    return euler._x === this._x && euler._y === this._y && euler._z === this._z && euler._order === this._order;
  },

  fromArray: function fromArray(array) {
    this._x = array[0];
    this._y = array[1];
    this._z = array[2];
    if (array[3] !== undefined) this._order = array[3];

    this.onChangeCallback();

    return this;
  },

  toArray: function toArray(array, offset) {
    if (array === undefined) array = [];
    if (offset === undefined) offset = 0;

    array[offset] = this._x;
    array[offset + 1] = this._y;
    array[offset + 2] = this._z;
    array[offset + 3] = this._order;

    return array;
  },

  toVector3: function toVector3(optionalResult) {
    if (optionalResult) {
      return optionalResult.set(this._x, this._y, this._z);
    } else {
      return new Vector3(this._x, this._y, this._z);
    }
  },

  onChange: function onChange(callback) {
    this.onChangeCallback = callback;

    return this;
  },

  onChangeCallback: function onChangeCallback() {}

};

export { Euler };