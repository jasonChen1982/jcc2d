
import { Container } from './Container';
import { Utils } from '../util/Utils';

/* eslint max-len: 0 */

/**
 * 文本，继承至Container
 *
 *
 * ```js
 * var text = new JC.TextFace(
 *   'JC jcc2d canvas renderer',
 *   {
 *     fontSize: '16px',
 *     ...
 *   }
 * );
 * ```
 *
 * @class
 * @extends JC.Container
 * @memberof JC
 * @param {string} text
 * @param {object} style
 * @param {string} [style.fontSize] 文字的字号
 * @param {string} [style.fontFamily] 文字的字体
 * @param {string} [style.fontStyle] 文字的 style ('normal', 'italic' or 'oblique')
 * @param {string} [style.fontWeight] 文字的 weight ('normal', 'bold', 'bolder', 'lighter' and '100', '200', '300', '400', '500', '600', '700', 800' or '900')
 * @param {boolean} [style.fill] 文字填充模式 默认为: ture
 * @param {string} [style.fillColor] 文字填充的颜色
 * @param {boolean} [style.stroke] 文字描边模式 默认为: false
 * @param {string} [style.strokeColor] 文字描边的颜色
 * @param {number} [style.lineWidth] 文字描边的宽度
 * @param {string} [style.textAlign] 文字的水平对齐方式 默认值: 'center' (top|bottom|middle|alphabetic|hanging)
 * @param {string} [style.textBaseline] 文字的垂直对齐方式 默认值: 'middle' (top|bottom|middle|alphabetic|hanging)
 */
function TextFace(text, style) {
  Container.call(this);
  this.text = text.toString();

  // ctx.font 缩写的顺序 fontStyle + fontVariant + fontWeight + fontSizeString + fontFamily
  this.fontStyle = style.fontStyle || 'normal';
  this.fontWeight = style.fontWeight || 'normal';
  this.fontSize = style.fontSize || '12px';
  this.fontFamily = style.fontFamily || 'Arial';

  this.fillColor = style.fillColor || 'black';
  this.strokeColor = style.strokeColor || 'red';

  // 对齐方式
  this.textAlign = style.textAlign || 'center';
  this.textBaseline = style.textBaseline || 'middle';

  this.lineWidth = Utils.isNumber(style.lineWidth) ? style.lineWidth : 1;

  this.stroke = Utils.isBoolean(style.stroke) ? style.stroke : false;

  this.fill = Utils.isBoolean(style.fill) ? style.fill : true;

  // ctx.measureText(str); // 返回指定文本的宽度
}
TextFace.prototype = Object.create(Container.prototype);

/**
 * 更新对象本身的矩阵姿态以及透明度
 *
 * @method updateMe
 * @private
 * @param {context} ctx
 */
TextFace.prototype.renderMe = function (ctx) {
  ctx.font = this.fontStyle + ' ' + this.fontWeight + ' ' + this.fontSize + ' ' + this.fontFamily;
  ctx.textAlign = this.textAlign;
  ctx.textBaseline = this.textBaseline;
  if (this.fill) {
    ctx.fillStyle = this.fillColor;
    ctx.fillText(this.text, 0, 0);
  }
  if (this.stroke) {
    ctx.lineWidth = this.lineWidth;
    ctx.strokeStyle = this.strokeColor;
    ctx.strokeText(this.text, 0, 0);
  }
};

export { TextFace };