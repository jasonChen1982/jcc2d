import CurveData from './CurveData';
import {drawCurve} from './DrawCurve';

/**
 * CurveShape
 * @class
 * @private
 */
class CurveShape extends CurveData {
  /**
   * CurveShape
   * @param {object} element host graphics element
   * @param {object} data curve config data
   * @param {object} session session
   * @param {boolean} mask is mask or not
   */
  constructor(element, data, session) {
    super(data, session);
    this.element = element;
  }

  /**
   * update curve by progress
   * @param {number} progress progress
   */
  update(progress) {
    const data = this.getCurve(progress);
    const start = data.v[0];
    this.element.moveTo(start[0], start[1]);
    const jLen = data.v.length;
    let j = 1;
    let pre = start;
    for (; j < jLen; j++) {
      const oj = data.o[j - 1];
      const ij = data.i[j];
      const vj = data.v[j];
      this.element.bezierCurveTo(pre[0] + oj[0], pre[1] + oj[1], vj[0] + ij[0], vj[1] + ij[1], vj[0], vj[1]);
      pre = vj;
    }
    const oj = data.o[j - 1];
    const ij = data.i[0];
    const vj = data.v[0];
    this.element.bezierCurveTo(pre[0] + oj[0], pre[1] + oj[1], vj[0] + ij[0], vj[1] + ij[1], vj[0], vj[1]);
  }

  /**
   * a
   * @param {*} ctx a
   */
  render(ctx) {
    drawCurve(ctx);
  }
}

export default CurveShape;
