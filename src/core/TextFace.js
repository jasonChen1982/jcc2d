
import {Container} from './Container';

/**
 * 文本，继承至Container
 *
 *
 * ```js
 * var text = new JC.TextFace(
 *              'JC jcc2d canvas renderer',
 *              'bold 36px Arial',
 *              '#f00'
 *            );
 * ```
 *
 * @class
 * @extends JC.Container
 * @memberof JC
 * @param {string} text
 * @param {string} font
 * @param {string} color
 */
function TextFace(text, font, color) {
  Container.call( this );
  this.text = text.toString();
  this.font = font || 'bold 12px Arial';
  this.color = color || '#000000';

  this.textAlign = 'center'; // start left center end right
  this.textBaseline = 'middle'; // top bottom middle alphabetic hanging


  this.outline = 0;
  this.lineWidth = 1;

  this.US = false; // use stroke
  this.UF = true; // use fill

    // ctx.measureText(str) 返回指定文本的宽度
}
TextFace.prototype = Object.create( Container.prototype );

/**
 * 更新对象本身的矩阵姿态以及透明度
 *
 * @method updateMe
 * @private
 * @param {context} ctx
 */
TextFace.prototype.renderMe = function(ctx) {
  ctx.font = this.font;
  ctx.textAlign = this.textAlign;
  ctx.textBaseline = this.textBaseline;
  if(this.UF) {
    ctx.fillStyle = this.color;
    ctx.fillText(this.text, 0, 0);
  }
  if(this.US) {
    ctx.lineWidth = this.lineWidth;
    ctx.strokeStyle = this.color;
    ctx.strokeText(this.text, 0, 0);
  }
};

export {TextFace};
