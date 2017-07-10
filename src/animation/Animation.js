import {Transition} from './Transition';
import {PathMotion} from './PathMotion';
import {KeyFrames} from './KeyFrames';
import {AnimateRunner} from './AnimateRunner';
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
 * 更新动画数据
 * @private
 * @param {number} snippet 时间片段
 */
Animation.prototype.update = function(snippet) {
  if (this.paused) return;
  snippet = this.timeScale * snippet;
  const cache = this.animates.slice(0);
  for (let i = 0; i < cache.length; i++) {
    if (!cache[i].living && !cache[i].resident) {
      this.animates.splice(i, 1);
    }
    cache[i].update(snippet);
  }
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
Animation.prototype.runners = function(options, clear) {
  options.element = this.element;
  return this._addMove(new AnimateRunner(options), clear);
};

/**
 * 创建一个`keyFrames`动画
 * @private
 * @param {object} options 动画配置
 * @param {boolean} clear 是否清除之前的动画
 * @return {JC.KeyFrames}
 */
Animation.prototype.keyFrames = function(options, clear) {
  options.element = this.element;
  return this._addMove(new KeyFrames(options), clear);
};

/**
 * 添加到动画队列
 * @private
 * @param {object} animate 创建出来的动画对象
 * @param {boolean} clear 是否清除之前的动画
 * @return {JC.KeyFrames|JC.AnimateRunner|JC.PathMotion|JC.Transition}
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
