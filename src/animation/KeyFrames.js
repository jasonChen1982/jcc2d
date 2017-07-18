
/* eslint guard-for-in: "off" */

import {Animate} from './Animate';
import {BezierCurve} from '../math/BezierCurve';
import {Point} from '../math/Point';
import {Utils} from '../util/Utils';
import {prepareEaseing, getEaseing, getEaseingPath} from '../util/Easeing';
const PM = {
  o: {
    label: 'alpha',
    scale: 0.01,
  },
  r: {
    label: 'rotation',
    scale: 1,
  },
  p: {
    label: ['x', 'y'],
    scale: 1,
  },
  a: {
    label: ['pivotX', 'pivotY'],
    scale: 1,
  },
  s: {
    label: ['scaleX', 'scaleY'],
    scale: 0.01,
  },
};

/**
 * 判断数值是否在(min, max]区间内
 * @param {number} v   待比较的值
 * @param {number} min 最小区间
 * @param {number} max 最大区间
 * @return {boolean} 是否在(min, max]区间内
 */
function inRange(v, min, max) {
  return v > min && v <= max;
}

/**
 * 判断当前进度在哪一帧内
 * @param {array} steps 帧数组
 * @param {number} progress 当前进度
 * @param {number} rfr 每一帧的时间
 * @return {number} 当前进度停留在第几帧
 */
function findStep(steps, progress, rfr) {
  const last = steps.length - 1;
  for (let i = 0; i < last; i++) {
    const step = steps[i];
    if (inRange(progress, step.t * rfr, step.jcet * rfr)) {
      return i;
    }
  }
}

/**
 * KeyFrames类型动画对象
 *
 * @class
 * @memberof JC
 * @param {object} [options] 动画配置信息
 */
function KeyFrames(options) {
  Animate.call(this, options);

  this.keys = options.ks;
  this.aks = {};
  this.fr = this.keys.fr || 30;
  this.rfr = 1000 / this.fr;
  this.iip = this.keys.ip;
  this.ip = options.ip === undefined ? this.keys.ip : options.ip;
  this.op = options.op === undefined ? this.keys.op : options.op;

  this.tfs = Math.floor(this.op - this.ip);
  this.duration = this.tfs * this.rfr;

  this.keyState = {};

  this.preParser(Utils.copyJSON(options.ks));
  this.nextPose();
}
KeyFrames.prototype = Object.create(Animate.prototype);

/**
 * 预解析关键帧
 * @private
 * @param {object} keys 关键帧配置
 */
KeyFrames.prototype.preParser = function(keys) {
  const ks = keys.ks;
  for (const key in ks) {
    if (ks[key].a) {
      this.prepareDynamic(ks, key);
    } else {
      this.prepareStatic(ks, key);
    }
  }
};

/**
 * 预解析动态属性的关键帧
 * @private
 * @param {object} ks 关键帧配置
 * @param {string} key 所属的属性
 */
KeyFrames.prototype.prepareDynamic = function(ks, key) {
  this.aks[key] = ks[key];
  const k = ks[key].k;
  const et = k[k.length - 1].t;
  const st = k[0].t;

  this.aks[key].jcet = et;
  this.aks[key].jcst = st;
  for (let i = 0; i < k.length; i++) {
    const now = k[i];
    const next = k[i + 1];
    if (next) {
      now.jcet = next.t;
      if (Utils.isString(now.n) && now.ti && now.to) {
        prepareEaseing(now.o.x, now.o.y, now.i.x, now.i.y);
        const s = new Point(now.s[0], now.s[1]);
        const e = new Point(now.e[0], now.e[1]);
        const ti = new Point(now.ti[0], now.ti[1]);
        const to = new Point(now.to[0], now.to[1]);
        const c1 = new Point(now.s[0], now.s[1]);
        const c2 = new Point(now.e[0], now.e[1]);
        now.curve = new BezierCurve([s, c1.add(ti), c2.add(to), e]);
      } else {
        for (let i = 0; i < now.n.length; i++) {
          prepareEaseing(now.o.x[i], now.o.y[i], now.i.x[i], now.i.y[i]);
        }
      }
    }
  }
};

/**
 * 预解析静态属性的关键帧
 * @private
 * @param {object} ks 关键帧配置
 * @param {string} key 所属的属性
 */
KeyFrames.prototype.prepareStatic = function(ks, key) {
  const prop = PM[key].label;
  const scale = PM[key].scale;
  let k = 0;
  if (Utils.isString(prop)) {
    if (Utils.isNumber(ks[key].k)) {
      k = ks[key].k;
    }
    if (Utils.isArray(ks[key].k)) {
      k = ks[key].k[0];
    }
    this.element[prop] = scale * k;
  } else if (Utils.isArray(prop)) {
    for (let i = 0; i < prop.length; i++) {
      k = ks[key].k[i];
      this.element[prop[i]] = scale * k;
    }
  }
};

/**
 * 计算下一帧状态
 * @private
 * @return {object}
 */
KeyFrames.prototype.nextPose = function() {
  const pose = {};
  for (const key in this.aks) {
    const ak = this.aks[key];
    pose[key] = this.interpolation(key, ak);
  }
  return pose;
};

/**
 * 预计算关键帧属性值
 * @private
 * @param {string} key 关键帧配置
 * @param {object} ak 所属的属性
 * @return {array}
 */
KeyFrames.prototype.prepare = function(key, ak) {
  const k = ak.k;
  const rfr = this.rfr;
  const progress = Utils.clamp(this.progress, 0, ak.jcet * rfr);
  const skt = ak.jcst * rfr;
  const ekt = ak.jcet * rfr;
  const last = k.length - 2;
  const invisible = progress < this.iip * rfr;
  if (invisible === this.element.visible) this.element.visible = !invisible;

  if (progress <= skt) {
    return k[0].s;
  } else if (progress >= ekt) {
    return k[last].e;
  } else {
    let ck = this.keyState[key];
    if (
      !Utils.isNumber(ck) ||
      !inRange(progress, k[ck].t * rfr, k[ck].jcet * rfr)
    ) {
      ck = this.keyState[key] = findStep(k, progress, rfr);
    }
    const frame = k[ck];
    const rate = (progress / rfr - frame.t) / (frame.jcet - frame.t);
    if (frame.curve) {
      return getEaseingPath(frame.curve, frame.n, rate);
    } else {
      return getEaseing(frame.s, frame.e, frame.n, rate);
    }
  }
};

/**
 * 进行插值计算
 * @private
 * @param {string} key 属性
 * @param {object} ak 属性配置
 * @return {array}
 */
KeyFrames.prototype.interpolation = function(key, ak) {
  const value = this.prepare(key, ak);
  this.setValue(key, value);
  return value;
};

/**
 * 更新元素的属性值
 * @private
 * @param {string} key 属性
 * @param {array} value 属性值
 */
KeyFrames.prototype.setValue = function(key, value) {
  const prop = PM[key].label;
  const scale = PM[key].scale;
  if (Utils.isString(prop)) {
    this.element[prop] = scale * value[0];
  } else if (Utils.isArray(prop)) {
    for (let i = 0; i < prop.length; i++) {
      const v = value[i];
      this.element[prop[i]] = scale * v;
    }
  }
};

export {KeyFrames};
