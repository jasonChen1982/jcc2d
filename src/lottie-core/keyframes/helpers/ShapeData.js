import ShapePropertyFactory from '../../utils/shapes/ShapeProperty';

/**
 * ShapeData class
 */
export default class ShapeData {
  /**
   * constructor ShapeData
   * @param {*} element a
   * @param {*} data a
   * @param {*} styles a
   * @param {*} transformsManager a
   */
  constructor(element, data, styles, transformsManager) {
    this.styledShapes = [];
    this.tr = [0, 0, 0, 0, 0, 0];
    let ty = 4;
    if (data.ty == 'rc') {
      ty = 5;
    } else if (data.ty == 'el') {
      ty = 6;
    } else if (data.ty == 'sr') {
      ty = 7;
    }
    this.sh = ShapePropertyFactory.getShapeProp(element, data, ty);
    const len = styles.length;
    for (let i = 0; i < len; i += 1) {
      if (!styles[i].closed) {
        const styledShape = {
          transforms: transformsManager.addTransformSequence(styles[i].transforms),
          trNodes: [],
        };
        this.styledShapes.push(styledShape);
        styles[i].elements.push(styledShape);
      }
    }
  }

  /**
   * set as animated
   */
  setAsAnimated() {
    this._isAnimated = true;
  }
}
