
import {Animate} from './Animate';

/**
 * Transition类型动画对象
 *
 * @class
 * @memberof JC
 * @param {object} [options] 动画所具备的特性
 */
function Transition(options) {
  Animate.call(this, options);

  this.from = options.from;
  this.to = options.to;
}
Transition.prototype = Object.create(Animate.prototype);

export {Transition};
