
import { Point } from './Point';
import { Curve } from './Curve';

/**
 *
 * @param {Array}  points  array of points
 */

function BezierCurve( points ) {
  this.points = points;
}

BezierCurve.prototype = Object.create( Curve.prototype );

BezierCurve.prototype.getPoint = function (t , points) {
  var a = points,
    len = a.length,
    rT = 1 - t,
    l = a.slice(0, len - 1),
    r = a.slice(1),
    oP = new Point();
  if (len > 3) {
    var oL = this.getPoint(t, l),
      oR = this.getPoint(t, r);
    oP.x = rT * oL.x + t * oR.x;
    oP.y = rT * oL.y + t * oR.y;
    return oP;
  } else {
    oP.x = rT * rT * points[0].x + 2 * t * rT * points[1].x + t * t * points[2].x;
    oP.y = rT * rT * points[0].y + 2 * t * rT * points[1].y + t * t * points[2].y;
    return oP;
  }
};

export { BezierCurve };
