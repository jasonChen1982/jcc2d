import BezierEasing from './BezierEasing';

const beziers = {};

/**
 * get a bezierEasing from real time or cache
 * @param {*} a in control point x component
 * @param {*} b in control point y component
 * @param {*} c out control point x component
 * @param {*} d out control point y component
 * @param {*} [nm] curver name
 * @return {BezierEasing}
 */
function getBezierEasing(a, b, c, d, nm) {
  const str = nm || ('bez_' + a+'_'+b+'_'+c+'_'+d).replace(/\./g, 'p');
  if (beziers[str]) {
    return beziers[str];
  }
  const bezEasing = new BezierEasing(a, b, c, d);
  beziers[str] = bezEasing;
  return bezEasing;
}

export default {getBezierEasing};
