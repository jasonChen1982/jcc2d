import {Utils} from './Utils';
import {findStep, inRange} from '../keyframes/common/common';
import {BezierEasing} from '../math/BezierEasing';
const bezierPool = {};

/**
 * 准备好贝塞尔曲线
 * @param {number} mX1 控制点1的x分量
 * @param {number} mY1 控制点1的y分量
 * @param {number} mX2 控制点2的x分量
 * @param {number} mY2 控制点2的y分量
 * @param {string} nm 控制点命名
 * @return {BezierEasing}
 */
function prepareEaseing(mX1, mY1, mX2, mY2, nm) {
  const str = nm || [mX2, mY2, mX1, mY1].join('_').replace(/\./g, 'p');
  if (bezierPool[str]) {
    return bezierPool[str];
  }
  const bezEasing = new BezierEasing(mX1, mY1, mX2, mY2);
  bezierPool[str] = bezEasing;
}

/**
 * 根据进度获取到普通插值
 * @param {number} s  插值起始端点
 * @param {number} e  插值结束端点
 * @param {array}  nm 贝塞尔曲线的名字
 * @param {number} p  插值进度
 * @return {array}
 */
function getEaseing(s, e, nm, p) {
  const value = [];
  for (let i = 0; i < s.length; i++) {
    const rate = bezierPool[nm[i]].get(p);
    const v = e[i] - s[i];
    value[i] = s[i] + v * rate;
  }
  return value;
}

/**
 *
 * @param {BezierCurve} curve
 * @param {string} nm
 * @param {number} p
 * @return {Point}
 */
function getEaseingPath(curve, nm, p) {
  const rate = bezierPool[nm].get(p);
  const point = curve.getPointAt(rate);
  return [point.x, point.y, point.z];
}

/**
 * interpolation keyframes and return value
 * @ignore
 * @param {object} keyframes keyframes with special prop
 * @param {number} progress progress
 * @param {object} indexCache index cache
 * @param {string} key prop name
 * @return {array}
 */
function interpolation(keyframes, progress, indexCache, key) {
  const aksk = keyframes.k;
  if (keyframes.expression) {
    progress = keyframes.expression.update(progress);
  }
  if (progress <= keyframes.ost) {
    return aksk[0].s;
  } else if (progress >= keyframes.oet) {
    const last = aksk.length - 2;
    return aksk[last].e;
  } else {
    let ick = indexCache[key];
    let frame = aksk[ick];
    if (
      !Utils.isNumber(ick) ||
      !inRange(progress, frame.ost, frame.oet)
    ) {
      ick = indexCache[key] = findStep(aksk, progress);
      frame = aksk[ick];
    }
    const rate = (progress - frame.ost) / (frame.oet - frame.ost);
    if (frame.curve) {
      return getEaseingPath(frame.curve, frame.n, rate);
    } else {
      return getEaseing(frame.s, frame.e, frame.n, rate);
    }
  }
}

export {prepareEaseing, getEaseing, getEaseingPath, interpolation};
