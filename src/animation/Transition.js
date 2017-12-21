import {Tween} from '../util/Tween';
import {Animate} from './Animate';
import {Utils} from '../util/Utils';

/* eslint guard-for-in: "off" */

/**
 * Transition类型动画对象
 *
 * @class
 * @memberof JC
 * @param {object} [options] 动画所具备的特性
 */
function Transition(options) {
  Animate.call(this, options);

  // collect from pose, when from was not complete
  options.from = options.from || {};
  for (const i in options.to) {
    if (Utils.isUndefined(options.from[i])) {
      options.from[i] = this.element[i];
    }
  }

  this.ease = options.ease || Tween.Ease.InOut;
  this.from = options.from;
  this.to = options.to;
}
Transition.prototype = Object.create(Animate.prototype);

/**
 * 计算下一帧状态
 * @private
 * @return {object}
 */
Transition.prototype.nextPose = function() {
  const pose = {};
  const t = this.ease(this.progress / this.duration);
  for (let i in this.to) {
    pose[i] = this.linear(this.from[i], this.to[i], t);
    if (this.element[i] !== undefined) this.element[i] = pose[i];
  }
  return pose;
};

export {Transition};
