import { TWEEN } from '../util/TWEEN';
/**
 * 动画对象的基本类型
 *
 * @class
 * @memberof JC
 * @param [opts] {object} 动画配置信息
 */

function Animate(opts) {
    this.element = opts.element || {};
    this.duration = opts.duration || 300;
    this.living = true;

    this.onCompelete = opts.onCompelete || null;
    this.onUpdate = opts.onUpdate || null;

    this.infinity = opts.infinity || false;
    this.alternate = opts.alternate || false;
    this.ease = opts.ease || 'easeBoth';
    this.repeats = opts.repeats || 0;
    this.delay = opts.delay || 0;
    this.wait = opts.wait || 0;
    this.delayCut = this.delay;
    this.progress = 0;
    this.direction = 1;

    this.timeScale = opts.timeScale || 1;

    this.paused = false;
}
Animate.prototype._swapEase = function() {
    var ease = this.ease;
    if (ease.indexOf('In') > 0) {
        ease = ease.replace('In', 'Out');
    } else if (ease.indexOf('Out') > 0) {
        ease = ease.replace('Out', 'In');
    }
    this.ease = ease;
};
Animate.prototype.nextPose = function() {
    var cache = {};
    for (var i in this.to) {
        cache[i] = TWEEN[this.ease](this.progress, this.from[i], this.to[i] - this.from[i], this.duration);
        if (this.element[i] !== undefined) this.element[i] = cache[i];
    }
    return cache; //this.onUpdate
};
Animate.prototype.pause = function() {
    this.paused = true;
};
Animate.prototype.start = function() {
    this.paused = false;
};
Animate.prototype.stop = function() {
    this.progress = this.duration;
};
Animate.prototype.cancle = function() {
    this.living = false;
};

export { Animate };
