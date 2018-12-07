import {Utils} from '../../../utils/Utils';
import {STROKE_MAP} from '../../common/PropsMap';
import {prepareEaseing, interpolation} from '../../../utils/Easeing';

/**
 * Stroke
 * @class
 * @private
 */
class Stroke {
  /**
   * generate a keyframes buffer
   * @param {object} item item data
   * @param {object} session now session
   * @param {object} session.size time of pre-frame
   * @param {number} session.st time of start position
   */
  constructor(item, session) {
    const {st = 0} = session;
    this.item = item;

    this.alpha = 255;
    this.lineWidth = 1;
    this.color = [0, 0, 0];

    this.st = st;
    this.aks = {};
    this.kic = {};

    this.preParse(item);
  }

  /**
   * preParse
   * @param {object} item fill tiem config
   */
  preParse(item) {
    for (const key in STROKE_MAP) {
      if (item[key] && item[key].a) {
        this.parseDynamic(key);
      } else if (item[key]) {
        this.parseStatic(key);
      }
    }
  }

  /**
   * parse dynamic property
   * @param {string} key property name
   */
  parseDynamic(key) {
    const prop = this.item[key];
    const propk = prop.k;
    const last = propk.length - 1;

    prop.ost = this.st + propk[0].t;
    prop.oet = this.st + propk[last].t;

    for (let i = 0; i < last; i++) {
      const sbk = propk[i];
      const sek = propk[i + 1];

      sbk.ost = this.st + sbk.t;
      sbk.oet = this.st + sek.t;

      prepareEaseing(sbk.o.x, sbk.o.y, sbk.i.x, sbk.i.y);
    }
    this.aks[key] = prop;
  }

  /**
   * parse static property
   * @param {string} key property name
   */
  parseStatic(key) {
    let propk = this.item[key].k;
    if (Utils.isNumber(propk)) propk = [propk];
    this.setValue(key, propk);
  }

  /**
   * update fill information
   * @param {number} progress progress
   * @param {object} session update session
   */
  update(progress, session) {
    for (const key in this.aks) {
      if (this.aks[key]) {
        const value = interpolation(this.aks[key], progress, this.kic, key);
        this.setValue(key, value);
      }
    }
  }

  /**
   * set value to host element
   * @private
   * @param {string} key property
   * @param {array} value value array
   */
  setValue(key, value) {
    const {props, translate} = STROKE_MAP[key];
    for (let i = 0; i < props.length; i++) {
      this[props[i]] = translate(value, i);
    }
  }

  /**
   * a
   * @param {*} ctx a
   */
  render(ctx) {
    ctx.strokeStyle = `rgba(${this.color.join(', ')}, ${this.alpha})`;
    ctx.lineWidth = this.lineWidth;
  }
}

export default Stroke;
