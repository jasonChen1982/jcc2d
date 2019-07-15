import { createTypedArray } from '../helpers/arrays';
import pool_factory from './pool_factory';

/**
 * a
 * @return {*}
 */
function create() {
  return createTypedArray('float32', 2);
}
const point_pool = pool_factory(8, create);

export default point_pool;
