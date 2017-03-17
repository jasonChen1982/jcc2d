import { Transition } from './Transition';
import { PathMotion } from './PathMotion';
import { KeyFrames } from './KeyFrames';
/**
 * Animation类型动画对象
 *
 * @class
 * @memberof JC
 */
function Animation(element) {
  this.element = element;
    // this.start = false;
  this.animates = [];
}
Animation.prototype.update = function(snippet) {
  for (var i = 0; i < this.animates.length; i++) {
    if (!this.animates[i].living) this.animates.splice(i, 1);
    if (this.animates[i]) this.animates[i].update(snippet);
  }
};
Animation.prototype.fromTo = function(opts, clear) {
  this.element.setProps(opts.from);
  opts.element = this.element;
  return this._addMove(new Transition(opts), clear);
};
Animation.prototype.to = function(opts, clear) {
  opts.from = {};
  for (var i in opts.to) {
    opts.from[i] = this.element[i];
  }
  opts.element = this.element;
  return this._addMove(new Transition(opts), clear);
};
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

export { Animation };
