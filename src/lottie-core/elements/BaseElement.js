import KeyframesManager from '../keyframes/KeyframesManager';
import DisplayRegister from '../register/DisplayRegister';

/**
 * a
 */
export default class BaseElement {
  /**
   * a
   * @param {*} layer layer
   */
  constructor(layer) {
    this.data = layer;
    if (this.data.sr === undefined) {
      this.data.sr = 1;
    }
    this.offsetTime = layer.st || 0;
    this.bodymovin = new KeyframesManager(this);
    this.displayType = '';
    this.display = null;
    this.hierarchy = null;

    this.lottieTreeParent = null;
  }

  /**
   * set hierarchy
   * @param {*} elem elem
   */
  setHierarchy(elem) {
    this.hierarchy = elem;
    this.display.setHierarchy(elem.display);
  }

  /**
   * a
   * @param {*} type a
   * @param {*} data a
   * @return {DisplayInstance}
   */
  initDisplayInstance(type, data) {
    const classFn = DisplayRegister.getDisplayByType(type);
    const instance = new classFn(this, data);
    return instance;
  }

  /**
   * a
   * @param {*} frameNum a
   */
  updateFrame(frameNum) {
    this.bodymovin.updateFrame(frameNum);
    this.bodymovin.updateDisplay();
  }
}
