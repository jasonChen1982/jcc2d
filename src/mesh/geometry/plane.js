/**
 * 平面
 *
 * @param {Number} width  宽度
 * @param {Number} height 高度
 * @param {Number} widthSegments 宽分隔
 * @param {Number} heightSegments 高分隔
 */
function Plane( width, height, widthSegments, heightSegments ) {
  const widthHalf = width / 2;
  const heightHalf = height / 2;

  const gridX = Math.floor( widthSegments ) || 1;
  const gridY = Math.floor( heightSegments ) || 1;

  const gridX1 = gridX + 1;
  const gridY1 = gridY + 1;

  const segmentWidth = width / gridX;
  const segmentHeight = height / gridY;

  this._vertices = new Float32Array( gridX1 * gridY1 * 3 );
  this.normals = new Float32Array( gridX1 * gridY1 * 3 );
  this.uvs = new Float32Array( gridX1 * gridY1 * 2 );

  let offset = 0;
  let offset2 = 0;

  for ( let iy = 0; iy < gridY1; iy ++ ) {
    const y = iy * segmentHeight - heightHalf;

    for ( let ix = 0; ix < gridX1; ix ++ ) {
      const x = ix * segmentWidth - widthHalf;

      this._vertices[offset] = x;
      this._vertices[offset + 1] = -y;
      this._vertices[offset + 2] = 0;

      this.normals[offset + 2] = 1;

      this.uvs[offset2] = ix / gridX;
      this.uvs[offset2 + 1] = 1 - ( iy / gridY );

      offset += 3;
      offset2 += 2;
    }
  }

  offset = 0;

  /* eslint max-len: 0 */
  this.indices = new ( ( this._vertices.length / 3 ) > 65535 ? Uint32Array : Uint16Array )( gridX * gridY * 6 );

  for ( let iy = 0; iy < gridY; iy ++ ) {
    for ( let ix = 0; ix < gridX; ix ++ ) {
      const a = ix + gridX1 * iy;
      const b = ix + gridX1 * ( iy + 1 );
      const c = ( ix + 1 ) + gridX1 * ( iy + 1 );
      const d = ( ix + 1 ) + gridX1 * iy;

      this.indices[offset] = a;
      this.indices[offset + 1] = b;
      this.indices[offset + 2] = d;

      this.indices[offset + 3] = b;
      this.indices[offset + 4] = c;
      this.indices[offset + 5] = d;

      offset += 6;
    }
  }
  this.vertices = new Float32Array(this._vertices);
}

Plane.prototype.update = function(matrix) {
  for (let i = 0; i < this._vertices.length; i+=3) {
    const x = this._vertices[i];
    const y = this._vertices[i + 1];
    const z = this._vertices[i + 2];
    const w = 1;

    // const ww = matrix[3]*x + matrix[7]*y + matrix[11]*z + matrix[15]*w;
    this.vertices[i] = matrix[0]*x + matrix[4]*y + matrix[8]*z + matrix[12]*w;
    this.vertices[i + 1] = matrix[1]*x + matrix[5]*y + matrix[9]*z + matrix[13]*w;
    this.vertices[i + 2] = matrix[2]*x + matrix[6]*y + matrix[10]*z + matrix[14]*w;
  }
};

export {Plane};
