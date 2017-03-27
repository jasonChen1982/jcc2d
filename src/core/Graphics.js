import {Container} from './Container';
import {FrameBuffer} from '../filters/FrameBuffer';

/**
 * 形状对象，继承至Container
 *
 *
 * ```js
 * var graphics = new JC.Graphics();
 * ```
 *
 * @class
 * @extends JC.Container
 * @memberof JC
 */
function Graphics() {
  Container.call(this);
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
  if (!this.draw) return;
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
Graphics.prototype._drawBack = function(ctx) {
  if (typeof this.draw === 'function') {
    this.draw(ctx);
  } else if (
    typeof this.draw === 'object'
    &&
    typeof this.draw.render === 'function'
  ) {
    this.draw.render(ctx);
  }
};
/**
 * 图形绘制挂载函数
 *
 *```js
 *  var cacheMap = new JC.Graphics();  // 创建形状绘制对象
 *
 *  cacheMap.drawCall(function(ctx){
 *      for(var i = 50;i>0;i--){
 *          ctx.strokeStyle = COLOURS[i%COLOURS.length];
 *          ctx.beginPath();
 *          ctx.arc( 0, 0, i, 0, Math.PI*2 );
 *          ctx.stroke();
 *      }
 *  },{
 *      cache: true,
 *      bounds: new JC.Bounds(-50, -50, 50, 50)
 *  });
 * ```
 *
 * @param {function} fn
 * @param {object} opts
 */
Graphics.prototype.drawCall = function(fn, opts) {
  if (fn === undefined) return;
  opts = opts || {};
  this.cache = opts.cache || false;
  this.cached = false;
  /* eslint max-len: "off" */
  // this.session = opts.session || { bounds: { x: 0, y: 0 }, width: 100, height: 100 };
  this.draw = fn || null;

  this.setBounds(opts.bounds);
};


export {Graphics};
