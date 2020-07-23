import BaseElement from './BaseElement';
import DisplayRegister from '../register/DisplayRegister';

/**
 * a
 */
export default class SolidElement extends BaseElement {
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
      rect: {x: 0, y: 0, width: layer.sw, height: layer.sh},
      color: layer.sc,
    };
    this.config = config;
    this.session = session;

    this.displayType = DisplayRegister.Type.Solid;

    this.display = this.initDisplayInstance(this.displayType, config);

    this.bodymovin.initFrame(layer, session);
  }
}
