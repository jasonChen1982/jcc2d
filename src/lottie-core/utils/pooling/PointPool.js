import {createTypedArray} from '../helpers/arrays';
import PoolFactory from './PoolFactory';

/**
 * a
 * @return {*}
 */
function create() {
  return createTypedArray('float32', 2);
}
const PointPool = PoolFactory(8, create);

export default PointPool;
