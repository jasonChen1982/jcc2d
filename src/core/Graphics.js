import {Container} from './Container';
import {FrameBuffer} from '../filters/FrameBuffer';
import {Utils} from '../util/Utils';

const FUNCTION = 'fn';
const INSTANCE = 'in';

/* eslint max-len: 0 */

/**
 * 形状对象，继承至Container
 *
 *
 * ```js
 * const options = {
 *   cache: true,
 *   bounds: new JC.Bounds(-50, -50, 50, 50)
 * };
 * function drawRect(ctx) {
 *  ctx.fillStyle = 'red';
 *  ctx.fillRect(-10, -10, 10, 10);
 * }
 *
 * function Cricle(options) {
 *   this.radius = options.radius || 0;
 *   this.color = options.color || '#3a3cfd';
 * }
 * Cricle.prototype.render = function(ctx) {
 *   ctx.beginPath();
 *   ctx.fillStyle = this.color;
 *   ctx.arc(0, 0, this.radius, 0, Math.PI * 2, true);
 *   ctx.closePath();
 *   ctx.fill();
 * }
 *
 * const rect = new JC.Graphics(drawRect);
 * const cricle = new JC.Graphics(new Cricle());
 *
 * ```
 *
 * @class
 * @extends JC.Container
 * @memberof JC
 * @param {function|object} mesh 绘制对象，可以是函数，也可以是带有render方法的对象，绘制时会将当前绘图环境传递给它
 * @param {object} options 绘制对象
 * @param {boolean} [options.cache] 是否缓存改绘制对象，加入绘制对象非常复杂并后续无需更新时设置为 true 可以优化性能
 * @param {JC.Bounds} [options.bounds] 绘制对象的包围盒，在需要缓存时需要手动设置
 */
function Graphics(mesh, options) {
  Container.call(this);
  options = options || {};
  this.mesh = mesh;
  this.meshType = Utils.isFunction(mesh) ? FUNCTION : Utils.isObject(mesh) && Utils.isFunction(mesh.render) ? INSTANCE : '';
  if (this.meshType === '') throw new Error('不支持的绘制对象');

  this.cache = options.cache || false;
  this.cached = false;
  this.setBounds(options.bounds);

  this.frameBuffer = null;
}
Graphics.prototype = Object.create(Container.prototype);

/**
 * 更新对象本身的矩阵姿态以及透明度
 *
 * @param {context} ctx
 * @private
 */
Graphics.prototype.renderMe = function(ctx) {
  if (!this.meshType) return;
  if (this.cached || this.cache) {
    if (this.cache) {
      if (this.frameBuffer === null) this.frameBuffer = new FrameBuffer();

      this.frameBuffer.clear();
      this.__co = this._bounds.getRectangle();
      this.__co.px = this.__co.py = 0;
      this.frameBuffer.setSize(this.__co);
      this.frameBuffer.setTransform(1, 0, 0, 1, -this.__co.x, -this.__co.y);

      this._drawBack(this.frameBuffer.ctx);

      this.cached = true;
      this.cache = false;
    }
    this.frameBuffer
    &&
    ctx.drawImage(
      this.frameBuffer.canvas,
      this.__co.x - this.__co.px,
      this.__co.y - this.__co.py,
      this.frameBuffer.width,
      this.frameBuffer.height
    );
  } else {
    this._drawBack(ctx);
  }
};

/**
 * 调用绘制函数
 *
 * @param {context} ctx
 * @private
 */
Graphics.prototype._drawBack = function(ctx) {
  if (this.meshType === FUNCTION) {
    this.mesh(ctx);
  } else if (this.meshType === INSTANCE) {
    this.mesh.render(ctx);
  }
};

export {Graphics};
