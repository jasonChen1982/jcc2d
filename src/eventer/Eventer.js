import {Eventer, Tools} from '../lottie-core/index';


/**
 * 事件对象的事件绑定函数
 *
 * @param {String} type 事件类型
 * @param {Function} fn 回调函数
 * @return {this}
 */
Eventer.prototype.on = function(type, fn) {
  if (!Tools.isFunction(fn)) return this;
  if (Tools.isUndefined(this.listeners[type])) this.listeners[type] = [];
  this.listeners[type].push(fn);
  this.interactive = true;
  return this;
};

export {Eventer};
