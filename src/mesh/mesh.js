
import {Sprite} from '../core/Sprite';

/**
 * 网格类型
 * @param {JC.Texture} texture 图片纹理
 * @param {geometry} geometry
 */
function Mesh(texture, geometry) {
  Sprite.call(this, {texture: texture});

  this.geometry = geometry;

  this.gap = 0.05;
}

Mesh.prototype = Object.create(Sprite.prototype);

Mesh.prototype.renderMe = function(ctx) {
  const vertices = this.geometry.vertices;
  const uvs = this.geometry.uvs;
  const indices = this.geometry.indices;

  const length = indices.length;

  for (let i = 0; i < length; i += 3) {
    const index0 = indices[i];
    const index1 = indices[i + 1];
    const index2 = indices[i + 2];
    this.drawTriangle(ctx, vertices, uvs, index0, index1, index2);
  }
};

/* eslint max-len: 0 */
Mesh.prototype.drawTriangle = function(ctx, vertices, uvs, index0, index1, index2) {
  const base = this.texture;
  const texture = base.texture;
  const w = base.width;
  const h = base.height;

  const x0 = vertices[index0 * 3];
  const x1 = vertices[index1 * 3];
  const x2 = vertices[index2 * 3];
  const xc = (x0 + x1 + x2) / 3;
  const y0 = vertices[index0 * 3 + 1];
  const y1 = vertices[index1 * 3 + 1];
  const y2 = vertices[index2 * 3 + 1];
  const yc = (y0 + y1 + y2) / 3;

  const u0 = uvs[index0 * 2] * w;
  const u1 = uvs[index1 * 2] * w;
  const u2 = uvs[index2 * 2] * w;
  const v0 = uvs[index0 * 2 + 1] * h;
  const v1 = uvs[index1 * 2 + 1] * h;
  const v2 = uvs[index2 * 2 + 1] * h;

  const gapScale = 1 + this.gap;

  ctx.save();
  ctx.beginPath();

  ctx.moveTo(xc + (x0 - xc) * gapScale, yc + (y0 - yc) * gapScale);
  ctx.lineTo(xc + (x1 - xc) * gapScale, yc + (y0 - yc) * gapScale);
  ctx.lineTo(xc + (x2 - xc) * gapScale, yc + (y0 - yc) * gapScale);

  ctx.closePath();

  ctx.clip();

  // 求出变换矩阵，矩阵解方程组
  const delta = (u0 * v1) + (v0 * u2) + (u1 * v2) - (v1 * u2) - (v0 * u1) - (u0 * v2);
  const deltaA = (x0 * v1) + (v0 * x2) + (x1 * v2) - (v1 * x2) - (v0 * x1) - (x0 * v2);
  const deltaB = (u0 * x1) + (x0 * u2) + (u1 * x2) - (x1 * u2) - (x0 * u1) - (u0 * x2);
  const deltaC = (u0 * v1 * x2) + (v0 * x1 * u2) + (x0 * u1 * v2) - (x0 * v1 * u2) - (v0 * u1 * x2) - (u0 * x1 * v2);
  const deltaD = (y0 * v1) + (v0 * y2) + (y1 * v2) - (v1 * y2) - (v0 * y1) - (y0 * v2);
  const deltaE = (u0 * y1) + (y0 * u2) + (u1 * y2) - (y1 * u2) - (y0 * u1) - (u0 * y2);
  const deltaF = (u0 * v1 * y2) + (v0 * y1 * u2) + (y0 * u1 * v2) - (y0 * v1 * u2) - (v0 * u1 * y2) - (u0 * y1 * v2);

  ctx.transform(deltaA / delta, deltaD / delta,
    deltaB / delta, deltaE / delta,
    deltaC / delta, deltaF / delta);

  ctx.drawImage(texture, 0, 0, w, h, 0, 0, w, h);
  ctx.restore();
};

export {Mesh};
