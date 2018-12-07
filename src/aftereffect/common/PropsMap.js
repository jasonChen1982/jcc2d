
/**
 * translate rgba array to hex
 * @ignore
 * @param {array} color an array with rgba
 * @param {*} _ just a placeholder param
 * @return {hex}
 */
function toColor(color, _) {
  color = color.slice(0, 3);
  return color.map((c) => {
    return c * 255 >> 0;
  });
}

/**
 * just return the value * 2.55 >> 0
 * @ignore
 * @param {array} value an array with some number value
 * @param {*} _ just a placeholder param
 * @return {number}
 */
function to255(value, _) {
  return value[0] * 2.55 >> 0;
}

/**
 * just return the value / 100
 * @ignore
 * @param {array} value an array with some number value
 * @param {*} _ just a placeholder param
 * @return {number}
 */
function toNormalize(value, _) {
  return value[0] / 100;
}

/**
 * just return the value / 100 by index
 * @ignore
 * @param {array} value an array with some number value
 * @param {number} index use which value
 * @return {number}
 */
function toNormalizeByIdx(value, index) {
  return value[index] / 100;
}

/**
 * just return the origin value by index
 * @ignore
 * @param {array} value an array with some number value
 * @param {number} index use which value
 * @return {number}
 */
function toBack(value, index) {
  return value[index];
}

/**
 * translate degree to radian
 * @ignore
 * @param {array} value an array with degree value
 * @param {*} _ just a placeholder param
 * @return {number}
 */
function toRadian(value, _) {
  return value[0] * Math.PI / 180;
}

export const FILL_MAP = {
  o: {
    props: ['alpha'],
    translate: to255,
  },
  c: {
    props: ['color'],
    translate: toColor,
  },
};

export const STROKE_MAP = {
  o: {
    props: ['alpha'],
    translate: to255,
  },
  c: {
    props: ['color'],
    translate: toColor,
  },
  w: {
    props: ['lineWidth'],
    translate: toBack,
  },
};

export const TRANSFORM_MAP = {
  o: {
    props: ['alpha'],
    translate: toNormalize,
  },
  r: {
    props: ['rotation'],
    translate: toRadian,
  },
  p: {
    props: ['x', 'y'],
    translate: toBack,
  },
  a: {
    props: ['pivotX', 'pivotY'],
    translate: toBack,
  },
  s: {
    props: ['scaleX', 'scaleY'],
    translate: toNormalizeByIdx,
  },
};
