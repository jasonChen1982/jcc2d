import {inRange, findStep} from '../../common/common';
import {prepareEaseing, getEaseing} from '../../../utils/Easeing';

/**
 * CurveData
 * @class
 * @private
 */
class CurveData {
  /**
   * the primitive curve data object
   * @param {object} data curve config data
   * @param {object} session session
   * @param {boolean} mask is mask
   */
  constructor(data, session, mask) {
    const {st = 0} = session;
    this.inv = data.inv;

    this.data = mask ? data.pt : data.ks;

    this.dynamic = this.data.a === 1;

    this.st = st;

    this.kic = 0;

    if (this.dynamic) this.prepare();
  }

  /**
   * prepare some data for faster calculation
   */
  prepare() {
    const datak = this.data.k;
    const last = datak.length - 1;

    this.ost = this.st + datak[0].t;
    this.oet = this.st + datak[last].t;

    for (let i = 0; i < last; i++) {
      const sbk = datak[i];
      const sek = datak[i + 1];

      sbk.ost = this.st + sbk.t;
      sbk.oet = this.st + sek.t;

      // TODO: 是否需要预先 修正坐标值，i、o 相对值 转换成 绝对值

      prepareEaseing(sbk.o.x, sbk.o.y, sbk.i.x, sbk.i.y);
    }
  }

  /**
   * get the curve frame by this progress
   * @param {number} progress timeline progress
   * @return {object}
   */
  getCurve(progress) {
    if (!this.dynamic) return this.data.k;
    return this.interpolation(progress);
  }

  /**
   * compute value with keyframes buffer
   * @private
   * @param {number} progress progress
   * @return {array}
   */
  interpolation(progress) {
    const datak = this.data.k;

    if (progress <= this.ost) {
      return datak[0].s[0];
    } else if (progress >= this.oet) {
      const last = datak.length - 2;
      return datak[last].e[0];
    } else {
      const path = {
        i: [],
        o: [],
        v: [],
      };
      let frame = datak[this.kic];
      if (!inRange(progress, frame.ost, frame.oet)) {
        this.kic = findStep(datak, progress);
        frame = datak[this.kic];
      }
      const rate = (progress - frame.ost) / (frame.oet - frame.ost);
      const nm = [frame.n, frame.n];

      const s0 = frame.s[0];
      const e0 = frame.e[0];
      for (const prop in path) {
        if (path[prop]) {
          const sp = s0[prop];
          const ep = e0[prop];
          const vv = [];
          for (let i = 0; i < sp.length; i++) {
            const s = sp[i];
            const e = ep[i];
            vv[i] = getEaseing(s, e, nm, rate);
          }
          path[prop] = vv;
        }
      }
      path.c = s0.c;
      return path;
    }
  }
}

export default CurveData;
