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
function Point(x, y, z, w)
{
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
Point.prototype.clone = function ()
{
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
 * @param [x=0] {number} x轴的位置
 * @param [y=0] {number} y轴的位置
 */
Point.prototype.set = function (x, y)
{
  this.x = x || 0;
  this.y = y || ( (y !== 0) ? this.x : 0 ) ;
};

export { Point };
