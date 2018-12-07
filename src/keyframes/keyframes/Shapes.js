import GraphicsElement from '../core/elements/GraphicsElement';

/**
 * Shapes
 * @class
 * @private
 */
class Shapes {
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
    this.shapes = [];
    this.createShapes(layer, session);
  }

  /**
   * createShapes
   * @param {object} layer layer data
   * @param {object} session now session
   */
  createShapes(layer, session) {
    const shapes = layer.shapes;
    for (let i = 0; i < shapes.length; i++) {
      const shape = shapes[i];
      if (shape.ty === 'gr') {
        const ge = new GraphicsElement(layer, shape, session);
        this.element.addChild(ge);
        this.shapes.push(ge);
      }
    }
  }

  /**
   * update
   * @param {number} progress progress
   * @param {object} session update session
   */
  update(progress, session) {
    for (let i = 0; i < this.shapes.length; i++) {
      const shape = this.shapes[i];
      shape.updateShape(progress);
    }
  }
}

export default Shapes;
