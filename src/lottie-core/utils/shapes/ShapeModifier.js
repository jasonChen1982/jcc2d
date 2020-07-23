import DynamicPropertyContainer from '../helpers/dynamicProperties';
import ShapeCollectionPool from '../pooling/ShapeCollectionPool';
import {initialDefaultFrame} from '../../constant/index';

/**
 * a
 */
export default class ShapeModifier extends DynamicPropertyContainer {
  /**
   * a
   */
  initModifierProperties() {}

  /**
   * a
   */
  addShapeToModifier() {}

  /**
   * a
   * @param {*} data a
   */
  addShape(data) {
    if (!this.closed) {
      // Adding shape to dynamic properties. It covers the case where a shape has no effects applied, to reset it's _mdf state on every tick.
      data.sh.container.addDynamicProperty(data.sh);

      const shapeData = {shape: data.sh, data: data, localShapeCollection: ShapeCollectionPool.newShapeCollection()};
      this.shapes.push(shapeData);
      this.addShapeToModifier(shapeData);
      if (this._isAnimated) {
        data.setAsAnimated();
      }
    }
  }

  /**
   * a
   * @param {*} elem a
   * @param {*} data a
   */
  init(elem, data) {
    this.shapes = [];
    this.elem = elem;
    this.initDynamicPropertyContainer(elem);
    this.initModifierProperties(elem, data);
    this.frameId = initialDefaultFrame;
    this.closed = false;
    this.k = false;
    if (this.dynamicProperties.length) {
      this.k = true;
    } else {
      this.getValue(true);
    }
  }

  /**
   * process keys
   * @param {number} frameNum frameNum
   */
  processKeys(frameNum) {
    if (frameNum === this.frameId) {
      return;
    }
    this.frameId = frameNum;
    this.iterateDynamicProperties(frameNum);
  }
}

