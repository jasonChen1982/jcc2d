import CurveData from '../shapes/CurveData';
import {drawCurve, drawInv} from '../shapes/DrawCurve';


/**
 * GraphicsMask class
 * @class
 * @private
 */
class GraphicsMask {
  /**
   * GraphicsMask constructor
   * @param {object} masksProperties layer data information
   * @param {object} session layer data information
   */
  constructor(masksProperties, session = {}) {
    this.maskData = masksProperties.filter((it) => {
      return it.mode !== 'n';
    });

    this.shapes = this.maskData.map((it) => {
      return new CurveData(it, session, true);
    });

    this.session = session;

    this.curves = [];
  }

  /**
   * updateShape
   * @param {number} progress
   */
  update(progress) {
    for (let i = 0; i < this.shapes.length; i++) {
      this.curves[i] = this.shapes[i].getCurve(progress);
    }
  }

  /**
   * render content
   * @param {object} ctx
   */
  render(ctx) {
    ctx.beginPath();
    for (let i = 0; i < this.shapes.length; i++) {
      if (this.shapes[i].inv) drawInv(ctx, this.session.size);
      drawCurve(ctx, this.curves[i]);
    }
    ctx.clip();
  }
}

export default GraphicsMask;
