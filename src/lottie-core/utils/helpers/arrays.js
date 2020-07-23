
/**
 * a
 * @param {*} type a
 * @param {*} len a
 * @return {*}
 */
function createRegularArray(type, len) {
  let i = 0;
  const arr = [];
  let value;
  switch (type) {
  case 'int16':
  case 'uint8c':
    value = 1;
    break;
  default:
    value = 1.1;
    break;
  }
  for (i = 0; i < len; i += 1) {
    arr.push(value);
  }
  return arr;
}

/**
 * a
 * @param {*} type a
 * @param {*} len a
 * @return {*}
 */
function _createTypedArray(type, len) {
  if (type === 'float32') {
    return new Float32Array(len);
  } else if (type === 'int16') {
    return new Int16Array(len);
  } else if (type === 'uint8c') {
    return new Uint8ClampedArray(len);
  }
}

let createTypedArray;
//  = createTypedArray
if (typeof Uint8ClampedArray === 'function' && typeof Float32Array === 'function') {
  createTypedArray = _createTypedArray;
} else {
  createTypedArray = createRegularArray;
}

/**
 * a
 * @param {*} len a
 * @return {*}
 */
function createSizedArray(len) {
  return new Array(len);
}

export {createTypedArray, createSizedArray};
