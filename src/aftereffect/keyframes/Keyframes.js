import {Utils} from '../../utils/Utils';
import Mask from './Mask';
// import Shapes from './Shapes';
import Transform from './Transform';

/**
 * Keyframes
 * @class
 * @private
 */
class Keyframes {
  /**
   * manager
   * @param {object} element element
   * @param {object} layer element
   * @param {object} session element
   */
  constructor(element, layer, session) {
    this.element = element;
    this.layer = Utils.copyJSON(layer);
    this.keyframes = [];

    this.parse(element, layer, session);
  }

  /**
   * parse
   * @param {object} element element
   * @param {object} layer
   * @param {object} session
   */
  parse(element, layer, session) {
    this.transform(element, layer, session);

    if (layer.hasMask) this.mask(element, layer, session);
    // if (layer.shapes) this.shapes(element, layer, session);
  }

  /**
   * transform
   * @param {object} element element
   * @param {object} layer
   * @param {object} session
   */
  transform(element, layer, session) {
    this.add(new Transform(element, layer, session));
  }

  /**
   * mask
   * @param {object} element element
   * @param {object} layer
   * @param {object} session
   */
  mask(element, layer, session) {
    this.add(new Mask(element, layer, session));
  }

  /**
   * shapes
   * @param {object} element element
   * @param {object} layer
   * @param {object} session
   */
  // shapes(element, layer, session) {
  //   this.add(new Shapes(element, layer, session));
  // }

  /**
   * update
   * @param {number} progress
   * @param {object} session update session
   */
  update(progress, session) {
    for (let i = 0; i < this.keyframes.length; i++) {
      this.keyframes[i].update(progress, session);
    }
  }

  /**
   * add
   * @param {object} keyframe
   */
  add(keyframe) {
    this.keyframes.push(keyframe);
  }
}

export {Keyframes};
