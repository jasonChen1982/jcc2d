/**
 * 平面
 *
 * @param {Number} width  宽度
 * @param {Number} height 高度
 * @param {Number} widthSegments 宽分隔
 * @param {Number} heightSegments 高分隔
 */
function Plane(width, height, widthSegments, heightSegments) {
  var widthHalf = width / 2;
  var heightHalf = height / 2;

  var gridX = Math.floor(widthSegments) || 1;
  var gridY = Math.floor(heightSegments) || 1;

  var gridX1 = gridX + 1;
  var gridY1 = gridY + 1;

  var segmentWidth = width / gridX;
  var segmentHeight = height / gridY;

  this._vertices = new Float32Array(gridX1 * gridY1 * 3);
  this.normals = new Float32Array(gridX1 * gridY1 * 3);
  this.uvs = new Float32Array(gridX1 * gridY1 * 2);

  var offset = 0;
  var offset2 = 0;

  for (var iy = 0; iy < gridY1; iy++) {
    var y = iy * segmentHeight - heightHalf;

    for (var ix = 0; ix < gridX1; ix++) {
      var x = ix * segmentWidth - widthHalf;

      this._vertices[offset] = x;
      this._vertices[offset + 1] = -y;
      this._vertices[offset + 2] = 0;

      this.normals[offset + 2] = 1;

      this.uvs[offset2] = ix / gridX;
      this.uvs[offset2 + 1] = 1 - iy / gridY;

      offset += 3;
      offset2 += 2;
    }
  }

  offset = 0;

  /* eslint max-len: 0 */
  this.indices = new (this._vertices.length / 3 > 65535 ? Uint32Array : Uint16Array)(gridX * gridY * 6);

  for (var _iy = 0; _iy < gridY; _iy++) {
    for (var _ix = 0; _ix < gridX; _ix++) {
      var a = _ix + gridX1 * _iy;
      var b = _ix + gridX1 * (_iy + 1);
      var c = _ix + 1 + gridX1 * (_iy + 1);
      var d = _ix + 1 + gridX1 * _iy;

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

Plane.prototype.update = function (matrix) {
  for (var i = 0; i < this._vertices.length; i += 3) {
    var x = this._vertices[i];
    var y = this._vertices[i + 1];
    var z = this._vertices[i + 2];
    var w = 1;

    // const ww = matrix[3]*x + matrix[7]*y + matrix[11]*z + matrix[15]*w;
    this.vertices[i] = matrix[0] * x + matrix[4] * y + matrix[8] * z + matrix[12] * w;
    this.vertices[i + 1] = matrix[1] * x + matrix[5] * y + matrix[9] * z + matrix[13] * w;
    this.vertices[i + 2] = matrix[2] * x + matrix[6] * y + matrix[10] * z + matrix[14] * w;
  }
};

export { Plane };