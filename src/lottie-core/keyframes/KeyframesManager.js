import Tools from '../utils/tools';
import MaskFrames from './MaskFrames';
import ShapesFrames from './ShapesFrames';
import TransformFrames from './TransformFrames';

import PropertyFactory from '../utils/PropertyFactory';

/**
 * KeyframesManager
 * @class
 * @private
 */
class KeyframesManager {
  /**
   * manager
   * @param {object} elem elem
   */
  constructor(elem) {
    // const { st, config } = session;

    this.elem = elem;
    // this.layer = layer;

    // const opst = this.layer.op + st;

    // this.isOverSide = opst >= config.op;

    // this.keyframes = [];

    // set to true when inpoint is rendered
    this._isFirstFrame = false;

    // list of animated properties
    this.dynamicProperties = [];

    // If layer has been modified in current tick this will be true
    this._mdf = false;

    this.transform = null;

    this.masks = null;

    this.shapes = null;

    this._hasOutTypeExpression = false;

    this.needUpdateOverlap = false;

    this.isOverlapMode = false;

    this.visible = true;
  }

  /**
   * manager
   * @param {object} layer elem
   * @param {object} session elem
   */
  initFrame(layer, session) {
    // this.elem = elem;
    this.layer = layer;

    const {local, global} = session;
    this.session = session;

    // const opst = this.layer.op + st;

    // ip, op, st session
    this.isOverlapLayer = this.layer.op >= (local.op - local.st);

    this.isOverlapMode = global.overlapMode;

    this.parseLayer(layer, session);
  }

  /**
   * a
   */
  outTypeExpressionMode() {
    this._hasOutTypeExpression = true;
    if (this.isOverlapLayer) {
      this.needUpdateOverlap = true;
    }
  }

  /**
   * Calculates all dynamic values
   * @param {number} frameNum current frame number in Layer's time
   * @param {boolean} isVisible if layers is currently in range
   */
  prepareProperties(frameNum, isVisible) {
    let i; let len = this.dynamicProperties.length;
    for (i = 0; i < len; i += 1) {
      if (isVisible || this.needUpdateOverlap || (this.elem._isParent && this.dynamicProperties[i].propType === 'transform')) {
        this.dynamicProperties[i].getValue(frameNum);
        if (this.dynamicProperties[i]._mdf) {
          // this.globalData._mdf = true;
          this._mdf = true;
        }
      }
    }
  }

  /**
   * a
   * @param {*} prop a
   */
  addDynamicProperty(prop) {
    if (this.dynamicProperties.indexOf(prop) === -1) {
      this.dynamicProperties.push(prop);
    }
  }

  /**
   * parse
   * @param {object} layer
   * @param {object} session
   */
  parseLayer({ks, hasMask, masksProperties, shapes, tm}, session) {
    if (ks) {
      this.transform = new TransformFrames(this, ks, session);
      // ao logic
    }

    if (hasMask) {
      this.masks = new MaskFrames(this, masksProperties, session);
    }
    if (shapes) {
      this.shapes = new ShapesFrames(this, shapes, session);
    }

    if (tm) {
      const {frameRate} = session.global;
      this.tm = PropertyFactory.getProp(this, tm, 0, frameRate, this);
    }
  }

  /**
   * update
   * @param {number} frameNum frameNum
   * @param {object} session update session
   */
  updateFrame(frameNum, session) {
    this._mdf = false;
    const inIpOpRange = Tools.inRange(frameNum, this.layer.ip, this.layer.op);
    if (this.isOverlapMode && this.isOverlapLayer) {
      this.visible = frameNum >= this.layer.ip;
    } else {
      this.visible = inIpOpRange;
    }

    this.prepareProperties(frameNum, inIpOpRange);
  }

  /**
   * a
   */
  updateDisplay() {
    const display = this.elem.display;
    if (!this.elem._isRoot) {
      if (this.visible) {
        display.show();
      } else {
        display.hide();
      }
    }
    if (this.transform) display.updateLottieTransform(this.transform);
    if (this.masks) display.updateLottieMasks(this.masks);
  }
}

export default KeyframesManager;
