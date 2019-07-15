import {Container} from '../../../core/Container';
import {Graphics} from '../../../core/Graphics';
import {Keyframes} from '../../keyframes/Keyframes';
import CVShapeElement from '../../shapes/CVShapeElement';

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
    this.bProgress = -999999;

    register.setLayer(this.name, this);

    this.initKeyFrames(layer, session);

    this.shapes = new CVShapeElement(layer, session);
    this.adds(new Graphics((ctx) => {
      this.shapes.prepareFrame(this.bProgress);
      this.shapes.renderFrame(ctx);
    }));
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
    this.bProgress = progress;
    this.bodymovin.update(progress, session);
  }
}

export default ShapeElement;
