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
   * @param {object} data curve config data
   * @param {object} session session
   * @param {boolean} mask is mask or not
   */
  constructor(data, session) {
    super(data, session);
    this.curve = null;
  }

  /**
   * update curve by progress
   * @param {number} progress progress
   */
  update(progress) {
    this.curve = this.getCurve(progress);
  }

  /**
   * a
   * @param {*} ctx a
   */
  render(ctx) {
    drawCurve(ctx, this.curve);
  }
}

export default CurveShape;
