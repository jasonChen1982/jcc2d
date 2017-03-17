import { Animate } from './Animate';
import { UTILS } from '../util/UTILS';
import { TWEEN } from '../util/TWEEN';
import { Curve } from '../math/Curve';
import { Point } from '../math/Point';

/**
 * PathMotion类型动画对象
 *
 * @class
 * @memberof JC
 * @param [opts] {object} 动画所具备的特性
 */
function PathMotion(opts) {
  Animate.call(this, opts);
  if (!opts.path || !(opts.path instanceof Curve)) {
    console.warn(
      '%c JC.PathMotion warn %c: path is not instanceof Curve',
      'color: #f98165; background: #80a89e',
      'color: #80a89e; background: #cad9d5;'
    );
  }

  this.path = opts.path;
  this.attachTangent = opts.attachTangent || false;
  this._cacheRotate = this.element.rotation;
  var radian = this._cacheRotate * UTILS.DTR;
  this._cacheVector = new Point(10 * Math.cos(radian), 10 * Math.sin(radian));
}

PathMotion.prototype = Object.create(Animate.prototype);

PathMotion.prototype.nextPose = function() {
  var _rotate = 0,
    t = TWEEN[this.ease](this.progress, 0, 1, this.duration),
    pos = this.path.getPoint(t),
    cache = pos.clone();

  // cache.x = pos.x;
  // cache.y = pos.y;
  if (this.attachTangent) {
    _rotate = this.decomposeRotate(t);
    cache.rotation = _rotate === false ? this.preDegree : _rotate;
    cache.rotation += this._cacheRotate;
    if (_rotate !== false) this.preDegree = _rotate;
  }
  this.element.setProps(cache);
  return cache;
};

PathMotion.prototype.decomposeRotate = function(t) {
  // var p1 = pos || this.getPoint(t, this.points);
  // var p2 = this.getPoint(t + 0.01, this.points);
  var vector = this.path.getTangent(t); // { x: p2.x - p1.x, y: p2.y - p1.y };

  var nor = this._cacheVector.x * vector.y - vector.x * this._cacheVector.y;
  var pi = nor > 0 ? 1 : -1;
  var cos = (vector.x * this._cacheVector.x + vector.y * this._cacheVector.y) / (Math.sqrt(vector.x * vector.x + vector.y * vector.y) * Math.sqrt(this._cacheVector.x * this._cacheVector.x + this._cacheVector.y * this._cacheVector.y));
  if (isNaN(cos)) return false;
  return pi * Math.acos(cos) * UTILS.RTD;
};

export { PathMotion };
