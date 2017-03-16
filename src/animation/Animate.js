import { TWEEN } from '../util/TWEEN';
import { UTILS } from '../util/UTILS';

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

    this.totalTime = 0;

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
Animate.prototype.update = function(snippet) {
    if (this.wait > 0) {
        this.wait -= Math.abs(snippet);
        return;
    }
    if (this.paused || !this.living || this.delayCut > 0) {
        if (this.delayCut > 0) this.delayCut -= Math.abs(snippet);
        return;
    }

    var snippetCache = this.direction * this.timeScale * snippet;
    this.progress = UTILS.clamp(this.progress + snippetCache, 0, this.duration);
    this.totalTime += Math.abs(snippetCache);

    var pose = this.nextPose();
    if (this.onUpdate) this.onUpdate(pose, this.progress / this.duration);

    if (this.totalTime >= this.duration) {
        if (this.repeats > 0 || this.infinity) {
            if (this.repeats > 0) --this.repeats;
            this.delayCut = this.delay;
            this.totalTime = 0;
            if (this.alternate) {
                this.direction *= -1;
                this._swapEase();
            } else {
                this.direction = 1;
                this.progress = 0;
            }
        } else {
            this.living = false;
            if (this.onCompelete) this.onCompelete(pose);
        }
    }
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
