import {Utils} from '../../utils/Utils';
import {FILL_MAP} from '../common/PropsMap';
import {prepareEaseing, interpolation} from '../../utils/Easeing';

/**
 * Fill keyframes class
 * @class
 * @private
 */
class Fill {
  /**
   * generate a fill-type keyframes buffer
   * @param {Container} element host element
   * @param {object} item item data
   * @param {object} session now session
   * @param {object} session.size time of pre-frame
   * @param {number} session.st time of start position
   */
  constructor(element, item, session) {
    const {st = 0} = session;
    this.element = element;
    this.item = item;

    this.alpha = 1;
    this.color = 0x000000;

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
    for (const key in FILL_MAP) {
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

    this.element.beginFill(this.color, this.alpha);
  }

  /**
   * set value to host element
   * @private
   * @param {string} key property
   * @param {array} value value array
   */
  setValue(key, value) {
    const {props, translate} = FILL_MAP[key];
    for (let i = 0; i < props.length; i++) {
      this[props[i]] = translate(value, i);
    }
  }
}

export default Fill;
