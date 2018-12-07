import {Graphics} from '../../core/Graphics';
import CurveData from './shapes/CurveData';
import {drawCurve, drawInv} from './shapes/DrawCurve';

/**
 * Shape
 */
class Shape {
  /**
   *
   * @param {*} shapes a
   * @param {*} session a
   */
  constructor(shapes, session) {
    this.shapes = shapes;
    this.session = session;
    this.curves = [];
  }

  /**
   * a
   * @param {*} progress a
   */
  update(progress) {
    for (let i = 0; i < this.shapes.length; i++) {
      this.curves[i] = this.shapes[i].getCurve(progress);
    }
  }

  /**
   * a
   * @param {*} ctx a
   */
  render(ctx) {
    for (let i = 0; i < this.shapes.length; i++) {
      if (this.shapes[i].inv) drawInv(ctx, this.session.size);
      drawCurve(ctx, this.curves[i]);
    }
  }
}

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

    this.maskData = this.masksProperties.filter((it) => {
      return it.mode !== 'n';
    });
    this.shapes = this.maskData.map((it) => {
      return new CurveData(it, session, true);
    });

    this.maskShape = new Shape(this.shapes, session);
    this.element.mask = new Graphics(this.maskShape);
  }

  /**
   * update
   * @param {number} progress progress
   * @param {object} session update session
   */
  update(progress, session) {
    this.maskShape.update(progress);
  }
}

export default Mask;
