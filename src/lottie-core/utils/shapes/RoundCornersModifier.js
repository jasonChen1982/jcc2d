import ShapeModifier from './ShapeModifier';
import PropertyFactory from '../PropertyFactory';
import ShapePool from '../pooling/ShapePool';

const roundCorner = 0.5519;

/**
 * a
 */
export default class RoundCornersModifier extends ShapeModifier {
  /**
   * init modifier properties
   * @param {*} elem element node
   * @param {*} data round corners value property data
   */
  initModifierProperties(elem, data) {
    this.getValue = this.processKeys;
    this.rd = PropertyFactory.getProp(elem, data.r, 0, null, this);
    this._isAnimated = !!this.rd.effectsSequence.length;
  }

  /**
   * process path
   * @param {*} path path
   * @param {*} round round
   * @return {*}
   */
  processPath(path, round) {
    const clonedPath = ShapePool.newElement();
    clonedPath.c = path.c;
    let i; let len = path._length;
    let currentV;
    let currentI;
    let currentO;
    let closerV;
    // let newV;
    // let newO;
    // let newI;
    let distance;
    let newPosPerc;
    let index = 0;
    let vX; let vY; let oX; let oY; let iX; let iY;
    for (i=0; i<len; i+=1) {
      currentV = path.v[i];
      currentO = path.o[i];
      currentI = path.i[i];
      if (currentV[0]===currentO[0] && currentV[1]===currentO[1] && currentV[0]===currentI[0] && currentV[1]===currentI[1]) {
        if ((i===0 || i === len - 1) && !path.c) {
          clonedPath.setTripleAt(currentV[0], currentV[1], currentO[0], currentO[1], currentI[0], currentI[1], index);
          /* clonedPath.v[index] = currentV;
                clonedPath.o[index] = currentO;
                clonedPath.i[index] = currentI;*/
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
          clonedPath.setTripleAt(vX, vY, oX, oY, iX, iY, index);
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
          clonedPath.setTripleAt(vX, vY, oX, oY, iX, iY, index);
          index += 1;
        }
      } else {
        clonedPath.setTripleAt(path.v[i][0], path.v[i][1], path.o[i][0], path.o[i][1], path.i[i][0], path.i[i][1], index);
        index += 1;
      }
    }
    return clonedPath;
  }

  /**
   * process shapes
   * @param {*} _isFirstFrame is first frame
   */
  processShapes(_isFirstFrame) {
    let shapePaths;
    let i; let len = this.shapes.length;
    let j; let jLen;
    let rd = this.rd.v;

    if (rd !== 0) {
      let shapeData;
      // let newPaths;
      let localShapeCollection;
      for (i=0; i<len; i+=1) {
        shapeData = this.shapes[i];
        // newPaths = shapeData.shape.paths;
        localShapeCollection = shapeData.localShapeCollection;
        if (!(!shapeData.shape._mdf && !this._mdf && !_isFirstFrame)) {
          localShapeCollection.releaseShapes();
          shapeData.shape._mdf = true;
          shapePaths = shapeData.shape.paths.shapes;
          jLen = shapeData.shape.paths._length;
          for (j=0; j<jLen; j+=1) {
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
