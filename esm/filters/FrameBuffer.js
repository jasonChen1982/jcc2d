/**
 * 帧缓冲区
 * @class
 * @memberof JC
 */
function FrameBuffer() {
  this.canvas = document.createElement('canvas');
  this.ctx = this.canvas.getContext('2d');
}

/**
 * 设置缓冲区大小
 * @param {JC.Rectangle} rect 获取到的尺寸
 */
FrameBuffer.prototype.setSize = function (rect) {
  this.width = this.canvas.width = rect.width + rect.px * 2;
  this.height = this.canvas.height = rect.height + rect.py * 2;
};

/**
 * 清除缓冲区
 */
FrameBuffer.prototype.clear = function () {
  this.ctx.setTransform(1, 0, 0, 1, 0, 0);
  this.ctx.clearRect(0, 0, this.width, this.height);
};

/**
 * 设置绘图上下文的变换矩阵
 * @param {number} a
 * @param {number} b
 * @param {number} c
 * @param {number} d
 * @param {number} e
 * @param {number} f
 */
FrameBuffer.prototype.setTransform = function (a, b, c, d, e, f) {
  this.ctx.setTransform(a, b, c, d, e, f);
};

/**
 * 获取缓冲区的像素
 * @return {ImageData}
 */
FrameBuffer.prototype.getBuffer = function () {
  this.buffer = this.ctx.getImageData(0, 0, this.width, this.height);
  return this.buffer;
};

/**
 * 放置像素到缓冲区
 * @return {canvas}
 */
FrameBuffer.prototype.putBuffer = function () {
  this.ctx.putImageData(this.buffer, 0, 0);
  return this.canvas;
};

export { FrameBuffer };