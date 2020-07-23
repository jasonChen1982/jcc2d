import {createSizedArray} from '../helpers/arrays';
import ShapePool from '../pooling/ShapePool';

/**
 * shape collection
 */
export default class ShapeCollection {
  /**
   * constructor shape collection
   */
  constructor() {
    this._length = 0;
    this._maxLength = 4;
    this.shapes = createSizedArray(this._maxLength);
  }

  /**
   * add shape to collection
   * @param {*} shapeData shape data
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
   * release shapes form shape pool
   */
  releaseShapes() {
    for (let i = 0; i < this._length; i += 1) {
      ShapePool.release(this.shapes[i]);
    }
    this._length = 0;
  }
}
