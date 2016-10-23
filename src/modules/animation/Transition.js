import { Animate } from './Animate';
import { UTILS } from '../util/UTILS';

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
Transition.prototype.update = function(snippet) {
    if(this.wait>0){
        this.wait -= Math.abs(snippet);
        return;
    }
    if (this.paused || !this.living || this.delayCut>0){
        if (this.delayCut>0) this.delayCut -= Math.abs(snippet);
        return;
    }

    var progress = this.progress += this.direction * this.timeScale * snippet;
    this.progress = UTILS.clamp(progress,0,this.duration);

    var pose = this.nextPose();

    if (this.onUpdate) this.onUpdate(pose, this.progress / this.duration);

    if ((this.direction === -1 && progress <= 0) || (this.direction === 1 && progress >= this.duration)) {
        if (this.repeats > 0 || this.infinity) {
            if (this.repeats > 0) --this.repeats;
            this.delayCut = this.delay;
            if (this.alternate) {
                this.direction *= -1;
                this._swapEase();
            } else {
                this.progress = 0;
            }
        } else {
            this.living = false;
            if(this.onCompelete) this.onCompelete(pose);
        }
    }
};

export { Transition };
