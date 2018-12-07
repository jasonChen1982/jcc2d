import {Container} from '../../../core/Container';
import {getShape} from '../shapes/ShapeFactory';
import Fill from './Fill';
import Stroke from './Stroke';
import Transform from '../Transform';

/**
 * Graphics class
 * @class
 * @private
 */
class Graphics extends Container {
  /**
   * Graphics constructor
   * @param {object} layer layer data information
   * @param {object} items items data information
   * @param {object} session layer data information
   */
  constructor(layer, items, session = {}) {
    super();

    this.fill = null;
    this.stroke = null;
    this.shape = null;

    this.layer = layer;
    this.itemCache = [];

    this.parseItems(items.it, session);
  }

  /**
   * parseItems
   * @param {object} items items
   * @param {object} session session
   */
  parseItems(items, session) {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.ty == 'tr') {
        const ip = this.layer.ip;
        const op = this.layer.op;
        this.itemCache.push(new Transform(this, {ks: item, ip, op}, session));
      } else if (item.ty == 'sh' || item.ty == 'el' || item.ty == 'rc' || item.ty == 'sr') {
        const shape = getShape(item, session);
        if (!shape) continue;
        this.shape = shape;
        this.itemCache.push(this.shape);
      } else if (items[i].ty == 'fl') {
        this.fill = new Fill(item, session);
        this.itemCache.push(this.fill);
      } else if (items[i].ty == 'st') {
        this.stroke = new Stroke(item, session);
        this.itemCache.push(this.stroke);
      } else if (items[i].ty == 'tm') {
        // TODO:
      }
    }
  }

  /**
   * update
   * @param {number} progress
   * @param {object} session update session
   */
  update(progress, session) {
    for (let i = 0; i < this.itemCache.length; i++) {
      this.itemCache[i].update(progress, session);
    }
  }

  /**
   * render content
   * @param {object} ctx
   */
  renderMe(ctx) {
    if (this.fill) this.fill.render(ctx);
    if (this.stroke) this.stroke.render(ctx);
    if (this.shape) {
      ctx.beginPath();
      this.shape.render(ctx);
    }
    if (this.fill) ctx.fill();
    if (this.stroke) ctx.stroke();
  }
}

export default Graphics;
