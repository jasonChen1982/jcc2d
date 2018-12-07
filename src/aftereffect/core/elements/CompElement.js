import {Container} from '../../../core/Container';
import SpriteElement from './SpriteElement';
// import ShapeElement from './ShapeElement';
import {Utils} from '../../../utils/Utils';
import {getAssets} from '../../common/common';
import {Keyframes} from '../../keyframes/Keyframes';

/**
 * CompElement class
 * @class
 * @private
 */
class CompElement extends Container {
  /**
   * CompElement constructor
   * @param {object} layer layer data information
   * @param {object} session global session information
   */
  constructor(layer, session = {}) {
    super();
    const {assets, size, prefix, register} = session;
    let parentName = session.parentName;
    let ist = 0;
    let layers = [];

    const mySize = {
      w: size.w,
      h: size.h,
    };
    if (Utils.isArray(layer)) {
      layers = layer;
      this.name = parentName;
    } else {
      this.initKeyFrames(layer, session);
      mySize.w = layer.w;
      mySize.h = layer.h;
      layers = getAssets(layer.refId, assets).layers;
      ist = layer.st;
      parentName = this.name = parentName + '.' + layer.nm;
    }

    register.setLayer(parentName, this);

    this.parseLayers(layers, {assets, st: ist, size: mySize, prefix, register, parentName});
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

  /**
   * parse layers
   * @param {array} layers layers data
   * @param {object} session assets data
   */
  parseLayers(layers, session) {
    const elementsMap = this.createElements(layers, session);
    for (let i = layers.length - 1; i >= 0; i--) {
      const layer = layers[i];
      const item = elementsMap[layer.ind];
      if (!item) continue;
      if (layer.parent) {
        const parent = elementsMap[layer.parent];
        parent.adds(item);
      } else {
        this.adds(item);
      }
    }
  }

  /**
   * createElements
   * @param {arrya} layers layers
   * @param {object} session object
   * @return {object}
   */
  createElements(layers, session) {
    const elementsMap = {};
    for (let i = layers.length - 1; i >= 0; i--) {
      const layer = layers[i];
      let element = null;

      switch (layer.ty) {
      case 0:
        element = new CompElement(layer, session);
        break;
      case 2:
        element = new SpriteElement(layer, session);
        break;
      // case 4:
      //   element = new ShapeElement(layer, session);
      //   break;
      default:
        continue;
      }

      if (element) {
        elementsMap[layer.ind] = element;
      }
    }
    return elementsMap;
  }
}

export default CompElement;
