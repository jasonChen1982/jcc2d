import { Animate } from './Animate';
/**
 * KeyFrames类型动画对象
 *
 * @class
 * @memberof JC
 * @param [opts] {object} 动画配置信息
 */
function KeyFrames(opts) {
    Animate.call(this, opts);

    this._keyframes = opts.keys;
    this._keyIndex = 0;
    this._direction = 1;
    this._keyConfig = opts.keyConfig;

    this.configKey();
}
KeyFrames.prototype = Object.create(Animate.prototype);
KeyFrames.prototype.configKey = function() {
    this.from = this._keyframes[this._keyIndex];
    this._keyIndex += this._direction;
    this.to = this._keyframes[this._keyIndex];
    var config = this._keyConfig[Math.min(this._keyIndex, this._keyIndex - this._direction)] || {};
    this.ease = config.ease || this.ease;
    this.duration = config.duration || this.duration;
    this.progress = 0;
};
KeyFrames.prototype.update = function(snippet) {
    if (this.paused || !this.living) return;
    this.progress += this.timeScale * snippet;

    if (this.progress < this.duration) {
        if (this.progress < 0) return;
        var pose = this.nextPose();
        if (this.onUpdate) this.onUpdate(pose, this.progress / this.duration, this._keyIndex);
    } else {
        this.element.setVal(this.to);
        if (this.onUpdate) this.onUpdate(this.to, 1, this._keyIndex);
        if (this._keyIndex < this._keyframes.length - 1 && this._keyIndex > 0) {
            this.configKey();
        } else {
            if (this.repeats > 0 || this.infinity) {
                if (this.repeats > 0) --this.repeats;
                if (this.alternate) {
                    this._direction *= -1;
                } else {
                    this._keyIndex = 0;
                }
                this.configKey();
            } else {
                this.living = false;
                if (this.onCompelete) this.onCompelete();
            }
        }
    }
};

export { KeyFrames };
