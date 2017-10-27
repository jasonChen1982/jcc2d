import { _Math } from './Math';
import { Matrix4 } from './Matrix4';
import { Quaternion } from './Quaternion';

/**
 *
 * @param {*} x
 * @param {*} y
 * @param {*} z
 */
function Vector3(x, y, z) {
  this.x = x || 0;
  this.y = y || 0;
  this.z = z || 0;
}

Vector3.prototype = {

  constructor: Vector3,

  isVector3: true,

  set: function set(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;

    return this;
  },

  setScalar: function setScalar(scalar) {
    this.x = scalar;
    this.y = scalar;
    this.z = scalar;

    return this;
  },

  setX: function setX(x) {
    this.x = x;

    return this;
  },

  setY: function setY(y) {
    this.y = y;

    return this;
  },

  setZ: function setZ(z) {
    this.z = z;

    return this;
  },

  setComponent: function setComponent(index, value) {
    switch (index) {
      case 0:
        this.x = value;break;
      case 1:
        this.y = value;break;
      case 2:
        this.z = value;break;
      default:
        throw new Error('index is out of range: ' + index);
    }

    return this;
  },

  getComponent: function getComponent(index) {
    switch (index) {
      case 0:
        return this.x;
      case 1:
        return this.y;
      case 2:
        return this.z;
      default:
        throw new Error('index is out of range: ' + index);
    }
  },

  clone: function clone() {
    return new this.constructor(this.x, this.y, this.z);
  },

  copy: function copy(v) {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;

    return this;
  },

  add: function add(v) {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;

    return this;
  },

  addScalar: function addScalar(s) {
    this.x += s;
    this.y += s;
    this.z += s;

    return this;
  },

  addVectors: function addVectors(a, b) {
    this.x = a.x + b.x;
    this.y = a.y + b.y;
    this.z = a.z + b.z;

    return this;
  },

  addScaledVector: function addScaledVector(v, s) {
    this.x += v.x * s;
    this.y += v.y * s;
    this.z += v.z * s;

    return this;
  },

  sub: function sub(v) {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;

    return this;
  },

  subScalar: function subScalar(s) {
    this.x -= s;
    this.y -= s;
    this.z -= s;

    return this;
  },

  subVectors: function subVectors(a, b) {
    this.x = a.x - b.x;
    this.y = a.y - b.y;
    this.z = a.z - b.z;

    return this;
  },

  multiply: function multiply(v) {
    this.x *= v.x;
    this.y *= v.y;
    this.z *= v.z;

    return this;
  },

  multiplyScalar: function multiplyScalar(scalar) {
    if (isFinite(scalar)) {
      this.x *= scalar;
      this.y *= scalar;
      this.z *= scalar;
    } else {
      this.x = 0;
      this.y = 0;
      this.z = 0;
    }

    return this;
  },

  multiplyVectors: function multiplyVectors(a, b) {
    this.x = a.x * b.x;
    this.y = a.y * b.y;
    this.z = a.z * b.z;

    return this;
  },

  applyEuler: function () {
    var quaternion = void 0;

    return function applyEuler(euler) {
      if (quaternion === undefined) quaternion = new Quaternion();

      return this.applyQuaternion(quaternion.setFromEuler(euler));
    };
  }(),

  applyAxisAngle: function () {
    var quaternion = void 0;

    return function applyAxisAngle(axis, angle) {
      if (quaternion === undefined) quaternion = new Quaternion();

      return this.applyQuaternion(quaternion.setFromAxisAngle(axis, angle));
    };
  }(),

  applyMatrix3: function applyMatrix3(m) {
    var x = this.x;
    var y = this.y;
    var z = this.z;
    var e = m.elements;

    this.x = e[0] * x + e[3] * y + e[6] * z;
    this.y = e[1] * x + e[4] * y + e[7] * z;
    this.z = e[2] * x + e[5] * y + e[8] * z;

    return this;
  },

  applyMatrix4: function applyMatrix4(m) {
    var x = this.x;
    var y = this.y;
    var z = this.z;
    var e = m.elements;

    this.x = e[0] * x + e[4] * y + e[8] * z + e[12];
    this.y = e[1] * x + e[5] * y + e[9] * z + e[13];
    this.z = e[2] * x + e[6] * y + e[10] * z + e[14];
    var w = e[3] * x + e[7] * y + e[11] * z + e[15];

    return this.divideScalar(w);
  },

  applyQuaternion: function applyQuaternion(q) {
    var x = this.x;
    var y = this.y;
    var z = this.z;
    var qx = q.x;
    var qy = q.y;
    var qz = q.z;
    var qw = q.w;

    // calculate quat * vector

    var ix = qw * x + qy * z - qz * y;
    var iy = qw * y + qz * x - qx * z;
    var iz = qw * z + qx * y - qy * x;
    var iw = -qx * x - qy * y - qz * z;

    // calculate result * inverse quat

    this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;

    return this;
  },

  project: function () {
    var matrix = void 0;

    return function project(camera) {
      if (matrix === undefined) matrix = new Matrix4();

      /* eslint max-len: 0 */
      matrix.multiplyMatrices(camera.projectionMatrix, matrix.getInverse(camera.matrixWorld));
      return this.applyMatrix4(matrix);
    };
  }(),

  unproject: function () {
    var matrix = void 0;

    return function unproject(camera) {
      if (matrix === undefined) matrix = new Matrix4();

      matrix.multiplyMatrices(camera.matrixWorld, matrix.getInverse(camera.projectionMatrix));
      return this.applyMatrix4(matrix);
    };
  }(),

  transformDirection: function transformDirection(m) {
    // input: THREE.Matrix4 affine matrix
    // vector interpreted as a direction

    var x = this.x;
    var y = this.y;
    var z = this.z;
    var e = m.elements;

    this.x = e[0] * x + e[4] * y + e[8] * z;
    this.y = e[1] * x + e[5] * y + e[9] * z;
    this.z = e[2] * x + e[6] * y + e[10] * z;

    return this.normalize();
  },

  divide: function divide(v) {
    this.x /= v.x;
    this.y /= v.y;
    this.z /= v.z;

    return this;
  },

  divideScalar: function divideScalar(scalar) {
    return this.multiplyScalar(1 / scalar);
  },

  min: function min(v) {
    this.x = Math.min(this.x, v.x);
    this.y = Math.min(this.y, v.y);
    this.z = Math.min(this.z, v.z);

    return this;
  },

  max: function max(v) {
    this.x = Math.max(this.x, v.x);
    this.y = Math.max(this.y, v.y);
    this.z = Math.max(this.z, v.z);

    return this;
  },

  clamp: function clamp(min, max) {
    // This function assumes min < max, if this assumption isn't true it will not operate correctly

    this.x = Math.max(min.x, Math.min(max.x, this.x));
    this.y = Math.max(min.y, Math.min(max.y, this.y));
    this.z = Math.max(min.z, Math.min(max.z, this.z));

    return this;
  },

  clampScalar: function () {
    var min = void 0;
    var max = void 0;

    return function clampScalar(minVal, maxVal) {
      if (min === undefined) {
        min = new Vector3();
        max = new Vector3();
      }

      min.set(minVal, minVal, minVal);
      max.set(maxVal, maxVal, maxVal);

      return this.clamp(min, max);
    };
  }(),

  clampLength: function clampLength(min, max) {
    var length = this.length();

    return this.multiplyScalar(Math.max(min, Math.min(max, length)) / length);
  },

  floor: function floor() {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
    this.z = Math.floor(this.z);

    return this;
  },

  ceil: function ceil() {
    this.x = Math.ceil(this.x);
    this.y = Math.ceil(this.y);
    this.z = Math.ceil(this.z);

    return this;
  },

  round: function round() {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    this.z = Math.round(this.z);

    return this;
  },

  roundToZero: function roundToZero() {
    this.x = this.x < 0 ? Math.ceil(this.x) : Math.floor(this.x);
    this.y = this.y < 0 ? Math.ceil(this.y) : Math.floor(this.y);
    this.z = this.z < 0 ? Math.ceil(this.z) : Math.floor(this.z);

    return this;
  },

  negate: function negate() {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;

    return this;
  },

  dot: function dot(v) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  },

  lengthSq: function lengthSq() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  },

  length: function length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  },

  lengthManhattan: function lengthManhattan() {
    return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
  },

  normalize: function normalize() {
    return this.divideScalar(this.length());
  },

  setLength: function setLength(length) {
    return this.multiplyScalar(length / this.length());
  },

  lerp: function lerp(v, alpha) {
    this.x += (v.x - this.x) * alpha;
    this.y += (v.y - this.y) * alpha;
    this.z += (v.z - this.z) * alpha;

    return this;
  },

  lerpVectors: function lerpVectors(v1, v2, alpha) {
    return this.subVectors(v2, v1).multiplyScalar(alpha).add(v1);
  },

  cross: function cross(v, w) {
    if (w !== undefined) {
      console.warn('THREE.Vector3: .cross() now only accepts one argument. Use .crossVectors( a, b ) instead.');
      return this.crossVectors(v, w);
    }

    var x = this.x;
    var y = this.y;
    var z = this.z;

    this.x = y * v.z - z * v.y;
    this.y = z * v.x - x * v.z;
    this.z = x * v.y - y * v.x;

    return this;
  },

  crossVectors: function crossVectors(a, b) {
    var ax = a.x;
    var ay = a.y;
    var az = a.z;
    var bx = b.x;
    var by = b.y;
    var bz = b.z;

    this.x = ay * bz - az * by;
    this.y = az * bx - ax * bz;
    this.z = ax * by - ay * bx;

    return this;
  },

  projectOnVector: function projectOnVector(vector) {
    var scalar = vector.dot(this) / vector.lengthSq();

    return this.copy(vector).multiplyScalar(scalar);
  },

  projectOnPlane: function () {
    var v1 = void 0;

    return function projectOnPlane(planeNormal) {
      if (v1 === undefined) v1 = new Vector3();

      v1.copy(this).projectOnVector(planeNormal);

      return this.sub(v1);
    };
  }(),

  reflect: function () {
    // reflect incident vector off plane orthogonal to normal
    // normal is assumed to have unit length

    var v1 = void 0;

    return function reflect(normal) {
      if (v1 === undefined) v1 = new Vector3();

      return this.sub(v1.copy(normal).multiplyScalar(2 * this.dot(normal)));
    };
  }(),

  angleTo: function angleTo(v) {
    var theta = this.dot(v) / Math.sqrt(this.lengthSq() * v.lengthSq());

    // clamp, to handle numerical problems

    return Math.acos(_Math.clamp(theta, -1, 1));
  },

  distanceTo: function distanceTo(v) {
    return Math.sqrt(this.distanceToSquared(v));
  },

  distanceToSquared: function distanceToSquared(v) {
    var dx = this.x - v.x;
    var dy = this.y - v.y;
    var dz = this.z - v.z;

    return dx * dx + dy * dy + dz * dz;
  },

  distanceToManhattan: function distanceToManhattan(v) {
    return Math.abs(this.x - v.x) + Math.abs(this.y - v.y) + Math.abs(this.z - v.z);
  },

  setFromSpherical: function setFromSpherical(s) {
    var sinPhiRadius = Math.sin(s.phi) * s.radius;

    this.x = sinPhiRadius * Math.sin(s.theta);
    this.y = Math.cos(s.phi) * s.radius;
    this.z = sinPhiRadius * Math.cos(s.theta);

    return this;
  },

  setFromCylindrical: function setFromCylindrical(c) {
    this.x = c.radius * Math.sin(c.theta);
    this.y = c.y;
    this.z = c.radius * Math.cos(c.theta);

    return this;
  },

  setFromMatrixPosition: function setFromMatrixPosition(m) {
    return this.setFromMatrixColumn(m, 3);
  },

  setFromMatrixScale: function setFromMatrixScale(m) {
    var sx = this.setFromMatrixColumn(m, 0).length();
    var sy = this.setFromMatrixColumn(m, 1).length();
    var sz = this.setFromMatrixColumn(m, 2).length();

    this.x = sx;
    this.y = sy;
    this.z = sz;

    return this;
  },

  setFromMatrixColumn: function setFromMatrixColumn(m, index) {
    if (typeof m === 'number') {
      console.warn('THREE.Vector3: setFromMatrixColumn now expects ( matrix, index ).');
      var temp = m;
      m = index;
      index = temp;
    }

    return this.fromArray(m.elements, index * 4);
  },

  equals: function equals(v) {
    return v.x === this.x && v.y === this.y && v.z === this.z;
  },

  fromArray: function fromArray(array, offset) {
    if (offset === undefined) offset = 0;

    this.x = array[offset];
    this.y = array[offset + 1];
    this.z = array[offset + 2];

    return this;
  },

  toArray: function toArray(array, offset) {
    if (array === undefined) array = [];
    if (offset === undefined) offset = 0;

    array[offset] = this.x;
    array[offset + 1] = this.y;
    array[offset + 2] = this.z;

    return array;
  },

  fromBufferAttribute: function fromBufferAttribute(attribute, index, offset) {
    if (offset !== undefined) {
      console.warn('THREE.Vector3: offset has been removed from .fromBufferAttribute().');
    }

    this.x = attribute.getX(index);
    this.y = attribute.getY(index);
    this.z = attribute.getZ(index);

    return this;
  }

};

export { Vector3 };