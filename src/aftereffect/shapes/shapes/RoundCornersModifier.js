import ShapeModifier from './BaseShapeModifier';
// import { registerModifier } from './ShapeModifiers';
import PropertyFactory from '../PropertyFactory';
import shape_pool from '../pooling/shape_pool';

const roundCorner = 0.5519;

/**
 * a
 */
export default class RoundCornersModifier extends ShapeModifier {
  /**
   * a
   * @param {*} elem a
   * @param {*} data a
   */
  initModifierProperties(elem, data) {
    this.getValue = this.processKeys;
    this.rd = PropertyFactory.getProp(elem, data.r, 0, null, this);
    this._isAnimated = !!this.rd.effectsSequence.length;
  }


  /**
   * a
   * @param {*} path a
   * @param {*} round a
   * @return {*}
   */
  processPath(path, round) {
    const cloned_path = shape_pool.newElement();
    cloned_path.c = path.c;
    const len = path._length;
    let currentV;
    let currentI;
    let currentO;
    let closerV;
    let distance;
    let newPosPerc;
    let index = 0;
    let vX;
    let vY;
    let oX;
    let oY;
    let iX;
    let iY;
    for (let i = 0; i < len; i++) {
      currentV = path.v[i];
      currentO = path.o[i];
      currentI = path.i[i];
      if (currentV[0]===currentO[0] && currentV[1]===currentO[1] && currentV[0]===currentI[0] && currentV[1]===currentI[1]) {
        if ((i===0 || i === len - 1) && !path.c) {
          cloned_path.setTripleAt(currentV[0], currentV[1], currentO[0], currentO[1], currentI[0], currentI[1], index);
          // /*cloned_path.v[index] = currentV;
          // cloned_path.o[index] = currentO;
          // cloned_path.i[index] = currentI;*/
          index += 1;
        } else {
          if (i===0) {
            closerV = path.v[len-1];
          } else {
            closerV = path.v[i-1];
          }
          distance = Math.sqrt(Math.pow(currentV[0]-closerV[0], 2)+Math.pow(currentV[1]-closerV[1], 2));
          newPosPerc = distance ? Math.min(distance/2, round)/distance : 0;
          vX = iX = currentV[0]+(closerV[0]-currentV[0])*newPosPerc;
          vY = iY = currentV[1]-(currentV[1]-closerV[1])*newPosPerc;
          oX = vX-(vX-currentV[0])*roundCorner;
          oY = vY-(vY-currentV[1])*roundCorner;
          cloned_path.setTripleAt(vX, vY, oX, oY, iX, iY, index);
          index += 1;

          if (i === len - 1) {
            closerV = path.v[0];
          } else {
            closerV = path.v[i+1];
          }
          distance = Math.sqrt(Math.pow(currentV[0]-closerV[0], 2)+Math.pow(currentV[1]-closerV[1], 2));
          newPosPerc = distance ? Math.min(distance/2, round)/distance : 0;
          vX = oX = currentV[0]+(closerV[0]-currentV[0])*newPosPerc;
          vY = oY = currentV[1]+(closerV[1]-currentV[1])*newPosPerc;
          iX = vX-(vX-currentV[0])*roundCorner;
          iY = vY-(vY-currentV[1])*roundCorner;
          cloned_path.setTripleAt(vX, vY, oX, oY, iX, iY, index);
          index += 1;
        }
      } else {
        cloned_path.setTripleAt(path.v[i][0], path.v[i][1], path.o[i][0], path.o[i][1], path.i[i][0], path.i[i][1], index);
        index += 1;
      }
    }
    return cloned_path;
  }

  /**
   * a
   * @param {*} _isFirstFrame a
   */
  processShapes(_isFirstFrame) {
    let shapePaths;
    const len = this.shapes.length;
    const rd = this.rd.v;

    if (rd !== 0) {
      let shapeData;
      // let newPaths;
      let localShapeCollection;
      for (let i = 0; i < len; i++) {
        shapeData = this.shapes[i];
        // newPaths = shapeData.shape.paths;
        localShapeCollection = shapeData.localShapeCollection;
        if (!(!shapeData.shape._mdf && !this._mdf && !_isFirstFrame)) {
          localShapeCollection.releaseShapes();
          shapeData.shape._mdf = true;
          shapePaths = shapeData.shape.paths.shapes;
          const jLen = shapeData.shape.paths._length;
          for (let j=0; j<jLen; j+=1) {
            localShapeCollection.addShape(this.processPath(shapePaths[j], rd));
          }
        }
        shapeData.shape.paths = shapeData.localShapeCollection;
      }
    }
    if (!this.dynamicProperties.length) {
      this._mdf = false;
    }
  }
}
