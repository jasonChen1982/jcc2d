/**
 * jcc2d的事件对象的类
 *
 * @class
 * @memberof JC
 */
function Eventer() {
  /**
   * 标记当前对象是否为touchstart触发状态
   *
   * @member {Boolean}
   * @private
   */
  // this.touchstarted = false;

  /**
   * 标记当前对象是否为mousedown触发状态
   *
   * @member {Boolean}
   * @private
   */
  // this.mouseDowned = false;

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
 * @param type {String} 事件类型
 * @param fn {Function} 回调函数
 */
Eventer.prototype.on = function(type, fn) {
  this.listeners[type] = this.listeners[type] || [];
  this.listeners[type].push(fn);
};

/**
 * 事件对象的事件解绑函数
 *
 * @param type {String} 事件类型
 * @param fn {Function} 注册时回调函数的引用
 */
Eventer.prototype.off = function(type, fn) {
  var ears = this.listeners;
  var cbs = ears[type];
  var i = ears[type].length;
  if (cbs && i > 0) {
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
};

/**
 * 事件对象的一次性事件绑定函数
 *
 * @param type {String} 事件类型
 * @param fn {Function} 回调函数
 */
Eventer.prototype.once = function(type, fn) {
  var This = this,
    cb = function(ev) {
      if (fn) fn(ev);
      This.off(type, cb);
    };
  this.on(type, cb);
};

/**
 * 事件对象的触发事件函数
 *
 * @param ev {JC.InteractionData} 事件类型
 */
Eventer.prototype.emit = function(type, ev) {
  if (this.listeners === undefined) return;
  var ears = this.listeners;
  var cbs = ears[type];
  if (cbs !== undefined) {
    var length = cbs.length;
    var i;
    for (i = 0; i < length; i++) {
      cbs[i].call(this, ev);
    }
  }
};

export { Eventer };
