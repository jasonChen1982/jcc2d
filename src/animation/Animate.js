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
  this.delay = options.delay || 0;
  this.wait = options.wait || 0;
  this.timeScale = Utils.isNumber(options.timeScale) ?
  options.timeScale :
  1;

  // this.repeatsCut = this.repeats;
  // this.delayCut = this.delay;
  // this.waitCut = this.wait;
  // this.progress = 0;
  // this.direction = 1;
  this.init();

  this.paused = false;
}

/**
 * 更新动画
 * @private
 * @param {number} snippet 时间片段
 * @return {object}
 */
Animate.prototype.update = function(snippet) {
  const snippetCache = this.direction * this.timeScale * snippet;
  if (this.waitCut > 0) {
    this.waitCut -= Math.abs(snippetCache);
    return;
  }
  if (this.paused || !this.living || this.delayCut > 0) {
    if (this.delayCut > 0) this.delayCut -= Math.abs(snippetCache);
    return;
  }

  this.progress = Utils.clamp(this.progress + snippetCache, 0, this.duration);

  const pose = this.nextPose();
  if (this.onUpdate) this.onUpdate(pose, this.progress / this.duration);

  if (this.spill()) {
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
  }
  return pose;
};

/**
 * 检查动画是否到了边缘
 * @private
 * @return {boolean}
 */
Animate.prototype.spill = function() {
  const bottomSpill = this.progress <= 0 && this.direction === -1;
  const topSpill = this.progress >= this.duration && this.direction === 1;
  return bottomSpill || topSpill;
};

/**
 * 初始化动画状态
 * @private
 */
Animate.prototype.init = function() {
  this.direction = 1;
  this.progress = 0;
  this.repeatsCut = this.repeats;
  this.delayCut = this.delay;
  this.waitCut = this.wait;
};

/**
 * 下一帧的数据
 * @private
 */
Animate.prototype.nextPose = function() {
  console.warn('should be overwrite');
};

/**
 * 暂停动画
 */
Animate.prototype.pause = function() {
  this.paused = true;
};

/**
 * 恢复动画
 */
Animate.prototype.restart = function() {
  this.paused = false;
};

/**
 * 停止动画，并把状态置为最后一帧，会触发事件
 */
Animate.prototype.stop = function() {
  this.repeats = 0;
  this.infinite = false;
  this.progress = this.duration;
};

/**
 * 设置动画的速率
 * @param {number} speed
 */
Animate.prototype.setSpeed = function(speed) {
  this.timeScale = speed;
};

/**
 * 取消动画，不会触发事件
 */
Animate.prototype.cancle = function() {
  this.living = false;
};

export {Animate};
