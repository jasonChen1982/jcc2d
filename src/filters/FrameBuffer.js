/**
 * 帧缓冲区
 * @class
 */
function FrameBuffer() {
  this.canvas = document.createElement('canvas');
  this.ctx = this.canvas.getContext('2d');
}
FrameBuffer.prototype.setSize = function(rect) {
  this.width = this.canvas.width = rect.width + rect.px * 2;
  this.height = this.canvas.height = rect.height + rect.py * 2;
};
FrameBuffer.prototype.clear = function() {
  this.ctx.setTransform(1, 0, 0, 1, 0, 0);
  this.ctx.clearRect(0, 0, this.width, this.height);
};
FrameBuffer.prototype.setTransform = function(a, b, c, d, e, f) {
  this.ctx.setTransform(a, b, c, d, e, f);
};
FrameBuffer.prototype.getBuffer = function() {
  this.bufferData = this.ctx.getImageData(0, 0, this.width, this.height);
  return this.bufferData;
};
FrameBuffer.prototype.putBuffer = function() {
  this.ctx.putImageData(this.bufferData, 0, 0);
  return this.canvas;
};
FrameBuffer.prototype.createBuffer = function() {};

export {FrameBuffer};
