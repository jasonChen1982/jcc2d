
/* eslint max-len: "off" */

/**
 * 二维空间内坐标点类
 *
 * @class
 * @memberof JC
 * @param {number} [x=0] x轴的位置
 * @param {number} [y=0] y轴的位置
 * @param {number} [z=0] z轴的位置
 * @param {number} [w=0] w轴的位置
 */
function Point(x, y, z, w) {
  /**
   * @member {number}
   * @default 0
   */
  this.x = x || 0;

  /**
   * @member {number}
   * @default 0
   */
  this.y = y || 0;

  /**
   * @member {number}
   * @default 0
   */
  this.z = z || 0;

  /**
   * @member {number}
   * @default 0
   */
  this.w = w || 0;
}

/**
 * 克隆一这个坐标点
 *
 * @return {JC.Point} 克隆的坐标点
 */
Point.prototype.clone = function() {
  return new Point(this.x, this.y, this.z, this.w);
};

/**
 * 拷贝传入的坐标点来设置当前坐标点
 *
 * @param {JC.Point} p
 */
Point.prototype.copy = function(p) {
  this.set(p.x, p.y, p.z, p.w);
};

/**
 * 设置坐标点
 *
 * @param {number} x 轴的位置
 * @param {number} y 轴的位置
 * @param {number} z 轴的位置
 * @param {number} w 轴的位置
 * @return {Point} this
 */
Point.prototype.set = function( x, y, z, w ) {
  this.x = x;
  this.y = y;
  this.z = z;
  this.w = w;
  return this;
};

Point.prototype.add = function( v, w ) {
  if ( w !== undefined ) {
    console.warn( 'Use .addVectors( a, b ) instead.' );
    return this.addVectors( v, w );
  }
  this.x += v.x;
  this.y += v.y;
  this.z += v.z;
  this.w += v.w;
  return this;
};

Point.prototype.addVectors = function( a, b ) {
  this.x = a.x + b.x;
  this.y = a.y + b.y;
  this.z = a.z + b.z;
  this.w = a.w + b.w;
  return this;
};


Point.prototype.sub = function( v, w ) {
  if ( w !== undefined ) {
    console.warn( 'Use .subVectors( a, b ) instead.' );
    return this.subVectors( v, w );
  }
  this.x -= v.x;
  this.y -= v.y;
  this.z -= v.z;
  this.w -= v.w;
  return this;
};

Point.prototype.subVectors = function( a, b ) {
  this.x = a.x - b.x;
  this.y = a.y - b.y;
  this.z = a.z - b.z;
  this.w = a.w - b.w;
  return this;
};

Point.prototype.lengthSq = function() {
  return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
};

Point.prototype.length = function() {
  return Math.sqrt( this.lengthSq() );
};

Point.prototype.normalize = function() {
  return this.divideScalar( this.length() );
};

Point.prototype.divideScalar = function( scalar ) {
  return this.multiplyScalar( 1 / scalar );
};

Point.prototype.distanceTo = function( v ) {
  return Math.sqrt( this.distanceToSquared( v ) );
};

Point.prototype.distanceToSquared = function( v ) {
  const dx = this.x - v.x;
  const dy = this.y - v.y;
  const dz = this.z - v.z;
  return dx * dx + dy * dy + dz * dz;
};

Point.prototype.multiplyScalar = function( scalar ) {
  if ( isFinite( scalar ) ) {
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;
    this.w *= scalar;
  } else {
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.w = 0;
  }
  return this;
};

Point.prototype.cross = function(v, w) {
  if (w !== undefined) {
    console.warn('Use .crossVectors( a, b ) instead.');
    return this.crossVectors(v, w);
  }

  const x = this.x;
  const y = this.y;
  const z = this.z;

  this.x = y * v.z - z * v.y;
  this.y = z * v.x - x * v.z;
  this.z = x * v.y - y * v.x;

  return this;
};

Point.prototype.crossVectors = function(a, b) {
  const ax = a.x;
  const ay = a.y;
  const az = a.z;
  const bx = b.x;
  const by = b.y;
  const bz = b.z;

  this.x = ay * bz - az * by;
  this.y = az * bx - ax * bz;
  this.z = ax * by - ay * bx;

  return this;
};


export {Point};
