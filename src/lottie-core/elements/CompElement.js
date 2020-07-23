import BaseElement from './BaseElement';
import DisplayRegister from '../register/DisplayRegister';

/**
 * a
 */
export default class CompElement extends BaseElement {
  /**
   * a
   * @param {*} layer a
   * @param {*} session a
   */
  constructor(layer, session) {
    super(layer);

    const {global: {maskComp}, local: {w, h}} = session;
    this.session = session;

    const config = {
      layer,
      session,
    };

    if (maskComp) {
      config.maskComp = maskComp;
      config.viewport = {x: 0, y: 0, width: w, height: h};
    }
    this.config = config;

    this.childNodes = [];

    this.displayType = DisplayRegister.Type.Container;

    this.display = this.initDisplayInstance(this.displayType, config);

    this.bodymovin.initFrame(layer, session);
  }

  /**
   * a
   * @param {*} frameNum a
   */
  updateFrame(frameNum) {
    this.bodymovin.updateFrame(frameNum);
    this.bodymovin.updateDisplay();

    frameNum -= this.offsetTime;

    if (this.bodymovin.tm) {
      let timeRemapped = this.bodymovin.tm.v;
      if (timeRemapped === this.data.op) {
        timeRemapped = this.data.op - 1;
      }
      frameNum = timeRemapped;
    } else {
      frameNum = frameNum / this.data.sr;
    }
    for (let i = 0; i < this.childNodes.length; i++) {
      this.childNodes[i].updateFrame(frameNum);
    }
  }

  /**
   * a
   * @param {*} node a
   */
  addChild(node) {
    node.lottieTreeParent = this;
    this.childNodes.push(node);
    this.display.addChild(node.display);
  }
}
