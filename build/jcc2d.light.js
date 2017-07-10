(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.JC = global.JC || {})));
}(this, (function (exports) { 'use strict';

(function () {
  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function (callback) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function () {
        callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }

  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function (id) {
      clearTimeout(id);
    };
  }

  window.RAF = window.requestAnimationFrame;
  window.CAF = window.cancelAnimationFrame;
})();

/**
 * 返回数据类型
 * @param {*} val
 * @return {String} 数据类型
 */
function _rt(val) {
  return Object.prototype.toString.call(val);
}

/**
 * Utils 引擎工具箱
 *
 * @namespace JC.Utils
 */
var Utils = {
  /**
   * 简单拷贝纯数据的JSON对象
   *
   * @static
   * @memberof JC.Utils
   * @param {JSON} json 待拷贝的纯数据JSON
   * @return {JSON} 拷贝后的纯数据JSON
   */
  copyJSON: function copyJSON(json) {
    return JSON.parse(JSON.stringify(json));
  },

  /**
   * 将角度转化成弧度的乘法因子
   *
   * @static
   * @memberof JC.Utils
   * @type {number}
   */
  DTR: Math.PI / 180,

  /**
   * 将弧度转化成角度的乘法因子
   *
   * @static
   * @memberof JC.Utils
   * @type {number}
   */
  RTD: 180 / Math.PI,

  /**
   * 判断变量是否为数组类型
   *
   * @static
   * @method
   * @memberof JC.Utils
   * @param {Array} variable 待判断的变量
   * @return {Boolean} 判断的结果
   */
  isArray: function () {
    var ks = _rt([]);
    return function (variable) {
      return _rt(variable) === ks;
    };
  }(),

  /**
   * 判断变量是否为对象类型
   *
   * @static
   * @method
   * @memberof JC.Utils
   * @param {Object} variable 待判断的变量
   * @return {Boolean} 判断的结果
   */
  isObject: function () {
    var ks = _rt({});
    return function (variable) {
      return _rt(variable) === ks;
    };
  }(),

  /**
   * 判断变量是否为字符串类型
   *
   * @static
   * @method
   * @memberof JC.Utils
   * @param {String} variable 待判断的变量
   * @return {Boolean} 判断的结果
   */
  isString: function () {
    var ks = _rt('s');
    return function (variable) {
      return _rt(variable) === ks;
    };
  }(),

  /**
   * 判断变量是否为数字类型
   *
   * @static
   * @method
   * @memberof JC.Utils
   * @param {Number} variable 待判断的变量
   * @return {Boolean} 判断的结果
   */
  isNumber: function () {
    var ks = _rt(1);
    return function (variable) {
      return _rt(variable) === ks;
    };
  }(),

  /**
   * 判断变量是否为函数类型
   *
   * @static
   * @method
   * @memberof JC.Utils
   * @param {Function} variable 待判断的变量
   * @return {Boolean} 判断的结果
   */
  isFunction: function () {
    var ks = _rt(function () {});
    return function (variable) {
      return _rt(variable) === ks;
    };
  }(),

  /**
   * 判断变量是否为undefined
   *
   * @static
   * @method
   * @memberof JC.Utils
   * @param {Function} variable 待判断的变量
   * @return {Boolean} 判断的结果
   */
  isUndefined: function isUndefined(variable) {
    return typeof variable === 'undefined';
  },

  /**
   * 判断变量是否为布尔型
   *
   * @static
   * @method
   * @memberof JC.Utils
   * @param {Function} variable 待判断的变量
   * @return {Boolean} 判断的结果
   */
  isBoolean: function () {
    var ks = _rt(true);
    return function (variable) {
      return _rt(variable) === ks;
    };
  }(),

  /**
   * 强化的随机数，可以随机产生给定区间内的数字、随机输出数字内的项
   *
   * @static
   * @method
   * @memberof JC.Utils
   * @param {Array | Number} min 当只传入一个变量时变量应该为数字，否则为所给定区间较小的数字
   * @param {Number} max 所给定区间较大的数字
   * @return {ArrayItem | Number} 返回数组中大一项或者给定区间内的数字
   */
  random: function random(min, max) {
    if (this.isArray(min)) return min[~~(Math.random() * min.length)];
    if (!this.isNumber(max)) max = min || 1, min = 0;
    return min + Math.random() * (max - min);
  },

  /**
   * 阿基米德求模
   *
   * @static
   * @method
   * @memberof JC.Utils
   * @param {Number} n 索引
   * @param {Number} m 模
   * @return {Number} 映射到模长内到索引
   */
  euclideanModulo: function euclideanModulo(n, m) {
    return (n % m + m) % m;
  },

  /**
   * 数字区间闭合，避免超出区间
   *
   * @static
   * @method
   * @memberof JC.Utils
   * @param {Number} x 待闭合到值
   * @param {Number} a 闭合区间左边界
   * @param {Number} b 闭合区间右边界
   * @return {Number} 闭合后的值
   */
  clamp: function clamp(x, a, b) {
    return x < a ? a : x > b ? b : x;
  },

  /**
   * 线性插值
   *
   * @static
   * @method
   * @memberof JC.Utils
   * @param {Number} x 输入的值
   * @param {Number} min 输入值的下区间
   * @param {Number} max 输入值的上区间
   * @return {Number} 返回的值在区间[0,1]内
   */
  linear: function linear(x, min, max) {
    if (x <= min) return 0;
    if (x >= max) return 1;
    x = (x - min) / (max - min);
    return x;
  },

  /**
   * 平滑插值
   *
   * @static
   * @method
   * @memberof JC.Utils
   * @param {Number} x 输入的值
   * @param {Number} min 输入值的下区间
   * @param {Number} max 输入值的上区间
   * @return {Number} 返回的值在区间[0,1]内
   */
  smoothstep: function smoothstep(x, min, max) {
    if (x <= min) return 0;
    if (x >= max) return 1;
    x = (x - min) / (max - min);
    return x * x * (3 - 2 * x);
  },

  /**
   * 更平滑的插值
   *
   * @static
   * @method
   * @memberof JC.Utils
   * @param {Number} x 输入的值
   * @param {Number} min 输入值的下区间
   * @param {Number} max 输入值的上区间
   * @return {Number} 返回的值在区间[0,1]内
   */
  smootherstep: function smootherstep(x, min, max) {
    if (x <= min) return 0;
    if (x >= max) return 1;
    x = (x - min) / (max - min);
    return x * x * x * (x * (x * 6 - 15) + 10);
  }
};

/* eslint prefer-rest-params: 0 */

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
 */
Eventer.prototype.on = function (type, fn) {
  if (!Utils.isFunction(fn)) return;
  this.listeners[type] = this.listeners[type] || [];
  this.listeners[type].push(fn);
};

/**
 * 事件对象的事件解绑函数
 *
 * @param {String} type 事件类型
 * @param {Function} fn 注册时回调函数的引用
 */
Eventer.prototype.off = function (type, fn) {
  if (Utils.isUndefined(this.listeners[type])) return;
  var cbs = this.listeners[type] || [];
  var i = cbs.length;
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
};

/**
 * 事件对象的一次性事件绑定函数
 *
 * @param {String} type 事件类型
 * @param {Function} fn 回调函数
 */
Eventer.prototype.once = function (type, fn) {
  if (!Utils.isFunction(fn)) return;
  var This = this;
  var cb = function cb(ev) {
    if (fn) fn(ev);
    This.off(type, cb);
  };
  this.on(type, cb);
};

/**
 * 事件对象的触发事件函数
 *
 * @param {String} type 事件类型
 * @param {JC.InteractionData} ev 事件数据
 */
Eventer.prototype.emit = function (type) {
  if (Utils.isUndefined(this.listeners[type])) return;
  var cbs = this.listeners[type] || [];
  var cache = cbs.slice(0);
  var reset = [];
  for (var j = 1; j < arguments.length; j++) {
    reset.push(arguments[j]);
  }
  var i = void 0;
  for (i = 0; i < cache.length; i++) {
    cache[i].apply(this, reset);
  }
};

/* eslint max-len: "off" */

/**
 * 二维空间内坐标点类
 *
 * @class
 * @memberof JC
 * @param {number} [x=0] x轴的位置
 * @param {number} [y=0] y轴的位置
 * @param {number} [z=0] z轴的位置
 * @param {number} [w=0] w轴的位置
 */
function Point(x, y, z, w) {
  /**
   * @member {number}
   * @default 0
   */
  this.x = x || 0;

  /**
   * @member {number}
   * @default 0
   */
  this.y = y || 0;

  /**
   * @member {number}
   * @default 0
   */
  this.z = z || 0;

  /**
   * @member {number}
   * @default 0
   */
  this.w = w || 0;
}

/**
 * 克隆一这个坐标点
 *
 * @return {JC.Point} 克隆的坐标点
 */
Point.prototype.clone = function () {
  return new Point(this.x, this.y, this.z, this.w);
};

/**
 * 拷贝传入的坐标点来设置当前坐标点
 *
 * @param {JC.Point} p
 */
Point.prototype.copy = function (p) {
  this.set(p.x, p.y, p.z, p.w);
};

/**
 * 设置坐标点
 *
 * @param {number} x 轴的位置
 * @param {number} y 轴的位置
 * @param {number} z 轴的位置
 * @param {number} w 轴的位置
 * @return {Point} this
 */
Point.prototype.set = function (x, y, z, w) {
  this.x = x;
  this.y = y;
  this.z = z;
  this.w = w;
  return this;
};

Point.prototype.add = function (v, w) {
  if (w !== undefined) {
    console.warn('Use .addVectors( a, b ) instead.');
    return this.addVectors(v, w);
  }
  this.x += v.x;
  this.y += v.y;
  this.z += v.z;
  this.w += v.w;
  return this;
};

Point.prototype.addVectors = function (a, b) {
  this.x = a.x + b.x;
  this.y = a.y + b.y;
  this.z = a.z + b.z;
  this.w = a.w + b.w;
  return this;
};

Point.prototype.sub = function (v, w) {
  if (w !== undefined) {
    console.warn('Use .subVectors( a, b ) instead.');
    return this.subVectors(v, w);
  }
  this.x -= v.x;
  this.y -= v.y;
  this.z -= v.z;
  this.w -= v.w;
  return this;
};

Point.prototype.subVectors = function (a, b) {
  this.x = a.x - b.x;
  this.y = a.y - b.y;
  this.z = a.z - b.z;
  this.w = a.w - b.w;
  return this;
};

Point.prototype.lengthSq = function () {
  return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
};

Point.prototype.length = function () {
  return Math.sqrt(this.lengthSq());
};

Point.prototype.normalize = function () {
  return this.divideScalar(this.length());
};

Point.prototype.divideScalar = function (scalar) {
  return this.multiplyScalar(1 / scalar);
};

Point.prototype.distanceTo = function (v) {
  return Math.sqrt(this.distanceToSquared(v));
};

Point.prototype.distanceToSquared = function (v) {
  var dx = this.x - v.x;
  var dy = this.y - v.y;
  var dz = this.z - v.z;
  return dx * dx + dy * dy + dz * dz;
};

Point.prototype.multiplyScalar = function (scalar) {
  if (isFinite(scalar)) {
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;
    this.w *= scalar;
  } else {
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.w = 0;
  }
  return this;
};

Point.prototype.cross = function (v, w) {
  if (w !== undefined) {
    console.warn('Use .crossVectors( a, b ) instead.');
    return this.crossVectors(v, w);
  }

  var x = this.x;
  var y = this.y;
  var z = this.z;

  this.x = y * v.z - z * v.y;
  this.y = z * v.x - x * v.z;
  this.z = x * v.y - y * v.x;

  return this;
};

Point.prototype.crossVectors = function (a, b) {
  var ax = a.x;
  var ay = a.y;
  var az = a.z;
  var bx = b.x;
  var by = b.y;
  var bz = b.z;

  this.x = ay * bz - az * by;
  this.y = az * bx - ax * bz;
  this.z = ax * by - ay * bx;

  return this;
};

/**
 * 事件系统的事件消息对象的基本类型
 *
 * @class
 * @memberof JC
 */
function InteractionData() {
  /**
   * 转换到canvas坐标系统的事件触发点
   *
   * @member {JC.Point}
   */
  this.global = new Point(-100000, -100000);

  /**
   * 事件源
   *
   * @member {JC.DisplayObject}
   */
  this.target = null;

  /**
   * 浏览器的原始事件对象
   *
   * @member {Event}
   */
  this.originalEvent = null;

  /**
   * 在canvas内阻止事件冒泡
   *
   * @member {Boolean}
   */
  this.cancleBubble = false;

  /**
   * canvas视窗和页面坐标的兑换比例
   *
   * @member {Number}
   */
  this.ratio = 1;

  /**
   * 事件类型
   *
   * @member {String}
   */
  this.type = '';
}
InteractionData.prototype.clone = function () {
  var evd = new InteractionData();
  evd.originalEvent = this.originalEvent;
  evd.ratio = this.ratio;

  if (this.touches) {
    evd.touches = [];
    if (this.touches.length > 0) {
      for (var i = 0; i < this.touches.length; i++) {
        evd.touches[i] = {};
        evd.touches[i].global = this.touches[i].global.clone();
      }
      evd.global = evd.touches[0].global;
    }
  } else {
    evd.global = this.global.clone();
  }
  return evd;
};

/* eslint no-cond-assign: "off" */

/**
 * Tween 缓动时间运动函数集合
 *
 * ```js
 * dispay.animate({
 *   from: {x: 100},
 *   to: {x: 200},
 *   ease: 'linear' // 配置要调用的运动函数
 * })
 * ```
 * @namespace JC.Tween
 */

var Tween = {
  /**
   * 匀速运动函数
   *
   * @param {Number} t 当前时间
   * @param {Number} b 起始值
   * @param {Number} c 变化值
   * @param {Number} d 总时间
   * @static
   * @memberof JC.Tween
   * @return {Number} 当前时间对应的值
   */
  linear: function linear(t, b, c, d) {
    return c * t / d + b;
  },

  /**
   * 加速运动函数
   *
   * @param {Number} t 当前时间
   * @param {Number} b 起始值
   * @param {Number} c 变化值
   * @param {Number} d 总时间
   * @static
   * @memberof JC.Tween
   * @return {Number} 当前时间对应的值
   */
  easeIn: function easeIn(t, b, c, d) {
    return c * (t /= d) * t + b;
  },

  /**
   * 减速运动函数
   *
   * @param {Number} t 当前时间
   * @param {Number} b 起始值
   * @param {Number} c 变化值
   * @param {Number} d 总时间
   * @static
   * @memberof JC.Tween
   * @return {Number} 当前时间对应的值
   */
  easeOut: function easeOut(t, b, c, d) {
    return -c * (t /= d) * (t - 2) + b;
  },

  /**
   * 先加速再减速运动函数
   *
   * @param {Number} t 当前时间
   * @param {Number} b 起始值
   * @param {Number} c 变化值
   * @param {Number} d 总时间
   * @static
   * @memberof JC.Tween
   * @return {Number} 当前时间对应的值
   */
  easeBoth: function easeBoth(t, b, c, d) {
    if ((t /= d / 2) < 1) {
      return c / 2 * t * t + b;
    }
    return -c / 2 * (--t * (t - 2) - 1) + b;
  },

  /**
   * 扩展运动函数
   *
   * ```js
   * JC.Tween.extend({
   *   elasticIn: function(t, b, c, d){....},
   *   elasticOut: function(t, b, c, d){....},
   *   ......
   * })
   * ```
   * @param {Number} options 扩展的时间函数
   * @static
   * @memberof JC.Tween
   */
  extend: function extend(options) {
    if (!options) return;
    for (var key in options) {
      if (key !== 'extend' && options[key]) this[key] = options[key];
    }
  }
};

/**
 * 动画对象的基本类型
 *
 * @class
 * @memberof JC
 * @param {object} [options] 动画配置信息
 */
function Animate(options) {
  Eventer.call(this);

  this.element = options.element || {};
  this.duration = options.duration || 300;
  this.living = true;
  this.resident = options.resident || false;

  // this.onCompelete = options.onCompelete || null;
  // this.onUpdate = options.onUpdate || null;

  this.infinite = options.infinite || false;
  this.alternate = options.alternate || false;
  this.repeats = options.repeats || 0;
  this.delay = options.delay || 0;
  this.wait = options.wait || 0;
  this.timeScale = Utils.isNumber(options.timeScale) ? options.timeScale : 1;

  if (options.onCompelete) {
    this.on('compelete', options.onCompelete.bind(this));
  }
  if (options.onUpdate) {
    this.on('update', options.onUpdate.bind(this));
  }

  // this.repeatsCut = this.repeats;
  // this.delayCut = this.delay;
  // this.waitCut = this.wait;
  // this.progress = 0;
  // this.direction = 1;
  this.init();

  this.paused = false;
}

Animate.prototype = Object.create(Eventer.prototype);

/**
 * 更新动画
 * @private
 * @param {number} snippet 时间片段
 * @return {object}
 */
Animate.prototype.update = function (snippet) {
  var snippetCache = this.direction * this.timeScale * snippet;
  if (this.waitCut > 0) {
    this.waitCut -= Math.abs(snippetCache);
    return;
  }
  if (this.paused || !this.living || this.delayCut > 0) {
    if (this.delayCut > 0) this.delayCut -= Math.abs(snippetCache);
    return;
  }

  this.progress = Utils.clamp(this.progress + snippetCache, 0, this.duration);

  var pose = this.nextPose();
  this.emit('update', pose, this.progress / this.duration);
  // if (this.onUpdate) this.onUpdate(pose, this.progress / this.duration);

  if (this.spill()) {
    if (this.repeatsCut > 0 || this.infinite) {
      if (this.repeatsCut > 0) --this.repeatsCut;
      this.delayCut = this.delay;
      if (this.alternate) {
        this.direction *= -1;
      } else {
        this.direction = 1;
        this.progress = 0;
      }
    } else {
      if (!this.resident) this.living = false;
      this.emit('compelete', pose);
    }
  }
  return pose;
};

/**
 * 检查动画是否到了边缘
 * @private
 * @return {boolean}
 */
Animate.prototype.spill = function () {
  var bottomSpill = this.progress <= 0 && this.direction === -1;
  var topSpill = this.progress >= this.duration && this.direction === 1;
  return bottomSpill || topSpill;
};

/**
 * 初始化动画状态
 * @private
 */
Animate.prototype.init = function () {
  this.direction = 1;
  this.progress = 0;
  this.repeatsCut = this.repeats;
  this.delayCut = this.delay;
  this.waitCut = this.wait;
};

/**
 * 下一帧的数据
 * @private
 */
Animate.prototype.nextPose = function () {
  console.warn('should be overwrite');
};

/**
 * 暂停动画
 */
Animate.prototype.pause = function () {
  this.paused = true;
};

/**
 * 恢复动画
 */
Animate.prototype.restart = function () {
  this.paused = false;
};

/**
 * 停止动画，并把状态置为最后一帧，会触发事件
 */
Animate.prototype.stop = function () {
  this.repeats = 0;
  this.infinite = false;
  this.progress = this.duration;
};

/**
 * 设置动画的速率
 * @param {number} speed
 */
Animate.prototype.setSpeed = function (speed) {
  this.timeScale = speed;
};

/**
 * 取消动画，不会触发事件
 */
Animate.prototype.cancle = function () {
  this.living = false;
};

/* eslint guard-for-in: "off" */

/**
 * Transition类型动画对象
 *
 * @class
 * @memberof JC
 * @param {object} [options] 动画所具备的特性
 */
function Transition(options) {
  Animate.call(this, options);

  if (Utils.isObject(options.from)) {
    this.element.setProps(options.from);
  } else {
    options.from = {};
    for (var i in options.to) {
      options.from[i] = this.element[i];
    }
  }
  this.ease = options.ease || 'easeBoth';
  this.from = options.from;
  this.to = options.to;
}
Transition.prototype = Object.create(Animate.prototype);

/**
 * 计算下一帧状态
 * @private
 * @return {object}
 */
Transition.prototype.nextPose = function () {
  var pose = {};
  for (var i in this.to) {
    pose[i] = Tween[this.ease](this.progress, this.from[i], this.to[i] - this.from[i], this.duration);
    if (this.element[i] !== undefined) this.element[i] = pose[i];
  }
  return pose;
};

// import { Point } from './Point';
/**
 * @class
 * @memberof JC
 */
function Curve() {}

Curve.prototype = {

  constructor: Curve,

  getPoint: function getPoint(t) {
    console.warn('Curve: Warning, getPoint() not implemented!', t);
    return null;
  },

  getPointAt: function getPointAt(u) {
    var t = this.getUtoTmapping(u);
    return this.getPoint(t);
  },

  getPoints: function getPoints(divisions) {
    if (isNaN(divisions)) divisions = 5;

    var points = [];

    for (var d = 0; d <= divisions; d++) {
      points.push(this.getPoint(d / divisions));
    }

    return points;
  },

  getSpacedPoints: function getSpacedPoints(divisions) {
    if (isNaN(divisions)) divisions = 5;

    var points = [];

    for (var d = 0; d <= divisions; d++) {
      points.push(this.getPointAt(d / divisions));
    }

    return points;
  },

  getLength: function getLength() {
    var lengths = this.getLengths();
    return lengths[lengths.length - 1];
  },

  getLengths: function getLengths(divisions) {
    if (isNaN(divisions)) divisions = this.__arcLengthDivisions ? this.__arcLengthDivisions : 200;

    if (this.cacheArcLengths && this.cacheArcLengths.length === divisions + 1 && !this.needsUpdate) {
      return this.cacheArcLengths;
    }

    this.needsUpdate = false;

    var cache = [];
    var current = void 0;
    var last = this.getPoint(0);
    var p = void 0;
    var sum = 0;

    cache.push(0);

    for (p = 1; p <= divisions; p++) {
      current = this.getPoint(p / divisions);
      sum += current.distanceTo(last);
      cache.push(sum);
      last = current;
    }
    this.cacheArcLengths = cache;
    return cache;
  },

  updateArcLengths: function updateArcLengths() {
    this.needsUpdate = true;
    this.getLengths();
  },

  getUtoTmapping: function getUtoTmapping(u, distance) {
    var arcLengths = this.getLengths();

    var i = 0;
    var il = arcLengths.length;
    var t = void 0;

    var targetArcLength = void 0;

    if (distance) {
      targetArcLength = distance;
    } else {
      targetArcLength = u * arcLengths[il - 1];
    }

    var low = 0;
    var high = il - 1;
    var comparison = void 0;
    while (low <= high) {
      i = Math.floor(low + (high - low) / 2);
      comparison = arcLengths[i] - targetArcLength;
      if (comparison < 0) {
        low = i + 1;
      } else if (comparison > 0) {
        high = i - 1;
      } else {
        high = i;
        break;
      }
    }

    i = high;

    if (arcLengths[i] === targetArcLength) {
      t = i / (il - 1);
      return t;
    }

    var lengthBefore = arcLengths[i];
    var lengthAfter = arcLengths[i + 1];

    var segmentLength = lengthAfter - lengthBefore;

    var segmentFraction = (targetArcLength - lengthBefore) / segmentLength;

    t = (i + segmentFraction) / (il - 1);

    return t;
  },

  getTangent: function getTangent(t) {
    var delta = 0.0001;
    var t1 = t - delta;
    var t2 = t + delta;

    // TODO: svg and bezier accept out of [0, 1] value
    // if ( t1 < 0 ) t1 = 0;
    // if ( t2 > 1 ) t2 = 1;

    var pt1 = this.getPoint(t1);
    var pt2 = this.getPoint(t2);

    var vec = pt2.clone().sub(pt1);
    return vec.normalize();
  },

  getTangentAt: function getTangentAt(u) {
    var t = this.getUtoTmapping(u);
    return this.getTangent(t);
  }

};

/**
 * PathMotion类型动画对象
 *
 * @class
 * @memberof JC
 * @param {object} [options] 动画所具备的特性
 */
function PathMotion(options) {
  Animate.call(this, options);
  if (!options.path || !(options.path instanceof Curve)) {
    console.warn('path is not instanceof Curve');
  }

  this.path = options.path;
  this.ease = options.ease || 'easeBoth';
  this.attachTangent = options.attachTangent || false;
  this._cacheRotate = this.element.rotation;
  var radian = this._cacheRotate * Utils.DTR;
  this._cacheVector = new Point(10 * Math.cos(radian), 10 * Math.sin(radian));
}

PathMotion.prototype = Object.create(Animate.prototype);

/**
 * 计算下一帧状态
 * @private
 * @return {object}
 */
PathMotion.prototype.nextPose = function () {
  var _rotate = 0;
  var t = Tween[this.ease](this.progress, 0, 1, this.duration);
  var pos = this.path.getPoint(t);
  var pose = pos.clone();

  if (this.attachTangent) {
    _rotate = this.decomposeRotate(t);
    pose.rotation = _rotate === false ? this.preDegree : _rotate;
    pose.rotation += this._cacheRotate;
    if (_rotate !== false) this.preDegree = _rotate;
  }
  this.element.setProps(pose);
  return pose;
};

/**
 * 解算旋转角度
 * @private
 * @param {number} t 当前进度, 区间[0, 1]
 * @return {number}
 */
PathMotion.prototype.decomposeRotate = function (t) {
  var vector = this.path.getTangent(t);

  var nor = this._cacheVector.x * vector.y - vector.x * this._cacheVector.y;
  var pi = nor > 0 ? 1 : -1;
  var cos = (vector.x * this._cacheVector.x + vector.y * this._cacheVector.y) / (Math.sqrt(vector.x * vector.x + vector.y * vector.y) * Math.sqrt(this._cacheVector.x * this._cacheVector.x + this._cacheVector.y * this._cacheVector.y));
  if (isNaN(cos)) return false;
  return pi * Math.acos(cos) * Utils.RTD;
};

/**
 *
 * @class
 * @memberof JC
 * @param {Array}  points  array of points
 */
function BezierCurve(points) {
  this.points = points;
}

BezierCurve.prototype = Object.create(Curve.prototype);

BezierCurve.prototype.getPoint = function (t, points) {
  var a = points || this.points;
  var len = a.length;
  var rT = 1 - t;
  var l = a.slice(0, len - 1);
  var r = a.slice(1);
  var oP = new Point();
  if (len > 3) {
    var oL = this.getPoint(t, l);
    var oR = this.getPoint(t, r);
    oP.x = rT * oL.x + t * oR.x;
    oP.y = rT * oL.y + t * oR.y;
    return oP;
  } else {
    oP.x = rT * rT * a[0].x + 2 * t * rT * a[1].x + t * t * a[2].x;
    oP.y = rT * rT * a[0].y + 2 * t * rT * a[1].y + t * t * a[2].y;
    return oP;
  }
};

/**
 * https://github.com/gre/bezier-easing
 * BezierEasing - use bezier curve for transition easing function
 * by Gaëtan Renaudeau 2014 - 2015 – MIT License
 */

var NEWTON_ITERATIONS = 4;
var NEWTON_MIN_SLOPE = 0.001;
var SUBDIVISION_PRECISION = 0.0000001;
var SUBDIVISION_MAX_ITERATIONS = 10;

var kSplineTableSize = 11;
var kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);

var float32ArraySupported = typeof Float32Array === 'function';

/* eslint new-cap: 0 */

/**
 * 公因式A
 *
 * @param {number} aA1 控制分量
 * @param {number} aA2 控制分量
 * @return {number} 整个公式中的A公因式的值
 */
function A(aA1, aA2) {
  return 1.0 - 3.0 * aA2 + 3.0 * aA1;
}

/**
 * 公因式B
 *
 * @param {number} aA1 控制分量1
 * @param {number} aA2 控制分量2
 * @return {number} 整个公式中的B公因式的值
 */
function B(aA1, aA2) {
  return 3.0 * aA2 - 6.0 * aA1;
}

/**
 * 公因式C
 *
 * @param {number} aA1 控制分量1
 * @param {number} aA2 控制分量2
 * @return {number} 整个公式中的C公因式的值
 */
function C(aA1) {
  return 3.0 * aA1;
}

/**
 * 获取aT处的值
 *
 * @param {number} aT 三次贝塞尔曲线的t自变量
 * @param {number} aA1 控制分量1
 * @param {number} aA2 控制分量2
 * @return {number} 三次贝塞尔公式的因变量
 */
function calcBezier(aT, aA1, aA2) {
  return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT;
}

/**
 * 获取aT处的斜率
 * @param {number} aT 三次贝塞尔曲线的t自变量
 * @param {number} aA1 控制分量1
 * @param {number} aA2 控制分量2
 * @return {number} 三次贝塞尔公式的导数
 */
function getSlope(aT, aA1, aA2) {
  return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1);
}

