import BaseElement from './BaseElement';
import DisplayRegister from '../register/DisplayRegister';

/**
 * a
 */
export default class NullElement extends BaseElement {
  /**
   * a
   * @param {*} layer a
   * @param {*} session a
   */
  constructor(layer, session) {
    super(layer);

    const config = {
      layer,
      session,
    };
    this.config = config;
    this.session = session;

    this.displayType = DisplayRegister.Type.Container;

    this.display = this.initDisplayInstance(this.displayType, config);

    this.bodymovin.initFrame(layer, session);
  }
}
