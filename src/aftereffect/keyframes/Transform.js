import {Point} from '../../math/Point';
import {Utils} from '../../utils/Utils';
import {hasExpression, getEX} from '../common/Expression';
import {TRANSFORM_MAP} from '../common/PropsMap';
import {BezierCurve} from '../../math/BezierCurve';
import {prepareEaseing, interpolation} from '../../utils/Easeing';


/**
 * keyframes buffer, cache some status and progress
 * @class
 * @private
 */
class Transform {
  /**
   * generate a keyframes buffer
   * @param {Container} element host element
   * @param {object} layer layer data
   * @param {object} session now session
   * @param {number} session.st time of start position
   */
  constructor(element, layer, session) {
    const {st = 0, register} = session;

    this.element = element;

    this.ks = layer.ks;
    this.ip = layer.ip;
    this.op = layer.op;

    this.st = st;
    this.oip = this.st + this.ip;
    this.oop = this.st + this.op;

    this.aks = {};
    this.kic = {};

    this.preParse(register);
  }

  /**
   * preparse keyframes
   * @private
   * @param {Register} register
   */
  preParse(register) {
    const ks = this.ks;
    for (const key in TRANSFORM_MAP) {
      if (ks[key] && ks[key].a) {
        this.parseDynamic(key, register);
      } else if (ks[key]) {
        this.parseStatic(key);
      }
    }
  }

  /**
   * preparse dynamic keyframes
   * @private
   * @param {string} key property
   * @param {Register} register
   */
  parseDynamic(key, register) {
    const ksp = this.ks[key];
    const kspk = ksp.k;
    const last = kspk.length - 1;

    ksp.ost = this.st + kspk[0].t;
    ksp.oet = this.st + kspk[last].t;

    for (let i = 0; i < last; i++) {
      const sbk = kspk[i];
      const sek = kspk[i + 1];

      sbk.ost = this.st + sbk.t;
      sbk.oet = this.st + sek.t;
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

    if (hasExpression(ksp.x)) {
      ksp.expression = getEX(ksp);
      register.forever();
    }
    this.aks[key] = ksp;
  }

  /**
   * preparse static keyframes
   * @private
   * @param {string} key property
   */
  parseStatic(key) {
    const ksp = this.ks[key];
    let kspk = ksp.k;
    if (Utils.isNumber(kspk)) kspk = [kspk];

    this.setValue(key, kspk);
  }

  /**
   * compute child transform props
   * @private
   * @param {number} progress timeline progress
   * @param {object} session update session
   */
  update(progress, session) {
    if (session.forever) {
      this.element.visible = progress >= this.oip;
    } else {
      const visible = Utils.inRange(progress, this.oip, this.oop);
      this.element.visible = visible;
      if (!visible) return;
    }

    for (const key in this.aks) {
      if (this.aks[key]) {
        this.setValue(key, this.interpolation(key, progress));
      }
    }
  }

  /**
   * compute value with keyframes buffer
   * @private
   * @param {string} key which prop
   * @param {number} progress which prop
   * @return {array}
   */
  interpolation(key, progress) {
    const ak = this.aks[key];
    return interpolation(ak, progress, this.kic, key);
  }

  /**
   * set value to host element
   * @private
   * @param {string} key property
   * @param {array} value value array
   */
  setValue(key, value) {
    const {props, translate} = TRANSFORM_MAP[key];
    for (let i = 0; i < props.length; i++) {
      this.element[props[i]] = translate(value, i);
    }
  }
}

export default Transform;
