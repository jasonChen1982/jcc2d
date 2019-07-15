import DynamicPropertyContainer from '../helpers/dynamicProperties';
import shapeCollection_pool from '../pooling/shapeCollection_pool';

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
      const shapeData = { shape: data.sh, data: data, localShapeCollection: shapeCollection_pool.newShapeCollection() };
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
    this.closed = false;
    this.k = false;
    if (this.dynamicProperties.length) {
      this.k = true;
    } else {
      this.getValue(-999999, true);
    }
  }

  /**
   * a
   */
  processKeys(frameNum) {
    this.iterateDynamicProperties(frameNum);
  }
}
