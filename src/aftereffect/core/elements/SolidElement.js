import {Graphics} from '../../../core/Graphics';
import {Keyframes} from '../../keyframes/Keyframes';

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
class SolidElement extends Graphics {
  /**
   * NullElement constructor
   * @param {object} layer layer data information
   * @param {object} session layer data information
   */
  constructor(layer, session = {}) {
    const {sc, sw, sh} = layer;
    super(new SolidRect(sc, sw, sh));

    const {parentName, register} = session;

    this.name = parentName + '.' + layer.nm;

    register.setLayer(this.name, this);

    this.initKeyFrames(layer, session);
  }

  /**
   * initKeyFrames
   * @param {object} layer layer
   * @param {object} session session
   */
  initKeyFrames(layer, session) {
    this.bodymovin = new Keyframes(this, layer, session);
    this.movin = true;
  }

  /**
   * initKeyFrames
   * @param {number} progress progress
   * @param {object} session session
   */
  updateKeyframes(progress, session) {
    if (!this.movin) return;
    this.bodymovin.update(progress, session);
  }
}

export default SolidElement;
