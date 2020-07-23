import {createSizedArray} from '../helpers/arrays';
import ShapeCollection from '../shapes/ShapeCollection';
import ShapePool from './ShapePool';
import pooling from './pooling';

let _length = 0;
let _maxLength = 4;
let pool = createSizedArray(_maxLength);

/**
 * a
 * @return {*}
 */
function newShapeCollection() {
  let shapeCollection;
  if (_length) {
    _length -= 1;
    shapeCollection = pool[_length];
  } else {
    shapeCollection = new ShapeCollection();
  }
  return shapeCollection;
}

/**
 * a
 * @param {*} shapeCollection a
 */
function release(shapeCollection) {
  const len = shapeCollection._length;
  for (let i = 0; i < len; i += 1) {
    ShapePool.release(shapeCollection.shapes[i]);
  }
  shapeCollection._length = 0;

  if (_length === _maxLength) {
    pool = pooling.double(pool);
    _maxLength = _maxLength*2;
  }
  pool[_length] = shapeCollection;
  _length += 1;
}


export default {newShapeCollection, release};
