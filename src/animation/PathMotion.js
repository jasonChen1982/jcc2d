import { Animate } from './Animate';
import { UTILS } from '../util/UTILS';
import { TWEEN } from '../util/TWEEN';

/**
 * PathMotion类型动画对象
 *
 * @class
 * @memberof JC
 * @param [opts] {object} 动画所具备的特性
 */
function PathMotion(opts) {
    Animate.call(this, opts);

    this.points = opts.points;
    this.attachTangent = opts.attachTangent || false;
    this._cacheRotate = this.element.rotation;
    var radian = this._cacheRotate * UTILS.DTR;
    this._cacheVector = { x: 10 * Math.cos(radian), y: 10 * Math.sin(radian) };
}
PathMotion.prototype = Object.create(Animate.prototype);
PathMotion.prototype.nextPose = function() {
    var cache = {},
        _rotate = 0,
        t = TWEEN[this.ease](this.progress, 0, 1, this.duration),
        pos = this.getPoint(t, this.points);

    cache.x = pos.x;
    cache.y = pos.y;
    if (this.attachTangent) {
        _rotate = this.decomposeRotate(t, pos);
        cache.rotation = _rotate === false ? this.preDegree : _rotate;
        cache.rotation += this._cacheRotate;
        if (_rotate !== false) this.preDegree = _rotate;
    }
    this.element.setProps(cache);
    return cache;
};
PathMotion.prototype.getPoint = function(t, points) {
    var a = points,
        len = a.length,
        rT = 1 - t,
        l = a.slice(0, len - 1),
        r = a.slice(1),
        oP = {};
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
PathMotion.prototype.decomposeRotate = function(t, pos) {
    var p1 = pos || this.getPoint(t, this.points);
    var p2 = this.getPoint(t + 0.01, this.points);
    var vector = { x: p2.x - p1.x, y: p2.y - p1.y };

    var nor = this._cacheVector.x * vector.y - vector.x * this._cacheVector.y;
    var pi = nor > 0 ? 1 : -1;
    var cos = (vector.x * this._cacheVector.x + vector.y * this._cacheVector.y) / (Math.sqrt(vector.x * vector.x + vector.y * vector.y) * Math.sqrt(this._cacheVector.x * this._cacheVector.x + this._cacheVector.y * this._cacheVector.y));
    if (isNaN(cos)) return false;
    return pi * Math.acos(cos) * UTILS.RTD;
};

export { PathMotion };
