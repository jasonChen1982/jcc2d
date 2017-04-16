
import {Animate} from './Animate';
import {Utils} from '../util/Utils';
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
  this.ip = this.keys.ip;
  this.op = this.keys.op;

  this.tfs = Math.floor(this.op - this.ip);
  this.duration = this.tfs * this.rfr;

  this.jcst = this.ip * this.rfr;

  this.preParser(Utils.copyJSON(options.ks));
}
KeyFrames.prototype = Object.create(Animate.prototype);

KeyFrames.prototype.preParser = function(keys) {
  const ks = keys.ks;
  for (const key in ks) {
    if (ks[key] && ks[key].a) {
      this.aks[key] = ks[key];
      const kl = ks[key].k.length - 1;
      const et = ks[key].k[kl].t;
      let pPose = null;
      this.aks[key].jcet = et * this.rfr;
      this.aks[key].k.forEach(function(pose) {
        if (!pose.s && !pose.e && pPose) {
          pose.s = pPose.e;
          pose.e = pPose.e;
        }
        pPose = Utils.copyJSON(pose);
      });
    }
  }
};

KeyFrames.prototype.nextPose = function() {
  let cache = {};
  /* eslint guard-for-in: "off" */
  for (const k in this.aks) {
    const ak = this.aks[k];
    cache[k] = this.interpolation(k, ak);
  }
  return cache;
};

KeyFrames.prototype.prepare = function(kk, ak) {
  const k = ak.k;
  const result = {};
  let pRange = this.jcst;
  const progress = Utils.clamp(this.progress, this.jcst, ak.jcet);
  // let pose;
  let range = 0;
  for (let i = 0; i < k.length; i++) {
    let pose = k[i];
    range = pose.t * this.rfr;
    result.pose = pose;
    result.progress = progress - pRange;
    result.range = [0, range - pRange];
    if (this.progress > pRange && this.progress <= range) {
      return result;
    }
    pRange = range;
  }
  return result;
};
KeyFrames.prototype.interpolation = function(k, ak) {
  const info = this.prepare(k, ak);
  if (!info.pose || !info.pose.s) return;
  const p = Utils.linear(info.progress, info.range[0], info.range[1]);
  const prop = PM[k].label;
  const scale = PM[k].scale;
  let s = 0;
  let e = 0;
  let cache = {};
  if (Utils.isString(prop)) {
    if (Utils.isNumber(info.pose.s)) {
      e = info.pose.e;
      s = info.pose.s;
    }
    if (Utils.isArray(info.pose.s)) {
      e = info.pose.e[0];
      s = info.pose.s[0];
    }

    cache[prop] = this.element[prop] = scale * (s + (e - s) * p);
  } else if (Utils.isArray(prop)) {
    for (let i = 0; i < prop.length; i++) {
      e = info.pose.e[i];
      s = info.pose.s[i];
      cache[prop[i]] = this.element[prop[i]] = scale * (s + (e - s) * p);
    }
  }
  return cache;
};

export {KeyFrames};
