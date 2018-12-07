import {Sprite} from '../../../core/Sprite';

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
}

export default SpriteElement;
