// import {
//   Graphics,
// } from 'pixi.js';
import ShapePropertyFactory from '../utils/shapes/ShapeProperty';
import {createSizedArray} from '../utils/helpers/arrays';
import DynamicPropertyContainer from '../utils/helpers/dynamicProperties';

/**
 * a
 */
export default class MaskFrames extends DynamicPropertyContainer {
  /**
   * a
   * @param {*} elem a
   * @param {*} masksProperties a
   * @param {*} session a
   */
  constructor(elem, masksProperties, session) {
    super();
    this.frameId = -1;
    this.elem = elem;
    this.session = session;
    this.masksProperties = masksProperties || [];
    this.initDynamicPropertyContainer(elem);
    this.viewData = createSizedArray(this.masksProperties.length);
    const len = this.masksProperties.length;
    let hasMasks = false;
    for (let i = 0; i < len; i++) {
      if (this.masksProperties[i].mode !== 'n') {
        hasMasks = true;
      }
      this.viewData[i] = ShapePropertyFactory.getShapeProp(this, this.masksProperties[i], 3);
      this.viewData[i].inv = this.masksProperties[i].inv;
    }
    this.hasMasks = hasMasks;
  }

  /**
   * a
   * @param {number} frameNum frameNum
   */
  getValue(frameNum) {
    if (frameNum === this.frameId) {
      return;
    }

    this.iterateDynamicProperties(frameNum);

    this.frameId = frameNum;
  }
}
