import {Utils} from '../util/Utils';

/**
 * 动画对象的基本类型
 *
 * @class
 * @memberof JC
 * @param {object} [options] 动画配置信息
 */
function Animate(options) {
  this.element = options.element || {};
  this.duration = options.duration || 300;
  this.living = true;
  this.resident = options.resident || false;

  this.onCompelete = options.onCompelete || null;
  this.onUpdate = options.onUpdate || null;

  this.infinite = options.infinite || false;
  this.alternate = options.alternate || false;
  this.repeats = options.repeats || 0;
  this.repeatsCut = this.repeats;
  this.delay = options.delay || 0;
  this.delayCut = this.delay;
  this.wait = options.wait || 0;
  this.progress = 0;
  this.direction = 1;

  this.timeScale = options.timeScale || 1;

  this.totalTime = 0;

  this.paused = false;
}
Animate.prototype.update = function(snippet) {
  let snippetCache = this.direction * this.timeScale * snippet;
  if (this.wait > 0) {
    this.wait -= Math.abs(snippetCache);
    return;
  }
  if (this.paused || !this.living || this.delayCut > 0) {
    if (this.delayCut > 0) this.delayCut -= Math.abs(snippetCache);
    return;
  }

  this.progress = Utils.clamp(this.progress + snippetCache, 0, this.duration);
  this.totalTime += Math.abs(snippetCache);

  let pose = this.nextPose();
  if (this.onUpdate) this.onUpdate(pose, this.progress / this.duration);

  if (this.totalTime >= this.duration) {
    if (this.repeatsCut > 0 || this.infinite) {
      if (this.repeatsCut > 0) --this.repeatsCut;
      this.delayCut = this.delay;
      if (this.alternate) {
        this.direction *= -1;
      } else {
        this.direction = 1;
        this.progress = 0;
      }
    } else {
      if (!this.resident) this.living = false;
      if (this.onCompelete) this.onCompelete(pose);
    }
    this.totalTime = 0;
  }
  return pose;
};
Animate.prototype.init = function() {
  this.direction = 1;
  this.progress = 0;
  this.repeatsCut = this.repeats;
};
Animate.prototype.nextPose = function() {
  console.warn('should be overwrite');
};
Animate.prototype.pause = function() {
  this.paused = true;
};
Animate.prototype.restart = function() {
  this.paused = false;
};
Animate.prototype.stop = function() {
  this.repeats = 0;
  this.infinite = false;
  this.progress = this.duration;
};
Animate.prototype.cancle = function() {
  this.living = false;
};

export {Animate};
