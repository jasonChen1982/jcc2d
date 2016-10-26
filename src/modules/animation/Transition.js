import { Animate } from './Animate';
// import { UTILS } from '../util/UTILS';

/**
 * Transition类型动画对象
 *
 * @class
 * @memberof JC
 * @param [opts] {object} 动画所具备的特性
 */
function Transition(opts) {
    Animate.call(this, opts);

    this.from = opts.from;
    this.to = opts.to;

}
Transition.prototype = Object.create(Animate.prototype);

export { Transition };
