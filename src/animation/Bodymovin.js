import {Tools, TransformFrames} from '../lottie-core/index';
import {Animate} from './Animate';
/* eslint guard-for-in: "off" */

/**
 * Bodymovin 类型动画对象
 *
 * @class
 * @private
 * @param {object} options 动画所具备的特性
 */
function Bodymovin(options) {
  Animate.call(this, options);

  // list of animated properties
  this.dynamicProperties = [];

  // If layer has been modified in current tick this will be true
  this._mdf = false;

  this.keyframes = Tools.copyJSON(options.keyframes);
  this.frameRate = options.frameRate || 30;
  this.tpf = 1000 / this.frameRate;
  // this.frameNum = -1;

  this.ip = Tools.isUndefined(options.ip) ? this.keyframes.ip : options.ip;
  this.op = Tools.isUndefined(options.ip) ? this.keyframes.op : options.op;

  this.tfs = this.op - this.ip;
  this.duration = this.tfs * this.tpf;

  this.ignoreProps = Tools.isArray(options.ignoreProps) ? options.ignoreProps : [];

  this.transform = new TransformFrames(this, this.keyframes.ks);
}
Bodymovin.prototype = Object.create(Animate.prototype);

/**
 * Calculates all dynamic values
 * @param {number} frameNum current frame number in Layer's time
 */
Bodymovin.prototype.prepareProperties = function(frameNum) {
  let i; let len = this.dynamicProperties.length;
  for (i = 0; i < len; i += 1) {
    this.dynamicProperties[i].getValue(frameNum);
    if (this.dynamicProperties[i]._mdf) {
      this._mdf = true;
    }
  }
};

/**
 * add dynamic property
 * @param {*} prop dynamic property
 */
Bodymovin.prototype.addDynamicProperty = function(prop) {
  if (this.dynamicProperties.indexOf(prop) === -1) {
    this.dynamicProperties.push(prop);
  }
};

/**
 * 计算下一帧状态
 * @private
 * @return {object}
 */
Bodymovin.prototype.nextPose = function() {
  const pose = {};
  const frameNum = this.ip + this.progress / this.tpf;
  this.prepareProperties(frameNum);

  if (this.ignoreProps.indexOf('position') === -1) {
    if (this.ignoreProps.indexOf('x') === -1) {
      pose.x = this.element.x = this.transform.x;
    }
    if (this.ignoreProps.indexOf('y') === -1) {
      pose.y = this.element.y = this.transform.y;
    }
  }

  if (this.ignoreProps.indexOf('pivot') === -1) {
    if (this.ignoreProps.indexOf('pivotX') === -1) {
      pose.pivotX = this.element.pivotX = this.transform.anchorX;
    }
    if (this.ignoreProps.indexOf('pivotY') === -1) {
      pose.pivotY = this.element.pivotY = this.transform.anchorY;
    }
  }

  if (this.ignoreProps.indexOf('scale') === -1) {
    if (this.ignoreProps.indexOf('scaleX') === -1) {
      pose.scaleX = this.element.scaleX = this.transform.scaleX;
    }
    if (this.ignoreProps.indexOf('scaleY') === -1) {
      pose.scaleY = this.element.scaleY = this.transform.scaleY;
    }
  }

  if (this.ignoreProps.indexOf('rotation') === -1) {
    pose.rotation = this.element.rotation = this.transform.rotation;
  }

  if (this.ignoreProps.indexOf('alpha') === -1) {
    pose.alpha = this.element.alpha = this.transform.alpha;
  }

  return pose;
};

export {Bodymovin};
