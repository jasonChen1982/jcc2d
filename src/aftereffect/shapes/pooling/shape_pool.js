import pool_factory from './pool_factory';
import point_pool from './point_pool';
import ShapePath from '../shapes/ShapePath';

/**
 * a
 * @return {*}
 */
function create() {
  return new ShapePath();
}

/**
 * a
 * @param {*} shapePath a
 */
function release(shapePath) {
  const len = shapePath._length;
  for (let i = 0; i < len; i += 1) {
    point_pool.release(shapePath.v[i]);
    point_pool.release(shapePath.i[i]);
    point_pool.release(shapePath.o[i]);
    shapePath.v[i] = null;
    shapePath.i[i] = null;
    shapePath.o[i] = null;
  }
  shapePath._length = 0;
  shapePath.c = false;
}

/**
 * a
 * @param {*} shape a
 * @return {*}
 */
function clone(shape) {
  const cloned = shape_pool.newElement();
  const len = shape._length === undefined ? shape.v.length : shape._length;
  cloned.setLength(len);
  cloned.c = shape.c;
  // var pt;

  for (let i = 0; i < len; i += 1) {
    cloned.setTripleAt(shape.v[i][0], shape.v[i][1], shape.o[i][0], shape.o[i][1], shape.i[i][0], shape.i[i][1], i);
  }
  return cloned;
}

const shape_pool = pool_factory(4, create, release);
shape_pool.clone = clone;

export default shape_pool;
