import {Sprite} from '../../../core/Sprite';
import {Keyframes} from '../../keyframes/Keyframes';

/**
 * SpriteElement class
 * @class
 * @private
 */
class SpriteElement extends Sprite {
  /**
   * SpriteElement constructor
   * @param {object} layer layer data information
   * @param {object} session layer data information
   */
  constructor(layer, session = {}) {
    const {parentName, register} = session;

    const texture = register.getTexture(layer.refId);
    super({texture});

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

export default SpriteElement;
