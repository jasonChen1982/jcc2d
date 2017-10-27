import { Point } from './Point';
import { Utils } from '../util/Utils';

/**
 * @class
 * @memberof JC
 * @param {JC.Point} points 坐标点数组，可以是JC.Point类型的数组项数组，也可以是连续两个数分别代表x、y坐标的数组。
 */
function Polygon(points) {
  if (!Utils.isArray(points)) {
    points = new Array(arguments.length);
    /* eslint-disable */
    for (var a = 0; a < points.length; ++a) {
      points[a] = arguments[a];
    }
  }

  if (points[0] instanceof Point) {
    var p = [];
    for (var i = 0, il = points.length; i < il; i++) {
      p.push(points[i].x, points[i].y);
    }

    points = p;
  }

  this.closed = true;

  this.points = points;
}

/**
 * 克隆一个属性相同的多边型对象
 *
 * @return {PIXI.Polygon} 克隆的对象
 */
Polygon.prototype.clone = function () {
  return new Polygon(this.points.slice());
};

/**
 * 检查坐标点是否在多边形内部
 *
 * @param {number} x 坐标点的x轴坐标
 * @param {number} y 坐标点的y轴坐标
 * @return {boolean} 是否在多边形内部
 */
Polygon.prototype.contains = function (x, y) {
  var inside = false;

  var length = this.points.length / 2;

  for (var i = 0, j = length - 1; i < length; j = i++) {
    var xi = this.points[i * 2];
    var yi = this.points[i * 2 + 1];
    var xj = this.points[j * 2];
    var yj = this.points[j * 2 + 1];
    var intersect = yi > y !== yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi;

    if (intersect) {
      inside = !inside;
    }
  }

  return inside;
};

export { Polygon };