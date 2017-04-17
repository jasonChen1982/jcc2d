
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
  this.iip = this.keys.ip;
  this.ip = options.ip === undefined ? this.keys.ip : options.ip;
  this.op = options.op === undefined ? this.keys.op : options.op;

  this.tfs = Math.floor(this.op - this.ip);
  this.duration = this.tfs * this.rfr;

  this.jcst = this.ip * this.rfr;

  this.preParser(Utils.copyJSON(options.ks));
}
KeyFrames.prototype = Object.create(Animate.prototype);

KeyFrames.prototype.preParser = function(keys) {
  const ks = keys.ks;
  for (const key in ks) {
    const prop = PM[key].label;
    const scale = PM[key].scale;
    if (ks[key]) {
      if (ks[key].a) {
        this.aks[key] = ks[key];
        const k = ks[key].k;
        const last = k.length - 1;
        const et = k[last].t;
        const st = k[0].t;

        this.aks[key].jcet = et * this.rfr;
        this.aks[key].jcst = st * this.rfr;
      } else {
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
      }
    }
  }
};

KeyFrames.prototype.nextPose = function() {
  let cache = {};
  /* eslint guard-for-in: "off" */
  for (const key in this.aks) {
    const ak = this.aks[key];
    cache[key] = this.interpolation(key, ak);
  }
  return cache;
};

KeyFrames.prototype.prepare = function(key, ak) {
  const k = ak.k;
  const progress = Utils.clamp(this.progress, 0, ak.jcet);
  let pkt = ak.jcst;
  if (progress < this.iip * this.rfr) {
    this.element.visible = false;
  } else {
    this.element.visible = true;
  }
  if (progress < pkt) {
    return k[0].s;
  } else {
    const l = k.length;
    for (let i = 1; i < l; i++) {
      const kt = k[i].t * this.rfr;
      if (progress < kt) {
        const s = k[i - 1].s;
        const e = k[i - 1].e;
        const value = [];
        const rate = Utils.linear(progress, pkt, kt);
        for (let j = 0; j < s.length; j++) {
          const v = e[j] - s[j];
          value[j] = s[j] + v * rate;
        }
        return value;
      }
      pkt = kt;
    }
    return k[l - 2].e;
  }
};
KeyFrames.prototype.interpolation = function(key, ak) {
  const value = this.prepare(key, ak);
  let cache = {};
  cache[key] = value;
  this.setValue(key, value);
  return cache;
};
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
