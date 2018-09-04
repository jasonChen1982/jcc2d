import {Animate} from './Animate';
import {Transition} from './Transition';
import {PathMotion} from './PathMotion';
// import {Utils} from '../util/Utils';

/**
 * AnimateRunner类型动画类
 *
 * @class
 * @memberof JC
 * @param {object} runner 动画属性参数
 * @param {object} [options] queue动画配置
 */
function Queues(runner, options) {
  Animate.call(this, options);

  this.runners = [];
  this.queues = [];
  this.cursor = 0;
  this.total = 0;
  this.alternate = false;

  if (runner) this.then(runner);
}
Queues.prototype = Object.create(Animate.prototype);

/**
 * 更新下一个`runner`
 * @param {Object} runner
 * @return {this}
 * @private
 */
Queues.prototype.then = function(runner) {
  this.queues.push(runner);

  this.total = this.queues.length;
  return this;
};

/**
 * 更新下一个`runner`
 * @param {Object} _
 * @param {Number} time
 * @private
 */
Queues.prototype.nextOne = function(_, time) {
  this.runners[this.cursor].init();
  this.cursor++;
  this.timeSnippet = time;
};

/**
 * 初始化当前`runner`
 * @private
 */
Queues.prototype.initOne = function() {
  const runner = this.queues[this.cursor];
  runner.infinite = false;
  runner.resident = true;
  runner.element = this.element;

  let animate = null;
  if (runner.path) {
    animate = new PathMotion(runner);
  } else if (runner.to) {
    animate = new Transition(runner);
  }
  if (animate !== null) {
    animate.on('complete', this.nextOne.bind(this));
    this.runners.push(animate);
  }
};

/**
 * 下一帧的状态
 * @private
 * @param {number} snippetCache 时间片段
 * @return {object}
 */
Queues.prototype.nextPose = function(snippetCache) {
  if (!this.runners[this.cursor] && this.queues[this.cursor]) {
    this.initOne();
  }
  if (this.timeSnippet > 0) {
    snippetCache += this.timeSnippet;
    this.timeSnippet = 0;
  }
  return this.runners[this.cursor].update(snippetCache);
};

/**
 * 更新动画数据
 * @private
 * @param {number} snippet 时间片段
 * @return {object}
 */
Queues.prototype.update = function(snippet) {
  if (this.wait > 0) {
    this.wait -= Math.abs(snippet);
    return;
  }
  if (this.paused || !this.living || this.delayCut > 0) {
    if (this.delayCut > 0) this.delayCut -= Math.abs(snippet);
    return;
  }

  const cc = this.cursor;

  const pose = this.nextPose(this.timeScale * snippet);

  this.emit('update', {
    index: cc, pose: pose,
  }, this.progress / this.duration);

  if (this.spill()) {
    if (this.repeats > 0 || this.infinite) {
      if (this.repeats > 0) --this.repeats;
      this.delayCut = this.delay;
      this.cursor = 0;
    } else {
      if (!this.resident) this.living = false;
      this.emit('complete', pose);
    }
  }
  return pose;
};

/**
 * 检查动画是否到了边缘
 * @private
 * @return {boolean}
 */
Queues.prototype.spill = function() {
  // TODO: 这里应该保留溢出，不然会导致时间轴上的误差
  const topSpill = this.cursor >= this.total;
  return topSpill;
};


export {Queues};
