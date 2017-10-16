import {Animate} from './Animate';
import {Utils} from '../util/Utils';
import {Tween} from '../util/Tween';
import {Curve} from '../math/Curve';
import {Point} from '../math/Point';

/**
 * PathMotion类型动画对象
 *
 * @class
 * @memberof JC
 * @param {object} [options] 动画所具备的特性
 */
function PathMotion(options) {
  Animate.call(this, options);
  if (!options.path || !(options.path instanceof Curve)) {
    console.warn('path is not instanceof Curve');
  }

  this.path = options.path;

  this.ease = options.ease || Tween.Ease.InOut;

  this.lengthMode = Utils.isBoolean(options.lengthMode)?
    options.lengthMode:
    false;

  this.attachTangent = Utils.isBoolean(options.attachTangent)?
    options.attachTangent:
    false;

  this._cacheRotate = this.element.rotation;
  const radian = this._cacheRotate * Utils.DTR;
  this._cacheVector = new Point(10 * Math.cos(radian), 10 * Math.sin(radian));
}

PathMotion.prototype = Object.create(Animate.prototype);

/**
 * 计算下一帧状态
 * @private
 * @return {object}
 */
PathMotion.prototype.nextPose = function() {
  let _rotate = 0;
  const t = this.ease(this.progress / this.duration);
  const pos = this.lengthMode ?
    this.path.getPointAt(t) :
    this.path.getPoint(t);

  const pose = pos.clone();

  if (this.attachTangent) {
    _rotate = this.decomposeRotate(t);
    pose.rotation = _rotate === false ? this.preDegree : _rotate;
    pose.rotation += this._cacheRotate;
    if (_rotate !== false) this.preDegree = _rotate;
  }
  this.element.setProps(pose);
  return pose;
};

/**
 * 解算旋转角度
 * @private
 * @param {number} t 当前进度, 区间[0, 1]
 * @return {number}
 */
PathMotion.prototype.decomposeRotate = function(t) {
  const vector = this.lengthMode ?
    this.path.getTangentAt(t) :
    this.path.getTangent(t);

  const nor = this._cacheVector.x * vector.y - vector.x * this._cacheVector.y;
  const pi = nor > 0 ? 1 : -1;
  const cos = (vector.x * this._cacheVector.x + vector.y * this._cacheVector.y)/
    ( Math.sqrt(vector.x * vector.x + vector.y * vector.y) *
      Math.sqrt(
        this._cacheVector.x * this._cacheVector.x +
        this._cacheVector.y * this._cacheVector.y
      )
    );
  if (isNaN(cos)) return false;
  return pi * Math.acos(cos) * Utils.RTD;
};

export {PathMotion};
