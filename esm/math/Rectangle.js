
/**
 * 矩形类
 *
 * @class
 * @memberof JC
 * @param {number} x 左上角的x坐标
 * @param {number} y 左上角的y坐标
 * @param {number} width 矩形的宽度
 * @param {number} height 矩形的高度
 */
function Rectangle(x, y, width, height) {
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
 * 空矩形对象
 *
 * @static
 * @constant
 */
Rectangle.EMPTY = new Rectangle(0, 0, 0, 0);

/**
 * 克隆一个与该举行对象同样属性的矩形
 *
 * @return {PIXI.Rectangle} 克隆出的矩形
 */
Rectangle.prototype.clone = function () {
  return new Rectangle(this.x, this.y, this.width, this.height);
};

/**
 * 检查坐标点是否在矩形区域内
 *
 * @param {number} x 坐标点的x轴位置
 * @param {number} y 坐标点的y轴位置
 * @return {boolean} 坐标点是否在矩形区域内
 */
Rectangle.prototype.contains = function (x, y) {
  if (this.width <= 0 || this.height <= 0) {
    return false;
  }

  if (x >= this.x && x < this.x + this.width) {
    if (y >= this.y && y < this.y + this.height) {
      return true;
    }
  }

  return false;
};

export { Rectangle };