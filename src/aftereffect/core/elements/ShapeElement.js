import {Container} from '../../../core/Container';
import {Keyframes} from '../../keyframes/Keyframes';

/**
 * ShapeElement class
 * @class
 * @private
 */
class ShapeElement extends Container {
  /**
   * ShapeElement constructor
   * @param {object} layer layer data information
   * @param {object} session layer data information
   */
  constructor(layer, session = {}) {
    super();

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

export default ShapeElement;
