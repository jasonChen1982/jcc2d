// import {
//   Container,
//   Graphics,
//   // Sprite,
//   // Rectangle,
//   // Matrix,
// } from 'pixi.js';
import {Container} from '../../core/Container';
import GraphicsMask from './GraphicsMask';

/**
 * NullElement class
 * @class
 * @private
 */
export default class CompElement extends Container {
  /**
   * NullElement constructor
   * @param {object} elem layer data information
   * @param {object} config layer data information
   */
  constructor(elem, config) {
    super();
    this.elem = elem;
    this.config = config;
    this.graphicsMasks = new GraphicsMask(elem, config);
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
