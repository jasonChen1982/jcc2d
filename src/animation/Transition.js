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

  if (Utils.isObject(options.from)) {
    this.element.setProps(options.from);
  } else {
    options.from = {};
    for (let i in options.to) {
      options.from[i] = this.element[i];
    }
  }
  this.ease = options.ease || 'easeBoth';
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
  for (let i in this.to) {
    pose[i] = Tween[this.ease](
      this.progress,
      this.from[i],
      this.to[i] - this.from[i],
      this.duration
    );
    if (this.element[i] !== undefined) this.element[i] = pose[i];
  }
  return pose;
};

export {Transition};
