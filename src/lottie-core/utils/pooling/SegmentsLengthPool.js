import BezierLengthPool from './BezierLengthPool';
import PoolFactory from './PoolFactory';

/**
 * @return {*}
 */
function create() {
  return {
    lengths: [],
    totalLength: 0,
  };
}

/**
 * a
 * @param {*} element a
 */
function release(element) {
  const len = element.lengths.length;
  for (let i = 0; i < len; i += 1) {
    BezierLengthPool.release(element.lengths[i]);
  }
  element.lengths.length = 0;
}

const SegmentsLengthPool = PoolFactory(8, create, release);

export default SegmentsLengthPool;