/**
 *
 * @param {number} aX
 * @param {number} aA
 * @param {number} aB
 * @param {number} mX1
 * @param {number} mX2
 * @return {number} 三次贝塞尔公式的导数
 */
function binarySubdivide(aX, aA, aB, mX1, mX2) {
  var currentX = void 0;
  var currentT = void 0;
  var i = 0;
  do {
    currentT = aA + (aB - aA) / 2.0;
    currentX = calcBezier(currentT, mX1, mX2) - aX;
    if (currentX > 0.0) {
      aB = currentT;
    } else {
      aA = currentT;
    }
  } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);
  return currentT;
}

/**
 * 牛顿迭代算法，进一步的获取精确的T值
 * @param {number} aX
 * @param {number} aGuessT
 * @param {number} mX1
 * @param {number} mX2
 * @return {number} 获取更精确的T值
 */
function newtonRaphsonIterate(aX, aGuessT, mX1, mX2) {
  for (var i = 0; i < NEWTON_ITERATIONS; ++i) {
    var currentSlope = getSlope(aGuessT, mX1, mX2);
    if (currentSlope === 0.0) {
      return aGuessT;
    }
    var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
    aGuessT -= currentX / currentSlope;
  }
  return aGuessT;
}

/**
 * cubic-bezier曲线的两个控制点，默认起始点为 0，结束点为 1
 *
 * @class
 * @memberof JC
 * @param {number} mX1 控制点1的x分量
 * @param {number} mY1 控制点1的y分量
 * @param {number} mX2 控制点2的x分量
 * @param {number} mY2 控制点2的y分量
 */
function BezierEasing(mX1, mY1, mX2, mY2) {
  if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) {
    throw new Error('bezier x values must be in [0, 1] range');
  }
  this.mX1 = mX1;
  this.mY1 = mY1;
  this.mX2 = mX2;
  this.mY2 = mY2;
  this.sampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);

  this._preCompute();
}

BezierEasing.prototype._preCompute = function () {
  // Precompute samples table
  if (this.mX1 !== this.mY1 || this.mX2 !== this.mY2) {
    for (var i = 0; i < kSplineTableSize; ++i) {
      this.sampleValues[i] = calcBezier(i * kSampleStepSize, this.mX1, this.mX2);
    }
  }
};

