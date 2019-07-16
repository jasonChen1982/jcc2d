import DynamicPropertyContainer from '../helpers/dynamicProperties';
import PropertyFactory from '../PropertyFactory';
import {createTypedArray} from '../helpers/arrays';

/**
 * a
 */
export default class GradientProperty extends DynamicPropertyContainer {
  /**
   * a
   * @param {*} elem a
   * @param {*} data a
   * @param {*} container a
   */
  constructor(elem, data, container) {
    super();
    this.data = data;
    this.c = createTypedArray('uint8c', data.p*4);
    let cLength = data.k.k[0].s ? (data.k.k[0].s.length - data.p*4) : data.k.k.length - data.p*4;
    this.o = createTypedArray('float32', cLength);
    this._cmdf = false;
    this._omdf = false;
    this._collapsable = this.checkCollapsable();
    this._hasOpacity = cLength;
    this.initDynamicPropertyContainer(container);
    this.prop = PropertyFactory(elem, data.k, 1, null, this);
    this.k = this.prop.k;
    this.getValue(true);
  }

  /**
   * a
   * @param {*} values a
   * @param {*} points a
   */
  comparePoints(values, points) {
    let i = 0;
    const len = this.o.length/2;
    let diff;
    while (i < len) {
      diff = Math.abs(values[i*4] - values[points*4 + i*2]);
      if (diff > 0.01) {
        return false;
      }
      i += 1;
    }
    return true;
  }

  /**
   * a
   */
  checkCollapsable() {
    if (this.o.length/2 !== this.c.length/4) {
      return false;
    }
    if (this.data.k.k[0].s) {
      let i = 0;
      const len = this.data.k.k.length;
      while (i < len) {
        if (!this.comparePoints(this.data.k.k[i].s, this.data.p)) {
          return false;
        }
        i += 1;
      }
    } else if (!this.comparePoints(this.data.k.k, this.data.p)) {
      return false;
    }
    return true;
  }

  /**
   * a
   * @param {*} forceRender a
   */
  getValue(forceRender) {
    this.prop.getValue();
    this._mdf = false;
    this._cmdf = false;
    this._omdf = false;
    if (this.prop._mdf || forceRender) {
      let len = this.data.p*4;
      let mult;
      let val;
      for (let i=0; i<len; i+=1) {
        mult = i%4 === 0 ? 100 : 255;
        val = Math.round(this.prop.v[i]*mult);
        if (this.c[i] !== val) {
          this.c[i] = val;
          this._cmdf = !forceRender;
        }
      }
      if (this.o.length) {
        len = this.prop.v.length;
        for (let i=this.data.p*4; i<len; i+=1) {
          mult = i%2 === 0 ? 100 : 1;
          val = i%2 === 0 ? Math.round(this.prop.v[i]*100):this.prop.v[i];
          if (this.o[i-this.data.p*4] !== val) {
            this.o[i-this.data.p*4] = val;
            this._omdf = !forceRender;
          }
        }
      }
      this._mdf = !forceRender;
    }
  }
}
