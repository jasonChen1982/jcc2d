import { createSizedArray } from '../helpers/arrays';
import shape_pool from '../pooling/shape_pool';

/**
 * a
 */
export default class ShapeCollection {
  /**
   * a
   */
  constructor() {
    this._length = 0;
    this._maxLength = 4;
    this.shapes = createSizedArray(this._maxLength);
  }

  /**
   * a
   * @param {*} shapeData a
   */
  addShape(shapeData) {
    if (this._length === this._maxLength) {
      this.shapes = this.shapes.concat(createSizedArray(this._maxLength));
      this._maxLength *= 2;
    }
    this.shapes[this._length] = shapeData;
    this._length += 1;
  }

  /**
   * a
   */
  releaseShapes() {
    for (let i = 0; i < this._length; i += 1) {
      shape_pool.release(this.shapes[i]);
    }
    this._length = 0;
  }
}
