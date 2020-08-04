import Tools from './tools';

/**
 * a
 */
export default class Eventer {
  /**
   * a
   */
  constructor() {
    /**
     * 事件监听列表
     *
     * @member {Object}
     * @private
     */
    this.listeners = {};
  }

  /**
   * 事件对象的事件绑定函数
   *
   * @param {String} type 事件类型
   * @param {Function} fn 回调函数
   * @return {this}
   */
  on(type, fn) {
    if (!Tools.isFunction(fn)) return this;
    if (Tools.isUndefined(this.listeners[type])) this.listeners[type] = [];
    this.listeners[type].push(fn);
    return this;
  }

  /**
   * 事件对象的事件解绑函数
   *
   * @param {String} type 事件类型
   * @param {Function} fn 注册时回调函数的引用
   * @return {this}
   */
  off(type, fn) {
    if (Tools.isUndefined(this.listeners[type])) return this;
    const cbs = this.listeners[type];
    let i = cbs.length;
    if (i > 0) {
      if (fn) {
        while (i--) {
          if (cbs[i] === fn) {
            cbs.splice(i, 1);
          }
        }
      } else {
        cbs.length = 0;
      }
    }
    return this;
  }

  /**
   * 事件对象的一次性事件绑定函数
   *
   * @param {String} type 事件类型
   * @param {Function} fn 回调函数
   * @return {this}
   */
  once(type, fn) {
    if (!Tools.isFunction(fn)) return this;
    const cb = (ev) => {
      fn(ev);
      this.off(type, cb);
    };
    return this.on(type, cb);
  }

  /**
   * 事件对象的触发事件函数
   *
   * @param {String} type 事件类型
   * @param {Object} ev 事件数据
   * @return {this}
   */
  emit(type, ...reset) {
    if (Tools.isUndefined(this.listeners[type])) return this;
    const cbs = this.listeners[type] || [];
    const cache = cbs.slice(0);
    for (let i = 0; i < cache.length; i++) {
      cache[i].apply(this, reset);
    }
    return this;
  }
}