BezierEasing.prototype._getTForX = function (aX) {
  var intervalStart = 0.0;
  var currentSample = 1;
  var lastSample = kSplineTableSize - 1;

  for (; currentSample !== lastSample && this.sampleValues[currentSample] <= aX; ++currentSample) {
    intervalStart += kSampleStepSize;
  }
  --currentSample;

  // Interpolate to provide an initial guess for t
  var dist = (aX - this.sampleValues[currentSample]) / (this.sampleValues[currentSample + 1] - this.sampleValues[currentSample]);
  var guessForT = intervalStart + dist * kSampleStepSize;

  var initialSlope = getSlope(guessForT, this.mX1, this.mX2);
  if (initialSlope >= NEWTON_MIN_SLOPE) {
    return newtonRaphsonIterate(aX, guessForT, this.mX1, this.mX2);
  } else if (initialSlope === 0.0) {
    return guessForT;
  } else {
    return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, this.mX1, this.mX2);
  }
};

/**
 * 通过x轴近似获取y的值
 *
 * @param {number} x x轴的偏移量
 * @return {number} y 与输入值x对应的y值
 */
BezierEasing.prototype.get = function (x) {
  if (this.mX1 === this.mY1 && this.mX2 === this.mY2) return x;
  if (x === 0) {
    return 0;
  }
  if (x === 1) {
    return 1;
  }
  return calcBezier(this._getTForX(x), this.mY1, this.mY2);
};

var bezierPool = {};

/**
 * 准备好贝塞尔曲线
 * @param {number} mX1 控制点1的x分量
 * @param {number} mY1 控制点1的y分量
 * @param {number} mX2 控制点2的x分量
 * @param {number} mY2 控制点2的y分量
 * @param {string} nm 控制点命名
 * @return {BezierEasing}
 */
function prepareEaseing(mX1, mY1, mX2, mY2, nm) {
  var str = nm || [mX2, mY2, mX1, mY1].join('_').replace(/\./g, 'p');
  if (bezierPool[str]) {
    return bezierPool[str];
  }
  var bezEasing = new BezierEasing(mX1, mY1, mX2, mY2);
  bezierPool[str] = bezEasing;
}

/**
 * 根据进度获取到普通插值
 * @param {number} s  插值起始端点
 * @param {number} e  插值结束端点
 * @param {array}  nm 贝塞尔曲线的名字
 * @param {number} p  插值进度
 * @return {array}
 */
function getEaseing(s, e, nm, p) {
  var value = [];
  for (var i = 0; i < s.length; i++) {
    var rate = bezierPool[nm[i]].get(p);
    var v = e[i] - s[i];
    value[i] = s[i] + v * rate;
  }
  return value;
}

/**
 *
 * @param {BezierCurve} curve
 * @param {string} nm
 * @param {number} p
 * @return {Point}
 */
function getEaseingPath(curve, nm, p) {
  var rate = bezierPool[nm].get(p);
  var point = curve.getPointAt(rate);
  return [point.x, point.y, point.z];
}

/* eslint guard-for-in: "off" */

var PM = {
  o: {
    label: 'alpha',
    scale: 0.01
  },
  r: {
    label: 'rotation',
    scale: 1
  },
  p: {
    label: ['x', 'y'],
    scale: 1
  },
  a: {
    label: ['pivotX', 'pivotY'],
    scale: 1
  },
  s: {
    label: ['scaleX', 'scaleY'],
    scale: 0.01
  }
};

/**
 * 判断数值是否在(min, max]区间内
 * @param {number} v   待比较的值
 * @param {number} min 最小区间
 * @param {number} max 最大区间
 * @return {boolean} 是否在(min, max]区间内
 */
function inRange(v, min, max) {
  return v > min && v <= max;
}

/**
 * 判断当前进度在哪一帧内
 * @param {array} steps 帧数组
 * @param {number} progress 当前进度
 * @param {number} rfr 每一帧的时间
 * @return {number} 当前进度停留在第几帧
 */
function findStep(steps, progress, rfr) {
  var last = steps.length - 1;
  for (var i = 0; i < last; i++) {
    var step = steps[i];
    if (inRange(progress, step.t * rfr, step.jcet * rfr)) {
      return i;
    }
  }
}

/**
 * KeyFrames类型动画对象
 *
 * @class
 * @memberof JC
 * @param {object} [options] 动画配置信息
 */
function KeyFrames(options) {
  Animate.call(this, options);

  this.keys = options.ks;
  this.aks = {};
  this.fr = this.keys.fr || 30;
  this.rfr = 1000 / this.fr;
  this.iip = this.keys.ip;
  this.ip = options.ip === undefined ? this.keys.ip : options.ip;
  this.op = options.op === undefined ? this.keys.op : options.op;

  this.tfs = Math.floor(this.op - this.ip);
  this.duration = this.tfs * this.rfr;

  this.keyState = {};

  this.preParser(Utils.copyJSON(options.ks));
}
KeyFrames.prototype = Object.create(Animate.prototype);

/**
 * 预解析关键帧
 * @private
 * @param {object} keys 关键帧配置
 */
KeyFrames.prototype.preParser = function (keys) {
  var ks = keys.ks;
  for (var key in ks) {
    if (ks[key].a) {
      this.prepareDynamic(ks, key);
    } else {
      this.prepareStatic(ks, key);
    }
  }
};

/**
 * 预解析动态属性的关键帧
 * @private
 * @param {object} ks 关键帧配置
 * @param {string} key 所属的属性
 */
KeyFrames.prototype.prepareDynamic = function (ks, key) {
  this.aks[key] = ks[key];
  var k = ks[key].k;
  var et = k[k.length - 1].t;
  var st = k[0].t;

  this.aks[key].jcet = et;
  this.aks[key].jcst = st;
  for (var i = 0; i < k.length; i++) {
    var now = k[i];
    var next = k[i + 1];
    if (next) {
      now.jcet = next.t;
      if (Utils.isString(now.n) && now.ti && now.to) {
        prepareEaseing(now.o.x, now.o.y, now.i.x, now.i.y);
        var s = new Point(now.s[0], now.s[1]);
        var e = new Point(now.e[0], now.e[1]);
        var ti = new Point(now.ti[0], now.ti[1]);
        var to = new Point(now.to[0], now.to[1]);
        var c1 = new Point(now.s[0], now.s[1]);
        var c2 = new Point(now.e[0], now.e[1]);
        now.curve = new BezierCurve([s, c1.add(ti), c2.add(to), e]);
      } else {
        for (var _i = 0; _i < now.n.length; _i++) {
          prepareEaseing(now.o.x[_i], now.o.y[_i], now.i.x[_i], now.i.y[_i]);
        }
      }
    }
  }
};

/**
 * 预解析静态属性的关键帧
 * @private
 * @param {object} ks 关键帧配置
 * @param {string} key 所属的属性
 */
KeyFrames.prototype.prepareStatic = function (ks, key) {
  var prop = PM[key].label;
  var scale = PM[key].scale;
  var k = 0;
  if (Utils.isString(prop)) {
    if (Utils.isNumber(ks[key].k)) {
      k = ks[key].k;
    }
    if (Utils.isArray(ks[key].k)) {
      k = ks[key].k[0];
    }
    this.element[prop] = scale * k;
  } else if (Utils.isArray(prop)) {
    for (var i = 0; i < prop.length; i++) {
      k = ks[key].k[i];
      this.element[prop[i]] = scale * k;
    }
  }
};

/**
 * 计算下一帧状态
 * @private
 * @return {object}
 */
KeyFrames.prototype.nextPose = function () {
  var pose = {};
  for (var key in this.aks) {
    var ak = this.aks[key];
    pose[key] = this.interpolation(key, ak);
  }
  return pose;
};

/**
 * 预计算关键帧属性值
 * @private
 * @param {string} key 关键帧配置
 * @param {object} ak 所属的属性
 * @return {array}
 */
KeyFrames.prototype.prepare = function (key, ak) {
  var k = ak.k;
  var rfr = this.rfr;
  var progress = Utils.clamp(this.progress, 0, ak.jcet * rfr);
  var skt = ak.jcst * rfr;
  var ekt = ak.jcet * rfr;
  var last = k.length - 2;
  var invisible = progress < this.iip * rfr;
  if (invisible === this.element.visible) this.element.visible = !invisible;

  if (progress <= skt) {
    return k[0].s;
  } else if (progress >= ekt) {
    return k[last].e;
  } else {
    var ck = this.keyState[key];
    if (!Utils.isNumber(ck) || !inRange(progress, k[ck].t * rfr, k[ck].jcet * rfr)) {
      ck = this.keyState[key] = findStep(k, progress, rfr);
    }
    var frame = k[ck];
    var rate = (progress / rfr - frame.t) / (frame.jcet - frame.t);
    if (frame.curve) {
      return getEaseingPath(frame.curve, frame.n, rate);
    } else {
      return getEaseing(frame.s, frame.e, frame.n, rate);
    }
  }
};

/**
 * 进行插值计算
 * @private
 * @param {string} key 属性
 * @param {object} ak 属性配置
 * @return {array}
 */
KeyFrames.prototype.interpolation = function (key, ak) {
  var value = this.prepare(key, ak);
  this.setValue(key, value);
  return value;
};

/**
 * 更新元素的属性值
 * @private
 * @param {string} key 属性
 * @param {array} value 属性值
 */
KeyFrames.prototype.setValue = function (key, value) {
  var prop = PM[key].label;
  var scale = PM[key].scale;
  if (Utils.isString(prop)) {
    this.element[prop] = scale * value[0];
  } else if (Utils.isArray(prop)) {
    for (var i = 0; i < prop.length; i++) {
      var v = value[i];
      this.element[prop[i]] = scale * v;
    }
  }
};

/**
 * AnimateRunner类型动画类
 *
 * @class
 * @memberof JC
 * @param {object} [options] 动画配置信息
 */
function AnimateRunner(options) {
  Animate.call(this, options);

  this.runners = options.runners;
  this.cursor = 0;
  this.queues = [];
  this.alternate = false;

  this.length = this.runners.length;
}
AnimateRunner.prototype = Object.create(Animate.prototype);

/**
 * 更新下一个`runner`
 * @private
 */
AnimateRunner.prototype.nextRunner = function () {
  this.queues[this.cursor].init();
  this.cursor += this.direction;
};

/**
 * 初始化当前`runner`
 * @private
 */
AnimateRunner.prototype.initRunner = function () {
  var runner = this.runners[this.cursor];
  runner.infinite = false;
  runner.resident = true;
  runner.element = this.element;
  // runner.onCompelete = this.nextRunner.bind(this);
  var animate = null;
  if (runner.path) {
    animate = new PathMotion(runner);
  } else if (runner.to) {
    animate = new Transition(runner);
  }
  if (animate !== null) {
    animate.on('compelete', this.nextRunner.bind(this));
    this.queues.push(animate);
  }
};

/**
 * 下一帧的状态
 * @private
 * @param {number} snippetCache 时间片段
 * @return {object}
 */
AnimateRunner.prototype.nextPose = function (snippetCache) {
  if (!this.queues[this.cursor] && this.runners[this.cursor]) {
    this.initRunner();
  }
  return this.queues[this.cursor].update(snippetCache);
};

/**
 * 更新动画数据
 * @private
 * @param {number} snippet 时间片段
 * @return {object}
 */
AnimateRunner.prototype.update = function (snippet) {
  if (this.wait > 0) {
    this.wait -= Math.abs(snippet);
    return;
  }
  if (this.paused || !this.living || this.delayCut > 0) {
    if (this.delayCut > 0) this.delayCut -= Math.abs(snippet);
    return;
  }

  var cc = this.cursor;

  var pose = this.nextPose(this.direction * this.timeScale * snippet);
  // if (this.onUpdate) this.onUpdate({
  //   index: cc, pose: pose,
  // }, this.progress / this.duration);
  this.emit('update', {
    index: cc, pose: pose
  }, this.progress / this.duration);

  if (this.spill()) {
    if (this.repeats > 0 || this.infinite) {
      if (this.repeats > 0) --this.repeats;
      this.delayCut = this.delay;
      this.direction = 1;
      this.cursor = 0;
    } else {
      if (!this.resident) this.living = false;
      // if (this.onCompelete) this.onCompelete(pose);
      this.emit('compelete', pose);
    }
  }
  return pose;
};

/**
 * 检查动画是否到了边缘
 * @private
 * @return {boolean}
 */
AnimateRunner.prototype.spill = function () {
  var bottomSpill = this.cursor <= 0 && this.direction === -1;
  var topSpill = this.cursor >= this.length && this.direction === 1;
  return bottomSpill || topSpill;
};

/**
 * Animation类型动画类，该类上的功能将以`add-on`的形势增加到`DisplayObject`上
 *
 * @class
 * @memberof JC
 * @param {JC.DisplayObject} element
 */
function Animation(element) {
  this.element = element;

  /**
   * 自身当前动画队列
   *
   * @member {array}
   */
  this.animates = [];

  /**
   * 自身及后代动画的缩放比例
   *
   * @member {number}
   */
  this.timeScale = 1;

  /**
   * 是否暂停自身的动画
   *
   * @member {Boolean}
   */
  this.paused = false;
}

/**
 * 更新动画数据
 * @private
 * @param {number} snippet 时间片段
 */
Animation.prototype.update = function (snippet) {
  if (this.paused) return;
  snippet = this.timeScale * snippet;
  var cache = this.animates.slice(0);
  for (var i = 0; i < cache.length; i++) {
    if (!cache[i].living && !cache[i].resident) {
      this.animates.splice(i, 1);
    }
    cache[i].update(snippet);
  }
};

/**
 * 创建一个`animate`动画
 * @private
 * @param {object} options 动画配置
 * @param {boolean} clear 是否清除之前的动画
 * @return {JC.Transition}
 */
Animation.prototype.animate = function (options, clear) {
  options.element = this.element;
  return this._addMove(new Transition(options), clear);
};

/**
 * 创建一个`motion`动画
 * @private
 * @param {object} options 动画配置
 * @param {boolean} clear 是否清除之前的动画
 * @return {JC.PathMotion}
 */
Animation.prototype.motion = function (options, clear) {
  options.element = this.element;
  return this._addMove(new PathMotion(options), clear);
};

/**
 * 创建一个`runners`动画
 * @private
 * @param {object} options 动画配置
 * @param {boolean} clear 是否清除之前的动画
 * @return {JC.AnimateRunner}
 */
Animation.prototype.runners = function (options, clear) {
  options.element = this.element;
  return this._addMove(new AnimateRunner(options), clear);
};

/**
 * 创建一个`keyFrames`动画
 * @private
 * @param {object} options 动画配置
 * @param {boolean} clear 是否清除之前的动画
 * @return {JC.KeyFrames}
 */
Animation.prototype.keyFrames = function (options, clear) {
  options.element = this.element;
  return this._addMove(new KeyFrames(options), clear);
};

/**
 * 添加到动画队列
 * @private
 * @param {object} animate 创建出来的动画对象
 * @param {boolean} clear 是否清除之前的动画
 * @return {JC.KeyFrames|JC.AnimateRunner|JC.PathMotion|JC.Transition}
 */
Animation.prototype._addMove = function (animate, clear) {
  if (clear) this.clear();
  this.animates.push(animate);
  return animate;
};

/**
 * 暂停动画组
 */
Animation.prototype.pause = function () {
  this.paused = true;
};

