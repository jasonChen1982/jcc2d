import {Animate} from './Animate';
import {Utils} from '../util/Utils';
/**
 * AnimateRunner类型动画对象
 *
 * @class
 * @memberof JC
 * @param {object} [options] 动画配置信息
 */
function AnimateRunner(options) {
  Animate.call(this, options);

  this._runners = options.runners;
  this._runnerIndex = 0;
  this._cursor = 1;
  this._runnerConfig = options.runnersConfig;

  this.configRunner();
}
AnimateRunner.prototype = Object.create(Animate.prototype);
AnimateRunner.prototype.configRunner = function() {
  this.from = this._runners[this._runnerIndex];
  this._runnerIndex += this._cursor;
  this.to = this._runners[this._runnerIndex];
  let config = this._runnerConfig[
                 Math.min(
                   this._runnerIndex,
                   this._runnerIndex - this._cursor
                 )
               ]||{};
  this.ease = config.ease || this.ease;
  this.duration = config.duration || this.duration;
  this.progress = 0;
};
AnimateRunner.prototype.update = function(snippet) {
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
  this.progress = Utils.clamp(this.progress + snippetCache, 0, this.duration);
  this.totalTime += Math.abs(snippetCache);

  let pose = this.nextPose();
  if (this.onUpdate) {
    this.onUpdate(pose,
      this.progress / this.duration,
      this._runnerIndex
    );
  }

  // this.progress += this.timeScale * snippet;
  if (this.totalTime >= this.duration) {
    this.totalTime = 0;
    if (this._runnerIndex < this._runners.length - 1 && this._runnerIndex > 0) {
      this.configRunner();
    } else {
      if (this.repeats > 0 || this.infinity) {
        if (this.repeats > 0) --this.repeats;
        this.delayCut = this.delay;
        if (this.alternate) {
          this._cursor *= -1;
        } else {
          this._cursor = 1;
          this._runnerIndex = 0;
        }
        this.configRunner();
      } else {
        this.living = false;
        if (this.onCompelete) this.onCompelete();
      }
    }
  }
};

export {AnimateRunner};
