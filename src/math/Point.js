/**
 * 二维空间内坐标点类
 *
 * @class
 * @memberof JC
 * @param [x=0] {number} x轴的位置
 * @param [y=0] {number} y轴的位置
 * @param [z=0] {number} z轴的位置
 * @param [w=0] {number} w轴的位置
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
Point.prototype.clone = function () {
  return new Point(this.x, this.y, this.z, this.w);
};

/**
 * 拷贝传入的坐标点来设置当前坐标点
 *
 * @param p {JC.Point}
 */
Point.prototype.copy = function (p) {
  this.set(p.x, p.y, p.z, p.w);
};

/**
 * 设置坐标点
 *
 * @param {number} x轴的位置
 * @param {number} y轴的位置
 * @param {number} z轴的位置
 * @param {number} w轴的位置
 */
Point.prototype.set = function ( x, y, z, w ) {
  this.x = x;
  this.y = y;
  this.z = z;
  this.w = w;
  return this;
};

Point.prototype.add = function ( v, w ) {
  if ( w !== undefined ) {
    console.warn( 'JC.Point: .add() now only accepts one argument. Use .addVectors( a, b ) instead.' );
    return this.addVectors( v, w );
  }
  this.x += v.x;
  this.y += v.y;
  this.z += v.z;
  this.w += v.w;
  return this;
};

Point.prototype.addVectors = function ( a, b ) {
  this.x = a.x + b.x;
  this.y = a.y + b.y;
  this.z = a.z + b.z;
  this.w = a.w + b.w;
  return this;
};


Point.prototype.sub = function ( v, w ) {
  if ( w !== undefined ) {
    console.warn( 'JC.Point: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.' );
    return this.subVectors( v, w );
  }
  this.x -= v.x;
  this.y -= v.y;
  this.z -= v.z;
  this.w -= v.w;
  return this;
};


Point.prototype.subVectors = function ( a, b ) {
  this.x = a.x - b.x;
  this.y = a.y - b.y;
  this.z = a.z - b.z;
  this.w = a.w - b.w;
  return this;
};


Point.prototype.lengthSq = function () {

  return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;

};

Point.prototype.length = function () {

  return Math.sqrt( this.lengthSq() );

};

Point.prototype.normalize = function () {

  return this.divideScalar( this.length() );

};

Point.prototype.divideScalar = function ( scalar ) {

  return this.multiplyScalar( 1 / scalar );

};


Point.prototype.multiplyScalar = function ( scalar ) {

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

export { Point };
