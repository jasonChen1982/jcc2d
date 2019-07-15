
/**
 * a
 */
export default class DynamicPropertyContainer {
  /**
   * a
   * @param {*} prop a
   */
  addDynamicProperty(prop) {
    if (this.dynamicProperties.indexOf(prop) === -1) {
      this.dynamicProperties.push(prop);
      this.container.addDynamicProperty(this);
      this._isAnimated = true;
    }
  }

  /**
   * a
   */
  iterateDynamicProperties(frameNum) {
    this._mdf = false;
    const len = this.dynamicProperties.length;
    for (let i = 0; i < len; i += 1) {
      this.dynamicProperties[i].getValue(frameNum);
      if (this.dynamicProperties[i]._mdf) {
        this._mdf = true;
      }
    }
  }

  /**
   * a
   * @param {*} container a
   */
  initDynamicPropertyContainer(container) {
    this.container = container;
    this.dynamicProperties = [];
    this._mdf = false;
    this._isAnimated = false;
  }
}