/**
 * 恢复动画组
 */
Animation.prototype.restart = function () {
  this.paused = false;
};

/**
 * 设置动画组的播放速率
 * @param {number} speed
 */
Animation.prototype.setSpeed = function (speed) {
  this.timeScale = speed;
};

/**
 * 清除动画队列
 * @private
 */
Animation.prototype.clear = function () {
  this.animates.length = 0;
};

/* eslint guard-for-in: "off" */

var URL = 'url';
var IMG = 'img';

/**
 * 图片纹理类
 *
 * @class
 * @memberof JC
 * @param {string | Image} img 图片url或者图片对象.
 * @param {object} options 图片配置
 * @param {boolean} [options.lazy] 图片是否需要懒加载
 * @param {string} [options.crossOrigin] 图片是否配置跨域
 * @extends JC.Eventer
 */
function Texture(img, options) {
  Eventer.call(this);
  options = options || {};

  var isImg = img instanceof Image || img.nodeName === 'IMG';
  this.type = Utils.isString(img) ? URL : isImg ? IMG : console.warn('not support asset');

  this.crossOrigin = options.crossOrigin;
  this.texture = null;
  this.width = 0;
  this.height = 0;
  this.naturalWidth = 0;
  this.naturalHeight = 0;
  this.loaded = false;
  this.hadload = false;
  this.src = img;

  this.resole(img);

  if (!options.lazy || this.type === IMG) this.load(img);
}
Texture.prototype = Object.create(Eventer.prototype);

/**
 * 预先处理一些数据
 *
 * @static
 * @param {string | Image} img 先生成对应的对象
 * @private
 */
Texture.prototype.resole = function (img) {
  var This = this;
  if (this.type === URL) {
    this.texture = new Image();
  } else if (this.type === IMG) {
    this.texture = img;
  }
  this.on('load', function () {
    This.update();
  });
};

/**
 * 尝试加载图片
 *
 * @static
 * @param {string | Image} img 图片url或者图片对象.
 * @private
 */
Texture.prototype.load = function (img) {
  if (this.hadload) return;
  this.hadload = true;
  img = img || this.src;
  if (this.type === URL) {
    this.fromURL(img);
  } else if (this.type === IMG) {
    if (this.texture.naturalWidth > 0 && this.texture.naturalHeight > 0) {
      this.loaded = true;
      this.update();
    } else {
      this.fromIMG(img);
    }
  }
};

Texture.prototype.fromURL = function (url) {
  if (!Utils.isUndefined(this.crossOrigin)) {
    this.texture.crossOrigin = this.crossOrigin;
  }
  this.listen(this.texture);
  this.texture.src = url;
};

Texture.prototype.fromIMG = function (img) {
  this.listen(img);
};

Texture.prototype.listen = function (img) {
  var This = this;
  img.addEventListener('load', function () {
    This.loaded = true;
    This.emit('load');
  });
  img.addEventListener('error', function () {
    This.emit('error');
  });
};

Texture.prototype.update = function () {
  this.width = this.texture.width;
  this.height = this.texture.height;
  this.naturalWidth = this.texture.naturalWidth;
  this.naturalHeight = this.texture.naturalHeight;
};

/**
 * 图片资源加载器
 *
 * @class
 * @namespace JC.Loader
 * @extends JC.Eventer
 */
function Loader() {
  Eventer.call(this);
  this.textures = {};
  this._total = 0;
  this._failed = 0;
  this._received = 0;
}
Loader.prototype = Object.create(Eventer.prototype);

/**
 * 开始加载资源
 *
 * ```js
 * var loadBox = new JC.Loader();
 * loadBox.load({
 *     aaa: 'img/xxx.png',
 *     bbb: 'img/yyy.png',
 *     ccc: 'img/zzz.png'
 * });
 * ```
 *
 * @param {object} srcMap 配置了key－value的json格式数据
 * @return {JC.Loader} 返回本实例对象
 */
Loader.prototype.load = function (srcMap) {
  var This = this;
  this._total = 0;
  this._failed = 0;
  this._received = 0;

  for (var src in srcMap) {
    this._total++;
    this.textures[src] = new Texture(srcMap[src]);
    bind(this.textures[src]);
  }

  /**
   * @param {Texture} texture
   */
  function bind(texture) {
    texture.on('load', function () {
      This._received++;
      This.emit('update');
      if (This._received + This._failed >= This._total) This.emit('compelete');
    });
    texture.on('error', function () {
      This._failed++;
      This.emit('update');
      if (This._received + This._failed >= This._total) This.emit('compelete');
    });
  }
  return this;
};

/**
 * 从纹理图片盒子里面通过id获取纹理图片
 *
 * ```js
 * var texture = loadBox.getById('id');
 * ```
 *
 * @param {string} id 之前加载时配置的key值
 * @return {JC.Texture} 包装出来的JC.Texture对象
 */
Loader.prototype.getById = function (id) {
  return this.textures[id];
};

/**
 * 获取资源加载的进度
 *
 * @member progress
 * @property progress {number} 0至1之间的值
 * @memberof JC.Loader
 */
Object.defineProperty(Texture.prototype, 'progress', {
  get: function get() {
    return this._total === 0 ? 1 : (this._received + this._failed) / this._total;
  }
});

/**
 * 资源加载工具
 *
 * @function
 * @memberof JC
 * @param {object} srcMap key-src map
 * @return {JC.Loader}
 */
var loaderUtil = function loaderUtil(srcMap) {
  return new Loader().load(srcMap);
};

/**
 * 矩阵对象，用来描述和记录对象的tansform 状态信息
 *
 * @class
 * @memberof JC
 */
function Matrix() {
  this.a = 1;
  this.b = 0;
  this.c = 0;
  this.d = 1;
  this.tx = 0;
  this.ty = 0;
}

/**
 * 从数组设置一个矩阵
 *
 * @param {array} array
 */
Matrix.prototype.fromArray = function (array) {
  this.a = array[0];
  this.b = array[1];
  this.c = array[3];
  this.d = array[4];
  this.tx = array[2];
  this.ty = array[5];
};

/**
 * 将对象的数据以数组的形式导出
 *
 * @param {boolean} transpose 是否对矩阵进行转置
 * @return {number[]} 返回数组
 */
Matrix.prototype.toArray = function (transpose) {
  if (!this.array) this.array = new Float32Array(9);
  var array = this.array;

  if (transpose) {
    array[0] = this.a;
    array[1] = this.b;
    array[2] = 0;
    array[3] = this.c;
    array[4] = this.d;
    array[5] = 0;
    array[6] = this.tx;
    array[7] = this.ty;
    array[8] = 1;
  } else {
    array[0] = this.a;
    array[1] = this.c;
    array[2] = this.tx;
    array[3] = this.b;
    array[4] = this.d;
    array[5] = this.ty;
    array[6] = 0;
    array[7] = 0;
    array[8] = 1;
  }
  return array;
};

/**
 * 将坐标点与矩阵左乘
 *
 * @param {object} pos 原始点
 * @param {object} newPos 变换之后的点
 * @return {object} 返回数组
 */
Matrix.prototype.apply = function (pos, newPos) {
  newPos = newPos || {};
  newPos.x = this.a * pos.x + this.c * pos.y + this.tx;
  newPos.y = this.b * pos.x + this.d * pos.y + this.ty;
  return newPos;
};
/**
 * 将坐标点与转置矩阵左乘
 *
 * @param {object} pos 原始点
 * @param {object} newPos 变换之后的点
 * @return {object} 变换之后的点
 */
Matrix.prototype.applyInverse = function (pos, newPos) {
  var id = 1 / (this.a * this.d + this.c * -this.b);
  newPos.x = this.d * id * pos.x + -this.c * id * pos.y + (this.ty * this.c - this.tx * this.d) * id;
  newPos.y = this.a * id * pos.y + -this.b * id * pos.x + (-this.ty * this.a + this.tx * this.b) * id;
  return newPos;
};
/**
 * 位移操作
 * @param {number} x
 * @param {number} y
 * @return {this}
 */
Matrix.prototype.translate = function (x, y) {
  this.tx += x;
  this.ty += y;
  return this;
};
/**
 * 缩放操作
 * @param {number} x
 * @param {number} y
 * @return {this}
 */
Matrix.prototype.scale = function (x, y) {
  this.a *= x;
  this.d *= y;
  this.c *= x;
  this.b *= y;
  this.tx *= x;
  this.ty *= y;
  return this;
};
/**
 * 旋转操作
 * @param {number} angle
 * @return {this}
 */
Matrix.prototype.rotate = function (angle) {
  var cos = Math.cos(angle);
  var sin = Math.sin(angle);
  var a1 = this.a;
  var c1 = this.c;
  var tx1 = this.tx;
  this.a = a1 * cos - this.b * sin;
  this.b = a1 * sin + this.b * cos;
  this.c = c1 * cos - this.d * sin;
  this.d = c1 * sin + this.d * cos;
  this.tx = tx1 * cos - this.ty * sin;
  this.ty = tx1 * sin + this.ty * cos;
  return this;
};
/**
 * 矩阵相乘
 * @param {matrix} matrix
 * @return {this}
 */
Matrix.prototype.append = function (matrix) {
  var a1 = this.a;
  var b1 = this.b;
  var c1 = this.c;
  var d1 = this.d;
  this.a = matrix.a * a1 + matrix.b * c1;
  this.b = matrix.a * b1 + matrix.b * d1;
  this.c = matrix.c * a1 + matrix.d * c1;
  this.d = matrix.c * b1 + matrix.d * d1;
  this.tx = matrix.tx * a1 + matrix.ty * c1 + this.tx;
  this.ty = matrix.tx * b1 + matrix.ty * d1 + this.ty;
  return this;
};
/**
 * 单位矩阵
 *
 * @return {this}
 */
Matrix.prototype.identity = function () {
  this.a = 1;
  this.b = 0;
  this.c = 0;
  this.d = 1;
  this.tx = 0;
  this.ty = 0;
  return this;
};
/**
 * 快速设置矩阵各个分量
 * @param {number} x
 * @param {number} y
 * @param {number} pivotX
 * @param {number} pivotY
 * @param {number} scaleX
 * @param {number} scaleY
 * @param {number} rotation
 * @param {number} skewX
 * @param {number} skewY
 * @return {this}
 */
Matrix.prototype.setTransform = function (x, y, pivotX, pivotY, scaleX, scaleY, rotation, skewX, skewY) {
  var a = void 0;
  var b = void 0;
  var c = void 0;
  var d = void 0;
  var sr = void 0;
  var cr = void 0;
  var sy = void 0;
  var nsx = void 0; // cy, cx,

  sr = Math.sin(rotation);
  cr = Math.cos(rotation);
  // cy  = Math.cos(skewY);
  sy = Math.tan(skewY);
  nsx = Math.tan(skewX);
  // cx  =  Math.cos(skewX);

  a = cr * scaleX;
  b = sr * scaleX;
  c = -sr * scaleY;
  d = cr * scaleY;

  this.a = a + sy * c;
  this.b = b + sy * d;
  this.c = nsx * a + c;
  this.d = nsx * b + d;

  this.tx = x + (pivotX * a + pivotY * c);
  this.ty = y + (pivotX * b + pivotY * d);

  return this;
};
var IDENTITY = new Matrix();
var TEMP_MATRIX = new Matrix();

/* eslint max-len: "off" */

/**
 * 显示对象的基类，继承至Eventer
 *
 * @class
 * @memberof JC
 * @extends JC.Eventer
 */
function DisplayObject() {
  Eventer.call(this);
  /**
   * 标记渲染对象是否就绪
   *
   * @private
   * @member {Boolean}
   */
  this._ready = true;

  /**
   * 控制渲染对象是否显示
   *
   * @member {Boolean}
   */
  this.visible = true;

  /**
   * 世界透明度
   *
   * @private
   * @member {Number}
   */
  this.worldAlpha = 1;

  /**
   * 控制渲染对象的透明度
   *
   * @member {Number}
   */
  this.alpha = 1;

  /**
   * 控制渲染对象的x轴的缩放
   *
   * @member {Number}
   */
  this.scaleX = 1;

  /**
   * 控制渲染对象的y轴的缩放
   *
   * @member {Number}
   */
  this.scaleY = 1;

  /**
   * 控制渲染对象的x轴的斜切
   *
   * @member {Number}
   */
  this.skewX = 0;

  /**
   * 控制渲染对象的y轴的斜切
   *
   * @member {Number}
   */
  this.skewY = 0;

  /**
   * 控制渲染对象的旋转角度
   *
   * @member {Number}
   */
  this.rotation = 0;
  this.rotationCache = 0;
  this._sr = 0;
  this._cr = 1;

  /**
   * 控制渲染对象的x位置
   *
   * @member {Number}
   */
  this.x = 0;

  /**
   * 控制渲染对象的y位置
   *
   * @member {Number}
   */
  this.y = 0;

  /**
   * 控制渲染对象的相对本身x轴位置的进一步偏移，将会影响旋转中心点
   *
   * @member {Number}
   */
  this.pivotX = 0;

  /**
   * 控制渲染对象的相对本身y轴位置的进一步偏移，将会影响旋转中心点
   *
   * @member {Number}
   */
  this.pivotY = 0;

  /**
   * 对象的遮罩层
   *
   * @member {JC.Graphics}
   */
  this.mask = null;

  /**
   * 当前对象的直接父级
   *
   * @private
   * @member {JC.Container}
   */
  this.parent = null;

  /**
   * 当前对象所应用的矩阵状态
   *
   * @private
   * @member {JC.Matrix}
   */
  this.worldTransform = new Matrix();

  /**
   * 当前对象的事件管家
   *
   * @private
   * @member {JC.Eventer}
   */
  // this.event = new Eventer();

  /**
   * 当前对象是否穿透自身的事件检测
   *
   * @member {Boolean}
   */
  this.passEvent = false;

  /**
   * 当前对象的事件检测边界
   *
   * @private
   * @member {JC.Shape}
   */
  this.eventArea = null;

  /**
   * 当前对象的动画管家
   *
   * @private
   * @member {Array}
   */
  this.Animation = new Animation(this);

  /**
   * 标记当前对象是否为touchstart触发状态
   *
   * @private
   * @member {Boolean}
   */
  this._touchstarted = false;

  /**
   * 标记当前对象是否为mousedown触发状态
   *
   * @private
   * @member {Boolean}
   */
  this._mousedowned = false;

  /**
   * 渲染对象是否具备光标样式，例如 cursor
   *
   * @member {Boolean}
   */
  this.buttonMode = false;

  /**
   * 当渲染对象是按钮时所具备的光标样式
   *
   * @member {Boolean}
   */
  this.cursor = 'pointer';
}
DisplayObject.prototype = Object.create(Eventer.prototype);

/**
 * 对渲染对象进行x、y轴同时缩放
 *
 * @name scale
 * @member {Number}
 * @memberof JC.DisplayObject#
 */
Object.defineProperty(DisplayObject.prototype, 'scale', {
  get: function get() {
    return this.scaleX;
  },
  set: function set(scale) {
    this.scaleX = this.scaleY = scale;
  }
});

