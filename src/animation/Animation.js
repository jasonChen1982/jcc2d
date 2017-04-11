import {Transition} from './Transition';
import {PathMotion} from './PathMotion';
import {KeyFrames} from './KeyFrames';
import {isObject} from '../util/UTILS';
/**
 * Animation类型动画对象
 *
 * @class
 * @memberof JC
 * @param {JC.DisplayObject} element
 */
function Animation(element) {
  this.element = element;
  // this.start = false;
  this.animates = [];
}
Animation.prototype.update = function(snippet) {
  for (let i = 0; i < this.animates.length; i++) {
    if (!this.animates[i].living) this.animates.splice(i, 1);
    if (this.animates[i]) this.animates[i].update(snippet);
  }
};
Animation.prototype.animate = function(opts, clear) {
  if (isObject(opts.from)) {
    this.element.setProps(opts.from);
  } else {
    opts.from = {};
    /* eslint guard-for-in: "off" */
    for (let i in opts.to) {
      opts.from[i] = this.element[i];
    }
  }
  opts.element = this.element;
  return this._addMove(new Transition(opts), clear);
};
// Animation.prototype.to = function(opts, clear) {
//   opts.from = {};
//   /* eslint guard-for-in: "off" */
//   for (let i in opts.to) {
//     opts.from[i] = this.element[i];
//   }
//   opts.element = this.element;
//   return this._addMove(new Transition(opts), clear);
// };
Animation.prototype.motion = function(opts, clear) {
  opts.element = this.element;
  return this._addMove(new PathMotion(opts), clear);
};
Animation.prototype.keyFrames = function(opts, clear) {
  opts.element = this.element;
  return this._addMove(new KeyFrames(opts), clear);
};
Animation.prototype._addMove = function(animate, clear) {
  if (clear) this.clear();
  this.animates.push(animate);
  return animate;
};
Animation.prototype.clear = function() {
  this.animates.length = 0;
};

export {Animation};
