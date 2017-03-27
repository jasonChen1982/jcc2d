import {Rectangle} from './Rectangle';

/**
 * 椭圆对象
 *
 * @class
 * @memberof JC
 * @param {number} x x轴的坐标
 * @param {number} y y轴的坐标
 * @param {number} width 椭圆的宽度
 * @param {number} height 椭圆的高度
 */
function Ellipse(x, y, width, height) {
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
  this.width = width || 0;

  /**
   * @member {number}
   * @default 0
   */
  this.height = height || 0;
}

/**
 * 克隆一个该椭圆对象
 *
 * @return {PIXI.Ellipse} 克隆出来的椭圆对象
 */
Ellipse.prototype.clone = function() {
  return new Ellipse(this.x, this.y, this.width, this.height);
};

/**
 * 检测坐标点是否在椭园内
 *
 * @param {number} x 坐标点的x轴坐标
 * @param {number} y 坐标点的y轴坐标
 * @return {boolean} 坐标点是否在椭园内
 */
Ellipse.prototype.contains = function(x, y) {
  if (this.width <= 0 || this.height <= 0) {
    return false;
  }

  // normalize the coords to an ellipse with center 0,0
  let normx = ((x - this.x) / this.width);
  let normy = ((y - this.y) / this.height);

  normx *= normx;
  normy *= normy;

  return (normx + normy <= 1);
};

/**
 * 返回对象所占的矩形区域
 *
 * @return {PIXI.Rectangle} 矩形对象
 */
Ellipse.prototype.getBounds = function() {
  return new Rectangle(
    this.x - this.width,
    this.y - this.height,
    this.width,
    this.height
  );
};

export {Ellipse};
