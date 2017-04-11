import {Animate} from './Animate';
import {UTILS} from '../util/UTILS';
/**
 * KeyFrames类型动画对象
 *
 * @class
 * @memberof JC
 * @param {object} [opts] 动画配置信息
 */
function KeyFrames(opts) {
  Animate.call(this, opts);

  this.keyframes = opts.keyframes;
  this._keyIndex = 0;
  this._cursor = 1;
  this._keyConfig = opts.keyConfig;

  this.configKey();
}
KeyFrames.prototype = Object.create(Animate.prototype);
KeyFrames.prototype.configKey = function() {
  this.from = this.keyframes[this._keyIndex];
  this._keyIndex += this._cursor;
  this.to = this.keyframes[this._keyIndex];
  let config = this._keyConfig[
                 Math.min(
                   this._keyIndex,
                   this._keyIndex - this._cursor
                 )
               ]||{};
  this.ease = config.ease || this.ease;
  this.duration = config.duration || this.duration;
  this.progress = 0;
};
KeyFrames.prototype.update = function(snippet) {
  if (this.wait > 0) {
    this.wait -= Math.abs(snippet);
    return;
  }
  if (this.paused || !this.living || this.delayCut > 0) {
    if (this.delayCut > 0) this.delayCut -= Math.abs(snippet);
    return;
  }
  // if (this.paused || !this.living) return;

  let snippetCache = this.direction * this.timeScale * snippet;
  this.progress = UTILS.clamp(this.progress + snippetCache, 0, this.duration);
  this.totalTime += Math.abs(snippetCache);

  let pose = this.nextPose();
  if (this.onUpdate) {
    this.onUpdate(pose,
      this.progress / this.duration,
      this._keyIndex
    );
  }

  // this.progress += this.timeScale * snippet;
  if (this.totalTime >= this.duration) {
    this.totalTime = 0;
    if (this._keyIndex < this.keyframes.length - 1 && this._keyIndex > 0) {
      this.configKey();
    } else {
      if (this.repeats > 0 || this.infinity) {
        if (this.repeats > 0) --this.repeats;
        this.delayCut = this.delay;
        if (this.alternate) {
          this._cursor *= -1;
        } else {
          this._cursor = 1;
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

export {KeyFrames};
