import {Container} from '../../../core/Container';

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
}

export default ShapeElement;
