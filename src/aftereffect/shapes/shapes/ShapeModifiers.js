import TrimModifier from './TrimModifier';
import RoundCornersModifier from './RoundCornersModifier';
import RepeaterModifier from './RepeaterModifier';
import MouseModifier from './MouseModifier';

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
registerModifier('rp', RepeaterModifier);
registerModifier('ms', MouseModifier);

export default getModifier;
