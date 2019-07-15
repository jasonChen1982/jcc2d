import TrimModifier from './TrimModifier';
import RoundCornersModifier from './RoundCornersModifier';

const modifiers = {};

/**
 * a
 * @param {*} nm a
 * @param {*} factory a
 */
function registerModifier(nm, factory) {
  if (!modifiers[nm]) {
    modifiers[nm] = factory;
  }
}

/**
 * a
 * @param {*} nm a
 * @param {*} elem a
 * @param {*} data a
 * @return {*}
 */
function getModifier(nm, elem, data) {
  return new modifiers[nm](elem, data);
}

registerModifier('tm', TrimModifier);
registerModifier('rd', RoundCornersModifier);

export default getModifier;
