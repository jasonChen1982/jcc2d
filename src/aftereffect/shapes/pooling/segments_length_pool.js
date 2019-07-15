import bezier_length_pool from './bezier_length_pool';
import pool_factory from './pool_factory';

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
    bezier_length_pool.release(element.lengths[i]);
  }
  element.lengths.length = 0;
}

const segments_length_pool = pool_factory(8, create, release);

export default segments_length_pool;
