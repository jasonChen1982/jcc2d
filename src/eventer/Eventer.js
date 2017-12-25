
/* eslint prefer-rest-params: 0 */

import {Utils} from '../util/Utils';

/**
 * jcc2d的事件对象的类
 *
 * @class
 * @memberof JC
 */
function Eventer() {
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
Eventer.prototype.on = function(type, fn) {
  if (!Utils.isFunction(fn)) return;
  this.interactive = true;
  this.listeners[type] = this.listeners[type] || [];
  this.listeners[type].push(fn);
  return this;
};

/**
 * 事件对象的事件解绑函数
 *
 * @param {String} type 事件类型
 * @param {Function} fn 注册时回调函数的引用
 * @return {this}
 */
Eventer.prototype.off = function(type, fn) {
  if (Utils.isUndefined(this.listeners[type])) return;
  const cbs = this.listeners[type] || [];
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
};

/**
 * 事件对象的一次性事件绑定函数
 *
 * @param {String} type 事件类型
 * @param {Function} fn 回调函数
 * @return {this}
 */
Eventer.prototype.once = function(type, fn) {
  if (!Utils.isFunction(fn)) return;
  const This = this;
  const cb = function(ev) {
    if (fn) fn(ev);
    This.off(type, cb);
  };
  this.on(type, cb);
  return this;
};

/**
 * 事件对象的触发事件函数
 *
 * @param {String} type 事件类型
 * @param {JC.InteractionData} ev 事件数据
 */
Eventer.prototype.emit = function(type) {
  if (Utils.isUndefined(this.listeners[type])) return;
  const cbs = this.listeners[type] || [];
  const cache = cbs.slice(0);
  const reset = [];
  for (let j = 1; j < arguments.length; j++) {
    reset.push(arguments[j]);
  }
  let i;
  for (i = 0; i < cache.length; i++) {
    cache[i].apply(this, reset);
  }
};

export {Eventer};
