
import {Point} from './Point';
import {Curve} from './Curve';

/**
 *
 * @param {Array}  points  array of points
 */
function BezierCurve( points ) {
  this.points = points;
}

BezierCurve.prototype = Object.create( Curve.prototype );

BezierCurve.prototype.getPoint = function(t, points) {
  const a = points || this.points;
  const len = a.length;
  const rT = 1 - t;
  const l = a.slice(0, len - 1);
  const r = a.slice(1);
  const oP = new Point();
  if (len > 3) {
    const oL = this.getPoint(t, l);
    const oR = this.getPoint(t, r);
    oP.x = rT * oL.x + t * oR.x;
    oP.y = rT * oL.y + t * oR.y;
    return oP;
  } else {
    oP.x = rT * rT * points[0].x
      + 2 * t * rT * points[1].x
          + t * t * points[2].x;
    oP.y = rT * rT * points[0].y
      + 2 * t * rT * points[1].y
          + t * t * points[2].y;
    return oP;
  }
};

export {BezierCurve};
