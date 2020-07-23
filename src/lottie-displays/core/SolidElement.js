// import {
//   // Container,
//   Graphics,
//   // Sprite,
//   // Rectangle,
//   // Matrix,
// } from 'pixi.js';
import GraphicsMask from './GraphicsMask';
import {Graphics} from '../../core/Graphics';

/**
 * a
 */
class SolidRect {
  /**
   * a
   * @param {*} fillColor a
   * @param {*} width a
   * @param {*} height a
   */
  constructor(fillColor, width, height) {
    this.fillColor = fillColor;
    this.width = width;
    this.height = height;
  }

  /**
   * a
   * @param {*} ctx a
   */
  render(ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.fillColor;
    ctx.fillRect(0, 0, this.width, this.height);
  }
}

/**
 * NullElement class
 * @class
 * @private
 */
export default class SolidElement extends Graphics {
  /**
   * NullElement constructor
   * @param {object} elem layer data information
   * @param {object} config layer data information
   */
  constructor(elem, config) {
    const {color, rect} = config;
    super(new SolidRect(color, rect.width, rect.height));
    this.elem = elem;
    this.config = config;
    this.mask = new GraphicsMask(elem, config);
    this.addChild = this.adds;
  }

  /**
   * a
   * @param {*} parent a
   */
  setHierarchy(parent) {
    this.hierarchy = parent;
  }

  /**
   * a
   */
  show() {
    this.visible = true;
  }

  /**
   * a
   */
  hide() {
    this.visible = false;
  }

  /**
   * a
   * @param {*} transform
   */
  updateLottieTransform(transform) {
    this.x = transform.x;
    this.y = transform.y;
    this.pivotX = transform.anchorX;
    this.pivotY = transform.anchorY;
    this.scaleX = transform.scaleX;
    this.scaleY = transform.scaleY;
    this.rotation = transform.rotation;
    this.alpha = transform.alpha;
  }

  /**
   * a
   * @param {*} masks a
   */
  updateLottieMasks(masks) {
    if (!this.mask) {
      this.mask = this.graphicsMasks;
    }
    this.mask.updateLottieMasks(masks);
  }
}
