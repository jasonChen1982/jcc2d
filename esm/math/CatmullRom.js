
import { Point } from './Point';
import { Curve } from './Curve';
import { Utils } from '../util/Utils';

/**
 *
 * @class
 * @memberof JC
 * @param {Array}  points  array of points
 */
function CatmullRom(points) {
  this.points = points;

  this.passCmp = {
    x: true,
    y: true,
    z: false
  };

  this.ccmp = {};

  this.updateCcmp();
}

CatmullRom.prototype = Object.create(Curve.prototype);

CatmullRom.prototype.updateCcmp = function () {
  for (var i = 0; i < this.points.length; i++) {
    var point = this.points[i];
    for (var cmp in this.passCmp) {
      if (this.passCmp[cmp] && !Utils.isUndefined(point[cmp])) {
        this.ccmp[cmp] = this.ccmp[cmp] || [];
        this.ccmp[cmp][i] = point[cmp];
      }
    }
  }
};

CatmullRom.prototype.getPoint = function (k) {
  var point = new Point();
  for (var cmp in this.passCmp) {
    if (this.passCmp[cmp]) {
      point[cmp] = this.solveEachCmp(this.ccmp[cmp], k);
    }
  }
  return point;
};

CatmullRom.prototype.solveEachCmp = function (v, k) {
  var m = v.length - 1;
  var f = m * k;
  var i = Math.floor(f);
  var fn = this.solve;

  if (v[0] === v[m]) {
    if (k < 0) {
      i = Math.floor(f = m * (1 + k));
    }

    return fn(v[(i - 1 + m) % m], v[i], v[(i + 1) % m], v[(i + 2) % m], f - i);
  } else {
    if (k < 0) {
      return v[0] - (fn(v[0], v[0], v[1], v[1], -f) - v[0]);
    }

    if (k > 1) {
      return v[m] - (fn(v[m], v[m], v[m - 1], v[m - 1], f - m) - v[m]);
    }

    return fn(v[i ? i - 1 : 0], v[i], v[m < i + 1 ? m : i + 1], v[m < i + 2 ? m : i + 2], f - i);
  }
};

CatmullRom.prototype.solve = function (p0, p1, p2, p3, t) {
  var v0 = (p2 - p0) * 0.5;
  var v1 = (p3 - p1) * 0.5;
  var t2 = t * t;
  var t3 = t * t2;

  /* eslint max-len: 0 */
  return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;
};

export { CatmullRom };