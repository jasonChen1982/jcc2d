
import { Point } from './Point';
import { Curve } from './Curve';

/**
 * 贝塞尔曲线类 note: 一般来说超过5阶的贝塞尔曲线并不是非常实用，你可以尝试 JC 的其他曲线类型
 * @class
 * @memberof JC
 * @param {Array}  points  array of points
 */
function BezierCurve(points) {
  this.points = points;
}

BezierCurve.prototype = Object.create(Curve.prototype);

BezierCurve.prototype.getPoint = function (t, points) {
  var a = points || this.points;
  var len = a.length;
  var rT = 1 - t;
  var l = a.slice(0, len - 1);
  var r = a.slice(1);
  var oP = new Point();
  if (len > 3) {
    var oL = this.getPoint(t, l);
    var oR = this.getPoint(t, r);
    oP.x = rT * oL.x + t * oR.x;
    oP.y = rT * oL.y + t * oR.y;
    return oP;
  } else {
    oP.x = rT * rT * a[0].x + 2 * t * rT * a[1].x + t * t * a[2].x;
    oP.y = rT * rT * a[0].y + 2 * t * rT * a[1].y + t * t * a[2].y;
    return oP;
  }
};

export { BezierCurve };