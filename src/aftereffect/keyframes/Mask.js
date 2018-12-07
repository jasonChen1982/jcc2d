import GraphicsMask from './graphics/GraphicsMask';

/**
 * Mask
 * @class
 * @private
 */
class Mask {
  /**
   * generate a keyframes buffer
   * @param {Container} element host element
   * @param {object} layer layer data
   * @param {object} session now session
   * @param {object} session.size time of pre-frame
   * @param {number} session.st time of start position
   */
  constructor(element, layer, session) {
    this.element = element;

    this.masksProperties = layer.masksProperties || [];

    this.session = session;

    this.mask = new GraphicsMask(this.masksProperties, session);

    this.element.mask = this.mask;
  }

  /**
   * update
   * @param {number} progress progress
   * @param {object} session update session
   */
  update(progress, session) {
    this.mask.update(progress);
  }
}

export default Mask;
