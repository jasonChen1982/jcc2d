import {loaderUtil} from '../../utils/Loader';
import {createUrl} from '../common/common';

/**
 * register class
 * @class
 * @private
 */
class Register {
  /**
   * register
   * @param {array} assets assets array
   * @param {string} prefix assets array
   * @param {string} crossOrigin assets array
   */
  constructor(assets, prefix, crossOrigin) {
    this.layers = {};
    this._forever = false;
    this.loader = this.loadAssets(assets, prefix, crossOrigin);
  }

  /**
   * load assets base pixi loader
   * @param {array} assets assets array
   * @param {string} prefix assets array
   * @param {string} crossOrigin assets array
   * @return {loader}
   */
  loadAssets(assets, prefix, crossOrigin) {
    const urls = {};
    assets.filter((it) => {
      return it.u && it.p;
    }).forEach((it) => {
      const url = createUrl(it, prefix);
      urls[it.id] = url;
    });
    return loaderUtil(urls, crossOrigin);
  }

  /**
   * get texture by id
   * @param {string} id id name
   * @return {Texture}
   */
  getTexture(id) {
    return this.loader.getById(id);
  }

  /**
   * registe layer
   * @private
   * @param {string} name layer name path
   * @param {object} layer layer object
   */
  setLayer(name, layer) {
    if (!name) return;
    if (this.layers[name]) console.warn('动画层命名冲突', name);
    this.layers[name] = layer;
  }

  /**
   * registe layer
   * @private
   */
  forever() {
    if (this._forever) return;
    this._forever = true;
  }

  /**
   * get layer by name path
   * @param {string} name layer name path, example: root.gift.star1
   * @return {object}
   */
  getLayer(name) {
    return this.layers[name];
  }
}

export default Register;
