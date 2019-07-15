import { createTypedArray } from '../helpers/arrays';
import pool_factory from './pool_factory';
const defaultCurveSegments = 200;
/**
 * a
 * @return {*}
 */
function create() {
  return {
    addedLength: 0,
    percents: createTypedArray('float32', defaultCurveSegments),
    lengths: createTypedArray('float32', defaultCurveSegments),
  };
}
const bezier_length_pool = pool_factory(8, create);

export default bezier_length_pool;
