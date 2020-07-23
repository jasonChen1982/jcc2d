import BaseElement from './BaseElement';
import DisplayRegister from '../register/DisplayRegister';
import Tools from '../utils/tools';

/**
 * a
 */
export default class SpriteElement extends BaseElement {
  /**
   * a
   * @param {*} layer a
   * @param {*} session a
   */
  constructor(layer, session) {
    super(layer);

    const {global: {loader, assets}} = session;
    const asset = Tools.getAssets(layer.refId, assets);

    const config = {
      layer,
      session,
      texture: loader.getTextureById(asset.id),
      asset,
    };
    this.config = config;
    this.session = session;

    this.displayType = DisplayRegister.Type.Sprite;

    this.display = this.initDisplayInstance(this.displayType, config);

    this.bodymovin.initFrame(layer, session);
  }
}