/**
 * animate动画，指定动画的启始位置和结束位置
 *
 * ```js
 * display.animate({
 *   from: {x: 100},
 *   to: {x: 200},
 *   ease: 'bounceOut', // 执行动画使用的缓动函数 默认值为 easeBoth
 *   repeats: 10, // 动画运动完后再重复10次
 *   infinite: true, // 无限循环动画
 *   alternate: true, // 偶数次的时候动画回放
 *   duration: 1000, // 动画时长 ms单位 默认 300ms
 *   onUpdate: function(state,rate){},
 *   onCompelete: function(){ console.log('end'); } // 动画执行结束回调
 * });
 * ```
 *
 * @param {Object} options 动画配置参数
 * @param {Object} [options.from] 设置对象的起始位置和起始姿态等，该项配置可选
 * @param {Object} options.to 设置对象的结束位置和结束姿态等
 * @param {String} [options.ease] 执行动画使用的缓动函数 默认值为 easeBoth
 * @param {Number} [options.repeats] 设置动画执行完成后再重复多少次，优先级没有infinite高
 * @param {Boolean} [options.infinite] 设置动画无限次执行，优先级高于repeats
 * @param {Boolean} [options.alternate] 设置动画是否偶数次回返
 * @param {Number} [options.duration] 设置动画执行时间 默认 300ms
 * @param {Number} [options.wait] 设置动画延迟时间，在重复动画不会生效 默认 0ms
 * @param {Number} [options.delay] 设置动画延迟时间，在重复动画也会生效 默认 0ms
 * @param {Function} [options.onUpdate] 设置动画更新时的回调函数
 * @param {Function} [options.onCompelete] 设置动画结束时的回调函数，如果infinite为true该事件将不会触发
 * @param {Boolean} clear 是否去掉之前的动画
 * @return {JC.Animate}
 */
DisplayObject.prototype.animate = function (options, clear) {
  return this.Animation.animate(options, clear);
};

/**
 * motion动画，让物体按照设定好的曲线运动
 *
 * ```js
 * display.motion({
 *   path: new JC.SvgCurve('M10 10 H 90 V 90 H 10 L 10 10), // path路径，需要继承自Curve
 *   attachTangent: true, // 物体是否捕获切线方向
 *   ease: 'bounceOut', // 执行动画使用的缓动函数 默认值为 easeBoth
 *   repeats: 10, // 动画运动完后再重复10次
 *   infinite: true, // 无限循环动画
 *   alternate: true, // 偶数次的时候动画回放
 *   duration: 1000, // 动画时长 ms单位 默认 300ms
 *   onUpdate: function(state,rate){}, // 动画更新回调
 *   onCompelete: function(){ console.log('end'); } // 动画执行结束回调
 * });
 * ```
 * @param {Object} options 动画配置参数
 * @param {Curve} options.path path路径，需要继承自Curve，可以传入BezierCurve实例、NURBSCurve实例、SvgCurve实例
 * @param {Boolean} [options.attachTangent] 物体是否捕获切线方向
 * @param {String} [options.ease] 执行动画使用的缓动函数 默认值为 easeBoth
 * @param {Number} [options.repeats] 设置动画执行完成后再重复多少次，优先级没有infinite高
 * @param {Boolean} [options.infinite] 设置动画无限次执行，优先级高于repeats
 * @param {Boolean} [options.alternate] 设置动画是否偶数次回返
 * @param {Number} [options.duration] 设置动画执行时间 默认 300ms
 * @param {Number} [options.wait] 设置动画延迟时间，在重复动画不会生效 默认 0ms
 * @param {Number} [options.delay] 设置动画延迟时间，在重复动画也会生效 默认 0ms
 * @param {Function} [options.onUpdate] 设置动画更新时的回调函数
 * @param {Function} [options.onCompelete] 设置动画结束时的回调函数，如果infinite为true该事件将不会触发
 * @param {Boolean} clear 是否去掉之前的动画
 * @return {JC.Animate}
 */
DisplayObject.prototype.motion = function (options, clear) {
  return this.Animation.motion(options, clear);
};

/**
 * keyFrames动画，设置物体动画的keyframe，可以为相邻的两个keyFrames之前配置差值时间及时间函数
 *
 * ```js
 * display.keyFrames({
 *   ks: data.layers[0], // ae导出的动画数据
 *   fr: 30, // 动画的帧率，默认：30fps
 *   repeats: 10, // 动画运动完后再重复10次
 *   infinite: true, // 无限循环动画
 *   alternate: true, // 偶数次的时候动画回放
 *   onUpdate: function(state,rate){},
 *   onCompelete: function(){ console.log('end'); } // 动画执行结束回调
 * });
 * ```
 *
 * @param {Object} options 动画配置参数
 * @param {Object} options.ks 配置关键帧的位置、姿态，ae导出的动画数据
 * @param {Number} [options.fr] 配置关键帧的位置、姿态，ae导出的动画数据
 * @param {Number} [options.repeats] 设置动画执行完成后再重复多少次，优先级没有infinite高
 * @param {Boolean} [options.infinite] 设置动画无限次执行，优先级高于repeats
 * @param {Boolean} [options.alternate] 设置动画是否偶数次回返
 * @param {Number} [options.wait] 设置动画延迟时间，在重复动画不会生效 默认 0ms
 * @param {Number} [options.delay] 设置动画延迟时间，在重复动画也会生效 默认 0ms
 * @param {Function} [options.onUpdate] 设置动画更新时的回调函数
 * @param {Function} [options.onCompelete] 设置动画结束时的回调函数，如果infinite为true该事件将不会触发
 * @param {Boolean} clear 是否去掉之前的动画
 * @return {JC.Animate}
 */
DisplayObject.prototype.keyFrames = function (options, clear) {
  return this.Animation.keyFrames(options, clear);
};

/**
 * runners动画，多个复合动画的组合形式，不支持`alternate`
 *
 * ```js
 * display.runners({
 *   runners: [], // ae导出的动画数据
 *   delay: 1000, // ae导出的动画数据
 *   wait: 100, // ae导出的动画数据
 *   repeats: 10, // 动画运动完后再重复10次
 *   infinite: true, // 无限循环动画
 *   onUpdate: function(state,rate){},
 *   onCompelete: function(){ console.log('end'); } // 动画执行结束回调
 * });
 * ```
 *
 * @param {Object} options 动画配置参数
 * @param {Object} options.runners 各个拆分动画
 * @param {Number} [options.repeats] 设置动画执行完成后再重复多少次，优先级没有infinite高
 * @param {Boolean} [options.infinite] 设置动画无限次执行，优先级高于repeats
 * @param {Number} [options.wait] 设置动画延迟时间，在重复动画不会生效 默认 0ms
 * @param {Number} [options.delay] 设置动画延迟时间，在重复动画也会生效 默认 0ms
 * @param {Function} [options.onUpdate] 设置动画更新时的回调函数
 * @param {Function} [options.onCompelete] 设置动画结束时的回调函数，如果infinite为true该事件将不会触发
 * @param {Boolean} clear 是否去掉之前的动画
 * @return {JC.Animate}
 */
DisplayObject.prototype.runners = function (options, clear) {
  return this.Animation.runners(options, clear);
};

/**
 * 检查对象是否可见
 *
 * @return {Boolean} 对象是否可见
 */
DisplayObject.prototype.isVisible = function () {
  return !!(this.visible && this.alpha > 0 && this.scaleX * this.scaleY !== 0);
};

/**
 * 移除对象上的遮罩
 */
DisplayObject.prototype.removeMask = function () {
  this.mask = null;
};

/**
 * 设置对象上的属性值
 *
 * @private
 * @param {Object} props
 */
DisplayObject.prototype.setProps = function (props) {
  if (props === undefined) return;
  for (var key in props) {
    if (this[key] === undefined) {
      continue;
    } else {
      this[key] = props[key];
    }
  }
};

/**
 * 更新对象本身的矩阵姿态以及透明度
 *
 * @private
 * @method updateTransform
 */
DisplayObject.prototype.updateTransform = function () {
  var pt = this.parent && this.parent.worldTransform || IDENTITY;
  var wt = this.worldTransform;
  var worldAlpha = this.parent && this.parent.worldAlpha || 1;

  var a = void 0;
  var b = void 0;
  var c = void 0;
  var d = void 0;
  var tx = void 0;
  var ty = void 0;

  if (this.skewX || this.skewY) {
    TEMP_MATRIX.setTransform(this.x, this.y, this.pivotX, this.pivotY, this.scaleX, this.scaleY, this.rotation * Utils.DTR, this.skewX * Utils.DTR, this.skewY * Utils.DTR);

    wt.a = TEMP_MATRIX.a * pt.a + TEMP_MATRIX.b * pt.c;
    wt.b = TEMP_MATRIX.a * pt.b + TEMP_MATRIX.b * pt.d;
    wt.c = TEMP_MATRIX.c * pt.a + TEMP_MATRIX.d * pt.c;
    wt.d = TEMP_MATRIX.c * pt.b + TEMP_MATRIX.d * pt.d;
    wt.tx = TEMP_MATRIX.tx * pt.a + TEMP_MATRIX.ty * pt.c + pt.tx;
    wt.ty = TEMP_MATRIX.tx * pt.b + TEMP_MATRIX.ty * pt.d + pt.ty;
  } else {
    if (this.rotation % 360) {
      if (this.rotation !== this.rotationCache) {
        this.rotationCache = this.rotation;
        this._sr = Math.sin(this.rotation * Utils.DTR);
        this._cr = Math.cos(this.rotation * Utils.DTR);
      }

      a = this._cr * this.scaleX;
      b = this._sr * this.scaleX;
      c = -this._sr * this.scaleY;
      d = this._cr * this.scaleY;
      tx = this.x;
      ty = this.y;

      if (this.pivotX || this.pivotY) {
        tx -= this.pivotX * a + this.pivotY * c;
        ty -= this.pivotX * b + this.pivotY * d;
      }
      wt.a = a * pt.a + b * pt.c;
      wt.b = a * pt.b + b * pt.d;
      wt.c = c * pt.a + d * pt.c;
      wt.d = c * pt.b + d * pt.d;
      wt.tx = tx * pt.a + ty * pt.c + pt.tx;
      wt.ty = tx * pt.b + ty * pt.d + pt.ty;
    } else {
      a = this.scaleX;
      d = this.scaleY;

      tx = this.x - this.pivotX * a;
      ty = this.y - this.pivotY * d;

      wt.a = a * pt.a;
      wt.b = a * pt.b;
      wt.c = d * pt.c;
      wt.d = d * pt.d;
      wt.tx = tx * pt.a + ty * pt.c + pt.tx;
      wt.ty = tx * pt.b + ty * pt.d + pt.ty;
    }
  }
  this.worldAlpha = this.alpha * worldAlpha;
};

/**
 * 更新对象本身的动画
 *
 * @private
 * @param {Number} snippet
 */
DisplayObject.prototype.updateAnimation = function (snippet) {
  this.Animation.update(snippet);
};

/**
 * 设置矩阵和透明度到当前绘图上下文
 *
 * @private
 * @param {context} ctx
 */
DisplayObject.prototype.setTransform = function (ctx) {
  var matrix = this.worldTransform;
  ctx.globalAlpha = this.worldAlpha;
  ctx.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
};

/**
 * 获取物体相对于canvas世界坐标系的坐标位置
 *
 * @return {Object}
 */
DisplayObject.prototype.getGlobalPos = function () {
  return { x: this.worldTransform.tx, y: this.worldTransform.ty };
};

/**
 * 设置显示对象的事件检测区域
 *
 * @param {JC.Polygon|JC.Rectangle} shape JC内置形状类型的实例
 * @param {Boolean} clock 是否锁住当前设置的监测区域不会被内部更新修改。
 */
DisplayObject.prototype.setArea = function (shape, clock) {
  if (this.eventArea !== null && this.eventArea.clocked && !clock) return;
  this.eventArea = shape;
  if (clock) this.eventArea.clocked = true;
};

/**
 * 检测坐标点是否在多变性内
 *
 * @param {JC.Point} global
 * @return {Boolean} 是否包含该点
 */
DisplayObject.prototype.contains = function (global) {
  if (this.eventArea === null) return false;
  var point = new Point();
  this.worldTransform.applyInverse(global, point);
  return this.eventArea && this.eventArea.contains(point.x, point.y);
};

/**
 * 矩形类
 *
 * @class
 * @memberof JC
 * @param {number} x 左上角的x坐标
 * @param {number} y 左上角的y坐标
 * @param {number} width 矩形的宽度
 * @param {number} height 矩形的高度
 */
function Rectangle(x, y, width, height) {
  /**
   * @member {number}
   * @default 0
   */
  this.x = x || 0;

  /**
   * @member {number}
   * @default 0
   */
  this.y = y || 0;

  /**
   * @member {number}
   * @default 0
   */
  this.width = width || 0;

  /**
   * @member {number}
   * @default 0
   */
  this.height = height || 0;
}

/**
 * 空矩形对象
 *
 * @static
 * @constant
 */
Rectangle.EMPTY = new Rectangle(0, 0, 0, 0);

/**
 * 克隆一个与该举行对象同样属性的矩形
 *
 * @return {PIXI.Rectangle} 克隆出的矩形
 */
Rectangle.prototype.clone = function () {
  return new Rectangle(this.x, this.y, this.width, this.height);
};

/**
 * 检查坐标点是否在矩形区域内
 *
 * @param {number} x 坐标点的x轴位置
 * @param {number} y 坐标点的y轴位置
 * @return {boolean} 坐标点是否在矩形区域内
 */
Rectangle.prototype.contains = function (x, y) {
  if (this.width <= 0 || this.height <= 0) {
    return false;
  }

  if (x >= this.x && x < this.x + this.width) {
    if (y >= this.y && y < this.y + this.height) {
      return true;
    }
  }

  return false;
};

/**
 * 显示对象的包围盒子
 *
 * @class
 * @memberof JC
 * @param {Number} minX
 * @param {Number} minY
 * @param {Number} maxX
 * @param {Number} maxY
 */
function Bounds(minX, minY, maxX, maxY) {
  /**
   * @member {number}
   * @default 0
   */
  this.minX = minX || Infinity;

  /**
   * @member {number}
   * @default 0
   */
  this.minY = minY || Infinity;

  /**
   * @member {number}
   * @default 0
   */
  this.maxX = maxX || -Infinity;

  /**
   * @member {number}
   * @default 0
   */
  this.maxY = maxY || -Infinity;

  this.rect = null;
}

Bounds.prototype.isEmpty = function () {
  return this.minX > this.maxX || this.minY > this.maxY;
};

Bounds.prototype.clear = function () {
  this.minX = Infinity;
  this.minY = Infinity;
  this.maxX = -Infinity;
  this.maxY = -Infinity;
  return this;
};

/**
 * 将包围盒子转换成矩形描述
 *
 * @param {JC.Rectangle} rect 待转换的矩形
 * @return {JC.Rectangle}
 */
Bounds.prototype.getRectangle = function (rect) {
  if (this.isEmpty()) {
    return Rectangle.EMPTY;
  }

  rect = rect || new Rectangle(0, 0, 1, 1);

  rect.x = this.minX;
  rect.y = this.minY;
  rect.width = this.maxX - this.minX;
  rect.height = this.maxY - this.minY;

  return rect;
};

/**
 * 往包围盒增加外部顶点，更新包围盒区域
 *
 * @param {JC.Point} point
 */
Bounds.prototype.addPoint = function (point) {
  this.minX = Math.min(this.minX, point.x);
  this.maxX = Math.max(this.maxX, point.x);
  this.minY = Math.min(this.minY, point.y);
  this.maxY = Math.max(this.maxY, point.y);
};

/**
 * 往包围盒增加矩形区域，更新包围盒区域
 *
 * @param {JC.Rectangle} rect
 */
Bounds.prototype.addRect = function (rect) {
  this.minX = rect.x;
  this.maxX = rect.width + rect.x;
  this.minY = rect.y;
  this.maxY = rect.height + rect.y;
};

