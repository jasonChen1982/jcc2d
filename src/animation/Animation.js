import {Transition} from './Transition';
import {PathMotion} from './PathMotion';
import {KeyFrames} from './KeyFrames';
import {AnimateRunner} from './AnimateRunner';
import {Utils} from '../util/Utils';
/**
 * Animation类型动画对象
 *
 * @class
 * @memberof JC
 * @param {JC.DisplayObject} element
 */
function Animation(element) {
  this.element = element;
  this.animates = [];
}
Animation.prototype.update = function(snippet) {
  for (let i = 0; i < this.animates.length; i++) {
    if (!this.animates[i].living) this.animates.splice(i, 1);
    if (this.animates[i]) this.animates[i].update(snippet);
  }
};
Animation.prototype.animate = function(options, clear) {
  if (Utils.isObject(options.from)) {
    this.element.setProps(options.from);
  } else {
    options.from = {};
    /* eslint guard-for-in: "off" */
    for (let i in options.to) {
      options.from[i] = this.element[i];
    }
  }
  options.element = this.element;
  return this._addMove(new Transition(options), clear);
};
Animation.prototype.motion = function(options, clear) {
  options.element = this.element;
  return this._addMove(new PathMotion(options), clear);
};
Animation.prototype.runners = function(options, clear) {
  options.element = this.element;
  return this._addMove(new AnimateRunner(options), clear);
};
Animation.prototype.keyFrames = function(options, clear) {
  options.element = this.element;
  return this._addMove(new KeyFrames(options), clear);
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
