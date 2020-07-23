import PoolFactory from './PoolFactory';
import PointPool from './PointPool';
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
 * FIXME: 这里可能不需要这么深度的做 release
 * @param {*} shapePath a
 */
function release(shapePath) {
  const len = shapePath._length;
  for (let i = 0; i < len; i += 1) {
    PointPool.release(shapePath.v[i]);
    PointPool.release(shapePath.i[i]);
    PointPool.release(shapePath.o[i]);
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
  const cloned = ShapePool.newElement();
  const len = shape._length === undefined ? shape.v.length : shape._length;
  cloned.setLength(len);
  cloned.c = shape.c;
  // var pt;

  for (let i = 0; i < len; i += 1) {
    cloned.setTripleAt(shape.v[i][0], shape.v[i][1], shape.o[i][0], shape.o[i][1], shape.i[i][0], shape.i[i][1], i);
  }
  return cloned;
}

const ShapePool = PoolFactory(4, create, release);
ShapePool.clone = clone;

export default ShapePool;
