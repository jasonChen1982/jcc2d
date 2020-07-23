import {createTypedArray} from '../helpers/arrays';
import PoolFactory from './PoolFactory';
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
const BezierLengthPool = PoolFactory(8, create);

export default BezierLengthPool;
