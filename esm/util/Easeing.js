
import { BezierEasing } from '../math/BezierEasing';
var bezierPool = {};

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
  var str = nm || [mX2, mY2, mX1, mY1].join('_').replace(/\./g, 'p');
  if (bezierPool[str]) {
    return bezierPool[str];
  }
  var bezEasing = new BezierEasing(mX1, mY1, mX2, mY2);
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
  var value = [];
  for (var i = 0; i < s.length; i++) {
    var rate = bezierPool[nm[i]].get(p);
    var v = e[i] - s[i];
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
  var rate = bezierPool[nm].get(p);
  var point = curve.getPointAt(rate);
  return [point.x, point.y, point.z];
}

export { prepareEaseing, getEaseing, getEaseingPath };