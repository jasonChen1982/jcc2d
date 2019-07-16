
/**
 * a
 * @param {*} ctx a
 * @param {*} data a
 */
export function drawCurve(ctx, data) {
  const start = data.v[0];
  ctx.moveTo(start[0], start[1]);
  const jLen = data.v.length;
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

/**
 * a
 * @param {*} ctx a
 * @param {*} size a
 */
export function drawInv(ctx, size) {
  ctx.moveTo(0, 0);
  ctx.lineTo(size.w, 0);
  ctx.lineTo(size.w, size.h);
  ctx.lineTo(0, size.h);
  ctx.lineTo(0, 0);
}
