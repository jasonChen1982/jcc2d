
/* eslint guard-for-in: "off" */

import {Animate} from './Animate';
import {BezierCurve} from '../math/BezierCurve';
import {Point} from '../math/Point';
import {Utils} from '../util/Utils';
import {prepareEaseing, getEaseing, getEaseingPath} from '../util/Easeing';
const PROPS_MAP = {
  o: {
    props: ['alpha'],
    scale: 0.01,
  },
  r: {
    props: ['rotation'],
    scale: 1,
  },
  p: {
    props: ['x', 'y'],
    scale: 1,
  },
  a: {
    props: ['pivotX', 'pivotY'],
    scale: 1,
  },
  s: {
    props: ['scaleX', 'scaleY'],
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
 * @return {number} 当前进度停留在第几帧
 */
function findStep(steps, progress) {
  const last = steps.length - 1;
  for (let i = 0; i < last; i++) {
    const step = steps[i];
    if (inRange(progress, step.jcst, step.jcet)) {
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

  this.layer = Utils.copyJSON(options.layer);
  this.fr = options.fr || 30;
  this.tpf = 1000 / this.fr;

  this.iipt = this.layer.ip * this.tpf;
  this.iopt = this.layer.op * this.tpf;

  this.ip = options.ip === undefined ? this.layer.ip : options.ip;
  this.op = options.op === undefined ? this.layer.op : options.op;

  this.tfs = Math.floor(this.op - this.ip);
  this.duration = this.tfs * this.tpf;

  // this.keyState = {};
  this.aks = {};
  this.kic = {};

  this.preParser();
  this.nextPose();
}
KeyFrames.prototype = Object.create(Animate.prototype);

/**
 * 预解析关键帧
 * @private
 */
KeyFrames.prototype.preParser = function() {
  const ks = this.layer.ks;
  for (const key in ks) {
    if (ks[key].a) {
      this.parserDynamic(key);
    } else {
      this.parserStatic(key);
    }
  }
};

/**
 * 预解析动态属性的关键帧
 * @private
 * @param {string} key 所属的属性
 */
KeyFrames.prototype.parserDynamic = function(key) {
  const ksp = this.layer.ks[key];
  const kspk = ksp.k;

  ksp.jcst = kspk[0].t * this.tpf;
  ksp.jcet = kspk[kspk.length - 1].t * this.tpf;

  for (let i = 0; i < kspk.length; i++) {
    const sbk = kspk[i];
    const sek = kspk[i + 1];
    if (sek) {
      sbk.jcst = sbk.t * this.tpf;
      sbk.jcet = sek.t * this.tpf;
      if (Utils.isString(sbk.n) && sbk.ti && sbk.to) {
        prepareEaseing(sbk.o.x, sbk.o.y, sbk.i.x, sbk.i.y);
        const sp = new Point(sbk.s[0], sbk.s[1]);
        const ep = new Point(sbk.e[0], sbk.e[1]);
        const c1 = new Point(sbk.s[0] + sbk.ti[0], sbk.s[1] + sbk.ti[1]);
        const c2 = new Point(sbk.e[0] + sbk.to[0], sbk.e[1] + sbk.to[1]);
        sbk.curve = new BezierCurve([sp, c1, c2, ep]);
      } else {
        for (let i = 0; i < sbk.n.length; i++) {
          prepareEaseing(sbk.o.x[i], sbk.o.y[i], sbk.i.x[i], sbk.i.y[i]);
        }
      }
    }
  }

  this.aks[key] = ksp;
};

/**
 * 预解析静态属性的关键帧
 * @private
 * @param {string} key 所属的属性
 */
KeyFrames.prototype.parserStatic = function(key) {
  // const prop = PM[key].label;
  // const scale = PM[key].scale;
  // let k = 0;
  // if (Utils.isString(prop)) {
  //   if (Utils.isNumber(ks[key].k)) {
  //     k = ks[key].k;
  //   }
  //   if (Utils.isArray(ks[key].k)) {
  //     k = ks[key].k[0];
  //   }
  //   this.element[prop] = scale * k;
  // } else if (Utils.isArray(prop)) {
  //   for (let i = 0; i < prop.length; i++) {
  //     k = ks[key].k[i];
  //     this.element[prop[i]] = scale * k;
  //   }
  // }

  const ksp = this.layer.ks[key];
  let kspk = ksp.k;
  if (Utils.isNumber(kspk)) kspk = [kspk];

  this.setValue(key, kspk);
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
    this.setValue(key, pose[key]);
  }
  return pose;
};

/**
 * 计算关键帧属性值
 * @private
 * @param {string} key 关键帧配置
 * @param {object} ak 所属的属性
 * @return {array}
 */
KeyFrames.prototype.interpolation = function(key, ak) {
  const akk = ak.k;
  const progress = Utils.clamp(this.progress, 0, ak.jcet);
  const skt = ak.jcst;
  const ekt = ak.jcet;
  const invisible = progress < this.iipt;
  if (invisible === this.element.visible) this.element.visible = !invisible;

  if (progress <= skt) {
    return akk[0].s;
  } else if (progress >= ekt) {
    const last = akk.length - 2;
    return akk[last].e;
  } else {
    let kic = this.kic[key];
    if (
      !Utils.isNumber(kic) ||
      !inRange(progress, akk[kic].jcst, akk[kic].jcet)
    ) {
      kic = this.kic[key] = findStep(akk, progress);
    }
    const frame = akk[kic];
    const rate = (progress - frame.jcst) / (frame.jcet - frame.jcst);
    if (frame.curve) {
      return getEaseingPath(frame.curve, frame.n, rate);
    } else {
      return getEaseing(frame.s, frame.e, frame.n, rate);
    }
  }
};

/**
 * 更新元素的属性值
 * @private
 * @param {string} key 属性
 * @param {array} value 属性值
 */
KeyFrames.prototype.setValue = function(key, value) {
  const props = PROPS_MAP[key].props;
  const scale = PROPS_MAP[key].scale;
  for (let i = 0; i < props.length; i++) {
    const v = value[i];
    this.element[props[i]] = scale * v;
  }
};

export {KeyFrames};