/**
 * 往包围盒增加顶点数组，更新包围盒区域
 *
 * @param {Array} vertices
 */
Bounds.prototype.addVert = function (vertices) {
  var minX = this.minX;
  var minY = this.minY;
  var maxX = this.maxX;
  var maxY = this.maxY;

  for (var i = 0; i < vertices.length; i += 2) {
    var x = vertices[i];
    var y = vertices[i + 1];
    minX = x < minX ? x : minX;
    minY = y < minY ? y : minY;
    maxX = x > maxX ? x : maxX;
    maxY = y > maxY ? y : maxY;
  }

  this.minX = minX;
  this.minY = minY;
  this.maxX = maxX;
  this.maxY = maxY;
};

/**
 * 往包围盒增加包围盒，更新包围盒区域
 *
 * @param {JC.Bounds} bounds
 */
Bounds.prototype.addBounds = function (bounds) {
  var minX = this.minX;
  var minY = this.minY;
  var maxX = this.maxX;
  var maxY = this.maxY;

  this.minX = bounds.minX < minX ? bounds.minX : minX;
  this.minY = bounds.minY < minY ? bounds.minY : minY;
  this.maxX = bounds.maxX > maxX ? bounds.maxX : maxX;
  this.maxY = bounds.maxY > maxY ? bounds.maxY : maxY;
};

/* eslint prefer-rest-params: 0 */

/**
 * 显示对象容器，继承至DisplayObject
 *
 * ```js
 * var container = new JC.Container();
 * container.adds(sprite);
 * ```
 *
 * @class
 * @memberof JC
 * @extends JC.DisplayObject
 */
function Container() {
  DisplayObject.call(this);

  /**
   * 渲染对象的列表
   *
   * @member {Array}
   */
  this.childs = [];

  /**
   * 自身及后代动画的缩放比例
   *
   * @member {Number}
   */
  this.timeScale = 1;

  /**
   * 是否暂停自身的动画
   *
   * @member {Boolean}
   */
  this.paused = false;

  /**
   * 当前对象的z-index层级，z-index的值只会影响该对象在其所在的渲染列表内产生影响
   *
   * @private
   * @member {Number}
   */
  this._zIndex = 0;

  /**
   * 强制该对象在渲染子集之前为他们排序
   *
   * @member {Boolean}
   */
  this.souldSort = false;

  /**
   * 显示对象的包围盒
   *
   * @member {JC.Bounds}
   */
  this.bounds = new Bounds();

  /**
   * 显示对象内部表示的边界
   *
   * @private
   * @member {JC.Bounds}
   */
  this._bounds = new Bounds();

  this.vertexData = new Float32Array(8);
}
Container.prototype = Object.create(DisplayObject.prototype);

/**
 * 当前对象的z-index层级，z-index的值只会影响该对象在其所在的渲染列表内产生影响
 *
 * @name zIndex
 * @member {Number}
 * @memberof JC.Container#
 */
Object.defineProperty(Container.prototype, 'zIndex', {
  get: function get() {
    return this._zIndex;
  },
  set: function set(zIndex) {
    if (this._zIndex !== zIndex) {
      this._zIndex = zIndex;
      if (this.parent) {
        this.parent.souldSort = true;
      }
    }
  }
});

/**
 * 对自身子集进行zIndex排序
 *
 * @private
 * @method _sortList
 */
Container.prototype._sortList = function () {
  /**
   * 因为数组sort排序的不稳定性，顾采用冒泡排序方式
   */
  var childs = this.childs;
  var length = childs.length;
  var i = void 0;
  var j = void 0;
  var temp = void 0;
  for (i = 0; i < length - 1; i++) {
    for (j = 0; j < length - 1 - i; j++) {
      if (childs[j].zIndex > childs[j + 1].zIndex) {
        temp = childs[j];
        childs[j] = childs[j + 1];
        childs[j + 1] = temp;
      }
    }
  }
  this.souldSort = false;
};

/**
 * 向容器添加一个物体
 *
 * ```js
 * container.adds(sprite,sprite2,text3,graphice);
 * ```
 *
 * @param {JC.Container} object
 * @return {JC.Container}
 */
Container.prototype.adds = function (object) {
  if (arguments.length > 1) {
    for (var i = 0; i < arguments.length; i++) {
      this.adds(arguments[i]);
    }
    return this;
  }
  if (object === this) {
    console.error('adds: object can\'t be added as a child of itself.', object);
  }
  if (object && object instanceof Container) {
    if (object.parent !== null) {
      object.parent.remove(object);
    }
    object.parent = this;
    this.childs.push(object);
    this.souldSort = true;
  } else {
    console.error('adds: object not an instance of Container', object);
  }
  return this;
};

/**
 * 从容器移除一个物体
 *
 * ```js
 * container.remove(sprite,sprite2,text3,graphice);
 * ```
 *
 * @param {JC.Container} object
 */
Container.prototype.remove = function (object) {
  if (arguments.length > 1) {
    for (var i = 0; i < arguments.length; i++) {
      this.remove(arguments[i]);
    }
  }
  var index = this.childs.indexOf(object);
  if (index !== -1) {
    object.parent = null;
    this.childs.splice(index, 1);
  }
};

/**
 * 更新自身的透明度可矩阵姿态更新，并触发后代同步更新
 *
 * @private
 * @param {Number} snippet
 */
Container.prototype.updateTimeline = function (snippet) {
  if (this.paused) return;
  snippet = this.timeScale * snippet;
  this.updateAnimation(snippet);

  var i = 0;
  var l = this.childs.length;
  while (i < l) {
    var child = this.childs[i];
    child.updateTimeline(snippet);
    i++;
  }
};

/**
 * 更新自身的透明度可矩阵姿态更新，并触发后代同步更新
 *
 * @private
 */
Container.prototype.updatePosture = function () {
  if (this.souldSort) this._sortList();
  this.updateTransform();

  var i = 0;
  var l = this.childs.length;
  while (i < l) {
    var child = this.childs[i];
    child.updatePosture();
    i++;
  }
};

/**
 * 渲染自己并触发后代渲染
 * @param {context} ctx
 * @private
 */
Container.prototype.render = function (ctx) {
  ctx.save();
  this.setTransform(ctx);
  if (this.mask) this.mask.render(ctx);
  this.renderMe(ctx);

  var i = 0;
  var l = this.childs.length;
  while (i < l) {
    var child = this.childs[i];
    i++;
    if (!child.isVisible() || !child._ready) continue;
    child.render(ctx);
  }
  ctx.restore();
};

/**
 * 渲染自己
 * @private
 * @return {Boolean} 是否渲染
 */
Container.prototype.renderMe = function () {
  return true;
};

/**
 * 计算自己的包围盒
 * @private
 */
Container.prototype.calculateVertices = function () {
  var wt = this.worldTransform;
  var a = wt.a;
  var b = wt.b;
  var c = wt.c;
  var d = wt.d;
  var tx = wt.tx;
  var ty = wt.ty;
  var vertexData = this.vertexData;
  var w0 = void 0;
  var w1 = void 0;
  var h0 = void 0;
  var h1 = void 0;

  w0 = this._bounds.minX;
  w1 = this._bounds.maxX;

  h0 = this._bounds.minY;
  h1 = this._bounds.maxY;

  // xy
  vertexData[0] = a * w1 + c * h1 + tx;
  vertexData[1] = d * h1 + b * w1 + ty;

  // xy
  vertexData[2] = a * w0 + c * h1 + tx;
  vertexData[3] = d * h1 + b * w0 + ty;

  // xy
  vertexData[4] = a * w0 + c * h0 + tx;
  vertexData[5] = d * h0 + b * w0 + ty;

  // xy
  vertexData[6] = a * w1 + c * h0 + tx;
  vertexData[7] = d * h0 + b * w1 + ty;
};

/**
 * 计算包围盒子
 *
 * @method calculateBounds
 */
Container.prototype.calculateBounds = function () {
  this.bounds.clear();
  if (!this.visible) {
    return;
  }
  this._calculateBounds();

  for (var i = 0; i < this.childs.length; i++) {
    var child = this.childs[i];

    child.calculateBounds();

    this.bounds.addBounds(child.bounds);
  }
};

Container.prototype._calculateBounds = function () {
  this.calculateVertices();
  this.bounds.addVert(this.vertexData);
};

/**
 * 设置渲染物体的包围盒
 * @param {JC.Bounds} bounds
 */
Container.prototype.setBounds = function (bounds) {
  if (bounds instanceof Bounds) {
    this._bounds = bounds;
  }
};

/**
 * 暂停自身和子级的所有动画进度
 */
Container.prototype.pause = function () {
  this.paused = true;
};

/**
 * 恢复自身和子级的所有动画进度
 */
Container.prototype.restart = function () {
  this.paused = false;
};

/**
 * 设置自身及子级的动画速度
 * @param {Number} speed 设置的速率值
 */
Container.prototype.setSpeed = function (speed) {
  this.timeScale = speed;
};

/* eslint max-len: "off" */

/**
 * MovieClip类型动画对象
 *
 * @class
 * @memberof JC
 * @extends JC.Eventer
 * @param {object} [element] 动画对象 内部传入
 * @param {object} [options] 动画配置信息 内部传入
 */
function MovieClip(element, options) {
  Eventer.call(this);

  this.element = element;
  this.living = false;

  // this.onCompelete = null;
  // this.onUpdate = null;

  this.infinite = false;
  this.alternate = false;
  this.repeats = 0;

  this.animations = options.animations || {};

  this.index = 0;
  this.preIndex = -1;
  this.direction = 1;
  this.frames = [];
  this.preFrame = null;

  this.fillMode = 0;
  this.fps = 16;

  this.paused = false;

  this.pt = 0;
  this.nt = 0;
}

MovieClip.prototype = Object.create(Eventer.prototype);

/**
 * 更新动画
 * @private
 * @param {number} snippet 时间片段
 */
MovieClip.prototype.update = function (snippet) {
  if (this.paused || !this.living) return;
  this.nt += snippet;
  if (this.nt - this.pt < this.interval) return;
  this.pt = this.nt;
  var i = this.index + this.direction;
  if (i < this.frames.length && i >= 0) {
    this.index = i;
    // Do you need this handler???
    // this.onUpdate&&this.onUpdate(this.index);
  } else {
    if (this.repeats > 0 || this.infinite) {
      if (this.repeats > 0) --this.repeats;
      if (this.alternate) {
        this.direction *= -1;
        this.index += this.direction;
      } else {
        this.direction = 1;
        this.index = 0;
      }
      // Do you need this handler???
      // this.onUpdate && this.onUpdate(this.index);
    } else {
      this.living = false;
      this.index = this.fillMode;
      this.emit('compelete');
    }
  }
};

/**
 * 获取帧位置
 * @private
 * @return {JC.Rectangle}
 */
MovieClip.prototype.getFrame = function () {
  if (this.index === this.preIndex && this.preFrame !== null) return this.preFrame;
  var frame = this.element.frame.clone();
  var cf = this.frames[this.index];
  if (cf > 0) {
    var row = this.element.naturalWidth / this.element.frame.width >> 0;
    var lintRow = this.element.frame.x / this.element.frame.width >> 0;

    var mCol = (lintRow + cf) / row >> 0;
    var mRow = (lintRow + cf) % row;
    frame.x = mRow * this.element.frame.width;
    frame.y += mCol * this.element.frame.height;
  }
  this.preIndex = this.index;
  this.preFrame = frame;
  return frame;
};

/**
 * 播放逐帧
 * @param {object} options 播放配置
 * @return {this}
 */
MovieClip.prototype.playMovie = function (options) {
  // 避免多次调用时前面调用所绑定的监听事件还在监听列表里
  this.off('compelete');
  var movie = this.format(options.movie);
  if (!Utils.isArray(movie)) return;
  this.frames = movie;
  this.index = 0;
  this.direction = 1;
  this.fillMode = options.fillMode || 0;
  this.fps = options.fps || this.fps;
  this.infinite = options.infinite || false;
  this.alternate = options.alternate || false;
  this.repeats = options.repeats || 0;
  this.living = true;
  if (options.onCompelete) {
    var This = this;
    this.once('compelete', function () {
      options.onCompelete.call(This);
    });
  }
  return this;
};

/**
 * 格式化逐帧信息
 * @private
 * @param {string|array|object} movie 逐帧信息
 * @return {array}
 */
MovieClip.prototype.format = function (movie) {
  if (Utils.isString(movie)) {
    var config = this.animations[movie];
    if (config) {
      return this.format(config);
    } else {
      console.warn('you havn\'t config ' + movie + ' in animations ');
      return false;
    }
  } else if (Utils.isArray(movie)) {
    return movie;
  } else if (Utils.isObject(movie)) {
    var arr = [];
    for (var i = movie.start; i <= movie.end; i++) {
      arr.push(i);
    }
    if (movie.next && this.animations[movie.next]) {
      var This = this;
      var conf = {};
      if (Utils.isString(movie.next) && this.animations[movie.next]) {
        conf.movie = movie.next;
        conf.infinite = true;
      } else if (Utils.isObject(movie.next)) {
        conf = movie.next;
      }
      if (Utils.isString(conf.movie)) {
        this.once('compelete', function () {
          This.playMovie(conf);
        });
      }
    }
    return arr;
  }
};

/**
 * 暂停逐帧
 */
MovieClip.prototype.pause = function () {
  this.paused = true;
};

/**
 * 恢复播放逐帧
 */
MovieClip.prototype.restart = function () {
  this.paused = false;
};

/**
 * 取消逐帧
 */
MovieClip.prototype.cancle = function () {
  this.living = false;
};

/**
 * 帧间隔
 * @private
 */
Object.defineProperty(MovieClip.prototype, 'interval', {
  get: function get() {
    return this.fps > 0 ? 1000 / this.fps >> 0 : 16;
  }
});

/**
 * 位图精灵图，继承至Container
 *
 * ```js
 * var loadBox = JC.loaderUtil({
 *    frames: './images/frames.png'
 * });
 * var sprite = new JC.Sprite({
 *      texture: loadBox.getById('frames'),
 *      frame: new JC.Rectangle(0, 0, w, h),
 *      width: 100,
 *      height: 100,
 *      animations: {
 *          fall: {start: 0,end: 4,next: 'stand'},
 *          fly: {start: 5,end: 9,next: {movie: 'stand', repeats: 2}},
 *          stand: {start: 10,end: 39},
 *          walk: {start: 40,end: 59,next: 'stand'},
 *          other: [ 0, 1, 2, 1, 3, 4 ], // 同样接受数组形势
 *      }
 * });
 * ```
 *
 * @class
 * @memberof JC
 * @extends JC.Container
 * @param {Object} options
 * @param {JC.Texture} options.texture 图片纹理
 * @param {JC.Rectangle} [options.frame] 当是逐帧或者是裁切显示时需要配置，显示的矩形区域
 * @param {Number} [options.width] 实际显示的宽，可能会缩放图像
 * @param {Number} [options.height] 实际显示的高，可能会缩放图像
 * @param {Object} [options.animations] 逐帧的预置帧动画配置
 */
function Sprite(options) {
  Container.call(this);

  this._width = 0;

  this._height = 0;

  this.texture = options.texture;
  if (this.texture.loaded) {
    this.upTexture(options);
  } else {
    var This = this;
    this._ready = false;
    this.texture.on('load', function () {
      This.upTexture(options);
      This._ready = true;
    });
  }

  this.MovieClip = new MovieClip(this, options);
}
Sprite.prototype = Object.create(Container.prototype);

