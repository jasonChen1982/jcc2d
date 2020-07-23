
/**
 * register class
 * @class
 * @private
 */
class Register {
  /**
   * register
   */
  constructor() {
    this.layers = {};
    // this._forever = false;
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

  // /**
  //  * registe layer
  //  * @private
  //  */
  // forever() {
  //   if (this._forever) return;
  //   this._forever = true;
  // }

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
