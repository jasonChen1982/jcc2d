import {Rectangle} from './Rectangle';

/**
 * 圆形对象
 *
 * @class
 * @memberof JC
 * @param {number} x x轴的坐标
 * @param {number} y y轴的坐标
 * @param {number} radius 圆的半径
 */
function Circle(x, y, radius) {
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
  this.radius = radius || 0;
}

/**
 * 克隆一个该圆对象
 *
 * @return {PIXI.Circle} 克隆出来的圆对象
 */
Circle.prototype.clone = function() {
  return new Circle(this.x, this.y, this.radius);
};

/**
 * 检测坐标点是否在园内
 *
 * @param {number} x 坐标点的x轴坐标
 * @param {number} y 坐标点的y轴坐标
 * @return {boolean} 坐标点是否在园内
 */
Circle.prototype.contains = function(x, y) {
  if (this.radius <= 0) {
    return false;
  }

  let dx = (this.x - x);
  let dy = (this.y - y);
  let r2 = this.radius * this.radius;

  dx *= dx;
  dy *= dy;

  return (dx + dy <= r2);
};

/**
* 返回对象所占的矩形区域
*
* @return {PIXI.Rectangle} 矩形对象
*/
Circle.prototype.getBounds = function() {
  return new Rectangle(
    this.x - this.radius,
    this.y - this.radius,
    this.radius * 2,
    this.radius * 2
  );
};

export {Circle};