/**
 * 更新纹理对象
 *
 * @private
 * @param {json} options
 */
Sprite.prototype.upTexture = function (options) {
  this.naturalWidth = options.texture.naturalWidth;
  this.naturalHeight = options.texture.naturalHeight;
  this.frame = options.frame || new Rectangle(0, 0, this.naturalWidth, this.naturalHeight);

  this.width = options.width || this.frame.width;
  this.height = options.height || this.frame.height;
};

/**
 * 当前图片对象的width
 *
 * @name width
 * @member {Number}
 * @memberof JC.Sprite#
 */
Object.defineProperty(Sprite.prototype, 'width', {
  get: function get() {
    return this._width;
  },
  set: function set(width) {
    if (this._width !== width) {
      this._width = width;
      this.updateGeometry();
    }
  }
});

/**
 * 当前图片对象的height
 *
 * @name height
 * @member {Number}
 * @memberof JC.Sprite#
 */
Object.defineProperty(Sprite.prototype, 'height', {
  get: function get() {
    return this._height;
  },
  set: function set(height) {
    if (this._height !== height) {
      this._height = height;
      this.updateGeometry();
    }
  }
});

/**
 * 更新对象的事件几何形态
 * note: 此处的setArea是懒更新，如果需要
 *
 * @private
 */
Sprite.prototype.updateGeometry = function () {
  var rect = new Rectangle(0, 0, this.width, this.height);
  this._bounds.clear().addRect(rect);
  this.setArea(rect);
};

/**
 * 更新对象的动画姿态
 *
 * @private
 * @param {number} snippet
 */
Sprite.prototype.updateAnimation = function (snippet) {
  this.Animation.update(snippet);
  this.MovieClip.update(snippet);
};

/**
 * 播放逐帧动画
 * @param {Object} options 可以是播放配置对象
 * @param {String|Array} options.movie 预置的动画名，或者是帧索引数组
 * @param {Number} [options.fillMode] 结束时停留在哪一帧
 * @param {Boolean} [options.repeats] 重复播放次数
 * @param {Boolean} [options.infinite] 无限循环，优先级比 repeats 高
 * @param {Boolean} [options.alternate] 循环时交替播放
 * @param {Number} [options.fps] 当前动画将使用的帧率
 * @return {MovieClip}
 */
Sprite.prototype.playMovie = function (options) {
  return this.MovieClip.playMovie(options);
};

/**
 * 更新对象本身的矩阵姿态以及透明度
 *
 * @private
 * @param {context} ctx
 */
Sprite.prototype.renderMe = function (ctx) {
  if (!this._ready) return;
  var frame = this.MovieClip.getFrame();
  ctx.drawImage(this.texture.texture, frame.x, frame.y, frame.width, frame.height, 0, 0, this.width, this.height);
};

/**
 * 解析bodymovin从ae导出的数据
 * @class
 * @memberof JC
 * @param {object} options 动画配置
 * @param {object} options.keyframes bodymovin从ae导出的动画数据
 * @param {number} [options.fr] 动画的帧率，默认会读取导出数据配置的帧率
 * @param {number} [options.repeats] 动画是否无限循环
 * @param {boolean} [options.infinite] 动画是否无限循环
 * @param {boolean} [options.alternate] 动画是否交替播放
 * @param {string} [options.prefix] 导出资源的前缀
 * @param {function} [options.onCompelete] 结束回调
 * @param {function} [options.onUpdate] 更新回调
 */
function ParserAnimation(options) {
  this.prefix = options.prefix || '';
  this.doc = new Container();
  this.fr = options.fr || options.keyframes.fr;
  this.keyframes = options.keyframes;
  this.ip = this.keyframes.ip;
  this.op = this.keyframes.op;
  this.repeats = options.repeats || 0;
  this.infinite = options.infinite || false;
  this.alternate = options.alternate || false;
  this.assetBox = null;
  this.timeline = [];
  this.preParser(this.keyframes.assets, this.keyframes.layers);
  this.parser(this.doc, this.keyframes.layers);

  if (options.onCompelete) {
    this.timeline[0].on('compelete', options.onCompelete.bind(this));
  }
  if (options.onUpdate) {
    this.timeline[0].on('update', options.onUpdate.bind(this));
  }
}

/**
 * @private
 * @param {array} assets 资源数组
 * @param {array} layers 图层数组
 */
ParserAnimation.prototype.preParser = function (assets, layers) {
  var sourceMap = {};
  var i = 0;
  var l = layers.length;
  for (i = 0; i < assets.length; i++) {
    var id = assets[i].id;
    var up = assets[i].up;
    var u = assets[i].u;
    var p = assets[i].p;
    if (up) {
      sourceMap[id] = up;
    } else if (u && p) {
      sourceMap[id] = u + p;
    } else if (!assets[i].layers) {
      console.error('can not get asset url');
    }
  }
  for (i = l - 1; i >= 0; i--) {
    var layer = layers[i];
    this.ip = Math.min(this.ip, layer.ip);
    this.op = Math.max(this.op, layer.op);
  }
  this.assetBox = loaderUtil(sourceMap);
};

/**
 * @private
 * @param {JC.Container} doc 动画元素的渲染组
 * @param {array} layers 图层数组
 */
ParserAnimation.prototype.parser = function (doc, layers) {
  var l = layers.length;
  var repeats = this.repeats;
  var infinite = this.infinite;
  var alternate = this.alternate;
  var ip = this.ip;
  var op = this.op;
  for (var i = l - 1; i >= 0; i--) {
    var layer = layers[i];
    if (layer.ty === 2) {
      var id = this.getAssets(layer.refId).id;
      var ani = new Sprite({
        texture: this.assetBox.getById(id)
      });
      this.timeline.push(ani.keyFrames({
        ks: layer,
        fr: this.fr,
        ip: ip,
        op: op,
        repeats: repeats,
        infinite: infinite,
        alternate: alternate
      }));
      ani.name = layer.nm;
      doc.adds(ani);
    }
    if (layer.ty === 0) {
      var ddoc = new Container();
      var llayers = this.getAssets(layer.refId).layers;
      this.timeline.push(ddoc.keyFrames({
        ks: layer,
        fr: this.fr,
        ip: ip,
        op: op,
        repeats: repeats,
        infinite: infinite,
        alternate: alternate
      }));
      ddoc.name = layer.nm;
      doc.adds(ddoc);
      this.parser(ddoc, llayers);
    }
  }
};

/**
 * @private
 * @param {string} id 资源的refid
 * @return {object} 资源配置
 */
ParserAnimation.prototype.getAssets = function (id) {
  var assets = this.keyframes.assets;
  for (var i = 0; i < assets.length; i++) {
    if (id === assets[i].id) return assets[i];
  }
};

/**
 * 设置动画播放速度
 * @param {number} speed
 */
ParserAnimation.prototype.setSpeed = function (speed) {
  this.doc.setSpeed(speed);
};

/**
 * 暂停播放动画
 */
ParserAnimation.prototype.pause = function () {
  this.doc.pause();
};

/**
 * 恢复播放动画
 */
ParserAnimation.prototype.restart = function () {
  this.doc.restart();
};

/**
 * 停止播放动画
 */
ParserAnimation.prototype.stop = function () {
  this.timeline.forEach(function (it) {
    it.stop();
  });
};

/**
 * 取消播放动画
 */
ParserAnimation.prototype.cancle = function () {
  this.timeline.forEach(function (it) {
    it.cancle();
  });
};

/**
 * 帧缓冲区
 * @class
 * @memberof JC
 */
function FrameBuffer() {
  this.canvas = document.createElement('canvas');
  this.ctx = this.canvas.getContext('2d');
}

/**
 * 设置缓冲区大小
 * @param {JC.Rectangle} rect 获取到的尺寸
 */
FrameBuffer.prototype.setSize = function (rect) {
  this.width = this.canvas.width = rect.width + rect.px * 2;
  this.height = this.canvas.height = rect.height + rect.py * 2;
};

/**
 * 清除缓冲区
 */
FrameBuffer.prototype.clear = function () {
  this.ctx.setTransform(1, 0, 0, 1, 0, 0);
  this.ctx.clearRect(0, 0, this.width, this.height);
};

/**
 * 设置绘图上下文的变换矩阵
 * @param {number} a
 * @param {number} b
 * @param {number} c
 * @param {number} d
 * @param {number} e
 * @param {number} f
 */
FrameBuffer.prototype.setTransform = function (a, b, c, d, e, f) {
  this.ctx.setTransform(a, b, c, d, e, f);
};

/**
 * 获取缓冲区的像素
 * @return {ImageData}
 */
FrameBuffer.prototype.getBuffer = function () {
  this.bufferData = this.ctx.getImageData(0, 0, this.width, this.height);
  return this.bufferData;
};

/**
 * 放置像素到缓冲区
 * @return {canvas}
 */
FrameBuffer.prototype.putBuffer = function () {
  this.ctx.putImageData(this.bufferData, 0, 0);
  return this.canvas;
};

var FUNCTION = 'fn';
var INSTANCE = 'in';

/* eslint max-len: 0 */

/**
 * 形状对象，继承至Container
 *
 *
 * ```js
 * const options = {
 *   cache: true,
 *   bounds: new JC.Bounds(-50, -50, 50, 50)
 * };
 * function drawRect(ctx) {
 *  ctx.fillStyle = 'red';
 *  ctx.fillRect(-10, -10, 10, 10);
 * }
 *
 * function Cricle(options) {
 *   this.radius = options.radius || 0;
 *   this.color = options.color || '#3a3cfd';
 * }
 * Cricle.prototype.render = function(ctx) {
 *   ctx.beginPath();
 *   ctx.fillStyle = this.color;
 *   ctx.arc(0, 0, this.radius, 0, Math.PI * 2, true);
 *   ctx.closePath();
 *   ctx.fill();
 * }
 *
 * const rect = new JC.Graphics(drawRect);
 * const cricle = new JC.Graphics(new Cricle());
 *
 * ```
 *
 * @class
 * @memberof JC
 * @extends JC.Container
 * @param {function|object} mesh 绘制对象，可以是函数，也可以是带有render方法的对象，绘制时会将当前绘图环境传递给它
 * @param {object} options 绘制对象
 * @param {boolean} [options.cache] 是否缓存改绘制对象，加入绘制对象非常复杂并后续无需更新时设置为 true 可以优化性能
 * @param {JC.Bounds} [options.bounds] 绘制对象的包围盒，在需要缓存时需要手动设置
 */
function Graphics(mesh, options) {
  Container.call(this);
  options = options || {};
  this.mesh = mesh;
  this.meshType = Utils.isFunction(mesh) ? FUNCTION : Utils.isObject(mesh) && Utils.isFunction(mesh.render) ? INSTANCE : '';
  if (this.meshType === '') throw new Error('不支持的绘制对象');

  this.cache = options.cache || false;
  this.cached = false;
  this.setBounds(options.bounds);

  this.frameBuffer = null;
}
Graphics.prototype = Object.create(Container.prototype);

/**
 * 更新对象本身的矩阵姿态以及透明度
 *
 * @private
 * @param {context} ctx
 */
Graphics.prototype.renderMe = function (ctx) {
  if (!this.meshType) return;
  if (this.cached || this.cache) {
    if (this.cache) {
      if (this.frameBuffer === null) this.frameBuffer = new FrameBuffer();

      this.frameBuffer.clear();
      this.__co = this._bounds.getRectangle();
      this.__co.px = this.__co.py = 0;
      this.frameBuffer.setSize(this.__co);
      this.frameBuffer.setTransform(1, 0, 0, 1, -this.__co.x, -this.__co.y);

      this._drawBack(this.frameBuffer.ctx);

      this.cached = true;
      this.cache = false;
    }
    this.frameBuffer && ctx.drawImage(this.frameBuffer.canvas, this.__co.x - this.__co.px, this.__co.y - this.__co.py, this.frameBuffer.width, this.frameBuffer.height);
  } else {
    this._drawBack(ctx);
  }
};

/**
 * 调用绘制函数
 *
 * @private
 * @param {context} ctx
 */
Graphics.prototype._drawBack = function (ctx) {
  if (this.meshType === FUNCTION) {
    this.mesh(ctx);
  } else if (this.meshType === INSTANCE) {
    this.mesh.render(ctx);
  }
};

/**
 * @param {JC.Stage} stage 需要接入事件系统的的场景
 */
function InteractionManager(stage) {
  Eventer.call(this);
  this.stage = stage;

  this.canvas = this.stage.canvas;

  this.autoPreventDefault = true;
  this.strictMode = false;

  this.onMouseUp = this.onMouseUp.bind(this);
  this.processMouseUp = this.processMouseUp.bind(this);

  this.onMouseMove = this.onMouseMove.bind(this);
  this.processMouseMove = this.processMouseMove.bind(this);

  this.onMouseDown = this.onMouseDown.bind(this);
  this.processMouseDown = this.processMouseDown.bind(this);

  this.onClick = this.onClick.bind(this);
  this.processClick = this.processClick.bind(this);

  this.onTouchStart = this.onTouchStart.bind(this);
  this.processTouchStart = this.processTouchStart.bind(this);

  this.onTouchEnd = this.onTouchEnd.bind(this);
  this.processTouchEnd = this.processTouchEnd.bind(this);

  this.onTouchMove = this.onTouchMove.bind(this);
  this.processTouchMove = this.processTouchMove.bind(this);

  this.onMouseOut = this.onMouseOut.bind(this);
  this.processMouseOverOut = this.processMouseOverOut.bind(this);

  this.onMouseOver = this.onMouseOver.bind(this);

  this.defaultCursorStyle = 'inherit';

  this.currentCursorStyle = 'inherit';
}
InteractionManager.prototype = Object.create(Eventer.prototype);

InteractionManager.prototype.addEvents = function () {
  if (!this.canvas || this.eventsAdded) {
    return;
  }

  window.document.addEventListener('mousemove', this.onMouseMove, true);
  this.canvas.addEventListener('mousedown', this.onMouseDown, true);
  this.canvas.addEventListener('click', this.onClick, true);
  this.canvas.addEventListener('mouseout', this.onMouseOut, true);
  this.canvas.addEventListener('mouseover', this.onMouseOver, true);

  this.canvas.addEventListener('touchstart', this.onTouchStart, true);
  this.canvas.addEventListener('touchend', this.onTouchEnd, true);
  this.canvas.addEventListener('touchmove', this.onTouchMove, true);

  window.addEventListener('mouseup', this.onMouseUp, true);

  this.eventsAdded = true;
};

InteractionManager.prototype.removeEvents = function () {
  if (!this.canvas) {
    return;
  }

  window.document.removeEventListener('mousemove', this.onMouseMove, true);
  this.canvas.removeEventListener('mousedown', this.onMouseDown, true);
  this.canvas.removeEventListener('click', this.onClick, true);
  this.canvas.removeEventListener('mouseout', this.onMouseOut, true);
  this.canvas.removeEventListener('mouseover', this.onMouseOver, true);

  this.canvas.removeEventListener('touchstart', this.onTouchStart, true);
  this.canvas.removeEventListener('touchend', this.onTouchEnd, true);
  this.canvas.removeEventListener('touchmove', this.onTouchMove, true);

  window.removeEventListener('mouseup', this.onMouseUp, true);

  this.eventsAdded = false;
};

