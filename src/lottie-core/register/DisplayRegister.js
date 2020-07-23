const display = {};
const Type = {
  Null: 'Null',
  Path: 'Path',
  Shape: 'Shape',
  Solid: 'Solid',
  Sprite: 'Sprite',
  Container: 'Container',
};

/**
 * setDisplayByType
 * @param {*} type a
 * @param {*} classFn a
 */
function setDisplayByType(type, classFn) {
  display[type] = classFn;
}

/**
 * a
 * @param {*} type a
 * @return {display}
 */
function getDisplayByType(type) {
  return display[type];
}

export default {Type, setDisplayByType, getDisplayByType};
