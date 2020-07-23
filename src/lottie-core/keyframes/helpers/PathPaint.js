import DisplayRegister from '../../register/DisplayRegister';

/**
 * a
 */
export default class PathPaint {
  /**
   * constructor style element
   * @param {*} elem item data
   * @param {*} data item data
   * @param {*} transforms transforms array
   */
  constructor(elem, data, transforms) {
    this.elem = elem;
    this.data = data;
    this.type = data.ty;
    this.preTransforms = transforms;
    this.transforms = [];
    this.elements = [];
    this.closed = data.hd === true;

    this.displayType = DisplayRegister.Type.Path;
    const classFn = DisplayRegister.getDisplayByType(this.displayType);
    this.display = new classFn(this, data);
    this.elem.display.addChild(this.display);
  }

  /**
   * a
   */
  updateGrahpics() {
    this.display.updateLottieGrahpics(this);
  }
}
