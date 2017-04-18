import {Animate} from './Animate';
import {Transition} from './Transition';
import {PathMotion} from './PathMotion';

/**
 * AnimateRunner类型动画对象
 *
 * @class
 * @memberof JC
 * @param {object} [options] 动画配置信息
 */
function AnimateRunner(options) {
  Animate.call(this, options);

  this.runners = options.runners;
  this.cursor = 0;
  this.queues = [];

  this.parserRunners();
  this.length = this.queues.length;
}
AnimateRunner.prototype = Object.create(Animate.prototype);
AnimateRunner.prototype.parserRunners = function() {
  for (let i = 0; i < this.runners.length; i++) {
    const runner = this.runners[i];
    runner.infinite = false;
    runner.alternate = false;
    runner.element = this.element;
    runner.onCompelete = this.nextRunner.bind(this);
    let animate = null;
    if (runner.path) {
      animate = new PathMotion(runner);
    } else if (runner.to) {
      animate = new Transition(runner);
    }
    if (animate !== null) this.queues.push(animate);
  }
};
AnimateRunner.prototype.nextRunner = function() {
  this.cursor += this.direction;
  this.totalTime++;
};
AnimateRunner.prototype.nextPose = function(snippetCache) {
  return this.queues[this.cursor].update(snippetCache);
};
Animate.prototype.update = function(snippet) {
  if (this.wait > 0) {
    this.wait -= Math.abs(snippet);
    return;
  }
  if (this.paused || !this.living || this.delayCut > 0) {
    if (this.delayCut > 0) this.delayCut -= Math.abs(snippet);
    return;
  }

  const cc = this.cursor;

  let pose = this.nextPose(this.direction * this.timeScale * snippet);
  if (this.onUpdate) this.onUpdate({
    index: cc, pose: pose,
  }, this.progress / this.duration);

  if (this.totalTime >= this.length) {
    if (this.repeats > 0 || this.infinite) {
      if (this.repeats > 0) --this.repeats;
      this.delayCut = this.delay;
      this.totalTime = 0;
      if (this.alternate) {
        this.direction *= -1;
      } else {
        this.direction = 1;
        this.cursor = 0;
      }
    } else {
      this.living = false;
      if (this.onCompelete) this.onCompelete(pose);
    }
  }
};


export {AnimateRunner};
