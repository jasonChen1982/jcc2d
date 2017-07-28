import {Animate} from './Animate';
import {Transition} from './Transition';
import {PathMotion} from './PathMotion';

/**
 * AnimateRunner类型动画类
 *
 * @class
 * @memberof JC
 * @param {object} [options] 动画配置信息
 */
function AnimateRunner(options) {
  Animate.call(this, options);

  this.runners = options.runners;
  this.cursor = 0;
  this.queues = [];
  this.alternate = false;

  this.length = this.runners.length;
}
AnimateRunner.prototype = Object.create(Animate.prototype);

/**
 * 更新下一个`runner`
 * @private
 */
AnimateRunner.prototype.nextRunner = function() {
  this.queues[this.cursor].init();
  this.cursor += this.direction;
};

/**
 * 初始化当前`runner`
 * @private
 */
AnimateRunner.prototype.initRunner = function() {
  const runner = this.runners[this.cursor];
  runner.infinite = false;
  runner.resident = true;
  runner.element = this.element;
  // runner.onCompelete = this.nextRunner.bind(this);
  let animate = null;
  if (runner.path) {
    animate = new PathMotion(runner);
  } else if (runner.to) {
    animate = new Transition(runner);
  }
  if (animate !== null) {
    animate.on('compelete', this.nextRunner.bind(this));
    this.queues.push(animate);
  }
};

/**
 * 下一帧的状态
 * @private
 * @param {number} snippetCache 时间片段
 * @return {object}
 */
AnimateRunner.prototype.nextPose = function(snippetCache) {
  if (!this.queues[this.cursor] && this.runners[this.cursor]) {
    this.initRunner();
  }
  return this.queues[this.cursor].update(snippetCache);
};

/**
 * 更新动画数据
 * @private
 * @param {number} snippet 时间片段
 * @return {object}
 */
AnimateRunner.prototype.update = function(snippet) {
  if (this.wait > 0) {
    this.wait -= Math.abs(snippet);
    return;
  }
  if (this.paused || !this.living || this.delayCut > 0) {
    if (this.delayCut > 0) this.delayCut -= Math.abs(snippet);
    return;
  }

  const cc = this.cursor;

  const pose = this.nextPose(this.direction * this.timeScale * snippet);
  // if (this.onUpdate) this.onUpdate({
  //   index: cc, pose: pose,
  // }, this.progress / this.duration);
  this.emit('update', {
    index: cc, pose: pose,
  }, this.progress / this.duration);

  if (this.spill()) {
    if (this.repeats > 0 || this.infinite) {
      if (this.repeats > 0) --this.repeats;
      this.delayCut = this.delay;
      this.direction = 1;
      this.cursor = 0;
    } else {
      if (!this.resident) this.living = false;
      // if (this.onCompelete) this.onCompelete(pose);
      this.emit('compelete', pose);
    }
  }
  return pose;
};

/**
 * 检查动画是否到了边缘
 * @private
 * @return {boolean}
 */
AnimateRunner.prototype.spill = function() {
  // TODO: 这里应该保留溢出，不然会导致时间轴上的误差
  const bottomSpill = this.cursor <= 0 && this.direction === -1;
  const topSpill = this.cursor >= this.length && this.direction === 1;
  return bottomSpill || topSpill;
};


export {AnimateRunner};
