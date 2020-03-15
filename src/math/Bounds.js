import {Rectangle} from './Rectangle';
import {Utils} from '../utils/Utils';

/**
 * 显示对象的包围盒子
 *
 * @class
 * @memberof JC
 * @param {Number} minX
 * @param {Number} minY
 * @param {Number} maxX
 * @param {Number} maxY
 */
function Bounds(minX, minY, maxX, maxY) {
  /**
   * @member {number}
   * @default 0
   */
  this.minX = Utils.isNumber(minX)?
    minX:
    Infinity;

  /**
   * @member {number}
   * @default 0
   */
  this.minY = Utils.isNumber(minY)?
    minY:
    Infinity;

  /**
   * @member {number}
   * @default 0
   */
  this.maxX = Utils.isNumber(maxX)?
    maxX:
    -Infinity;

  /**
   * @member {number}
   * @default 0
   */
  this.maxY = Utils.isNumber(maxY)?
    maxY:
    -Infinity;

  this.rect = null;
}

Bounds.prototype.isEmpty = function() {
  return this.minX > this.maxX || this.minY > this.maxY;
};

Bounds.prototype.clear = function() {
  this.minX = Infinity;
  this.minY = Infinity;
  this.maxX = -Infinity;
  this.maxY = -Infinity;
  return this;
};

/**
 * 将包围盒子转换成矩形描述
 *
 * @param {JC.Rectangle} rect 待转换的矩形
 * @return {JC.Rectangle}
 */
Bounds.prototype.getRectangle = function(rect) {
  if (this.isEmpty()) {
    return Rectangle.EMPTY;
  }

  rect = rect || new Rectangle(0, 0, 1, 1);

  rect.x = this.minX;
  rect.y = this.minY;
  rect.width = this.maxX - this.minX;
  rect.height = this.maxY - this.minY;

  return rect;
};

/**
 * 往包围盒增加外部顶点，更新包围盒区域
 *
 * @param {JC.Point} point
 */
Bounds.prototype.addPoint = function(point) {
  this.minX = Math.min(this.minX, point.x);
  this.maxX = Math.max(this.maxX, point.x);
  this.minY = Math.min(this.minY, point.y);
  this.maxY = Math.max(this.maxY, point.y);
};

/**
 * 往包围盒增加矩形区域，更新包围盒区域
 *
 * @param {JC.Rectangle} rect
 */
Bounds.prototype.addRect = function(rect) {
  this.minX = Math.min(this.minX, rect.x);
  this.maxX = Math.max(this.maxX, rect.width + rect.x);
  this.minY = Math.min(this.minY, rect.y);
  this.maxY = Math.max(this.maxY, rect.height + rect.y);
};

/**
 * 往包围盒增加矩形区域，更新包围盒区域
 *
 * @param {JC.Circle} circle
 */
Bounds.prototype.addCircle = function(circle) {
  this.minX = Math.min(this.minX, circle.x - circle.radius);
  this.maxX = Math.max(this.maxX, circle.x + circle.radius);
  this.minY = Math.min(this.minY, circle.y - circle.radius);
  this.maxY = Math.max(this.maxY, circle.y + circle.radius);
};

/**
 * 往包围盒增加顶点数组，更新包围盒区域
 *
 * @param {Array} vertices
 */
Bounds.prototype.addVert = function(vertices) {
  let minX = this.minX;
  let minY = this.minY;
  let maxX = this.maxX;
  let maxY = this.maxY;

  for (let i = 0; i < vertices.length; i += 2) {
    let x = vertices[i];
    let y = vertices[i + 1];
    minX = x < minX ? x : minX;
    minY = y < minY ? y : minY;
    maxX = x > maxX ? x : maxX;
    maxY = y > maxY ? y : maxY;
  }

  this.minX = minX;
  this.minY = minY;
  this.maxX = maxX;
  this.maxY = maxY;
};

/**
 * 往包围盒增加包围盒，更新包围盒区域
 *
 * @param {JC.Bounds} bounds
 */
Bounds.prototype.addBounds = function(bounds) {
  const minX = this.minX;
  const minY = this.minY;
  const maxX = this.maxX;
  const maxY = this.maxY;

  this.minX = bounds.minX < minX ? bounds.minX : minX;
  this.minY = bounds.minY < minY ? bounds.minY : minY;
  this.maxX = bounds.maxX > maxX ? bounds.maxX : maxX;
  this.maxY = bounds.maxY > maxY ? bounds.maxY : maxY;
};

export {Bounds};
