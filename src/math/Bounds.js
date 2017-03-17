import { Rectangle } from './Rectangle';

/**
 * 显示对象的包围盒子
 *
 * @class
 * @memberof JC
 */
function Bounds(minX, minY, maxX, maxY) {
  /**
   * @member {number}
   * @default 0
   */
  this.minX = minX || Infinity;

  /**
   * @member {number}
   * @default 0
   */
  this.minY = minY || Infinity;

  /**
   * @member {number}
   * @default 0
   */
  this.maxX = maxX || -Infinity;

  /**
   * @member {number}
   * @default 0
   */
  this.maxY = maxY || -Infinity;

  this.rect = null;
}

Bounds.prototype.isEmpty = function() {
  return this.minX > this.maxX || this.minY > this.maxY;
};

Bounds.prototype.clear = function() {
    // this.updateID++;

  this.minX = Infinity;
  this.minY = Infinity;
  this.maxX = -Infinity;
  this.maxY = -Infinity;
};

/**
 * 将包围盒子转换成矩形描述
 *
 * @param rect {JC.Rectangle} 待转换的矩形
 * @returns {JC.Rectangle}
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
 * @param point {JC.Point}
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
 * @param point {JC.Rectangle}
 */
Bounds.prototype.addRect = function(rect) {
  this.minX = rect.x;
  this.maxX = rect.width + rect.x;
  this.minY = rect.y;
  this.maxY = rect.height + rect.y;
};

/**
 * 往包围盒增加顶点数组，更新包围盒区域
 *
 * @param point {Array}
 */
Bounds.prototype.addVert = function(vertices) {
  var minX = this.minX,
    minY = this.minY,
    maxX = this.maxX,
    maxY = this.maxY;

  for (var i = 0; i < vertices.length; i += 2) {
    var x = vertices[i    ];
    var y = vertices[i + 1];
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
 * @param point {JC.Bounds}
 */
Bounds.prototype.addBounds = function(bounds) {
  var minX = this.minX,
    minY = this.minY,
    maxX = this.maxX,
    maxY = this.maxY;

  this.minX = bounds.minX < minX ? bounds.minX : minX;
  this.minY = bounds.minY < minY ? bounds.minY : minY;
  this.maxX = bounds.maxX > maxX ? bounds.maxX : maxX;
  this.maxY = bounds.maxY > maxY ? bounds.maxY : maxY;
};

export { Bounds };
