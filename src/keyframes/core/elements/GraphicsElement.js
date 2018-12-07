import {Graphics} from '../../../core/Graphics';
import {getShape} from '../../keyframes/shapes/ShapeFactory';
import Fill from '../../keyframes/Fill';
import Stroke from '../../keyframes/Stroke';

/**
 * GraphicsElement class
 * @class
 * @private
 */
class GraphicsElement extends Graphics {
  /**
   * GraphicsElement constructor
   * @param {object} layer layer data information
   * @param {object} items items data information
   * @param {object} session layer data information
   */
  constructor(layer, items, session = {}) {
    super();
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
        const layerConf = {ks: item, ip, op};
        this.initKeyFrames(layerConf, session);
      } else if (item.ty == 'sh' || item.ty == 'el' || item.ty == 'rc' || item.ty == 'sr') {
        const shape = getShape(this, item, session);
        if (shape) this.itemCache.push(shape);
      } else if (items[i].ty == 'fl') {
        this.itemCache.unshift(new Fill(this, item, session));
      } else if (items[i].ty == 'st') {
        this.itemCache.unshift(new Stroke(this, item, session));
      } else if (items[i].ty == 'tm') {
        // TODO:
      }
    }
  }

  /**
   * updateShape
   * @param {number} progress
   */
  updateShape(progress) {
    this.clear();
    for (let i = 0; i < this.itemCache.length; i++) {
      const item = this.itemCache[i];
      item.update(progress);
    }
    this.endFill();
  }
}

export default GraphicsElement;