InteractionManager.prototype.onMouseMove = function (event) {
  var eventd = this.fixCoord(event);

  this.cursor = this.defaultCursorStyle;
  this.processInteractive(this.stage, eventd, this.processMouseMove, true);

  if (this.currentCursorStyle !== this.cursor) {
    this.currentCursorStyle = this.cursor;
    this.canvas.style.cursor = this.cursor;
  }

  this.emit('mousemove', eventd);
};

InteractionManager.prototype.processMouseMove = function (displayObject, event, hit) {
  this.processMouseOverOut(displayObject, event, hit);
  if (hit) {
    this.dispatchEvent(displayObject, 'mousemove', event);
  }
};

InteractionManager.prototype.processMouseOverOut = function (displayObject, event, hit) {
  var eventd = event.clone();
  if (hit) {
    if (!displayObject._over) {
      displayObject._over = true;
      this.dispatchEvent(displayObject, 'mouseover', eventd);
    }
    if (displayObject.buttonMode) {
      this.cursor = displayObject.cursor;
    }
  } else {
    if (displayObject._over) {
      displayObject._over = false;
      this.dispatchEvent(displayObject, 'mouseout', eventd);
    }
  }
};

InteractionManager.prototype.onMouseDown = function (event) {
  if (this.autoPreventDefault) {
    event.preventDefault();
  }
  var eventd = this.fixCoord(event);
  this.processInteractive(this.stage, eventd, this.processMouseDown, true);

  this.emit('mousedown', eventd);
};

InteractionManager.prototype.processMouseDown = function (displayObject, event, hit) {
  if (hit) {
    this.dispatchEvent(displayObject, event.type, event);
  }
};

InteractionManager.prototype.onClick = function (event) {
  if (this.autoPreventDefault) {
    event.preventDefault();
  }
  var eventd = this.fixCoord(event);
  this.processInteractive(this.stage, eventd, this.processClick, true);

  this.emit('click', eventd);
};

InteractionManager.prototype.processClick = function (displayObject, event, hit) {
  if (hit) {
    this.dispatchEvent(displayObject, event.type, event);
  }
};

InteractionManager.prototype.onMouseUp = function (event) {
  var eventd = this.fixCoord(event);
  this.processInteractive(this.stage, eventd, this.processMouseUp, true);

  this.emit('mouseup', eventd);
};

InteractionManager.prototype.processMouseUp = function (displayObject, event, hit) {
  if (hit) {
    this.dispatchEvent(displayObject, event.type, event);
  }
};

InteractionManager.prototype.onMouseOut = function (event) {
  var eventd = this.fixCoord(event);

  this.processInteractive(this.stage, eventd, this.processMouseOverOut, false);

  this.emit('mouseout', event);
};

InteractionManager.prototype.onMouseOver = function (event) {
  this.emit('mouseover', event);
};

InteractionManager.prototype.onTouchStart = function (event) {
  var eventd = this.fixCoord(event);
  this.processInteractive(this.stage, eventd, this.processTouchStart, true);

  this.emit('touchstart', eventd);
};

InteractionManager.prototype.processTouchStart = function (displayObject, event, hit) {
  if (hit) {
    displayObject._touchstarted = true;
    this.dispatchEvent(displayObject, 'touchstart', event);
  }
};

InteractionManager.prototype.onTouchEnd = function (event) {
  var eventd = this.fixCoord(event);
  this.processInteractive(this.stage, eventd, this.processTouchEnd, this.strictMode);

  this.emit('touchend', eventd);
};

InteractionManager.prototype.processTouchEnd = function (displayObject, event) {
  if (displayObject._touchstarted) {
    displayObject._touchstarted = false;
    this.dispatchEvent(displayObject, 'touchend', event);
  }
};

InteractionManager.prototype.onTouchMove = function (event) {
  if (this.autoPreventDefault) {
    event.preventDefault();
  }
  var eventd = this.fixCoord(event);
  this.processInteractive(this.stage, eventd, this.processTouchMove, this.strictMode);

  this.emit('touchmove', eventd);
};

InteractionManager.prototype.processTouchMove = function (displayObject, event, hit) {
  if (!this.strictMode && displayObject._touchstarted || hit) {
    this.dispatchEvent(displayObject, 'touchmove', event);
  }
};

InteractionManager.prototype.processInteractive = function (object, event, func, hitTest) {
  /**
   *
   * @param {JC.DisplayObject} object 现实对象
   * @param {JC.InteractionData} event JC的交互数据对象
   * @param {Function} func 事件检测函数
   * @param {Boolean} shouldHit 是否需要检测
   * @return {Boolean} 是否检测到
   */
  function process(object, event, func, shouldHit) {
    var childs = object.childs;
    var hit = false;
    var i = childs.length - 1;
    while (i >= 0) {
      var cchilds = childs[i--];
      hit = false;
      if (cchilds.passEvent) continue;
      if (cchilds.childs.length > 0) {
        if (process(cchilds, event, func, shouldHit)) {
          shouldHit = false;
          hit = true;
        }
      }
      if (shouldHit && !hit) {
        hit = cchilds.contains(event.global);
        if (hit) {
          event.target = cchilds;
          shouldHit = false;
        }
      }
      func(cchilds, event, hit);
    }
    return hit;
  }
  process(object, event, func, hitTest);
};

InteractionManager.prototype.dispatchEvent = function (displayObject, eventString, event) {
  if (!event.cancleBubble) {
    event.target = displayObject;
    event.type = eventString;

    displayObject.emit(eventString, event);

    var type = 'on' + eventString;
    if (displayObject[type]) {
      displayObject[type](event);
    }
  }
};

InteractionManager.prototype.fixCoord = function (event) {
  var eventd = new InteractionData();
  var offset = this.getPos(this.canvas);
  eventd.originalEvent = event;
  eventd.type = event.type;

  eventd.ratio = this.canvas.width / this.canvas.offsetWidth;
  if (event.touches) {
    eventd.touches = [];
    if (event.touches.length > 0) {
      for (var i = 0; i < event.touches.length; i++) {
        eventd.touches[i] = {};
        eventd.touches[i].global = new Point((event.touches[i].pageX - offset.x) * eventd.ratio, (event.touches[i].pageY - offset.y) * eventd.ratio);
      }
      eventd.global = eventd.touches[0].global;
    }
  } else {
    eventd.global.x = (event.pageX - offset.x) * eventd.ratio;
    eventd.global.y = (event.pageY - offset.y) * eventd.ratio;
  }
  return eventd;
};

InteractionManager.prototype.getPos = function (obj) {
  var pos = new Point();
  if (obj.offsetParent) {
    var p = this.getPos(obj.offsetParent);
    pos.x = obj.offsetLeft + p.x;
    pos.y = obj.offsetTop + p.y;
  } else {
    pos.x = obj.offsetLeft;
    pos.y = obj.offsetTop;
  }
  return pos;
};

/* global RAF CAF */
/* eslint new-cap: 0 */

/**
 * 舞台对象，继承至Eventer
 *
 *
 * ```js
 * var stage = new JC.Stage({
 *   dom: 'canvas-dom', // 格式可以是 .canvas-dom 或者 ＃canvas-dom 或者 canvas-dom
 *   resolution: 1, // 分辨率
 *   interactive: true, // 是否可交互
 *   enableFPS: true, // 是否记录帧率
 *   bgColor: ‘rgba(0,0,0,0.4)’, // 背景色
 * });
 * ```
 *
 * @class
 * @extends JC.Container
 * @memberof JC
 * @param {object} options 舞台的配置项
 * @param {string} options.dom 舞台要附着的`canvas`元素
 * @param {number} [options.resolution] 设置舞台的分辨率，`默认为` 1
 * @param {boolean} [options.interactive] 设置舞台是否可交互，`默认为` true
 * @param {boolean} [options.enableFPS] 设置舞台是否记录帧率，`默认为` true
 * @param {string} [options.bgColor] 设置舞台的背景颜色，`默认为` ‘transparent’
 * @param {number} [options.width] 设置舞台的宽, `默认为` 附着的canvas.width
 * @param {number} [options.height] 设置舞台的高, `默认为` 附着的canvas.height
 */
function Stage(options) {
  options = options || {};
  Container.call(this);

  /**
   * 场景的canvas的dom
   *
   * @member {CANVAS}
   */
  this.canvas = Utils.isString(options.dom) ? document.getElementById(options.dom) || document.querySelector(options.dom) : options.dom;

  this.realWidth = options.width || this.canvas.width;
  this.realHeight = options.height || this.canvas.height;

  /**
   * 场景的canvas的绘图环境
   *
   * @member {context2d}
   */
  this.ctx = this.canvas.getContext('2d');
  this.canvas.style.backgroundColor = options.bgColor || 'transparent';

  /**
   * 场景是否自动清除上一帧的像素内容
   *
   * @member {Boolean}
   */
  this.autoClear = true;

  /**
   * 是否在每一帧绘制之前自动更新场景内所有物体的状态
   *
   * @member {Boolean}
   */
  this.autoUpdate = true;

  /**
   * 场景是否应用style控制宽高
   *
   * @member {Boolean}
   */
  this.autoStyle = false;

  /**
   * canvas的宽度
   *
   * @member {Number}
   */
  this.width = this.canvas.width = this.realWidth * this.resolution;

  /**
   * canvas的高度
   *
   * @member {Number}
   */
  this.height = this.canvas.height = this.realHeight * this.resolution;

  /**
   * 场景分辨率
   *
   * @member {Number}
   * @private
   */
  this._resolution = 0;

  /**
   * 场景分辨率
   *
   * @member {Number}
   * @private
   */
  this.resolution = options.resolution || 1;

  /**
   * 上一次绘制的时间点
   *
   * @member {Number}
   * @private
   */
  this.pt = null;

  /**
   * 本次渲染经历的时间片段长度
   *
   * @member {Number}
   * @private
   */
  this.snippet = 0;

  /**
   * 平均渲染经历的时间片段长度
   *
   * @member {Number}
   * @private
   */
  this.averageSnippet = 0;

  /**
   * 渲染的瞬时帧率，仅在enableFPS为true时才可用
   *
   * @member {Number}
   */
  this.fps = 0;

  /**
   * 渲染到目前为止的平均帧率，仅在enableFPS为true时才可用
   *
   * @member {Number}
   */
  this.averageFps = 0;

  /**
   * 渲染总花费时间，除去被中断、被暂停等时间
   *
   * @member {Number}
   * @private
   */
  this._takeTime = 0;

  /**
   * 渲染总次数
   *
   * @member {Number}
   * @private
   */
  this._renderTimes = 0;

  /**
   * 是否记录渲染性能
   *
   * @member {Boolean}
   */
  this.enableFPS = Utils.isBoolean(options.enableFPS) ? options.enableFPS : true;

  this.interactionManager = new InteractionManager(this);

  /**
   * 舞台是否可交互
   *
   * @member {boolean}
   * @private
   */
  this._interactive = false;

  this.interactiveOnChange = function () {
    if (this.interactive) {
      this.interactionManager.addEvents();
    } else {
      this.interactionManager.removeEvents();
    }
  };

  this.interactive = Utils.isBoolean(options.interactive) ? options.interactive : true;

  this.proxyOn();
}
Stage.prototype = Object.create(Container.prototype);

Stage.prototype.proxyOn = function () {
  var This = this;
  var EventList = ['click', 'mousemove', 'mousedown', 'mouseout', 'mouseover', 'touchstart', 'touchend', 'touchmove', 'mouseup'];
  EventList.forEach(function (it) {
    This.interactionManager.on(it, function (it) {
      return function (ev) {
        This.emit(it, ev);
      };
    }(it));
  });
};

/**
 * 舞台尺寸设置
 *
 * @param {number} w canvas的width值
 * @param {number} h canvas的height值
 * @param {number} sw canvas的style.width值，需将舞台属性autoStyle设置为true
 * @param {number} sh canvas的style.height值，需将舞台属性autoStyle设置为true
 */
Stage.prototype.resize = function (w, h, sw, sh) {
  if (Utils.isNumber(w) && Utils.isNumber(h)) {
    this.realWidth = w;
    this.realHeight = h;
  } else {
    w = this.realWidth;
    h = this.realHeight;
  }
  this.width = this.canvas.width = w * this.resolution;
  this.height = this.canvas.height = h * this.resolution;
  if (this.autoStyle && sw && sh) {
    this.canvas.style.width = Utils.isString(sw) ? sw : sw + 'px';
    this.canvas.style.height = Utils.isString(sh) ? sh : sh + 'px';
  }
};

/**
 * 渲染舞台内的所有可见渲染对象
 */
Stage.prototype.render = function () {
  this.emit('prerender');

  this.timeline();

  if (this.autoClear) {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
  this.updateTimeline(this.snippet);
  this.updatePosture();

  var i = 0;
  var l = this.childs.length;
  while (i < l) {
    var child = this.childs[i];
    if (!child.isVisible() || !child._ready) continue;
    child.render(this.ctx);
    i++;
  }

  this.emit('postrender');
};

/**
 * 引擎的时间轴
 *
 * @method timeline
 * @private
 */
Stage.prototype.timeline = function () {
  this.snippet = Date.now() - this.pt;
  if (this.pt === null || this.snippet > 200) {
    this.pt = Date.now();
    this.snippet = Date.now() - this.pt;
  }

  if (this.enableFPS) {
    this._renderTimes++;
    this._takeTime += Math.max(15, this.snippet);
    this.fps = 1000 / Math.max(15, this.snippet) >> 0;
    this.averageFps = 1000 / (this._takeTime / this._renderTimes) >> 0;
  }

  this.pt += this.snippet;
};

/**
 * 启动渲染引擎的渲染循环
 */
Stage.prototype.startEngine = function () {
  if (this.inRender) return;
  this.inRender = true;
  this.renderer();
};

/**
 * 关闭渲染引擎的渲染循环
 */
Stage.prototype.stopEngine = function () {
  CAF(this.loop);
  this.inRender = false;
};

/**
 * 渲染循环
 *
 * @method renderer
 */
Stage.prototype.renderer = function () {
  var This = this;
  /**
   * render loop
   */
  function render() {
    This.render();
    This.loop = RAF(render);
  }
  render();
};

/**
 * 标记场景是否可交互，涉及到是否进行事件检测
 *
 * @member {Boolean}
 * @name interactive
 * @memberof JC.Stage#
 */
Object.defineProperty(Stage.prototype, 'interactive', {
  get: function get() {
    return this._interactive;
  },
  set: function set(value) {
    if (this._interactive !== value) {
      this._interactive = value;
      this.interactiveOnChange();
    }
  }
});

/**
 * 场景设置分辨率
 *
 * @member {Number}
 * @name resolution
 * @memberof JC.Stage#
 */
Object.defineProperty(Stage.prototype, 'resolution', {
  get: function get() {
    return this._resolution;
  },
  set: function set(value) {
    if (this._resolution !== value) {
      this._resolution = value;
      this.scale = value;
      this.resize();
    }
  }
});

exports.Tween = Tween;
exports.Utils = Utils;
exports.Texture = Texture;
exports.Loader = Loader;
exports.loaderUtil = loaderUtil;
exports.ParserAnimation = ParserAnimation;
exports.Bounds = Bounds;
exports.Point = Point;
exports.Rectangle = Rectangle;
exports.Matrix = Matrix;
exports.IDENTITY = IDENTITY;
exports.TEMP_MATRIX = TEMP_MATRIX;
exports.BezierCurve = BezierCurve;
exports.DisplayObject = DisplayObject;
exports.Container = Container;
exports.Sprite = Sprite;
exports.Graphics = Graphics;
exports.Stage = Stage;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=jcc2d.light.js.map
