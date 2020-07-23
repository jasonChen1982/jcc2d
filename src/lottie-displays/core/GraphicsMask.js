/**
 * GraphicsMask class
 * @class
 * @private
 */
class GraphicsMask {
  /**
   * GraphicsMask constructor
   * @param {object} elem elem
   * @param {object} config layer data information
   */
  constructor(elem, config) {
    this.elem = elem;
    this.config = config;

    this.masks = [];
  }

  /**
   * a
   * @param {*} masks a
   */
  updateLottieMasks(masks) {
    this.masks = masks;
  }

  /**
   * render content
   * @param {object} ctx
   */
  render(ctx) {
    if (this.masks.length <= 0) return;
    ctx.beginPath();
    const masks = this.masks;
    for (let i = 0; i < masks.viewData.length; i++) {
      if (masks.viewData[i].inv) {
        const size = this.config.session.local;
        ctx.moveTo(0, 0);
        ctx.lineTo(size.w, 0);
        ctx.lineTo(size.w, size.h);
        ctx.lineTo(0, size.h);
        ctx.lineTo(0, 0);
      }
      const data = masks.viewData[i].v;
      const start = data.v[0];
      ctx.moveTo(start[0], start[1]);
      const jLen = data._length;
      let j = 1;
      for (; j < jLen; j++) {
        const oj = data.o[j - 1];
        const ij = data.i[j];
        const vj = data.v[j];
        ctx.bezierCurveTo(oj[0], oj[1], ij[0], ij[1], vj[0], vj[1]);
      }
      const oj = data.o[j - 1];
      const ij = data.i[0];
      const vj = data.v[0];
      ctx.bezierCurveTo(oj[0], oj[1], ij[0], ij[1], vj[0], vj[1]);
    }
    ctx.clip();
  }
}

export default GraphicsMask;
