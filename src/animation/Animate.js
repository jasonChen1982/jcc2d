
import {Eventer} from '../eventer/Eventer';
import {Utils} from '../util/Utils';

/**
 * 动画对象的基本类型
 *
 * @class
 * @memberof JC
 * @param {object} [options] 动画配置信息
 */
function Animate(options) {
  Eventer.call(this);

  this.element = options.element || {};
  this.duration = options.duration || 300;
  this.living = true;
  this.resident = options.resident || false;

  // this.onComplete = options.onComplete || null;
  // this.onUpdate = options.onUpdate || null;

  this.infinite = options.infinite || false;
  this.alternate = options.alternate || false;
  this.repeats = options.repeats || 0;
  this.delay = options.delay || 0;
  this.wait = options.wait || 0;
  this.timeScale = Utils.isNumber(options.timeScale) ?
    options.timeScale :
    1;

  if (options.onComplete) {
    this.on('complete', options.onComplete.bind(this));
  }
  if (options.onUpdate) {
    this.on('update', options.onUpdate.bind(this));
  }

  // this.repeatsCut = this.repeats;
  // this.delayCut = this.delay;
  // this.waitCut = this.wait;
  // this.progress = 0;
  // this.direction = 1;
  this.init();

  this.paused = false;
}

Animate.prototype = Object.create(Eventer.prototype);

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

  this.progress += snippetCache;
  let isEnd = false;
  const progressCache = this.progress;

  if (this.spill()) {
    if (this.repeatsCut > 0 || this.infinite) {
      if (this.repeatsCut > 0) --this.repeatsCut;
      this.delayCut = this.delay;
      if (this.alternate) {
        this.direction *= -1;
        this.progress = Utils.codomainBounce(this.progress, 0, this.duration);
      } else {
        this.direction = 1;
        this.progress = Utils.euclideanModulo(this.progress, this.duration);
      }
    } else {
      isEnd = true;
    }
  }

  let pose;
  if (!isEnd) {
    pose = this.nextPose();
    this.emit('update', pose, this.progress / this.duration);
  } else {
    if (!this.resident) this.living = false;
    this.progress = Utils.clamp(progressCache, 0, this.duration);
    pose = this.nextPose();
    this.emit('complete', pose, Math.abs(progressCache - this.progress));
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
 * 线性插值
 * @private
 * @param {number} p0 起始位置
 * @param {number} p1 结束位置
 * @param {number} t  进度位置
 * @return {Number}
 */
Animate.prototype.linear = function(p0, p1, t) {
  return (p1 - p0) * t + p0;
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
