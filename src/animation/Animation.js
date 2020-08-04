import {Transition} from './Transition';
import {PathMotion} from './PathMotion';
// import {KeyFrames} from './KeyFrames';
import {Bodymovin} from './Bodymovin';
import {Queues} from './Queues';
/**
 * Animation类型动画类，该类上的功能将以`add-on`的形势增加到`DisplayObject`上
 *
 * @class
 * @memberof JC
 * @param {JC.DisplayObject} element
 */
function Animation(element) {
  this.element = element;

  /**
   * 自身当前动画队列
   *
   * @member {array}
   */
  this.animates = [];

  /**
   * 自身及后代动画的缩放比例
   *
   * @member {number}
   */
  this.timeScale = 1;

  /**
   * 是否暂停自身的动画
   *
   * @member {Boolean}
   */
  this.paused = false;
}

/**
 * 清理需要移除的动画
 * @param {Array} needClearIdx 需要清理的对象索引
 * @private
 */
Animation.prototype.clearUP = function(needClearIdx) {
  if (this.paused) return;
  const animates = this.animates;
  for (let i = 0; i < needClearIdx.length; i++) {
    const idx = needClearIdx[i];
    if (!animates[idx].living && !animates[idx].resident) {
      this.animates.splice(idx, 1);
    }
  }
};

/**
 * 更新动画数据
 * @private
 * @param {number} snippet 时间片段
 */
Animation.prototype.update = function(snippet) {
  if (this.paused) return;
  snippet = this.timeScale * snippet;
  const needClearIdx = [];
  for (let i = 0; i < this.animates.length; i++) {
    if (!this.animates[i].living && !this.animates[i].resident) {
      needClearIdx.push(i);
      continue;
    }
    this.animates[i].update(snippet);
  }
  if (needClearIdx.length > 0) this.clearUP(needClearIdx);
};

/**
 * 创建一个`animate`动画
 * @private
 * @param {object} options 动画配置
 * @param {boolean} clear 是否清除之前的动画
 * @return {JC.Transition}
 */
Animation.prototype.animate = function(options, clear) {
  options.element = this.element;
  return this._addMove(new Transition(options), clear);
};

/**
 * 创建一个`motion`动画
 * @private
 * @param {object} options 动画配置
 * @param {boolean} clear 是否清除之前的动画
 * @return {JC.PathMotion}
 */
Animation.prototype.motion = function(options, clear) {
  options.element = this.element;
  return this._addMove(new PathMotion(options), clear);
};

/**
 * 创建一个`runners`动画
 * @private
 * @param {object} options 动画配置
 * @param {boolean} clear 是否清除之前的动画
 * @return {JC.AnimateRunner}
 */
// Animation.prototype.runners = function(options, clear) {
//   options.element = this.element;
//   return this._addMove(new AnimateRunner(options), clear);
// };
Animation.prototype.queues = function(runner, options, clear) {
  options.element = this.element;
  return this._addMove(new Queues(runner, options), clear);
};

// /**
//  * 创建一个`keyFrames`动画
//  * @private
//  * @param {object} options 动画配置
//  * @param {boolean} clear 是否清除之前的动画
//  * @return {JC.KeyFrames}
//  */
// Animation.prototype.keyFrames = function(options, clear) {
//   options.element = this.element;
//   return this._addMove(new KeyFrames(options), clear);
// };

/**
 * 创建一个`keyFrames`动画
 * @private
 * @param {object} options 动画配置
 * @param {boolean} clear 是否清除之前的动画
 * @return {JC.Bodymovin}
 */
Animation.prototype.bodymovin = function(options, clear) {
  options.element = this.element;
  return this._addMove(new Bodymovin(options), clear);
};

/**
 * 添加到动画队列
 * @private
 * @param {object} animate 创建出来的动画对象
 * @param {boolean} clear 是否清除之前的动画
 * @return {JC.Bodymovin|JC.AnimateRunner|JC.PathMotion|JC.Transition}
 */
Animation.prototype._addMove = function(animate, clear) {
  if (clear) this.clear();
  this.animates.push(animate);
  return animate;
};

/**
 * 暂停动画组
 */
Animation.prototype.pause = function() {
  this.paused = true;
};

/**
 * 恢复动画组
 */
Animation.prototype.restart = function() {
  this.paused = false;
};

/**
 * 设置动画组的播放速率
 * @param {number} speed
 */
Animation.prototype.setSpeed = function(speed) {
  this.timeScale = speed;
};

/**
 * 清除动画队列
 * @private
 */
Animation.prototype.clear = function() {
  this.animates.length = 0;
};

export {Animation};
