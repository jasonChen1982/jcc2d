import {createSizedArray} from '../helpers/arrays';

/**
 * a
 * @param {*} arr a
 * @return {*}
 */
function double(arr) {
  return arr.concat(createSizedArray(arr.length));
}

export default {double};
