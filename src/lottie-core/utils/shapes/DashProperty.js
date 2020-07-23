import DynamicPropertyContainer from '../helpers/dynamicProperties';
import PropertyFactory from '../PropertyFactory';
import {createTypedArray, createSizedArray} from '../helpers/arrays';

/**
 * a
 */
export default class DashProperty extends DynamicPropertyContainer {
  /**
   * a
   * @param {*} elem a
   * @param {*} data a
   * @param {*} container a
   */
  constructor(elem, data, container) {
    super();
    this.elem = elem;
    this.frameId = -1;
    this.dataProps = createSizedArray(data.length);
    // this.renderer = renderer;
    this.k = false;
    // this.dashStr = '';
    this.dashArray = createTypedArray('float32', data.length ? data.length - 1 : 0);
    this.dashoffset = createTypedArray('float32', 1);
    this.initDynamicPropertyContainer(container);
    let i; let len = data.length || 0; let prop;
    for (i = 0; i < len; i += 1) {
      prop = PropertyFactory.getProp(elem, data[i].v, 0, 0, this);
      this.k = prop.k || this.k;
      this.dataProps[i] = {n: data[i].n, p: prop};
    }
    if (!this.k) {
      this.getValue(true);
    }
    this._isAnimated = this.k;
  }

  /**
   * a
   * @param {number} frameNum frameNum
   * @param {*} forceRender a
   */
  getValue(frameNum, forceRender) {
    if (frameNum === this.frameId && !forceRender) {
      return;
    }
    this.frameId = frameNum;
    this.iterateDynamicProperties();
    this._mdf = this._mdf || forceRender;
    if (this._mdf) {
      let i = 0; let len = this.dataProps.length;
      // if (this.renderer === 'svg') {
      //   this.dashStr = '';
      // }
      for (i=0; i<len; i+=1) {
        if (this.dataProps[i].n != 'o') {
          // if (this.renderer === 'svg') {
          //   this.dashStr += ' ' + this.dataProps[i].p.v;
          // } else {
          //   this.dashArray[i] = this.dataProps[i].p.v;
          // }
          this.dashArray[i] = this.dataProps[i].p.v;
        } else {
          this.dashoffset[0] = this.dataProps[i].p.v;
        }
      }
    }
  }
}
