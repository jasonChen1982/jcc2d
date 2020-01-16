
/**
 * jcc2d.js
 * (c) 2014-2020 jason chen
 * Released under the MIT License.
 */

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
   * @param {number} degree 角度数
   * @return {number} 弧度数
   */
  DTR: function DTR(degree) {
    return degree * Math.PI / 180;
  },


  /**
   * 将弧度转化成角度的乘法因子
   *
   * @static
   * @memberof JC.Utils
   * @param {number} radian 角度数
   * @return {number} 弧度数
   */
  RTD: function RTD(radian) {
    return radian * 180 / Math.PI;
  },


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
   * @param {Number} n 当前值
   * @param {Number} m 模
   * @return {Number} 映射到模长内的值
   */
  euclideanModulo: function euclideanModulo(n, m) {
    return (n % m + m) % m;
  },

  /**
   * 边界值域镜像
   *
   * @static
   * @method
   * @memberof JC.Utils
   * @param {Number} n 当前值
   * @param {Number} min 值域下边界
   * @param {Number} max 值域上边界
   * @return {Number} 值域内反射到的值
   */
  codomainBounce: function codomainBounce(n, min, max) {
    if (n < min) return 2 * min - n;
    if (n > max) return 2 * max - n;
    return n;
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
 * @return {this}
 */
Eventer.prototype.on = function (type, fn) {
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
  return this;
};

/**
 * 事件对象的一次性事件绑定函数
 *
 * @param {String} type 事件类型
 * @param {Function} fn 回调函数
 * @return {this}
 */
Eventer.prototype.once = function (type, fn) {
  if (!Utils.isFunction(fn)) return;
  var This = this;
  var cb = function cb(ev) {
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
 * @return {number} 二分法猜测t的值
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

/* eslint no-cond-assign: "off" */
/* eslint new-cap: 0 */
/* eslint max-len: 0 */

/**
 * Tween 缓动时间运动函数集合
 *
 * ```js
 * dispay.animate({
 *   from: {x: 100},
 *   to: {x: 200},
 *   ease: JC.Tween.Ease.In, // 配置要调用的运动函数
 * })
 * ```
 * @namespace JC.Tween
 */

var Tween = {

  Linear: {

    None: function None(k) {
      return k;
    }

  },

  Ease: {

    In: function () {
      var bezier = new BezierEasing(.42, 0, 1, 1);
      return function (k) {
        return bezier.get(k);
      };
    }(),

    Out: function () {
      var bezier = new BezierEasing(0, 0, .58, 1);
      return function (k) {
        return bezier.get(k);
      };
    }(),

    InOut: function () {
      var bezier = new BezierEasing(.42, 0, .58, 1);
      return function (k) {
        return bezier.get(k);
      };
    }(),

    Bezier: function Bezier(x1, y1, x2, y2) {
      var bezier = new BezierEasing(x1, y1, x2, y2);
      return function (k) {
        return bezier.get(k);
      };
    }

  },

  Elastic: {

    In: function In(k) {
      if (k === 0) {
        return 0;
      }
      if (k === 1) {
        return 1;
      }
      return -Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
    },

    Out: function Out(k) {
      if (k === 0) {
        return 0;
      }
      if (k === 1) {
        return 1;
      }
      return Math.pow(2, -10 * k) * Math.sin((k - 0.1) * 5 * Math.PI) + 1;
    },

    InOut: function InOut(k) {
      if (k === 0) {
        return 0;
      }
      if (k === 1) {
        return 1;
      }
      k *= 2;
      if (k < 1) {
        return -0.5 * Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
      }
      return 0.5 * Math.pow(2, -10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI) + 1;
    }

  },

  Back: {

    In: function In(k) {
      var s = 1.70158;
      return k * k * ((s + 1) * k - s);
    },

    Out: function Out(k) {
      var s = 1.70158;
      return --k * k * ((s + 1) * k + s) + 1;
    },

    InOut: function InOut(k) {
      var s = 1.70158 * 1.525;
      if ((k *= 2) < 1) {
        return 0.5 * (k * k * ((s + 1) * k - s));
      }
      return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
    }

  },

  Bounce: {

    In: function In(k) {
      return 1 - Tween.Bounce.Out(1 - k);
    },

    Out: function Out(k) {
      if (k < 1 / 2.75) {
        return 7.5625 * k * k;
      } else if (k < 2 / 2.75) {
        return 7.5625 * (k -= 1.5 / 2.75) * k + 0.75;
      } else if (k < 2.5 / 2.75) {
        return 7.5625 * (k -= 2.25 / 2.75) * k + 0.9375;
      } else {
        return 7.5625 * (k -= 2.625 / 2.75) * k + 0.984375;
      }
    },

    InOut: function InOut(k) {
      if (k < 0.5) {
        return Tween.Bounce.In(k * 2) * 0.5;
      }
      return Tween.Bounce.Out(k * 2 - 1) * 0.5 + 0.5;
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

  // this.onComplete = options.onComplete || null;
  // this.onUpdate = options.onUpdate || null;

  this.infinite = options.infinite || false;
  this.alternate = options.alternate || false;
  this.repeats = options.repeats || 0;
  this.delay = options.delay || 0;
  this.wait = options.wait || 0;
  this.timeScale = Utils.isNumber(options.timeScale) ? options.timeScale : 1;

  if (options.onComplete) {
    this.on('complete', options.onComplete.bind(this));
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

  this.progress += snippetCache;
  var isEnd = false;
  var progressCache = this.progress;

  if (this.spill()) {
    if (this.repeatsCut > 0 || this.infinite) {
      if (this.repeatsCut > 0) --this.repeatsCut;
      this.delayCut = this.delay;
      if (this.alternate) {
        this.direction *= -1;
        this.progress = Utils.codomainBounce(this.progress, 0, this.duration);
      } else {
        this.direction = 1;
        this.progress = Utils.euclideanModulo(this.progress, this.duration);
      }
    } else {
      isEnd = true;
    }
  }

  var pose = void 0;
  if (!isEnd) {
    pose = this.nextPose();
    this.emit('update', pose, this.progress / this.duration);
  } else {
    if (!this.resident) this.living = false;
    this.progress = Utils.clamp(progressCache, 0, this.duration);
    pose = this.nextPose();
    this.emit('complete', pose, Math.abs(progressCache - this.progress));
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
 * 线性插值
 * @private
 * @param {number} p0 起始位置
 * @param {number} p1 结束位置
 * @param {number} t  进度位置
 * @return {Number}
 */
Animate.prototype.linear = function (p0, p1, t) {
  return (p1 - p0) * t + p0;
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

  // collect from pose, when from was not complete
  options.from = options.from || {};
  for (var i in options.to) {
    if (Utils.isUndefined(options.from[i])) {
      options.from[i] = this.element[i];
    }
  }

  this.ease = options.ease || Tween.Ease.InOut;
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
  var t = this.ease(this.progress / this.duration);
  for (var i in this.to) {
    pose[i] = this.linear(this.from[i], this.to[i], t);
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
    if (isNaN(divisions)) {
      divisions = this.__arcLengthDivisions ? this.__arcLengthDivisions : 200;
    }

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

    // NOTE: svg and bezier accept out of [0, 1] value
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

  this.ease = options.ease || Tween.Ease.InOut;

  this.lengthMode = Utils.isBoolean(options.lengthMode) ? options.lengthMode : false;

  this.attachTangent = Utils.isBoolean(options.attachTangent) ? options.attachTangent : false;

  this._cacheRotate = this.element.rotation;
  var radian = this._cacheRotate;
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
  var t = this.ease(this.progress / this.duration);
  var pos = this.lengthMode ? this.path.getPointAt(t) : this.path.getPoint(t);

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
  var vector = this.lengthMode ? this.path.getTangentAt(t) : this.path.getTangent(t);

  var nor = this._cacheVector.x * vector.y - vector.x * this._cacheVector.y;
  var pi = nor > 0 ? 1 : -1;
  var cos = (vector.x * this._cacheVector.x + vector.y * this._cacheVector.y) / (Math.sqrt(vector.x * vector.x + vector.y * vector.y) * Math.sqrt(this._cacheVector.x * this._cacheVector.x + this._cacheVector.y * this._cacheVector.y));
  if (isNaN(cos)) return false;
  return pi * Math.acos(cos) * Utils.RTD;
};

/**
 * 贝塞尔曲线类 note: 一般来说超过5阶的贝塞尔曲线并不是非常实用，你可以尝试 JC 的其他曲线类型
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
 * detect number was in [min, max]
 * @method
 * @param {number} v   value
 * @param {number} min lower
 * @param {number} max upper
 * @return {boolean} in [min, max] range ?
 */
function inRange$1(v, min, max) {
  return v >= min && v <= max;
}

/**
 * detect current frame index
 * @method
 * @param {array} steps frames array
 * @param {number} progress current time
 * @return {number} which frame index
 */
function findStep$1(steps, progress) {
  var last = steps.length - 1;
  for (var i = 0; i < last; i++) {
    var step = steps[i];
    if (inRange$1(progress, step.ost, step.oet)) {
      return i;
    }
  }
}

/**
 * prefix
 * @method
 * @param {object} asset asset
 * @param {string} prefix prefix
 * @return {string}
 */
function createUrl(asset, prefix) {
  if (prefix) prefix = prefix.replace(/\/?$/, '/');
  var up = asset.u + asset.p;
  var url = asset.up || prefix + up;
  return url;
}

/**
 * get assets from keyframes assets
 * @method
 * @param {string} id assets refid
 * @param {object} assets assets object
 * @return {object} asset object
 */
function getAssets(id, assets) {
  for (var i = 0; i < assets.length; i++) {
    if (id === assets[i].id) return assets[i];
  }
  return {};
}

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
    var bezier = bezierPool[nm[i]] || bezierPool[nm[0]];
    var rate = bezier.get(p);
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

/**
 * interpolation keyframes and return value
 * @ignore
 * @param {object} keyframes keyframes with special prop
 * @param {number} progress progress
 * @param {object} indexCache index cache
 * @param {string} key prop name
 * @return {array}
 */
function interpolation(keyframes, progress, indexCache, key) {
  var aksk = keyframes.k;
  if (keyframes.expression) {
    progress = keyframes.expression.update(progress);
  }
  if (progress <= keyframes.ost) {
    return aksk[0].s;
  } else if (progress >= keyframes.oet) {
    var last = aksk.length - 2;
    return aksk[last].e;
  } else {
    var ick = indexCache[key];
    var frame = aksk[ick];
    if (!Utils.isNumber(ick) || !inRange$1(progress, frame.ost, frame.oet)) {
      ick = indexCache[key] = findStep$1(aksk, progress);
      frame = aksk[ick];
    }
    var rate = (progress - frame.ost) / (frame.oet - frame.ost);
    if (frame.curve) {
      return getEaseingPath(frame.curve, frame.n, rate);
    } else {
      return getEaseing(frame.s, frame.e, frame.n, rate);
    }
  }
}

/* eslint guard-for-in: "off" */

var PROPS_MAP = {
  o: {
    props: ['alpha'],
    scale: 0.01
  },
  r: {
    props: ['rotation'],
    scale: 1
  },
  p: {
    props: ['x', 'y'],
    scale: 1
  },
  a: {
    props: ['pivotX', 'pivotY'],
    scale: 1
  },
  s: {
    props: ['scaleX', 'scaleY'],
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
 * @return {number} 当前进度停留在第几帧
 */
function findStep(steps, progress) {
  var last = steps.length - 1;
  for (var i = 0; i < last; i++) {
    var step = steps[i];
    if (inRange(progress, step.jcst, step.jcet)) {
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

  this.layer = Utils.copyJSON(options.layer);
  this.fr = options.fr || 30;
  this.tpf = 1000 / this.fr;

  this.iipt = this.layer.ip * this.tpf;
  this.iopt = this.layer.op * this.tpf;

  this.ip = options.ip === undefined ? this.layer.ip : options.ip;
  this.op = options.op === undefined ? this.layer.op : options.op;

  this.tfs = Math.floor(this.op - this.ip);
  this.duration = this.tfs * this.tpf;

  // this.keyState = {};
  this.aks = {};
  this.kic = {};

  this.preParser();
  this.nextPose();
}
KeyFrames.prototype = Object.create(Animate.prototype);

/**
 * 预解析关键帧
 * @private
 */
KeyFrames.prototype.preParser = function () {
  var ks = this.layer.ks;
  for (var key in ks) {
    if (ks[key].a) {
      this.parserDynamic(key);
    } else {
      this.parserStatic(key);
    }
  }
};

/**
 * 预解析动态属性的关键帧
 * @private
 * @param {string} key 所属的属性
 */
KeyFrames.prototype.parserDynamic = function (key) {
  var ksp = this.layer.ks[key];
  var kspk = ksp.k;

  ksp.jcst = kspk[0].t * this.tpf;
  ksp.jcet = kspk[kspk.length - 1].t * this.tpf;

  for (var i = 0; i < kspk.length; i++) {
    var sbk = kspk[i];
    var sek = kspk[i + 1];
    if (sek) {
      sbk.jcst = sbk.t * this.tpf;
      sbk.jcet = sek.t * this.tpf;
      if (Utils.isString(sbk.n) && sbk.ti && sbk.to) {
        prepareEaseing(sbk.o.x, sbk.o.y, sbk.i.x, sbk.i.y);
        var sp = new Point(sbk.s[0], sbk.s[1]);
        var ep = new Point(sbk.e[0], sbk.e[1]);
        var c1 = new Point(sbk.s[0] + sbk.ti[0], sbk.s[1] + sbk.ti[1]);
        var c2 = new Point(sbk.e[0] + sbk.to[0], sbk.e[1] + sbk.to[1]);
        sbk.curve = new BezierCurve([sp, c1, c2, ep]);
      } else {
        for (var _i = 0; _i < sbk.n.length; _i++) {
          prepareEaseing(sbk.o.x[_i], sbk.o.y[_i], sbk.i.x[_i], sbk.i.y[_i]);
        }
      }
    }
  }

  this.aks[key] = ksp;
};

/**
 * 预解析静态属性的关键帧
 * @private
 * @param {string} key 所属的属性
 */
KeyFrames.prototype.parserStatic = function (key) {
  // const prop = PM[key].label;
  // const scale = PM[key].scale;
  // let k = 0;
  // if (Utils.isString(prop)) {
  //   if (Utils.isNumber(ks[key].k)) {
  //     k = ks[key].k;
  //   }
  //   if (Utils.isArray(ks[key].k)) {
  //     k = ks[key].k[0];
  //   }
  //   this.element[prop] = scale * k;
  // } else if (Utils.isArray(prop)) {
  //   for (let i = 0; i < prop.length; i++) {
  //     k = ks[key].k[i];
  //     this.element[prop[i]] = scale * k;
  //   }
  // }

  var ksp = this.layer.ks[key];
  var kspk = ksp.k;
  if (Utils.isNumber(kspk)) kspk = [kspk];

  this.setValue(key, kspk);
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
    this.setValue(key, pose[key]);
  }
  return pose;
};

/**
 * 计算关键帧属性值
 * @private
 * @param {string} key 关键帧配置
 * @param {object} ak 所属的属性
 * @return {array}
 */
KeyFrames.prototype.interpolation = function (key, ak) {
  var akk = ak.k;
  var progress = Utils.clamp(this.progress, 0, ak.jcet);
  var skt = ak.jcst;
  var ekt = ak.jcet;
  var invisible = progress < this.iipt;
  if (invisible === this.element.visible) this.element.visible = !invisible;

  if (progress <= skt) {
    return akk[0].s;
  } else if (progress >= ekt) {
    var last = akk.length - 2;
    return akk[last].e;
  } else {
    var kic = this.kic[key];
    if (!Utils.isNumber(kic) || !inRange(progress, akk[kic].jcst, akk[kic].jcet)) {
      kic = this.kic[key] = findStep(akk, progress);
    }
    var frame = akk[kic];
    var rate = (progress - frame.jcst) / (frame.jcet - frame.jcst);
    if (frame.curve) {
      return getEaseingPath(frame.curve, frame.n, rate);
    } else {
      return getEaseing(frame.s, frame.e, frame.n, rate);
    }
  }
};

/**
 * 更新元素的属性值
 * @private
 * @param {string} key 属性
 * @param {array} value 属性值
 */
KeyFrames.prototype.setValue = function (key, value) {
  var props = PROPS_MAP[key].props;
  var scale = PROPS_MAP[key].scale;
  for (var i = 0; i < props.length; i++) {
    var v = value[i];
    this.element[props[i]] = scale * v;
  }
};

// import {Utils} from '../utils/Utils';

/**
 * AnimateRunner类型动画类
 *
 * @class
 * @memberof JC
 * @param {object} runner 动画属性参数
 * @param {object} [options] queue动画配置
 */
function Queues(runner, options) {
  Animate.call(this, options);

  this.runners = [];
  this.queues = [];
  this.cursor = 0;
  this.total = 0;
  this.alternate = false;

  if (runner) this.then(runner);
}
Queues.prototype = Object.create(Animate.prototype);

/**
 * 更新下一个`runner`
 * @param {Object} runner
 * @return {this}
 * @private
 */
Queues.prototype.then = function (runner) {
  this.queues.push(runner);

  this.total = this.queues.length;
  return this;
};

/**
 * 更新下一个`runner`
 * @param {Object} _
 * @param {Number} time
 * @private
 */
Queues.prototype.nextOne = function (_, time) {
  this.runners[this.cursor].init();
  this.cursor++;
  this.timeSnippet = time;
};

/**
 * 初始化当前`runner`
 * @private
 */
Queues.prototype.initOne = function () {
  var runner = this.queues[this.cursor];
  runner.infinite = false;
  runner.resident = true;
  runner.element = this.element;

  var animate = null;
  if (runner.path) {
    animate = new PathMotion(runner);
  } else if (runner.to) {
    animate = new Transition(runner);
  }
  if (animate !== null) {
    animate.on('complete', this.nextOne.bind(this));
    this.runners.push(animate);
  }
};

/**
 * 下一帧的状态
 * @private
 * @param {number} snippetCache 时间片段
 * @return {object}
 */
Queues.prototype.nextPose = function (snippetCache) {
  if (!this.runners[this.cursor] && this.queues[this.cursor]) {
    this.initOne();
  }
  if (this.timeSnippet > 0) {
    snippetCache += this.timeSnippet;
    this.timeSnippet = 0;
  }
  return this.runners[this.cursor].update(snippetCache);
};

/**
 * 更新动画数据
 * @private
 * @param {number} snippet 时间片段
 * @return {object}
 */
Queues.prototype.update = function (snippet) {
  if (this.wait > 0) {
    this.wait -= Math.abs(snippet);
    return;
  }
  if (this.paused || !this.living || this.delayCut > 0) {
    if (this.delayCut > 0) this.delayCut -= Math.abs(snippet);
    return;
  }

  var cc = this.cursor;

  var pose = this.nextPose(this.timeScale * snippet);

  this.emit('update', {
    index: cc, pose: pose
  }, this.progress / this.duration);

  if (this.spill()) {
    if (this.repeats > 0 || this.infinite) {
      if (this.repeats > 0) --this.repeats;
      this.delayCut = this.delay;
      this.cursor = 0;
    } else {
      if (!this.resident) this.living = false;
      this.emit('complete', pose);
    }
  }
  return pose;
};

/**
 * 检查动画是否到了边缘
 * @private
 * @return {boolean}
 */
Queues.prototype.spill = function () {
  // TODO: 这里应该保留溢出，不然会导致时间轴上的误差
  var topSpill = this.cursor >= this.total;
  return topSpill;
};

// import {AnimateRunner} from './AnimateRunner';
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
// Animation.prototype.runners = function(options, clear) {
//   options.element = this.element;
//   return this._addMove(new AnimateRunner(options), clear);
// };
Animation.prototype.queues = function (runner, options, clear) {
  options.element = this.element;
  return this._addMove(new Queues(runner, options), clear);
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

// const TextureCache = {};

var URL = 'url';
var IMG = 'img';

/**
 *
 * @param {Object} frame object
 * @return {Boolean}
 */
function isFrame(frame) {
  return frame.tagName === 'VIDEO' || frame.tagName === 'CANVAS' || frame.tagName === 'IMG';
}

/**
 * 图片纹理类
 *
 * @class
 * @memberof JC
 * @param {string | Image} texture 图片url或者图片对象.
 * @param {object} options 图片配置
 * @param {boolean} [options.lazy=false] 图片是否需要懒加载
 * @param {string} [options.crossOrigin] 图片是否配置跨域
 * @extends JC.Eventer
 */
function Texture(texture, options) {
  Eventer.call(this);
  options = options || {};

  this.type = '';
  this.url = '';
  this.texture = null;
  this.crossOrigin = options.crossOrigin;
  this.loaded = false;
  this.hadload = false;
  this.lazy = options.lazy || false;

  if (Utils.isString(texture)) {
    this.type = URL;
    this.url = texture;
    this.texture = this.resole();
    this.texture.crossOrigin = this.crossOrigin;
    if (!this.lazy) this.load();
  } else if (isFrame(texture)) {
    this.type = IMG;
    this.loaded = true;
    this.hadload = true;
    this.texture = texture;
  } else {
    console.warn('texture not support this texture');
    return;
  }

  this.listen();
}
Texture.prototype = Object.create(Eventer.prototype);

/**
 * 创建一个图片
 *
 * @private
 * @return {Image}
 */
Texture.prototype.resole = function () {
  return new Image();
};

/**
 * 尝试加载图片
 *
 * @param {String} url 图片url或者图片对象.
 */
Texture.prototype.load = function (url) {
  if (this.hadload || this.type !== URL) return;
  url = url || this.url;
  this.hadload = true;
  this.texture.src = url;
};

/**
 * 监听加载事件
 */
Texture.prototype.listen = function () {
  var _this = this;

  this.texture.addEventListener('load', function () {
    _this.loaded = true;
    _this.emit('load');
  });
  this.texture.addEventListener('error', function () {
    _this.emit('error');
  });
};

/**
 * 获取纹理的宽
 *
 * @member width
 * @property {Number} width 纹理的宽
 * @memberof JC.Texture
 */
Object.defineProperty(Texture.prototype, 'width', {
  get: function get() {
    return this.texture ? this.texture.width : 0;
  }
});

/**
 * 获取纹理的高
 *
 * @member height
 * @property {Number} height 纹理的高
 * @memberof JC.Texture
 */
Object.defineProperty(Texture.prototype, 'height', {
  get: function get() {
    return this.texture ? this.texture.height : 0;
  }
});

/**
 * 获取纹理的原始宽
 *
 * @member naturalWidth
 * @property {Number} naturalWidth 纹理的原始宽
 * @memberof JC.Texture
 */
Object.defineProperty(Texture.prototype, 'naturalWidth', {
  get: function get() {
    return this.texture ? this.texture.naturalWidth || this.texture.width : 0;
  }
});

/**
 * 获取纹理的原始高
 *
 * @member naturalHeight
 * @property {Number} naturalHeight 纹理的原始高
 * @memberof JC.Texture
 */
Object.defineProperty(Texture.prototype, 'naturalHeight', {
  get: function get() {
    return this.texture ? this.texture.naturalHeight || this.texture.height : 0;
  }
});

/**
 * 图片资源加载器
 *
 * @class
 * @param {String} crossOrigin cross-origin config
 * @namespace JC.Loader
 * @extends JC.Eventer
 */
function Loader(crossOrigin) {
  Eventer.call(this);
  this.crossOrigin = crossOrigin;
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
    this.textures[src] = new Texture(srcMap[src], { crossOrigin: this.crossOrigin });
    bind(this.textures[src]);
  }

  /**
   * @param {Texture} texture
   */
  function bind(texture) {
    texture.on('load', function () {
      This._received++;
      This.emit('update');
      if (This._received + This._failed >= This._total) This.emit('complete');
    });
    texture.on('error', function () {
      This._failed++;
      This.emit('update');
      if (This._received + This._failed >= This._total) This.emit('complete');
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
Object.defineProperty(Loader.prototype, 'progress', {
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
 * @param {String} crossOrigin cross-origin config
 * @return {JC.Loader}
 */
var loaderUtil = function loaderUtil(srcMap, crossOrigin) {
  return new Loader(crossOrigin).load(srcMap);
};

/**
 * ticker class
 * @param {boolean} enableFPS
 */
function Ticker(enableFPS) {
  Eventer.call(this);

  /**
   * 是否记录渲染性能
   *
   * @member {Boolean}
   */
  this.enableFPS = Utils.isBoolean(enableFPS) ? enableFPS : true;

  /**
   * 上一次绘制的时间点
   *
   * @member {Number}
   * @private
   */
  this.pt = 0;

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
   * 是否开启 ticker
   *
   * @member {Boolean}
   */
  this.started = false;

  /**
   * 是否暂停 ticker
   *
   * @member {Boolean}
   */
  this.paused = false;
}

Ticker.prototype = Object.create(Eventer.prototype);

Ticker.prototype.timeline = function () {
  this.snippet = Date.now() - this.pt;
  if (this.pt === 0 || this.snippet > 200) {
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

Ticker.prototype.tick = function () {
  if (this.paused) return;
  this.emit('pretimeline');
  this.timeline();
  this.emit('posttimeline', this.snippet);
  this.emit('update', this.snippet);
  this.emit('tick', this.snippet);
};

/**
 * 渲染循环
 *
 * @method start
 */
Ticker.prototype.start = function () {
  var _this = this;

  if (this.started) return;
  this.started = true;
  var loop = function loop() {
    _this.tick();
    _this.loop = RAF(loop);
  };
  loop();
};

/**
 * 渲染循环
 *
 * @method stop
 */
Ticker.prototype.stop = function () {
  CAF(this.loop);
  this.started = false;
};

/**
 * 暂停触发 tick
 *
 * @method pause
 */
Ticker.prototype.pause = function () {
  this.paused = true;
};

/**
 * 恢复触发 tick
 *
 * @method resume
 */
Ticker.prototype.resume = function () {
  this.paused = false;
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
  this.minX = Utils.isNumber(minX) ? minX : Infinity;

  /**
   * @member {number}
   * @default 0
   */
  this.minY = Utils.isNumber(minY) ? minY : Infinity;

  /**
   * @member {number}
   * @default 0
   */
  this.maxX = Utils.isNumber(maxX) ? maxX : -Infinity;

  /**
   * @member {number}
   * @default 0
   */
  this.maxY = Utils.isNumber(maxY) ? maxY : -Infinity;

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
  newPos = newPos || {};
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
 * @param {number} originX
 * @param {number} originY
 * @return {this}
 */
Matrix.prototype.setTransform = function (x, y, pivotX, pivotY, scaleX, scaleY, rotation, skewX, skewY, originX, originY) {
  var sr = Math.sin(rotation);
  var cr = Math.cos(rotation);
  var sy = Math.tan(skewY);
  var nsx = Math.tan(skewX);

  var a = cr * scaleX;
  var b = sr * scaleX;
  var c = -sr * scaleY;
  var d = cr * scaleY;

  var pox = pivotX + originX;
  var poy = pivotY + originY;

  this.a = a + sy * c;
  this.b = b + sy * d;
  this.c = nsx * a + c;
  this.d = nsx * b + d;

  this.tx = x - pox * this.a - poy * this.c + originX;
  this.ty = y - pox * this.b - poy * this.d + originY;

  return this;
};
var IDENTITY = new Matrix();
var TEMP_MATRIX = new Matrix();

/**
 *
 * @class
 * @memberof JC
 * @param {Array}  points  array of points
 */
function CatmullRom(points) {
  this.points = points;

  this.passCmp = {
    x: true,
    y: true,
    z: false
  };

  this.ccmp = {};

  this.updateCcmp();
}

CatmullRom.prototype = Object.create(Curve.prototype);

CatmullRom.prototype.updateCcmp = function () {
  for (var i = 0; i < this.points.length; i++) {
    var point = this.points[i];
    for (var cmp in this.passCmp) {
      if (this.passCmp[cmp] && !Utils.isUndefined(point[cmp])) {
        this.ccmp[cmp] = this.ccmp[cmp] || [];
        this.ccmp[cmp][i] = point[cmp];
      }
    }
  }
};

CatmullRom.prototype.getPoint = function (k) {
  var point = new Point();
  for (var cmp in this.passCmp) {
    if (this.passCmp[cmp]) {
      point[cmp] = this.solveEachCmp(this.ccmp[cmp], k);
    }
  }
  return point;
};

CatmullRom.prototype.solveEachCmp = function (v, k) {
  var m = v.length - 1;
  var f = m * k;
  var i = Math.floor(f);
  var fn = this.solve;

  if (v[0] === v[m]) {
    if (k < 0) {
      i = Math.floor(f = m * (1 + k));
    }

    return fn(v[(i - 1 + m) % m], v[i], v[(i + 1) % m], v[(i + 2) % m], f - i);
  } else {
    if (k < 0) {
      return v[0] - (fn(v[0], v[0], v[1], v[1], -f) - v[0]);
    }

    if (k > 1) {
      return v[m] - (fn(v[m], v[m], v[m - 1], v[m - 1], f - m) - v[m]);
    }

    return fn(v[i ? i - 1 : 0], v[i], v[m < i + 1 ? m : i + 1], v[m < i + 2 ? m : i + 2], f - i);
  }
};

CatmullRom.prototype.solve = function (p0, p1, p2, p3, t) {
  var v0 = (p2 - p0) * 0.5;
  var v1 = (p3 - p1) * 0.5;
  var t2 = t * t;
  var t3 = t * t2;

  /* eslint max-len: 0 */
  return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;
};

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
   * 控制渲染对象的x变换中心
   *
   * @member {Number}
   */
  this.originX = 0;

  /**
   * 控制渲染对象的y变换中心
   *
   * @member {Number}
   */
  this.originY = 0;

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
  this.animation = new Animation(this);

  /**
   * 标记当前对象是否为touchstart触发状态
   *
   * @private
   * @member {Boolean}
   */
  // this._touchstarted = false;

  /**
   * 标记当前对象是否为mousedown触发状态
   *
   * @private
   * @member {Boolean}
   */
  // this._mousedowned = false;

  /**
   * 渲染对象是否具备光标样式，例如 cursor
   *
   * @member {Boolean}
   */
  // this.buttonMode = false;

  /**
   * 当渲染对象是按钮时所具备的光标样式
   *
   * @member {Boolean}
   */
  this.cursor = '';

  /**
   * Enable interaction events for the DisplayObject. Touch, pointer and mouse
   * events will not be emitted unless `interactive` is set to `true`.
   *
   * @member {boolean}
   */
  this.interactive = false;

  /**
   * Determines if the children to the displayObject can be clicked/touched
   * Setting this to false allows PixiJS to bypass a recursive `hitTest` function
   *
   * @member {boolean}
   * @memberof PIXI.Container#
   */
  this.interactiveChildren = true;
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
 * 对渲染对象进行x、y轴同时缩放
 *
 * @name scale
 * @member {Number}
 * @memberof JC.DisplayObject#
 */
Object.defineProperty(DisplayObject.prototype, 'trackedPointers', {
  get: function get() {
    if (this._trackedPointers === undefined) this._trackedPointers = {};
    return this._trackedPointers;
  }
});

/**
 * animate动画，指定动画的启始位置和结束位置
 *
 * ```js
 * display.animate({
 *   from: {x: 100},
 *   to: {x: 200},
 *   ease: JC.Tween.Bounce.Out, // 执行动画使用的缓动函数 默认值为 JC.Tween.Ease.InOut
 *   repeats: 10, // 动画运动完后再重复10次
 *   infinite: true, // 无限循环动画
 *   alternate: true, // 偶数次的时候动画回放
 *   duration: 1000, // 动画时长 ms单位 默认 300ms
 *   onUpdate: function(state,rate){},
 *   onComplete: function(){ console.log('end'); } // 动画执行结束回调
 * });
 * ```
 *
 * @param {Object} options 动画配置参数
 * @param {Object} [options.from] 设置对象的起始位置和起始姿态等，该项配置可选
 * @param {Object} options.to 设置对象的结束位置和结束姿态等
 * @param {String} [options.ease] 执行动画使用的缓动函数 默认值为 JC.Tween.Ease.InOut
 * @param {Number} [options.repeats] 设置动画执行完成后再重复多少次，优先级没有infinite高
 * @param {Boolean} [options.infinite] 设置动画无限次执行，优先级高于repeats
 * @param {Boolean} [options.alternate] 设置动画是否偶数次回返
 * @param {Number} [options.duration] 设置动画执行时间 默认 300ms
 * @param {Number} [options.wait] 设置动画延迟时间，在重复动画不会生效 默认 0ms
 * @param {Number} [options.delay] 设置动画延迟时间，在重复动画也会生效 默认 0ms
 * @param {Function} [options.onUpdate] 设置动画更新时的回调函数
 * @param {Function} [options.onComplete] 设置动画结束时的回调函数，如果infinite为true该事件将不会触发
 * @param {Boolean} clear 是否去掉之前的动画
 * @return {JC.Animate}
 */
DisplayObject.prototype.animate = function (options, clear) {
  return this.animation.animate(options, clear);
};

/**
 * motion动画，让物体按照设定好的曲线运动
 *
 * ```js
 * display.motion({
 *   path: new JC.SvgCurve('M10 10 H 90 V 90 H 10 L 10 10), // path路径，需要继承自Curve
 *   attachTangent: true, // 物体是否捕获切线方向
 *   ease: JC.Tween.Ease.bezier(0.25,0.1,0.25,1), // 执行动画使用的缓动函数 默认值为 JC.Tween.Ease.InOut
 *   repeats: 10, // 动画运动完后再重复10次
 *   infinite: true, // 无限循环动画
 *   alternate: true, // 偶数次的时候动画回放
 *   duration: 1000, // 动画时长 ms单位 默认 300ms
 *   onUpdate: function(state,rate){}, // 动画更新回调
 *   onComplete: function(){ console.log('end'); } // 动画执行结束回调
 * });
 * ```
 * @param {Object} options 动画配置参数
 * @param {Curve} options.path path路径，需要继承自Curve，可以传入BezierCurve实例、NURBSCurve实例、SvgCurve实例
 * @param {Boolean} [options.attachTangent] 物体是否捕获切线方向
 * @param {String} [options.ease] 执行动画使用的缓动函数 默认值为 JC.Tween.Ease.InOut
 * @param {Number} [options.repeats] 设置动画执行完成后再重复多少次，优先级没有infinite高
 * @param {Boolean} [options.infinite] 设置动画无限次执行，优先级高于repeats
 * @param {Boolean} [options.alternate] 设置动画是否偶数次回返
 * @param {Number} [options.duration] 设置动画执行时间 默认 300ms
 * @param {Number} [options.wait] 设置动画延迟时间，在重复动画不会生效 默认 0ms
 * @param {Number} [options.delay] 设置动画延迟时间，在重复动画也会生效 默认 0ms
 * @param {Function} [options.onUpdate] 设置动画更新时的回调函数
 * @param {Function} [options.onComplete] 设置动画结束时的回调函数，如果infinite为true该事件将不会触发
 * @param {Boolean} clear 是否去掉之前的动画
 * @return {JC.Animate}
 */
DisplayObject.prototype.motion = function (options, clear) {
  return this.animation.motion(options, clear);
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
 *   onComplete: function(){ console.log('end'); } // 动画执行结束回调
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
 * @param {Function} [options.onComplete] 设置动画结束时的回调函数，如果infinite为true该事件将不会触发
 * @param {Boolean} clear 是否去掉之前的动画
 * @return {JC.Animate}
 */
DisplayObject.prototype.keyFrames = function (options, clear) {
  return this.animation.keyFrames(options, clear);
};

/**
 * 不推荐使用，建议使用`queues`方法达到同样效果
 * runners动画，多个复合动画的组合形式，不支持`alternate`
 *
 * ```js
 * display.runners({
 *   runners: [
 *     { from: {}, to: {} },
 *     { path: JC.BezierCurve([ point1, point2, point3, point4 ]) },
 *   ], // 组合动画，支持组合 animate、motion
 *   delay: 1000, // ae导出的动画数据
 *   wait: 100, // ae导出的动画数据
 *   repeats: 10, // 动画运动完后再重复10次
 *   infinite: true, // 无限循环动画
 *   onUpdate: function(state,rate){},
 *   onComplete: function(){ console.log('end'); } // 动画执行结束回调
 * });
 * ```
 *
 * @param {Object} options 动画配置参数
 * @param {Object} options.runners 组合动画，支持 animate、motion 这些的自定义组合
 * @param {Number} [options.repeats=0] 设置动画执行完成后再重复多少次，优先级没有infinite高
 * @param {Boolean} [options.infinite=false] 设置动画无限次执行，优先级高于repeats
 * @param {Number} [options.wait=0] 设置动画延迟时间，在重复动画不会生效 默认 0ms
 * @param {Number} [options.delay=0] 设置动画延迟时间，在重复动画也会生效 默认 0ms
 * @param {Function} [options.onUpdate] 设置动画更新时的回调函数
 * @param {Function} [options.onComplete] 设置动画结束时的回调函数，如果infinite为true该事件将不会触发
 * @param {Boolean} clear 是否去掉之前的动画
 * @return {JC.Animate}
 */
DisplayObject.prototype.runners = function (options, clear) {
  return this.animation.runners(options, clear);
};

/**
 * 以链式调用的方式触发一串动画 （不支持`alternate`）
 *
 * ```js
 * display.queues({ from: { x: 1 }, to: { x: 2 } })
 *   .then({ path: JC.BezierCurve([ point1, point2, point3, point4 ]) })
 *   .then({ from: { x: 2 }, to: { x: 1 } })
 *   .then({ from: { scale: 1 }, to: { scale: 0 } })
 *   .on('complete', function() {
 *     console.log('end queues');
 *   });
 * ```
 *
 * @param {Object} [runner] 添加动画，可以是 animate 或者 motion 动画配置
 * @param {Object} [options={}] 整个动画的循环等配置
 * @param {Object} [options.repeats=0] 设置动画执行完成后再重复多少次，优先级没有infinite高
 * @param {Object} [options.infinite=false] 设置动画无限次执行，优先级高于repeats
 * @param {Number} [options.wait] 设置动画延迟时间，在重复动画不会生效 默认 0ms
 * @param {Number} [options.delay] 设置动画延迟时间，在重复动画也会生效 默认 0ms
 * @param {Boolean} [clear=false] 是否去掉之前的动画
 * @return {JC.Queues}
 */
DisplayObject.prototype.queues = function (runner) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var clear = arguments[2];

  return this.animation.queues(runner, options, clear);
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
 * @param {Matrix} rootMatrix
 * @method updateTransform
 */
DisplayObject.prototype.updateTransform = function (rootMatrix) {
  var pt = rootMatrix || this.hierarchy && this.hierarchy.worldTransform || this.parent && this.parent.worldTransform || IDENTITY;
  var wt = this.worldTransform;
  var worldAlpha = this.parent && this.parent.worldAlpha || 1;

  var a = void 0;
  var b = void 0;
  var c = void 0;
  var d = void 0;
  var tx = void 0;
  var ty = void 0;

  var pox = this.pivotX + this.originX;
  var poy = this.pivotY + this.originY;

  if (this.skewX || this.skewY) {
    TEMP_MATRIX.setTransform(this.x, this.y, this.pivotX, this.pivotY, this.scaleX, this.scaleY, this.rotation, this.skewX, this.skewY, this.originX, this.originY);

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
        this._sr = Math.sin(this.rotation);
        this._cr = Math.cos(this.rotation);
      }

      a = this._cr * this.scaleX;
      b = this._sr * this.scaleX;
      c = -this._sr * this.scaleY;
      d = this._cr * this.scaleY;
      tx = this.x;
      ty = this.y;

      if (this.pivotX || this.pivotY || this.originX || this.originY) {
        tx -= pox * a + poy * c - this.originX;
        ty -= pox * b + poy * d - this.originY;
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

      tx = this.x - pox * a + this.originX;
      ty = this.y - poy * d + this.originY;

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
  this.animation.update(snippet);
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
 * 更新bodymovin动画
 * @param {number} progress progress
 * @param {object} session
 */
Container.prototype.updateMovin = function (progress, session) {
  var length = this.childs.length;
  for (var i = 0; i < length; i++) {
    var doc = this.childs[i];
    if (doc && !doc._aniRoot && doc.updateMovin) {
      doc.updateMovin(progress, session);
    }
  }
  this.updateKeyframes && this.updateKeyframes(progress, session);
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
  this.emit('pretimeline', snippet);
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
  this.emit('posttimeline', snippet);
};

/**
 * 更新自身的透明度可矩阵姿态更新，并触发后代同步更新
 *
 * @private
 */
Container.prototype.updatePosture = function () {
  this.emit('preposture');
  if (this.souldSort) this._sortList();
  this.updateTransform();

  var i = 0;
  var l = this.childs.length;
  while (i < l) {
    var child = this.childs[i];
    child.updatePosture();
    i++;
  }
  this.emit('postposture');
};

/**
 * 渲染自己并触发后代渲染
 * @param {context} ctx
 * @private
 */
Container.prototype.render = function (ctx) {
  this.emit('prerender');
  ctx.save();
  this.setTransform(ctx);
  if (this.mask) this.mask.render(ctx);
  this.renderMe(ctx);

  var i = 0;
  var l = this.childs.length;
  while (i < l) {
    var child = this.childs[i];
    i++;
    if (!child.isVisible()) continue;
    child.render(ctx);
  }
  ctx.restore();
  this.emit('postrender');
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

  // this.onComplete = null;
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
      this.emit('complete');
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
  this.off('complete');
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
  if (options.onComplete) {
    var This = this;
    this.once('complete', function () {
      options.onComplete.call(This);
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
        this.once('complete', function () {
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
function Sprite() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  Container.call(this);

  this._width = 0;

  this._height = 0;

  this.ready = false;

  this.upTexture(options);

  this.movieClip = new MovieClip(this, options);
}
Sprite.prototype = Object.create(Container.prototype);

/**
 * 更新纹理对象
 *
 * @private
 * @param {json} options
 */
Sprite.prototype.upTexture = function (options) {
  var _this = this;

  if (!options.texture) return;
  if (!options.texture.loaded) {
    this.ready = false;
    options.texture.on('load', function () {
      _this.upTexture(options);
      _this.ready = true;
    });
    return;
  }

  this.ready = true;
  this.texture = options.texture;
  this.naturalWidth = options.texture.naturalWidth;
  this.naturalHeight = options.texture.naturalHeight;
  this.frame = options.frame || new Rectangle(0, 0, this.naturalWidth, this.naturalHeight);

  this.width = options.width || this.frame.width;
  this.height = options.height || this.frame.height;
  if (this.movieClip) {
    this.movieClip.preFrame = null;
  }
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
  this.animation.update(snippet);
  this.movieClip.update(snippet);
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
  return this.movieClip.playMovie(options);
};

/**
 * 更新对象本身的矩阵姿态以及透明度
 *
 * @private
 * @param {context} ctx
 */
Sprite.prototype.renderMe = function (ctx) {
  if (!this.ready) return;
  var frame = this.movieClip.getFrame();
  ctx.drawImage(this.texture.texture, frame.x, frame.y, frame.width, frame.height, 0, 0, this.width, this.height);
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
  this.buffer = this.ctx.getImageData(0, 0, this.width, this.height);
  return this.buffer;
};

/**
 * 放置像素到缓冲区
 * @return {canvas}
 */
FrameBuffer.prototype.putBuffer = function () {
  this.ctx.putImageData(this.buffer, 0, 0);
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
  if (this.meshType === '') console.error('不支持的绘制对象');

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

// import {Utils} from '../utils/Utils';

/**
 * 舞台对象，继承至 Container
 * @class
 * @extends JC.Container
 * @memberof JC
 */
function Scene() {
  Container.call(this);
}

Scene.prototype = Object.create(Container.prototype);

/**
 * 更新自身的透明度可矩阵姿态更新，并触发后代同步更新。
 * Scene 的 updatePosture 会接收一个来自 Renderer 的 rootMatrix。
 *
 * @private
 * @param {Matrix} [rootMatrix] 初始矩阵，由 Renderer 直接传入。
 */
Scene.prototype.updatePosture = function (rootMatrix) {
  this.emit('preposture');
  if (this.souldSort) this._sortList();
  this.updateTransform(rootMatrix);

  var i = 0;
  var l = this.childs.length;
  while (i < l) {
    this.childs[i].updatePosture();
    i++;
  }
  this.emit('postposture');
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();









var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

// import {Vector2} from 'three';
/**
 * Holds all information related to an Interaction event
 *
 * @class
 */

var InteractionData = function () {
  /**
   * InteractionData constructor
   */
  function InteractionData() {
    classCallCheck(this, InteractionData);

    /**
     * This point stores the global coords of where the touch/mouse event happened
     *
     * @member {Point}
     */
    this.global = new Point(-100000, -100000);

    /**
     * This resolution
     *
     * @member {Point}
     */
    this.resolution = new Point(1, 1);

    /**
     * The target DisplayObject that was interacted with
     *
     * @member {Object3D}
     */
    this.target = null;

    /**
     * When passed to an event handler, this will be the original DOM Event that was captured
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent
     * @see https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent
     * @see https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent
     * @member {MouseEvent|TouchEvent|PointerEvent}
     */
    this.originalEvent = null;

    /**
     * Unique identifier for this interaction
     *
     * @member {number}
     */
    this.identifier = null;

    /**
     * Indicates whether or not the pointer device that created the event is the primary pointer.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/isPrimary
     * @type {Boolean}
     */
    this.isPrimary = false;

    /**
     * Indicates which button was pressed on the mouse or pointer device to trigger the event.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
     * @type {number}
     */
    this.button = 0;

    /**
     * Indicates which buttons are pressed on the mouse or pointer device when the event is triggered.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons
     * @type {number}
     */
    this.buttons = 0;

    /**
     * The width of the pointer's contact along the x-axis, measured in CSS pixels.
     * radiusX of TouchEvents will be represented by this value.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/width
     * @type {number}
     */
    this.width = 0;

    /**
     * The height of the pointer's contact along the y-axis, measured in CSS pixels.
     * radiusY of TouchEvents will be represented by this value.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/height
     * @type {number}
     */
    this.height = 0;

    /**
     * The angle, in degrees, between the pointer device and the screen.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/tiltX
     * @type {number}
     */
    this.tiltX = 0;

    /**
     * The angle, in degrees, between the pointer device and the screen.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/tiltY
     * @type {number}
     */
    this.tiltY = 0;

    /**
     * The type of pointer that triggered the event.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pointerType
     * @type {string}
     */
    this.pointerType = null;

    /**
     * Pressure applied by the pointing device during the event. A Touch's force property
     * will be represented by this value.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pressure
     * @type {number}
     */
    this.pressure = 0;

    /**
     * From TouchEvents (not PointerEvents triggered by touches), the rotationAngle of the Touch.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Touch/rotationAngle
     * @type {number}
     */
    this.rotationAngle = 0;

    /**
     * Twist of a stylus pointer.
     * @see https://w3c.github.io/pointerevents/#pointerevent-interface
     * @type {number}
     */
    this.twist = 0;

    /**
     * Barrel pressure on a stylus pointer.
     * @see https://w3c.github.io/pointerevents/#pointerevent-interface
     * @type {number}
     */
    this.tangentialPressure = 0;
  }

  /**
   * The unique identifier of the pointer. It will be the same as `identifier`.
   * @readonly
   * @member {number}
   * @see https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pointerId
   */


  createClass(InteractionData, [{
    key: '_copyEvent',


    /**
     * Copies properties from normalized event data.
     *
     * @param {Touch|MouseEvent|PointerEvent} event The normalized event data
     * @private
     */
    value: function _copyEvent(event) {
      // isPrimary should only change on touchstart/pointerdown, so we don't want to overwrite
      // it with "false" on later events when our shim for it on touch events might not be
      // accurate
      if (event.isPrimary) {
        this.isPrimary = true;
      }
      this.button = event.button;
      this.buttons = event.buttons;
      this.width = event.width;
      this.height = event.height;
      this.tiltX = event.tiltX;
      this.tiltY = event.tiltY;
      this.pointerType = event.pointerType;
      this.pressure = event.pressure;
      this.rotationAngle = event.rotationAngle;
      this.twist = event.twist || 0;
      this.tangentialPressure = event.tangentialPressure || 0;
    }

    /**
     * Resets the data for pooling.
     *
     * @private
     */

  }, {
    key: '_reset',
    value: function _reset() {
      // isPrimary is the only property that we really need to reset - everything else is
      // guaranteed to be overwritten
      this.isPrimary = false;
    }
  }, {
    key: 'pointerId',
    get: function get$$1() {
      return this.identifier;
    }
  }]);
  return InteractionData;
}();

/**
 * Event class that mimics native DOM events.
 *
 * @class
 */
var InteractionEvent = function () {
  /**
   * InteractionEvent constructor
   */
  function InteractionEvent() {
    classCallCheck(this, InteractionEvent);

    /**
     * Whether this event will continue propagating in the tree
     *
     * @member {boolean}
     */
    this.stopped = false;

    /**
     * The object which caused this event to be dispatched.
     *
     * @member {Object3D}
     */
    this.target = null;

    /**
     * The object whose event listener’s callback is currently being invoked.
     *
     * @member {Object3D}
     */
    this.currentTarget = null;

    /**
     * Type of the event
     *
     * @member {string}
     */
    this.type = null;

    /**
     * InteractionData related to this event
     *
     * @member {InteractionData}
     */
    this.data = null;
  }

  /**
   * Prevents event from reaching any objects other than the current object.
   *
   */


  createClass(InteractionEvent, [{
    key: "stopPropagation",
    value: function stopPropagation() {
      this.stopped = true;
    }

    /**
     * Resets the event.
     *
     * @private
     */

  }, {
    key: "_reset",
    value: function _reset() {
      this.stopped = false;
      this.currentTarget = null;
      this.target = null;
    }
  }]);
  return InteractionEvent;
}();

/**
 * DisplayObjects with the `trackedPointers` property use this class to track interactions
 *
 * @class
 * @private
 */
var InteractionTrackingData = function () {
  /**
   * @param {number} pointerId - Unique pointer id of the event
   */
  function InteractionTrackingData(pointerId) {
    classCallCheck(this, InteractionTrackingData);

    this._pointerId = pointerId;
    this._flags = InteractionTrackingData.FLAGS.NONE;
  }

  /**
   *
   * @private
   * @param {number} flag - The interaction flag to set
   * @param {boolean} yn - Should the flag be set or unset
   */


  createClass(InteractionTrackingData, [{
    key: "_doSet",
    value: function _doSet(flag, yn) {
      if (yn) {
        this._flags = this._flags | flag;
      } else {
        this._flags = this._flags & ~flag;
      }
    }

    /**
     * Unique pointer id of the event
     *
     * @readonly
     * @member {number}
     */

  }, {
    key: "pointerId",
    get: function get$$1() {
      return this._pointerId;
    }

    /**
     * State of the tracking data, expressed as bit flags
     *
     * @member {number}
     */

  }, {
    key: "flags",
    get: function get$$1() {
      return this._flags;
    }

    /**
     * Set the flags for the tracking data
     *
     * @param {number} flags - Flags to set
     */
    ,
    set: function set$$1(flags) {
      this._flags = flags;
    }

    /**
     * Is the tracked event inactive (not over or down)?
     *
     * @member {number}
     */

  }, {
    key: "none",
    get: function get$$1() {
      return this._flags === this.constructor.FLAGS.NONE;
    }

    /**
     * Is the tracked event over the DisplayObject?
     *
     * @member {boolean}
     */

  }, {
    key: "over",
    get: function get$$1() {
      return (this._flags & this.constructor.FLAGS.OVER) !== 0;
    }

    /**
     * Set the over flag
     *
     * @param {boolean} yn - Is the event over?
     */
    ,
    set: function set$$1(yn) {
      this._doSet(this.constructor.FLAGS.OVER, yn);
    }

    /**
     * Did the right mouse button come down in the DisplayObject?
     *
     * @member {boolean}
     */

  }, {
    key: "rightDown",
    get: function get$$1() {
      return (this._flags & this.constructor.FLAGS.RIGHT_DOWN) !== 0;
    }

    /**
     * Set the right down flag
     *
     * @param {boolean} yn - Is the right mouse button down?
     */
    ,
    set: function set$$1(yn) {
      this._doSet(this.constructor.FLAGS.RIGHT_DOWN, yn);
    }

    /**
     * Did the left mouse button come down in the DisplayObject?
     *
     * @member {boolean}
     */

  }, {
    key: "leftDown",
    get: function get$$1() {
      return (this._flags & this.constructor.FLAGS.LEFT_DOWN) !== 0;
    }

    /**
     * Set the left down flag
     *
     * @param {boolean} yn - Is the left mouse button down?
     */
    ,
    set: function set$$1(yn) {
      this._doSet(this.constructor.FLAGS.LEFT_DOWN, yn);
    }
  }]);
  return InteractionTrackingData;
}();

InteractionTrackingData.FLAGS = Object.freeze({
  NONE: 0,
  OVER: 1 << 0,
  LEFT_DOWN: 1 << 1,
  RIGHT_DOWN: 1 << 2
});

var MOUSE_POINTER_ID = 'MOUSE';

/* eslint max-len: 0 */

// helpers for hitTest() - only used inside hitTest()
var hitTestEvent = {
  target: null,
  data: {
    global: null
  }
};

/**
 * The interaction manager deals with mouse, touch and pointer events. Any DisplayObject can be interactive
 * if its interactive parameter is set to true
 * This manager also supports multitouch.
 *
 * reference to [pixi.js](http://www.pixijs.com/) impl
 *
 * @private
 * @class
 * @extends Eventer
 */

var InteractionManager = function (_Eventer) {
  inherits(InteractionManager, _Eventer);

  /**
   * @param {Renderer} renderer - A reference to the current renderer
   * @param {Object} [options] - The options for the manager.
   * @param {Boolean} [options.autoPreventDefault=false] - Should the manager automatically prevent default browser actions.
   * @param {Boolean} [options.autoAttach=true] - Should the manager automatically attach target element.
   * @param {Number} [options.interactionFrequency=10] - Frequency increases the interaction events will be checked.
   */
  function InteractionManager(renderer, options) {
    classCallCheck(this, InteractionManager);

    var _this = possibleConstructorReturn(this, (InteractionManager.__proto__ || Object.getPrototypeOf(InteractionManager)).call(this));

    options = options || {};

    /**
     * The renderer this interaction manager works for.
     *
     * @member {Renderer}
     */
    _this.renderer = renderer;

    /**
     * Should default browser actions automatically be prevented.
     * Does not apply to pointer events for backwards compatibility
     * preventDefault on pointer events stops mouse events from firing
     * Thus, for every pointer event, there will always be either a mouse of touch event alongside it.
     *
     * @member {boolean}
     * @default false
     */
    _this.autoPreventDefault = options.autoPreventDefault || false;

    /**
     * Frequency in milliseconds that the mousemove, moveover & mouseout interaction events will be checked.
     *
     * @member {number}
     * @default 10
     */
    _this.interactionFrequency = options.interactionFrequency || 10;

    /**
     * The mouse data
     *
     * @member {InteractionData}
     */
    _this.mouse = new InteractionData();
    _this.mouse.identifier = MOUSE_POINTER_ID;

    // setting the mouse to start off far off screen will mean that mouse over does
    //  not get called before we even move the mouse.
    _this.mouse.global.set(-999999);

    /**
     * Actively tracked InteractionData
     *
     * @private
     * @member {Object.<number,InteractionData>}
     */
    _this.activeInteractionData = {};
    _this.activeInteractionData[MOUSE_POINTER_ID] = _this.mouse;

    /**
     * Pool of unused InteractionData
     *
     * @private
     * @member {InteractionData[]}
     */
    _this.interactionDataPool = [];

    /**
     * An event data object to handle all the event tracking/dispatching
     *
     * @member {object}
     */
    _this.eventData = new InteractionEvent();

    /**
     * The DOM element to bind to.
     *
     * @private
     * @member {HTMLElement}
     */
    _this.interactionDOMElement = null;

    /**
     * This property determines if mousemove and touchmove events are fired only when the cursor
     * is over the object.
     * Setting to true will make things work more in line with how the DOM verison works.
     * Setting to false can make things easier for things like dragging
     * It is currently set to false as this is how three.js used to work.
     *
     * @member {boolean}
     * @default true
     */
    _this.moveWhenInside = true;

    /**
     * Have events been attached to the dom element?
     *
     * @private
     * @member {boolean}
     */
    _this.eventsAdded = false;

    /**
     * Is the mouse hovering over the renderer?
     *
     * @private
     * @member {boolean}
     */
    _this.mouseOverRenderer = false;

    /**
     * Does the device support touch events
     * https://www.w3.org/TR/touch-events/
     *
     * @readonly
     * @member {boolean}
     */
    _this.supportsTouchEvents = 'ontouchstart' in window;

    /**
     * Does the device support pointer events
     * https://www.w3.org/Submission/pointer-events/
     *
     * @readonly
     * @member {boolean}
     */
    _this.supportsPointerEvents = !!window.PointerEvent;

    // this will make it so that you don't have to call bind all the time

    /**
     * @private
     * @member {Function}
     */
    _this.onClick = _this.onClick.bind(_this);
    _this.processClick = _this.processClick.bind(_this);

    /**
     * @private
     * @member {Function}
     */
    _this.onPointerUp = _this.onPointerUp.bind(_this);
    _this.processPointerUp = _this.processPointerUp.bind(_this);

    /**
     * @private
     * @member {Function}
     */
    _this.onPointerCancel = _this.onPointerCancel.bind(_this);
    _this.processPointerCancel = _this.processPointerCancel.bind(_this);

    /**
     * @private
     * @member {Function}
     */
    _this.onPointerDown = _this.onPointerDown.bind(_this);
    _this.processPointerDown = _this.processPointerDown.bind(_this);

    /**
     * @private
     * @member {Function}
     */
    _this.onPointerMove = _this.onPointerMove.bind(_this);
    _this.processPointerMove = _this.processPointerMove.bind(_this);

    /**
     * @private
     * @member {Function}
     */
    _this.onPointerOut = _this.onPointerOut.bind(_this);
    _this.processPointerOverOut = _this.processPointerOverOut.bind(_this);

    /**
     * @private
     * @member {Function}
     */
    _this.onPointerOver = _this.onPointerOver.bind(_this);

    /**
     * Dictionary of how different cursor modes are handled. Strings are handled as CSS cursor
     * values, objects are handled as dictionaries of CSS values for interactionDOMElement,
     * and functions are called instead of changing the CSS.
     * Default CSS cursor values are provided for 'default' and 'pointer' modes.
     * @member {Object.<string, (string|Function|Object.<string, string>)>}
     */
    _this.cursorStyles = {
      default: 'inherit',
      pointer: 'pointer'
    };

    /**
     * The mode of the cursor that is being used.
     * The value of this is a key from the cursorStyles dictionary.
     *
     * @member {string}
     */
    _this.currentCursorMode = null;

    /**
     * Internal cached let.
     *
     * @private
     * @member {string}
     */
    _this.cursor = null;

    /**
     * ray caster, for survey intersects from 3d-scene
     *
     * @private
     * @member {Raycaster}
     */
    // this.raycaster = new Raycaster();

    /**
     * snippet time
     *
     * @private
     * @member {Number}
     */
    _this._deltaTime = 0;

    _this.setTargetElement(_this.renderer.canvas);

    /**
     * Fired when a pointer device button (usually a mouse left-button) is pressed on the display
     * object.
     *
     * @event InteractionManager#mousedown
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a pointer device secondary button (usually a mouse right-button) is pressed
     * on the display object.
     *
     * @event InteractionManager#rightdown
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a pointer device button (usually a mouse left-button) is released over the display
     * object.
     *
     * @event InteractionManager#mouseup
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a pointer device secondary button (usually a mouse right-button) is released
     * over the display object.
     *
     * @event InteractionManager#rightup
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a pointer device button (usually a mouse left-button) is pressed and released on
     * the display object.
     *
     * @event InteractionManager#click
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a pointer device secondary button (usually a mouse right-button) is pressed
     * and released on the display object.
     *
     * @event InteractionManager#rightclick
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a pointer device button (usually a mouse left-button) is released outside the
     * display object that initially registered a
     * [mousedown]{@link InteractionManager#event:mousedown}.
     *
     * @event InteractionManager#mouseupoutside
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a pointer device secondary button (usually a mouse right-button) is released
     * outside the display object that initially registered a
     * [rightdown]{@link InteractionManager#event:rightdown}.
     *
     * @event InteractionManager#rightupoutside
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a pointer device (usually a mouse) is moved while over the display object
     *
     * @event InteractionManager#mousemove
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a pointer device (usually a mouse) is moved onto the display object
     *
     * @event InteractionManager#mouseover
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a pointer device (usually a mouse) is moved off the display object
     *
     * @event InteractionManager#mouseout
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a pointer device button is pressed on the display object.
     *
     * @event InteractionManager#pointerdown
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a pointer device button is released over the display object.
     *
     * @event InteractionManager#pointerup
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when the operating system cancels a pointer event
     *
     * @event InteractionManager#pointercancel
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a pointer device button is pressed and released on the display object.
     *
     * @event InteractionManager#pointertap
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a pointer device button is released outside the display object that initially
     * registered a [pointerdown]{@link InteractionManager#event:pointerdown}.
     *
     * @event InteractionManager#pointerupoutside
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a pointer device is moved while over the display object
     *
     * @event InteractionManager#pointermove
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a pointer device is moved onto the display object
     *
     * @event InteractionManager#pointerover
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a pointer device is moved off the display object
     *
     * @event InteractionManager#pointerout
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a touch point is placed on the display object.
     *
     * @event InteractionManager#touchstart
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a touch point is removed from the display object.
     *
     * @event InteractionManager#touchend
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when the operating system cancels a touch
     *
     * @event InteractionManager#touchcancel
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a touch point is placed and removed from the display object.
     *
     * @event InteractionManager#tap
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a touch point is removed outside of the display object that initially
     * registered a [touchstart]{@link InteractionManager#event:touchstart}.
     *
     * @event InteractionManager#touchendoutside
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a touch point is moved along the display object.
     *
     * @event InteractionManager#touchmove
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a pointer device button (usually a mouse left-button) is pressed on the display.
     * object. DisplayObject's `interactive` property must be set to `true` to fire event.
     *
     * @event Object3D#mousedown
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a pointer device secondary button (usually a mouse right-button) is pressed
     * on the display object. DisplayObject's `interactive` property must be set to `true` to fire event.
     *
     * @event Object3D#rightdown
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a pointer device button (usually a mouse left-button) is released over the display
     * object. DisplayObject's `interactive` property must be set to `true` to fire event.
     *
     * @event Object3D#mouseup
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a pointer device secondary button (usually a mouse right-button) is released
     * over the display object. DisplayObject's `interactive` property must be set to `true` to fire event.
     *
     * @event Object3D#rightup
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a pointer device button (usually a mouse left-button) is pressed and released on
     * the display object. DisplayObject's `interactive` property must be set to `true` to fire event.
     *
     * @event Object3D#click
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a pointer device secondary button (usually a mouse right-button) is pressed
     * and released on the display object. DisplayObject's `interactive` property must be set to `true` to fire event.
     *
     * @event Object3D#rightclick
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a pointer device button (usually a mouse left-button) is released outside the
     * display object that initially registered a
     * [mousedown]{@link Object3D#event:mousedown}.
     * DisplayObject's `interactive` property must be set to `true` to fire event.
     *
     * @event Object3D#mouseupoutside
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a pointer device secondary button (usually a mouse right-button) is released
     * outside the display object that initially registered a
     * [rightdown]{@link Object3D#event:rightdown}.
     * DisplayObject's `interactive` property must be set to `true` to fire event.
     *
     * @event Object3D#rightupoutside
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a pointer device (usually a mouse) is moved while over the display object.
     * DisplayObject's `interactive` property must be set to `true` to fire event.
     *
     * @event Object3D#mousemove
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a pointer device (usually a mouse) is moved onto the display object.
     * DisplayObject's `interactive` property must be set to `true` to fire event.
     *
     * @event Object3D#mouseover
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a pointer device (usually a mouse) is moved off the display object.
     * DisplayObject's `interactive` property must be set to `true` to fire event.
     *
     * @event Object3D#mouseout
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a pointer device button is pressed on the display object.
     * DisplayObject's `interactive` property must be set to `true` to fire event.
     *
     * @event Object3D#pointerdown
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a pointer device button is released over the display object.
     * DisplayObject's `interactive` property must be set to `true` to fire event.
     *
     * @event Object3D#pointerup
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when the operating system cancels a pointer event.
     * DisplayObject's `interactive` property must be set to `true` to fire event.
     *
     * @event Object3D#pointercancel
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a pointer device button is pressed and released on the display object.
     * DisplayObject's `interactive` property must be set to `true` to fire event.
     *
     * @event Object3D#pointertap
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a pointer device button is released outside the display object that initially
     * registered a [pointerdown]{@link Object3D#event:pointerdown}.
     * DisplayObject's `interactive` property must be set to `true` to fire event.
     *
     * @event Object3D#pointerupoutside
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a pointer device is moved while over the display object.
     * DisplayObject's `interactive` property must be set to `true` to fire event.
     *
     * @event Object3D#pointermove
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a pointer device is moved onto the display object.
     * DisplayObject's `interactive` property must be set to `true` to fire event.
     *
     * @event Object3D#pointerover
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a pointer device is moved off the display object.
     * DisplayObject's `interactive` property must be set to `true` to fire event.
     *
     * @event Object3D#pointerout
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a touch point is placed on the display object.
     * DisplayObject's `interactive` property must be set to `true` to fire event.
     *
     * @event Object3D#touchstart
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a touch point is removed from the display object.
     * DisplayObject's `interactive` property must be set to `true` to fire event.
     *
     * @event Object3D#touchend
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when the operating system cancels a touch.
     * DisplayObject's `interactive` property must be set to `true` to fire event.
     *
     * @event Object3D#touchcancel
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a touch point is placed and removed from the display object.
     * DisplayObject's `interactive` property must be set to `true` to fire event.
     *
     * @event Object3D#tap
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a touch point is removed outside of the display object that initially
     * registered a [touchstart]{@link Object3D#event:touchstart}.
     * DisplayObject's `interactive` property must be set to `true` to fire event.
     *
     * @event Object3D#touchendoutside
     * @param {InteractionEvent} event - Interaction event
     */

    /**
     * Fired when a touch point is moved along the display object.
     * DisplayObject's `interactive` property must be set to `true` to fire event.
     *
     * @event Object3D#touchmove
     * @param {InteractionEvent} event - Interaction event
     */
    return _this;
  }

  /**
   * Hit tests a point against the display tree, returning the first interactive object that is hit.
   *
   * @param {Point} globalPoint - A point to hit test with, in global space.
   * @param {Object3D} [root] - The root display object to start from. If omitted, defaults
   * to the last rendered root of the associated renderer.
   * @return {Object3D} The hit display object, if any.
   */


  createClass(InteractionManager, [{
    key: 'hitTest',
    value: function hitTest(globalPoint, root) {
      // clear the target for our hit test
      hitTestEvent.target = null;
      // assign the global point
      hitTestEvent.data.global = globalPoint;
      // ensure safety of the root
      if (!root) {
        root = this.renderer;
      }
      // run the hit test
      this.processInteractive(hitTestEvent, root, null, true);
      // return our found object - it'll be null if we didn't hit anything

      return hitTestEvent.target;
    }

    /**
     * Sets the DOM element which will receive mouse/touch events. This is useful for when you have
     * other DOM elements on top of the renderers Canvas element. With this you'll be bale to deletegate
     * another DOM element to receive those events.
     *
     * @param {HTMLCanvasElement} element - the DOM element which will receive mouse and touch events.
     */

  }, {
    key: 'setTargetElement',
    value: function setTargetElement(element) {
      this.removeEvents();

      this.interactionDOMElement = element;

      this.addEvents();
    }

    /**
     * Registers all the DOM events
     *
     * @private
     */

  }, {
    key: 'addEvents',
    value: function addEvents() {
      if (!this.interactionDOMElement || this.eventsAdded) {
        return;
      }

      this.emit('addevents');

      this.interactionDOMElement.addEventListener('click', this.onClick, true);

      if (window.navigator.msPointerEnabled) {
        this.interactionDOMElement.style['-ms-content-zooming'] = 'none';
        this.interactionDOMElement.style['-ms-touch-action'] = 'none';
      } else if (this.supportsPointerEvents) {
        this.interactionDOMElement.style['touch-action'] = 'none';
      }

      /**
       * These events are added first, so that if pointer events are normalised, they are fired
       * in the same order as non-normalised events. ie. pointer event 1st, mouse / touch 2nd
       */
      if (this.supportsPointerEvents) {
        window.document.addEventListener('pointermove', this.onPointerMove, true);
        this.interactionDOMElement.addEventListener('pointerdown', this.onPointerDown, true);
        // pointerout is fired in addition to pointerup (for touch events) and pointercancel
        // we already handle those, so for the purposes of what we do in onPointerOut, we only
        // care about the pointerleave event
        this.interactionDOMElement.addEventListener('pointerleave', this.onPointerOut, true);
        this.interactionDOMElement.addEventListener('pointerover', this.onPointerOver, true);
        window.addEventListener('pointercancel', this.onPointerCancel, true);
        window.addEventListener('pointerup', this.onPointerUp, true);
      } else {
        window.document.addEventListener('mousemove', this.onPointerMove, true);
        this.interactionDOMElement.addEventListener('mousedown', this.onPointerDown, true);
        this.interactionDOMElement.addEventListener('mouseout', this.onPointerOut, true);
        this.interactionDOMElement.addEventListener('mouseover', this.onPointerOver, true);
        window.addEventListener('mouseup', this.onPointerUp, true);
      }

      // always look directly for touch events so that we can provide original data
      // In a future version we should change this to being just a fallback and rely solely on
      // PointerEvents whenever available
      if (this.supportsTouchEvents) {
        this.interactionDOMElement.addEventListener('touchstart', this.onPointerDown, true);
        this.interactionDOMElement.addEventListener('touchcancel', this.onPointerCancel, true);
        this.interactionDOMElement.addEventListener('touchend', this.onPointerUp, true);
        this.interactionDOMElement.addEventListener('touchmove', this.onPointerMove, true);
      }

      this.eventsAdded = true;
    }

    /**
     * Removes all the DOM events that were previously registered
     *
     * @private
     */

  }, {
    key: 'removeEvents',
    value: function removeEvents() {
      if (!this.interactionDOMElement) {
        return;
      }

      this.emit('removeevents');

      this.interactionDOMElement.removeEventListener('click', this.onClick, true);

      if (window.navigator.msPointerEnabled) {
        this.interactionDOMElement.style['-ms-content-zooming'] = '';
        this.interactionDOMElement.style['-ms-touch-action'] = '';
      } else if (this.supportsPointerEvents) {
        this.interactionDOMElement.style['touch-action'] = '';
      }

      if (this.supportsPointerEvents) {
        window.document.removeEventListener('pointermove', this.onPointerMove, true);
        this.interactionDOMElement.removeEventListener('pointerdown', this.onPointerDown, true);
        this.interactionDOMElement.removeEventListener('pointerleave', this.onPointerOut, true);
        this.interactionDOMElement.removeEventListener('pointerover', this.onPointerOver, true);
        window.removeEventListener('pointercancel', this.onPointerCancel, true);
        window.removeEventListener('pointerup', this.onPointerUp, true);
      } else {
        window.document.removeEventListener('mousemove', this.onPointerMove, true);
        this.interactionDOMElement.removeEventListener('mousedown', this.onPointerDown, true);
        this.interactionDOMElement.removeEventListener('mouseout', this.onPointerOut, true);
        this.interactionDOMElement.removeEventListener('mouseover', this.onPointerOver, true);
        window.removeEventListener('mouseup', this.onPointerUp, true);
      }

      if (this.supportsTouchEvents) {
        this.interactionDOMElement.removeEventListener('touchstart', this.onPointerDown, true);
        this.interactionDOMElement.removeEventListener('touchcancel', this.onPointerCancel, true);
        this.interactionDOMElement.removeEventListener('touchend', this.onPointerUp, true);
        this.interactionDOMElement.removeEventListener('touchmove', this.onPointerMove, true);
      }

      this.interactionDOMElement = null;

      this.eventsAdded = false;
    }

    /**
     * Updates the state of interactive objects.
     * Invoked by a throttled ticker.
     *
     * @param {number} deltaTime - time delta since last tick
     */

  }, {
    key: 'update',
    value: function update(_ref) {
      var snippet = _ref.snippet;

      this._deltaTime += snippet;

      if (this._deltaTime < this.interactionFrequency) {
        return;
      }

      this._deltaTime = 0;

      if (!this.interactionDOMElement) {
        return;
      }

      // if the user move the mouse this check has already been done using the mouse move!
      if (this.didMove) {
        this.didMove = false;

        return;
      }

      this.cursor = null;

      // Resets the flag as set by a stopPropagation call. This flag is usually reset by a user interaction of any kind,
      // but there was a scenario of a display object moving under a static mouse cursor.
      // In this case, mouseover and mouseevents would not pass the flag test in triggerEvent function
      for (var k in this.activeInteractionData) {
        // eslint-disable-next-line no-prototype-builtins
        if (this.activeInteractionData.hasOwnProperty(k)) {
          var interactionData = this.activeInteractionData[k];

          if (interactionData.originalEvent && interactionData.pointerType !== 'touch') {
            var interactionEvent = this.configureInteractionEventForDOMEvent(this.eventData, interactionData.originalEvent, interactionData);

            this.processInteractive(interactionEvent, this.renderer.currentScene, this.processPointerOverOut, true);
          }
        }
      }

      this.setCursorMode(this.cursor);

      // TODO
    }

    /**
     * Sets the current cursor mode, handling any callbacks or CSS style changes.
     *
     * @param {string} mode - cursor mode, a key from the cursorStyles dictionary
     */

  }, {
    key: 'setCursorMode',
    value: function setCursorMode(mode) {
      mode = mode || 'default';
      // if the mode didn't actually change, bail early
      if (this.currentCursorMode === mode) {
        return;
      }
      this.currentCursorMode = mode;
      var style = this.cursorStyles[mode];

      // only do things if there is a cursor style for it
      if (style) {
        switch (typeof style === 'undefined' ? 'undefined' : _typeof(style)) {
          case 'string':
            // string styles are handled as cursor CSS
            this.interactionDOMElement.style.cursor = style;
            break;
          case 'function':
            // functions are just called, and passed the cursor mode
            style(mode);
            break;
          case 'object':
            // if it is an object, assume that it is a dictionary of CSS styles,
            // apply it to the interactionDOMElement
            Object.assign(this.interactionDOMElement.style, style);
            break;
          default:
            break;
        }
      } else if (typeof mode === 'string' && !Object.prototype.hasOwnProperty.call(this.cursorStyles, mode)) {
        // if it mode is a string (not a Symbol) and cursorStyles doesn't have any entry
        // for the mode, then assume that the dev wants it to be CSS for the cursor.
        this.interactionDOMElement.style.cursor = mode;
      }
    }

    /**
     * Dispatches an event on the display object that was interacted with
     *
     * @param {Object3D} displayObject - the display object in question
     * @param {string} eventString - the name of the event (e.g, mousedown)
     * @param {object} eventData - the event data object
     * @private
     */

  }, {
    key: 'triggerEvent',
    value: function triggerEvent(displayObject, eventString, eventData) {
      if (!eventData.stopped) {
        eventData.currentTarget = displayObject;
        eventData.type = eventString;

        displayObject.emit(eventString, eventData);

        if (displayObject[eventString]) {
          displayObject[eventString](eventData);
        }
      }
    }

    /**
     * Maps x and y coords from a DOM object and maps them correctly to the three.js view. The
     * resulting value is stored in the point. This takes into account the fact that the DOM
     * element could be scaled and positioned anywhere on the screen.
     *
     * @param  {InteractionData} interactionData - the point that the result will be stored in
     * @param  {number} x - the x coord of the position to map
     * @param  {number} y - the y coord of the position to map
     */

  }, {
    key: 'mapPositionToPoint',
    value: function mapPositionToPoint(interactionData, x, y) {
      var resolution = interactionData.resolution,
          global = interactionData.global;

      var rect = void 0;

      // IE 11 fix
      if (!this.interactionDOMElement.parentElement) {
        rect = {
          x: 0,
          y: 0,
          left: 0,
          top: 0,
          width: 0,
          height: 0
        };
      } else {
        rect = this.interactionDOMElement.getBoundingClientRect();
      }

      resolution.x = this.interactionDOMElement.width / rect.width;
      resolution.y = this.interactionDOMElement.height / rect.height;

      global.x = (x - rect.left) * resolution.x;
      global.y = (y - rect.top) * resolution.y;
    }

    /**
     * This function is provides a neat way of crawling through the scene graph and running a
     * specified function on all interactive objects it finds. It will also take care of hit
     * testing the interactive objects and passes the hit across in the function.
     *
     * @private
     * @param {InteractionEvent} interactionEvent - event containing the point that
     *  is tested for collision
     * @param {Object3D} displayObject - the displayObject
     *  that will be hit test (recursively crawls its children)
     * @param {Function} [func] - the function that will be called on each interactive object. The
     *  interactionEvent, displayObject and hit will be passed to the function
     * @param {boolean} [hitTest] - this indicates if the objects inside should be hit test against the point
     * @param {boolean} [interactive] - Whether the displayObject is interactive
     * @return {boolean} returns true if the displayObject hit the point
     */

  }, {
    key: 'processInteractive',
    value: function processInteractive(interactionEvent, displayObject, func, hitTest, interactive) {
      if (!displayObject || !displayObject.visible) {
        return false;
      }

      var point = interactionEvent.data.global;

      // Took a little while to rework this function correctly! But now it is done and nice and optimised. ^_^
      //
      // This function will now loop through all objects and then only hit test the objects it HAS
      // to, not all of them. MUCH faster..
      // An object will be hit test if the following is true:
      //
      // 1: It is interactive.
      // 2: It belongs to a parent that is interactive AND one of the parents children have not already been hit.
      //
      // As another little optimisation once an interactive object has been hit we can carry on
      // through the scenegraph, but we know that there will be no more hits! So we can avoid extra hit tests
      // A final optimisation is that an object is not hit test directly if a child has already been hit.

      interactive = displayObject.interactive || interactive;

      var hit = false;
      var interactiveParent = interactive;

      if (displayObject.interactiveChildren && displayObject.childs) {
        var children = displayObject.childs;

        for (var i = children.length - 1; i >= 0; i--) {
          var child = children[i];

          // time to get recursive.. if this function will return if something is hit..
          var childHit = this.processInteractive(interactionEvent, child, func, hitTest, interactiveParent);

          if (childHit) {
            // its a good idea to check if a child has lost its parent.
            // this means it has been removed whilst looping so its best
            if (!child.parent) {
              continue;
            }

            // we no longer need to hit test any more objects in this container as we we
            // now know the parent has been hit
            interactiveParent = false;

            // If the child is interactive , that means that the object hit was actually
            // interactive and not just the child of an interactive object.
            // This means we no longer need to hit test anything else. We still need to run
            // through all objects, but we don't need to perform any hit tests.

            if (childHit) {
              if (interactionEvent.target) {
                hitTest = false;
              }
              hit = true;
            }
          }
        }
      }

      // no point running this if the item is not interactive or does not have an interactive parent.
      if (interactive) {
        // if we are hit testing (as in we have no hit any objects yet)
        // We also don't need to worry about hit testing if once of the displayObjects children
        // has already been hit - but only if it was interactive, otherwise we need to keep
        // looking for an interactive child, just in case we hit one
        if (hitTest && !interactionEvent.target) {
          if (displayObject.contains(point)) {
            hit = true;
          }
        }

        if (displayObject.interactive) {
          if (hit && !interactionEvent.target) {
            interactionEvent.data.target = interactionEvent.target = displayObject;
          }

          if (func) {
            func(interactionEvent, displayObject, !!hit);
          }
        }
      }

      return hit;
    }

    /**
     * Is called when the click is pressed down on the renderer element
     *
     * @private
     * @param {MouseEvent} originalEvent - The DOM event of a click being pressed down
     */

  }, {
    key: 'onClick',
    value: function onClick(originalEvent) {
      if (originalEvent.type !== 'click') return;

      var events = this.normalizeToPointerData(originalEvent);

      if (this.autoPreventDefault && events[0].isNormalized) {
        originalEvent.preventDefault();
      }

      var interactionData = this.getInteractionDataForPointerId(events[0]);

      var interactionEvent = this.configureInteractionEventForDOMEvent(this.eventData, event, interactionData);

      interactionEvent.data.originalEvent = originalEvent;

      this.processInteractive(interactionEvent, this.renderer.currentScene, this.processClick, true);

      this.emit('click', interactionEvent);
    }

    /**
     * Processes the result of the click check and dispatches the event if need be
     *
     * @private
     * @param {InteractionEvent} interactionEvent - The interaction event wrapping the DOM event
     * @param {Object3D} displayObject - The display object that was tested
     * @param {boolean} hit - the result of the hit test on the display object
     */

  }, {
    key: 'processClick',
    value: function processClick(interactionEvent, displayObject, hit) {
      if (hit) {
        this.triggerEvent(displayObject, 'click', interactionEvent);
      }
    }

    /**
     * Is called when the pointer button is pressed down on the renderer element
     *
     * @private
     * @param {PointerEvent} originalEvent - The DOM event of a pointer button being pressed down
     */

  }, {
    key: 'onPointerDown',
    value: function onPointerDown(originalEvent) {
      // if we support touch events, then only use those for touch events, not pointer events
      if (this.supportsTouchEvents && originalEvent.pointerType === 'touch') return;

      var events = this.normalizeToPointerData(originalEvent);

      /**
       * No need to prevent default on natural pointer events, as there are no side effects
       * Normalized events, however, may have the double mousedown/touchstart issue on the native android browser,
       * so still need to be prevented.
       */

      // Guaranteed that there will be at least one event in events, and all events must have the same pointer type

      if (this.autoPreventDefault && events[0].isNormalized) {
        originalEvent.preventDefault();
      }

      var eventLen = events.length;

      for (var i = 0; i < eventLen; i++) {
        var _event = events[i];

        var interactionData = this.getInteractionDataForPointerId(_event);

        var interactionEvent = this.configureInteractionEventForDOMEvent(this.eventData, _event, interactionData);

        interactionEvent.data.originalEvent = originalEvent;

        this.processInteractive(interactionEvent, this.renderer.currentScene, this.processPointerDown, true);

        this.emit('pointerdown', interactionEvent);
        if (_event.pointerType === 'touch') {
          this.emit('touchstart', interactionEvent);
        } else if (_event.pointerType === 'mouse' || _event.pointerType === 'pen') {
          var isRightButton = _event.button === 2;

          this.emit(isRightButton ? 'rightdown' : 'mousedown', this.eventData);
        }
      }
    }

    /**
     * Processes the result of the pointer down check and dispatches the event if need be
     *
     * @private
     * @param {InteractionEvent} interactionEvent - The interaction event wrapping the DOM event
     * @param {Object3D} displayObject - The display object that was tested
     * @param {boolean} hit - the result of the hit test on the display object
     */

  }, {
    key: 'processPointerDown',
    value: function processPointerDown(interactionEvent, displayObject, hit) {
      var data = interactionEvent.data;
      var id = interactionEvent.data.identifier;

      if (hit) {
        if (!displayObject.trackedPointers[id]) {
          displayObject.trackedPointers[id] = new InteractionTrackingData(id);
        }
        this.triggerEvent(displayObject, 'pointerdown', interactionEvent);

        if (data.pointerType === 'touch') {
          displayObject.started = true;
          this.triggerEvent(displayObject, 'touchstart', interactionEvent);
        } else if (data.pointerType === 'mouse' || data.pointerType === 'pen') {
          var isRightButton = data.button === 2;

          if (isRightButton) {
            displayObject.trackedPointers[id].rightDown = true;
          } else {
            displayObject.trackedPointers[id].leftDown = true;
          }

          this.triggerEvent(displayObject, isRightButton ? 'rightdown' : 'mousedown', interactionEvent);
        }
      }
    }

    /**
     * Is called when the pointer button is released on the renderer element
     *
     * @private
     * @param {PointerEvent} originalEvent - The DOM event of a pointer button being released
     * @param {boolean} cancelled - true if the pointer is cancelled
     * @param {Function} func - Function passed to {@link processInteractive}
     */

  }, {
    key: 'onPointerComplete',
    value: function onPointerComplete(originalEvent, cancelled, func) {
      var events = this.normalizeToPointerData(originalEvent);

      var eventLen = events.length;

      // if the event wasn't targeting our canvas, then consider it to be pointerupoutside
      // in all cases (unless it was a pointercancel)
      var eventAppend = originalEvent.target !== this.interactionDOMElement ? 'outside' : '';

      for (var i = 0; i < eventLen; i++) {
        var _event2 = events[i];

        var interactionData = this.getInteractionDataForPointerId(_event2);

        var interactionEvent = this.configureInteractionEventForDOMEvent(this.eventData, _event2, interactionData);

        interactionEvent.data.originalEvent = originalEvent;

        // perform hit testing for events targeting our canvas or cancel events
        this.processInteractive(interactionEvent, this.renderer.currentScene, func, cancelled || !eventAppend);

        this.emit(cancelled ? 'pointercancel' : 'pointerup' + eventAppend, interactionEvent);

        if (_event2.pointerType === 'mouse' || _event2.pointerType === 'pen') {
          var isRightButton = _event2.button === 2;

          this.emit(isRightButton ? 'rightup' + eventAppend : 'mouseup' + eventAppend, interactionEvent);
        } else if (_event2.pointerType === 'touch') {
          this.emit(cancelled ? 'touchcancel' : 'touchend' + eventAppend, interactionEvent);
          this.releaseInteractionDataForPointerId(_event2.pointerId, interactionData);
        }
      }
    }

    /**
     * Is called when the pointer button is cancelled
     *
     * @private
     * @param {PointerEvent} event - The DOM event of a pointer button being released
     */

  }, {
    key: 'onPointerCancel',
    value: function onPointerCancel(event) {
      // if we support touch events, then only use those for touch events, not pointer events
      if (this.supportsTouchEvents && event.pointerType === 'touch') return;

      this.onPointerComplete(event, true, this.processPointerCancel);
    }

    /**
     * Processes the result of the pointer cancel check and dispatches the event if need be
     *
     * @private
     * @param {InteractionEvent} interactionEvent - The interaction event wrapping the DOM event
     * @param {Object3D} displayObject - The display object that was tested
     */

  }, {
    key: 'processPointerCancel',
    value: function processPointerCancel(interactionEvent, displayObject) {
      var data = interactionEvent.data;

      var id = interactionEvent.data.identifier;

      if (displayObject.trackedPointers[id] !== undefined) {
        delete displayObject.trackedPointers[id];
        this.triggerEvent(displayObject, 'pointercancel', interactionEvent);

        if (data.pointerType === 'touch') {
          this.triggerEvent(displayObject, 'touchcancel', interactionEvent);
        }
      }
    }

    /**
     * Is called when the pointer button is released on the renderer element
     *
     * @private
     * @param {PointerEvent} event - The DOM event of a pointer button being released
     */

  }, {
    key: 'onPointerUp',
    value: function onPointerUp(event) {
      // if we support touch events, then only use those for touch events, not pointer events
      if (this.supportsTouchEvents && event.pointerType === 'touch') return;

      this.onPointerComplete(event, false, this.processPointerUp);
    }

    /**
     * Processes the result of the pointer up check and dispatches the event if need be
     *
     * @private
     * @param {InteractionEvent} interactionEvent - The interaction event wrapping the DOM event
     * @param {Object3D} displayObject - The display object that was tested
     * @param {boolean} hit - the result of the hit test on the display object
     */

  }, {
    key: 'processPointerUp',
    value: function processPointerUp(interactionEvent, displayObject, hit) {
      var data = interactionEvent.data;

      var id = interactionEvent.data.identifier;

      var trackingData = displayObject.trackedPointers[id];

      var isTouch = data.pointerType === 'touch';

      var isMouse = data.pointerType === 'mouse' || data.pointerType === 'pen';

      // Mouse only
      if (isMouse) {
        var isRightButton = data.button === 2;

        var flags = InteractionTrackingData.FLAGS;

        var test = isRightButton ? flags.RIGHT_DOWN : flags.LEFT_DOWN;

        var isDown = trackingData !== undefined && trackingData.flags & test;

        if (hit) {
          this.triggerEvent(displayObject, isRightButton ? 'rightup' : 'mouseup', interactionEvent);

          if (isDown) {
            this.triggerEvent(displayObject, isRightButton ? 'rightclick' : 'leftclick', interactionEvent);
          }
        } else if (isDown) {
          this.triggerEvent(displayObject, isRightButton ? 'rightupoutside' : 'mouseupoutside', interactionEvent);
        }
        // update the down state of the tracking data
        if (trackingData) {
          if (isRightButton) {
            trackingData.rightDown = false;
          } else {
            trackingData.leftDown = false;
          }
        }
      }

      // Pointers and Touches, and Mouse
      if (isTouch && displayObject.started) {
        displayObject.started = false;
        this.triggerEvent(displayObject, 'touchend', interactionEvent);
      }
      if (hit) {
        this.triggerEvent(displayObject, 'pointerup', interactionEvent);

        if (trackingData) {
          this.triggerEvent(displayObject, 'pointertap', interactionEvent);
          if (isTouch) {
            this.triggerEvent(displayObject, 'tap', interactionEvent);
            // touches are no longer over (if they ever were) when we get the touchend
            // so we should ensure that we don't keep pretending that they are
            trackingData.over = false;
          }
        }
      } else if (trackingData) {
        this.triggerEvent(displayObject, 'pointerupoutside', interactionEvent);
        if (isTouch) this.triggerEvent(displayObject, 'touchendoutside', interactionEvent);
      }
      // Only remove the tracking data if there is no over/down state still associated with it
      if (trackingData && trackingData.none) {
        delete displayObject.trackedPointers[id];
      }
    }

    /**
     * Is called when the pointer moves across the renderer element
     *
     * @private
     * @param {PointerEvent} originalEvent - The DOM event of a pointer moving
     */

  }, {
    key: 'onPointerMove',
    value: function onPointerMove(originalEvent) {
      // if we support touch events, then only use those for touch events, not pointer events
      if (this.supportsTouchEvents && originalEvent.pointerType === 'touch') return;

      var events = this.normalizeToPointerData(originalEvent);

      if (events[0].pointerType === 'mouse') {
        this.didMove = true;

        this.cursor = null;
      }

      var eventLen = events.length;

      for (var i = 0; i < eventLen; i++) {
        var _event3 = events[i];

        var interactionData = this.getInteractionDataForPointerId(_event3);

        var interactionEvent = this.configureInteractionEventForDOMEvent(this.eventData, _event3, interactionData);

        interactionEvent.data.originalEvent = originalEvent;

        var interactive = _event3.pointerType === 'touch' ? this.moveWhenInside : true;

        this.processInteractive(interactionEvent, this.renderer.currentScene, this.processPointerMove, interactive);
        this.emit('pointermove', interactionEvent);
        if (_event3.pointerType === 'touch') this.emit('touchmove', interactionEvent);
        if (_event3.pointerType === 'mouse' || _event3.pointerType === 'pen') this.emit('mousemove', interactionEvent);
      }

      if (events[0].pointerType === 'mouse') {
        this.setCursorMode(this.cursor);

        // TODO BUG for parents interactive object (border order issue)
      }
    }

    /**
     * Processes the result of the pointer move check and dispatches the event if need be
     *
     * @private
     * @param {InteractionEvent} interactionEvent - The interaction event wrapping the DOM event
     * @param {Object3D} displayObject - The display object that was tested
     * @param {boolean} hit - the result of the hit test on the display object
     */

  }, {
    key: 'processPointerMove',
    value: function processPointerMove(interactionEvent, displayObject, hit) {
      var data = interactionEvent.data;

      var isTouch = data.pointerType === 'touch';

      var isMouse = data.pointerType === 'mouse' || data.pointerType === 'pen';

      if (isMouse) {
        this.processPointerOverOut(interactionEvent, displayObject, hit);
      }

      if (isTouch && displayObject.started) this.triggerEvent(displayObject, 'touchmove', interactionEvent);
      if (!this.moveWhenInside || hit) {
        this.triggerEvent(displayObject, 'pointermove', interactionEvent);
        if (isMouse) this.triggerEvent(displayObject, 'mousemove', interactionEvent);
      }
    }

    /**
     * Is called when the pointer is moved out of the renderer element
     *
     * @private
     * @param {PointerEvent} originalEvent - The DOM event of a pointer being moved out
     */

  }, {
    key: 'onPointerOut',
    value: function onPointerOut(originalEvent) {
      // if we support touch events, then only use those for touch events, not pointer events
      if (this.supportsTouchEvents && originalEvent.pointerType === 'touch') return;

      var events = this.normalizeToPointerData(originalEvent);

      // Only mouse and pointer can call onPointerOut, so events will always be length 1
      var event = events[0];

      if (event.pointerType === 'mouse') {
        this.mouseOverRenderer = false;
        this.setCursorMode(null);
      }

      var interactionData = this.getInteractionDataForPointerId(event);

      var interactionEvent = this.configureInteractionEventForDOMEvent(this.eventData, event, interactionData);

      interactionEvent.data.originalEvent = event;

      this.processInteractive(interactionEvent, this.renderer.currentScene, this.processPointerOverOut, false);

      this.emit('pointerout', interactionEvent);
      if (event.pointerType === 'mouse' || event.pointerType === 'pen') {
        this.emit('mouseout', interactionEvent);
      } else {
        // we can get touchleave events after touchend, so we want to make sure we don't
        // introduce memory leaks
        this.releaseInteractionDataForPointerId(interactionData.identifier);
      }
    }

    /**
     * Processes the result of the pointer over/out check and dispatches the event if need be
     *
     * @private
     * @param {InteractionEvent} interactionEvent - The interaction event wrapping the DOM event
     * @param {Object3D} displayObject - The display object that was tested
     * @param {boolean} hit - the result of the hit test on the display object
     */

  }, {
    key: 'processPointerOverOut',
    value: function processPointerOverOut(interactionEvent, displayObject, hit) {
      var data = interactionEvent.data;

      var id = interactionEvent.data.identifier;

      var isMouse = data.pointerType === 'mouse' || data.pointerType === 'pen';

      var trackingData = displayObject.trackedPointers[id];

      // if we just moused over the display object, then we need to track that state
      if (hit && !trackingData) {
        trackingData = displayObject.trackedPointers[id] = new InteractionTrackingData(id);
      }

      if (trackingData === undefined) return;

      if (hit && this.mouseOverRenderer) {
        if (!trackingData.over) {
          trackingData.over = true;
          this.triggerEvent(displayObject, 'pointerover', interactionEvent);
          if (isMouse) {
            this.triggerEvent(displayObject, 'mouseover', interactionEvent);
          }
        }

        // only change the cursor if it has not already been changed (by something deeper in the
        // display tree)
        if (isMouse && this.cursor === null) {
          this.cursor = displayObject.cursor;
        }
      } else if (trackingData.over) {
        trackingData.over = false;
        this.triggerEvent(displayObject, 'pointerout', this.eventData);
        if (isMouse) {
          this.triggerEvent(displayObject, 'mouseout', interactionEvent);
        }
        // if there is no mouse down information for the pointer, then it is safe to delete
        if (trackingData.none) {
          delete displayObject.trackedPointers[id];
        }
      }
    }

    /**
     * Is called when the pointer is moved into the renderer element
     *
     * @private
     * @param {PointerEvent} originalEvent - The DOM event of a pointer button being moved into the renderer view
     */

  }, {
    key: 'onPointerOver',
    value: function onPointerOver(originalEvent) {
      var events = this.normalizeToPointerData(originalEvent);

      // Only mouse and pointer can call onPointerOver, so events will always be length 1
      var event = events[0];

      var interactionData = this.getInteractionDataForPointerId(event);

      var interactionEvent = this.configureInteractionEventForDOMEvent(this.eventData, event, interactionData);

      interactionEvent.data.originalEvent = event;

      if (event.pointerType === 'mouse') {
        this.mouseOverRenderer = true;
      }

      this.emit('pointerover', interactionEvent);
      if (event.pointerType === 'mouse' || event.pointerType === 'pen') {
        this.emit('mouseover', interactionEvent);
      }
    }

    /**
     * Get InteractionData for a given pointerId. Store that data as well
     *
     * @private
     * @param {PointerEvent} event - Normalized pointer event, output from normalizeToPointerData
     * @return {InteractionData} - Interaction data for the given pointer identifier
     */

  }, {
    key: 'getInteractionDataForPointerId',
    value: function getInteractionDataForPointerId(event) {
      var pointerId = event.pointerId;

      var interactionData = void 0;

      if (pointerId === MOUSE_POINTER_ID || event.pointerType === 'mouse') {
        interactionData = this.mouse;
      } else if (this.activeInteractionData[pointerId]) {
        interactionData = this.activeInteractionData[pointerId];
      } else {
        interactionData = this.interactionDataPool.pop() || new InteractionData();
        interactionData.identifier = pointerId;
        this.activeInteractionData[pointerId] = interactionData;
      }
      // copy properties from the event, so that we can make sure that touch/pointer specific
      // data is available
      interactionData._copyEvent(event);

      return interactionData;
    }

    /**
     * Return unused InteractionData to the pool, for a given pointerId
     *
     * @private
     * @param {number} pointerId - Identifier from a pointer event
     */

  }, {
    key: 'releaseInteractionDataForPointerId',
    value: function releaseInteractionDataForPointerId(pointerId) {
      var interactionData = this.activeInteractionData[pointerId];

      if (interactionData) {
        delete this.activeInteractionData[pointerId];
        interactionData._reset();
        this.interactionDataPool.push(interactionData);
      }
    }

    /**
     * Configure an InteractionEvent to wrap a DOM PointerEvent and InteractionData
     *
     * @private
     * @param {InteractionEvent} interactionEvent - The event to be configured
     * @param {PointerEvent} pointerEvent - The DOM event that will be paired with the InteractionEvent
     * @param {InteractionData} interactionData - The InteractionData that will be paired
     *        with the InteractionEvent
     * @return {InteractionEvent} the interaction event that was passed in
     */

  }, {
    key: 'configureInteractionEventForDOMEvent',
    value: function configureInteractionEventForDOMEvent(interactionEvent, pointerEvent, interactionData) {
      interactionEvent.data = interactionData;

      this.mapPositionToPoint(interactionData, pointerEvent.clientX, pointerEvent.clientY);

      // this.raycaster.setFromCamera(interactionData.global, this.camera);

      // Not really sure why this is happening, but it's how a previous version handled things TODO: there should be remove
      if (pointerEvent.pointerType === 'touch') {
        pointerEvent.globalX = interactionData.global.x;
        pointerEvent.globalY = interactionData.global.y;
      }

      interactionData.originalEvent = pointerEvent;
      interactionEvent._reset();

      return interactionEvent;
    }

    /**
     * Ensures that the original event object contains all data that a regular pointer event would have
     *
     * @private
     * @param {TouchEvent|MouseEvent|PointerEvent} event - The original event data from a touch or mouse event
     * @return {PointerEvent[]} An array containing a single normalized pointer event, in the case of a pointer
     *  or mouse event, or a multiple normalized pointer events if there are multiple changed touches
     */

  }, {
    key: 'normalizeToPointerData',
    value: function normalizeToPointerData(event) {
      var normalizedEvents = [];

      if (this.supportsTouchEvents && event instanceof TouchEvent) {
        for (var i = 0, li = event.changedTouches.length; i < li; i++) {
          var touch = event.changedTouches[i];

          if (typeof touch.button === 'undefined') touch.button = event.touches.length ? 1 : 0;
          if (typeof touch.buttons === 'undefined') touch.buttons = event.touches.length ? 1 : 0;
          if (typeof touch.isPrimary === 'undefined') {
            touch.isPrimary = event.touches.length === 1 && event.type === 'touchstart';
          }
          if (typeof touch.width === 'undefined') touch.width = touch.radiusX || 1;
          if (typeof touch.height === 'undefined') touch.height = touch.radiusY || 1;
          if (typeof touch.tiltX === 'undefined') touch.tiltX = 0;
          if (typeof touch.tiltY === 'undefined') touch.tiltY = 0;
          if (typeof touch.pointerType === 'undefined') touch.pointerType = 'touch';
          if (typeof touch.pointerId === 'undefined') touch.pointerId = touch.identifier || 0;
          if (typeof touch.pressure === 'undefined') touch.pressure = touch.force || 0.5;
          touch.twist = 0;
          touch.tangentialPressure = 0;
          // TODO: Remove these, as layerX/Y is not a standard, is deprecated, has uneven
          // support, and the fill ins are not quite the same
          // offsetX/Y might be okay, but is not the same as clientX/Y when the canvas's top
          // left is not 0,0 on the page
          if (typeof touch.layerX === 'undefined') touch.layerX = touch.offsetX = touch.clientX;
          if (typeof touch.layerY === 'undefined') touch.layerY = touch.offsetY = touch.clientY;

          // mark the touch as normalized, just so that we know we did it
          touch.isNormalized = true;

          normalizedEvents.push(touch);
        }
      } else if (event instanceof MouseEvent && (!this.supportsPointerEvents || !(event instanceof window.PointerEvent))) {
        if (typeof event.isPrimary === 'undefined') event.isPrimary = true;
        if (typeof event.width === 'undefined') event.width = 1;
        if (typeof event.height === 'undefined') event.height = 1;
        if (typeof event.tiltX === 'undefined') event.tiltX = 0;
        if (typeof event.tiltY === 'undefined') event.tiltY = 0;
        if (typeof event.pointerType === 'undefined') event.pointerType = 'mouse';
        if (typeof event.pointerId === 'undefined') event.pointerId = MOUSE_POINTER_ID;
        if (typeof event.pressure === 'undefined') event.pressure = 0.5;
        event.twist = 0;
        event.tangentialPressure = 0;

        // mark the mouse event as normalized, just so that we know we did it
        event.isNormalized = true;

        normalizedEvents.push(event);
      } else {
        normalizedEvents.push(event);
      }

      return normalizedEvents;
    }

    /**
     * Destroys the interaction manager
     *
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      this.removeEvents();

      this.removeAllListeners();

      this.renderer = null;

      this.mouse = null;

      this.eventData = null;

      this.interactionDOMElement = null;

      this.onPointerDown = null;
      this.processPointerDown = null;

      this.onPointerUp = null;
      this.processPointerUp = null;

      this.onPointerCancel = null;
      this.processPointerCancel = null;

      this.onPointerMove = null;
      this.processPointerMove = null;

      this.onPointerOut = null;
      this.processPointerOverOut = null;

      this.onPointerOver = null;

      this._tempPoint = null;
    }
  }]);
  return InteractionManager;
}(Eventer);

/**
 * @param {object} options 舞台的配置项
 * @param {string} options.dom 舞台要附着的`canvas`元素
 * @param {number} [options.resolution] 设置舞台的分辨率，`默认为` 1
 * @param {boolean} [options.interactive] 设置舞台是否可交互，`默认为` true
 * @param {number} [options.width] 设置舞台的宽, `默认为` 附着的canvas.width
 * @param {number} [options.height] 设置舞台的高, `默认为` 附着的canvas.height
 * @param {string} [options.backgroundColor] 设置舞台的背景颜色，`默认为` ‘transparent’
 */
function Renderer(options) {
  var _this = this;

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
  this.canvas.style.backgroundColor = options.backgroundColor || 'transparent';

  /**
   * 场景是否自动清除上一帧的像素内容
   *
   * @member {Boolean}
   */
  this.autoClear = true;

  /**
   * 场景是否应用style控制宽高
   *
   * @member {Boolean}
   */
  this.autoStyle = false;

  /**
   * 整个场景的初始矩阵
   */
  this.rootMatrix = new Matrix();

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
   */
  this.resolution = options.resolution || 1;

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

  this.interactionManager = new InteractionManager(this);

  /**
   * 舞台是否可交互
   *
   * @member {Boolean}
   * @private
   */
  this._enableinteractive = null;

  // update interaction in every tick
  var interactionUpdate = function interactionUpdate(snippet) {
    _this.interactionManager.update(snippet);
  };

  this.interactiveOnChange = function () {
    if (this.enableinteractive) {
      this.on('prerender', interactionUpdate);
      this.interactionManager.addEvents();
    } else {
      this.off('prerender', interactionUpdate);
      this.interactionManager.removeEvents();
    }
  };

  this.enableinteractive = Utils.isBoolean(options.interactive) ? options.interactive : true;

  this.currentScene = null;
}

Renderer.prototype.clear = function () {
  this.ctx.setTransform(1, 0, 0, 1, 0, 0);
  this.ctx.clearRect(0, 0, this.width, this.height);
};

Renderer.prototype.render = function (scene, snippet) {
  this.currentScene = scene;

  this.emit('preupdate', snippet);
  this.currentScene.updateTimeline(snippet);
  this.currentScene.updatePosture(this.rootMatrix);
  this.emit('postupdate', snippet);

  this.emit('prerender', snippet);
  if (this.autoClear) this.clear();
  this.currentScene.render(this.ctx);
  this.emit('postrender', snippet);
};

/**
 * 舞台尺寸设置
 *
 * @param {number} w canvas的width值
 * @param {number} h canvas的height值
 */
Renderer.prototype.resize = function (w, h) {
  if (Utils.isNumber(w) && Utils.isNumber(h)) {
    this.realWidth = w;
    this.realHeight = h;
  } else {
    w = this.realWidth;
    h = this.realHeight;
  }
  this.width = this.canvas.width = w * this.resolution;
  this.height = this.canvas.height = h * this.resolution;
};

/**
 * proxy this.interactionManager event-emit
 * Emit an event to all registered event listeners.
 *
 * @param {String} event The name of the event.
 */
Renderer.prototype.emit = function () {
  var _interactionManager;

  (_interactionManager = this.interactionManager).emit.apply(_interactionManager, arguments);
};

/**
 * proxy this.interactionManager event-on
 * Register a new EventListener for the given event.
 *
 * @param {String} event Name of the event.
 * @param {Function} fn Callback function.
 * @param {Mixed} [context=this] The context of the function.
 */
Renderer.prototype.on = function () {
  var _interactionManager2;

  (_interactionManager2 = this.interactionManager).on.apply(_interactionManager2, arguments);
};

/**
 * proxy this.interactionManager event-once
 * Add an EventListener that's only called once.
 *
 * @param {String} event Name of the event.
 * @param {Function} fn Callback function.
 * @param {Mixed} [context=this] The context of the function.
 */
Renderer.prototype.once = function () {
  var _interactionManager3;

  (_interactionManager3 = this.interactionManager).once.apply(_interactionManager3, arguments);
};

/**
 * proxy this.interactionManager event-off
 * @param {String} event The event we want to remove.
 * @param {Function} fn The listener that we need to find.
 * @param {Mixed} context Only remove listeners matching this context.
 * @param {Boolean} once Only remove once listeners.
 */
Renderer.prototype.off = function () {
  var _interactionManager4;

  (_interactionManager4 = this.interactionManager).off.apply(_interactionManager4, arguments);
};

/**
 * 场景设置分辨率
 *
 * @member {Number}
 * @name resolution
 * @memberof JC.Renderer#
 */
Object.defineProperty(Renderer.prototype, 'resolution', {
  get: function get() {
    return this._resolution;
  },
  set: function set(value) {
    if (this._resolution !== value) {
      this._resolution = value;
      this.rootMatrix.identity().scale(value, value);
      this.resize();
    }
  }
});

/**
 * 标记场景是否可交互，涉及到是否进行事件检测
 *
 * @member {Boolean}
 * @name enableinteractive
 * @memberof JC.Renderer#
 */
Object.defineProperty(Renderer.prototype, 'enableinteractive', {
  get: function get() {
    return this._enableinteractive;
  },
  set: function set(value) {
    if (this._enableinteractive !== value) {
      this._enableinteractive = value;
      this.interactiveOnChange();
    }
  }
});

/**
 * @memberof JC
 * @param {object} options 舞台的配置项
 * @param {string} options.dom 舞台要附着的`canvas`元素
 * @param {number} [options.resolution] 设置舞台的分辨率，`默认为` 1
 * @param {boolean} [options.interactive] 设置舞台是否可交互，`默认为` true
 * @param {number} [options.width] 设置舞台的宽, `默认为` 附着的canvas.width
 * @param {number} [options.height] 设置舞台的高, `默认为` 附着的canvas.height
 * @param {string} [options.backgroundColor] 设置舞台的背景颜色，`默认为` ‘transparent’
 * @param {boolean} [options.enableFPS] 设置舞台是否记录帧率，`默认为` true
 */
function Application(options) {
  var _this = this;

  this.renderer = new Renderer(options);
  this.scene = new Scene();

  this.ticker = new Ticker(options.enableFPS);

  this.ticker.on('tick', function (snippet) {
    _this.update(snippet);
  });

  this.ticker.start();
}

Application.prototype.update = function (snippet) {
  this.renderer.render(this.scene, snippet);
};

/**
 * register class
 * @class
 * @private
 */

var Register = function () {
  /**
   * register
   * @param {array} assets assets array
   * @param {string} prefix assets array
   */
  function Register(assets, prefix) {
    classCallCheck(this, Register);

    this.layers = {};
    this._forever = false;
    this.loader = this.loadAssets(assets, prefix);
  }

  /**
   * load assets base pixi loader
   * @param {array} assets assets array
   * @param {string} prefix assets array
   * @return {loader}
   */


  createClass(Register, [{
    key: 'loadAssets',
    value: function loadAssets(assets, prefix) {
      var urls = {};
      assets.filter(function (it) {
        return it.u && it.p;
      }).forEach(function (it) {
        var url = createUrl(it, prefix);
        urls[it.id] = url;
      });
      return loaderUtil(urls);
    }

    /**
     * get texture by id
     * @param {string} id id name
     * @return {Texture}
     */

  }, {
    key: 'getTexture',
    value: function getTexture(id) {
      return this.loader.getById(id);
    }

    /**
     * registe layer
     * @private
     * @param {string} name layer name path
     * @param {object} layer layer object
     */

  }, {
    key: 'setLayer',
    value: function setLayer(name, layer) {
      if (!name) return;
      if (this.layers[name]) console.warn('动画层命名冲突', name);
      this.layers[name] = layer;
    }

    /**
     * registe layer
     * @private
     */

  }, {
    key: 'forever',
    value: function forever() {
      if (this._forever) return;
      this._forever = true;
    }

    /**
     * get layer by name path
     * @param {string} name layer name path, example: root.gift.star1
     * @return {object}
     */

  }, {
    key: 'getLayer',
    value: function getLayer(name) {
      return this.layers[name];
    }
  }]);
  return Register;
}();

/**
 * CurveData
 * @class
 * @private
 */

var CurveData = function () {
  /**
   * the primitive curve data object
   * @param {object} data curve config data
   * @param {object} session session
   * @param {boolean} mask is mask
   */
  function CurveData(data, session, mask) {
    classCallCheck(this, CurveData);
    var _session$st = session.st,
        st = _session$st === undefined ? 0 : _session$st;

    this.inv = data.inv;

    this.data = mask ? data.pt : data.ks;

    this.dynamic = this.data.a === 1;

    this.st = st;

    this.kic = 0;

    if (this.dynamic) this.prepare();
  }

  /**
   * prepare some data for faster calculation
   */


  createClass(CurveData, [{
    key: 'prepare',
    value: function prepare() {
      var datak = this.data.k;
      var last = datak.length - 1;

      this.ost = this.st + datak[0].t;
      this.oet = this.st + datak[last].t;

      for (var i = 0; i < last; i++) {
        var sbk = datak[i];
        var sek = datak[i + 1];

        sbk.ost = this.st + sbk.t;
        sbk.oet = this.st + sek.t;

        // TODO: 是否需要预先 修正坐标值，i、o 相对值 转换成 绝对值

        prepareEaseing(sbk.o.x, sbk.o.y, sbk.i.x, sbk.i.y);
      }
    }

    /**
     * get the curve frame by this progress
     * @param {number} progress timeline progress
     * @return {object}
     */

  }, {
    key: 'getCurve',
    value: function getCurve(progress) {
      if (!this.dynamic) return this.data.k;
      return this.interpolation(progress);
    }

    /**
     * compute value with keyframes buffer
     * @private
     * @param {number} progress progress
     * @return {array}
     */

  }, {
    key: 'interpolation',
    value: function interpolation$$1(progress) {
      var datak = this.data.k;

      if (progress <= this.ost) {
        return datak[0].s[0];
      } else if (progress >= this.oet) {
        var last = datak.length - 2;
        return datak[last].e[0];
      } else {
        var path = {
          i: [],
          o: [],
          v: []
        };
        var frame = datak[this.kic];
        if (!inRange$1(progress, frame.ost, frame.oet)) {
          this.kic = findStep$1(datak, progress);
          frame = datak[this.kic];
        }
        var rate = (progress - frame.ost) / (frame.oet - frame.ost);
        var nm = [frame.n, frame.n];

        var s0 = frame.s[0];
        var e0 = frame.e[0];
        for (var prop in path) {
          if (path[prop]) {
            var sp = s0[prop];
            var ep = e0[prop];
            var vv = [];
            for (var i = 0; i < sp.length; i++) {
              var s = sp[i];
              var e = ep[i];
              vv[i] = getEaseing(s, e, nm, rate);
            }
            path[prop] = vv;
          }
        }
        path.c = s0.c;
        return path;
      }
    }
  }]);
  return CurveData;
}();

/**
 * a
 * @param {*} ctx a
 * @param {*} data a
 */
function drawCurve(ctx, data) {
  var start = data.v[0];
  ctx.moveTo(start[0], start[1]);
  var jLen = data.v.length;
  var j = 1;
  for (; j < jLen; j++) {
    var _oj = data.o[j - 1];
    var _ij = data.i[j];
    var _vj = data.v[j];
    ctx.bezierCurveTo(_oj[0], _oj[1], _ij[0], _ij[1], _vj[0], _vj[1]);
  }
  var oj = data.o[j - 1];
  var ij = data.i[0];
  var vj = data.v[0];
  ctx.bezierCurveTo(oj[0], oj[1], ij[0], ij[1], vj[0], vj[1]);
}

/**
 * a
 * @param {*} ctx a
 * @param {*} size a
 */
function drawInv(ctx, size) {
  ctx.moveTo(0, 0);
  ctx.lineTo(size.w, 0);
  ctx.lineTo(size.w, size.h);
  ctx.lineTo(0, size.h);
  ctx.lineTo(0, 0);
}

/**
 * GraphicsMask class
 * @class
 * @private
 */

var GraphicsMask = function () {
  /**
   * GraphicsMask constructor
   * @param {object} masksProperties layer data information
   * @param {object} session layer data information
   */
  function GraphicsMask(masksProperties) {
    var session = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    classCallCheck(this, GraphicsMask);

    this.maskData = masksProperties.filter(function (it) {
      return it.mode !== 'n';
    });

    this.shapes = this.maskData.map(function (it) {
      return new CurveData(it, session, true);
    });

    this.session = session;

    this.curves = [];
  }

  /**
   * updateShape
   * @param {number} progress
   */


  createClass(GraphicsMask, [{
    key: 'update',
    value: function update(progress) {
      for (var i = 0; i < this.shapes.length; i++) {
        this.curves[i] = this.shapes[i].getCurve(progress);
      }
    }

    /**
     * render content
     * @param {object} ctx
     */

  }, {
    key: 'render',
    value: function render(ctx) {
      ctx.beginPath();
      for (var i = 0; i < this.shapes.length; i++) {
        if (this.shapes[i].inv) drawInv(ctx, this.session.size);
        drawCurve(ctx, this.curves[i]);
      }
      ctx.clip();
    }
  }]);
  return GraphicsMask;
}();

/**
 * Mask
 * @class
 * @private
 */

var Mask = function () {
  /**
   * generate a keyframes buffer
   * @param {Container} element host element
   * @param {object} layer layer data
   * @param {object} session now session
   * @param {object} session.size time of pre-frame
   * @param {number} session.st time of start position
   */
  function Mask(element, layer, session) {
    classCallCheck(this, Mask);

    this.element = element;

    this.masksProperties = layer.masksProperties || [];

    this.session = session;

    this.mask = new GraphicsMask(this.masksProperties, session);

    this.element.mask = this.mask;
  }

  /**
   * update
   * @param {number} progress progress
   * @param {object} session update session
   */


  createClass(Mask, [{
    key: 'update',
    value: function update(progress, session) {
      this.mask.update(progress);
    }
  }]);
  return Mask;
}();

var EX_REG = /(loopIn|loopOut)\(([^)]+)/;
var STR_REG = /["']\w+["']/;

/**
 * Cycle
 * @class
 * @private
 */

var Cycle = function () {
  /**
   * Pingpong
   * @param {*} type Pingpong
   * @param {*} begin Pingpong
   * @param {*} end Pingpong
   */
  function Cycle(type, begin, end) {
    classCallCheck(this, Cycle);

    this.begin = begin;
    this.end = end;
    this.total = this.end - this.begin;
    this.type = type;
  }

  /**
   * progress
   * @param {number} progress progress
   * @return {number} progress
   */


  createClass(Cycle, [{
    key: 'update',
    value: function update(progress) {
      if (this.type === 'in') {
        if (progress >= this.begin) return progress;
        return this.end - Utils.euclideanModulo(this.begin - progress, this.total);
      } else if (this.type === 'out') {
        if (progress <= this.end) return progress;
        return this.begin + Utils.euclideanModulo(progress - this.end, this.total);
      }
    }
  }]);
  return Cycle;
}();

/**
 * Pingpong
 * @class
 * @private
 */


var Pingpong = function () {
  /**
   * Pingpong
   * @param {*} type Pingpong
   * @param {*} begin Pingpong
   * @param {*} end Pingpong
   */
  function Pingpong(type, begin, end) {
    classCallCheck(this, Pingpong);

    this.begin = begin;
    this.end = end;
    this.total = this.end - this.begin;
    this.type = type;
  }

  /**
   * progress
   * @param {number} progress progress
   * @return {number} progress
   */


  createClass(Pingpong, [{
    key: 'update',
    value: function update(progress) {
      if (this.type === 'in' && progress < this.begin || this.type === 'out' && progress > this.end) {
        var space = progress - this.end;
        return this.pingpong(space);
      }
      return progress;
    }

    /**
     * pingpong
     * @param {number} space
     * @return {number}
     */

  }, {
    key: 'pingpong',
    value: function pingpong(space) {
      var dir = Math.floor(space / this.total) % 2;
      if (dir) {
        return this.begin + Utils.euclideanModulo(space, this.total);
      } else {
        return this.end - Utils.euclideanModulo(space, this.total);
      }
    }
  }]);
  return Pingpong;
}();

var FN_MAPS = {
  loopIn: function loopIn(datak, mode, offset) {
    var begin = datak[0].t;
    var end = datak[offset].t;
    switch (mode) {
      case 'cycle':
        return new Cycle('in', begin, end);
      case 'pingpong':
        return new Pingpong('in', begin, end);
      default:
        break;
    }
    return null;
  },
  loopOut: function loopOut(datak, mode, offset) {
    var last = datak.length - 1;
    var begin = datak[last - offset].t;
    var end = datak[last].t;
    switch (mode) {
      case 'cycle':
        return new Cycle('out', begin, end);
      case 'pingpong':
        return new Pingpong('out', begin, end);
      default:
        break;
    }
    return null;
  }
};

/**
 * parseParams
 * @ignore
 * @param {string} pStr string
 * @return {array}
 */
function parseParams(pStr) {
  var params = pStr.split(/\s*,\s*/);
  return params.map(function (it) {
    if (STR_REG.test(it)) return it.replace(/"|'/g, '');
    return parseInt(it);
  });
}

/**
 * parseEx
 * @ignore
 * @param {string} ex string
 * @return {object}
 */
function parseEx(ex) {
  var rs = ex.match(EX_REG);
  var ps = parseParams(rs[2]);
  return {
    name: rs[1],
    mode: ps[0],
    offset: ps[1]
  };
}

/**
 * hasExpression
 * @ignore
 * @param {string} ex string
 * @return {boolean}
 */
function hasExpression(ex) {
  return EX_REG.test(ex);
}

/**
 * getEX
 * @ignore
 * @param {object} ksp ksp
 * @return {object}
 */
function getEX(ksp) {
  var _parseEx = parseEx(ksp.x),
      name = _parseEx.name,
      mode = _parseEx.mode,
      offset = _parseEx.offset;

  var _offset = offset === 0 ? ksp.k.length - 1 : offset;
  return FN_MAPS[name] && FN_MAPS[name](ksp.k, mode, _offset);
}

/**
 * just return the value / 100
 * @ignore
 * @param {array} value an array with some number value
 * @param {*} _ just a placeholder param
 * @return {number}
 */
function toNormalize(value, _) {
  return value[0] / 100;
}

/**
 * just return the value / 100 by index
 * @ignore
 * @param {array} value an array with some number value
 * @param {number} index use which value
 * @return {number}
 */
function toNormalizeByIdx(value, index) {
  return value[index] / 100;
}

/**
 * just return the origin value by index
 * @ignore
 * @param {array} value an array with some number value
 * @param {number} index use which value
 * @return {number}
 */
function toBack(value, index) {
  return value[index];
}

/**
 * translate degree to radian
 * @ignore
 * @param {array} value an array with degree value
 * @param {*} _ just a placeholder param
 * @return {number}
 */
function toRadian(value, _) {
  return value[0] * Math.PI / 180;
}





var TRANSFORM_MAP = {
  o: {
    props: ['alpha'],
    translate: toNormalize
  },
  r: {
    props: ['rotation'],
    translate: toRadian
  },
  p: {
    props: ['x', 'y'],
    translate: toBack
  },
  a: {
    props: ['pivotX', 'pivotY'],
    translate: toBack
  },
  s: {
    props: ['scaleX', 'scaleY'],
    translate: toNormalizeByIdx
  }
};

/**
 * keyframes buffer, cache some status and progress
 * @class
 * @private
 */

var Transform = function () {
  /**
   * generate a keyframes buffer
   * @param {Container} element host element
   * @param {object} layer layer data
   * @param {object} session now session
   * @param {number} session.st time of start position
   */
  function Transform(element, layer, session) {
    classCallCheck(this, Transform);
    var _session$st = session.st,
        st = _session$st === undefined ? 0 : _session$st,
        register = session.register;


    this.element = element;

    this.ks = layer.ks;
    this.ip = layer.ip;
    this.op = layer.op;

    this.st = st;
    this.oip = this.st + this.ip;
    this.oop = this.st + this.op;

    this.aks = {};
    this.kic = {};

    this.preParse(register);
  }

  /**
   * preparse keyframes
   * @private
   * @param {Register} register
   */


  createClass(Transform, [{
    key: 'preParse',
    value: function preParse(register) {
      var ks = this.ks;
      for (var key in TRANSFORM_MAP) {
        if (ks[key] && ks[key].a) {
          this.parseDynamic(key, register);
        } else if (ks[key]) {
          this.parseStatic(key);
        }
      }
    }

    /**
     * preparse dynamic keyframes
     * @private
     * @param {string} key property
     * @param {Register} register
     */

  }, {
    key: 'parseDynamic',
    value: function parseDynamic(key, register) {
      var ksp = this.ks[key];
      var kspk = ksp.k;
      var last = kspk.length - 1;

      ksp.ost = this.st + kspk[0].t;
      ksp.oet = this.st + kspk[last].t;

      for (var i = 0; i < last; i++) {
        var sbk = kspk[i];
        var sek = kspk[i + 1];

        sbk.ost = this.st + sbk.t;
        sbk.oet = this.st + sek.t;
        if (Utils.isString(sbk.n) && sbk.ti && sbk.to) {
          prepareEaseing(sbk.o.x, sbk.o.y, sbk.i.x, sbk.i.y);
          var sp = new Point(sbk.s[0], sbk.s[1]);
          var ep = new Point(sbk.e[0], sbk.e[1]);
          var c1 = new Point(sbk.s[0] + sbk.ti[0], sbk.s[1] + sbk.ti[1]);
          var c2 = new Point(sbk.e[0] + sbk.to[0], sbk.e[1] + sbk.to[1]);
          sbk.curve = new BezierCurve([sp, c1, c2, ep]);
        } else {
          for (var _i = 0; _i < sbk.n.length; _i++) {
            prepareEaseing(sbk.o.x[_i], sbk.o.y[_i], sbk.i.x[_i], sbk.i.y[_i]);
          }
        }
      }

      if (hasExpression(ksp.x)) {
        ksp.expression = getEX(ksp);
        register.forever();
      }
      this.aks[key] = ksp;
    }

    /**
     * preparse static keyframes
     * @private
     * @param {string} key property
     */

  }, {
    key: 'parseStatic',
    value: function parseStatic(key) {
      var ksp = this.ks[key];
      var kspk = ksp.k;
      if (Utils.isNumber(kspk)) kspk = [kspk];

      this.setValue(key, kspk);
    }

    /**
     * compute child transform props
     * @private
     * @param {number} progress timeline progress
     * @param {object} session update session
     */

  }, {
    key: 'update',
    value: function update(progress, session) {
      if (session.forever) {
        this.element.visible = progress >= this.oip;
      } else {
        var visible = inRange$1(progress, this.oip, this.oop);
        this.element.visible = visible;
        if (!visible) return;
      }

      for (var key in this.aks) {
        if (this.aks[key]) {
          this.setValue(key, this.interpolation(key, progress));
        }
      }
    }

    /**
     * compute value with keyframes buffer
     * @private
     * @param {string} key which prop
     * @param {number} progress which prop
     * @return {array}
     */

  }, {
    key: 'interpolation',
    value: function interpolation$$1(key, progress) {
      var ak = this.aks[key];
      return interpolation(ak, progress, this.kic, key);
    }

    /**
     * set value to host element
     * @private
     * @param {string} key property
     * @param {array} value value array
     */

  }, {
    key: 'setValue',
    value: function setValue(key, value) {
      var _TRANSFORM_MAP$key = TRANSFORM_MAP[key],
          props = _TRANSFORM_MAP$key.props,
          translate = _TRANSFORM_MAP$key.translate;

      for (var i = 0; i < props.length; i++) {
        this.element[props[i]] = translate(value, i);
      }
    }
  }]);
  return Transform;
}();

// import Shapes from './Shapes';
/**
 * Keyframes
 * @class
 * @private
 */

var Keyframes = function () {
  /**
   * manager
   * @param {object} element element
   * @param {object} layer element
   * @param {object} session element
   */
  function Keyframes(element, layer, session) {
    classCallCheck(this, Keyframes);

    this.element = element;
    this.layer = Utils.copyJSON(layer);
    this.keyframes = [];

    this.parse(element, layer, session);
  }

  /**
   * parse
   * @param {object} element element
   * @param {object} layer
   * @param {object} session
   */


  createClass(Keyframes, [{
    key: 'parse',
    value: function parse(element, layer, session) {
      this.transform(element, layer, session);

      if (layer.hasMask) this.mask(element, layer, session);
      // if (layer.shapes) this.shapes(element, layer, session);
    }

    /**
     * transform
     * @param {object} element element
     * @param {object} layer
     * @param {object} session
     */

  }, {
    key: 'transform',
    value: function transform(element, layer, session) {
      this.add(new Transform(element, layer, session));
    }

    /**
     * mask
     * @param {object} element element
     * @param {object} layer
     * @param {object} session
     */

  }, {
    key: 'mask',
    value: function mask(element, layer, session) {
      this.add(new Mask(element, layer, session));
    }

    /**
     * shapes
     * @param {object} element element
     * @param {object} layer
     * @param {object} session
     */
    // shapes(element, layer, session) {
    //   this.add(new Shapes(element, layer, session));
    // }

    /**
     * update
     * @param {number} progress
     * @param {object} session update session
     */

  }, {
    key: 'update',
    value: function update(progress, session) {
      for (var i = 0; i < this.keyframes.length; i++) {
        this.keyframes[i].update(progress, session);
      }
    }

    /**
     * add
     * @param {object} keyframe
     */

  }, {
    key: 'add',
    value: function add(keyframe) {
      this.keyframes.push(keyframe);
    }
  }]);
  return Keyframes;
}();

/**
 * a
 */

var SolidRect = function () {
  /**
   * a
   * @param {*} fillColor a
   * @param {*} width a
   * @param {*} height a
   */
  function SolidRect(fillColor, width, height) {
    classCallCheck(this, SolidRect);

    this.fillColor = fillColor;
    this.width = width;
    this.height = height;
  }

  /**
   * a
   * @param {*} ctx a
   */


  createClass(SolidRect, [{
    key: 'render',
    value: function render(ctx) {
      ctx.beginPath();
      ctx.fillStyle = this.fillColor;
      ctx.fillRect(0, 0, this.width, this.height);
    }
  }]);
  return SolidRect;
}();

/**
 * NullElement class
 * @class
 * @private
 */


var SolidElement = function (_Graphics) {
  inherits(SolidElement, _Graphics);

  /**
   * NullElement constructor
   * @param {object} layer layer data information
   * @param {object} session layer data information
   */
  function SolidElement(layer) {
    var session = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    classCallCheck(this, SolidElement);
    var sc = layer.sc,
        sw = layer.sw,
        sh = layer.sh;

    var _this = possibleConstructorReturn(this, (SolidElement.__proto__ || Object.getPrototypeOf(SolidElement)).call(this, new SolidRect(sc, sw, sh)));

    var parentName = session.parentName,
        register = session.register;


    _this.name = parentName + '.' + layer.nm;

    register.setLayer(_this.name, _this);

    _this.initKeyFrames(layer, session);
    return _this;
  }

  /**
   * initKeyFrames
   * @param {object} layer layer
   * @param {object} session session
   */


  createClass(SolidElement, [{
    key: 'initKeyFrames',
    value: function initKeyFrames(layer, session) {
      this.bodymovin = new Keyframes(this, layer, session);
      this.movin = true;
    }

    /**
     * initKeyFrames
     * @param {number} progress progress
     * @param {object} session session
     */

  }, {
    key: 'updateKeyframes',
    value: function updateKeyframes(progress, session) {
      if (!this.movin) return;
      this.bodymovin.update(progress, session);
    }
  }]);
  return SolidElement;
}(Graphics);

/**
 * SpriteElement class
 * @class
 * @private
 */

var SpriteElement = function (_Sprite) {
  inherits(SpriteElement, _Sprite);

  /**
   * SpriteElement constructor
   * @param {object} layer layer data information
   * @param {object} session layer data information
   */
  function SpriteElement(layer) {
    var session = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    classCallCheck(this, SpriteElement);
    var parentName = session.parentName,
        register = session.register;


    var texture = register.getTexture(layer.refId);

    var _this = possibleConstructorReturn(this, (SpriteElement.__proto__ || Object.getPrototypeOf(SpriteElement)).call(this, { texture: texture }));

    _this.name = parentName + '.' + layer.nm;

    register.setLayer(_this.name, _this);

    _this.initKeyFrames(layer, session);
    return _this;
  }

  /**
   * initKeyFrames
   * @param {object} layer layer
   * @param {object} session session
   */


  createClass(SpriteElement, [{
    key: 'initKeyFrames',
    value: function initKeyFrames(layer, session) {
      this.bodymovin = new Keyframes(this, layer, session);
      this.movin = true;
    }

    /**
     * initKeyFrames
     * @param {number} progress progress
     * @param {object} session session
     */

  }, {
    key: 'updateKeyframes',
    value: function updateKeyframes(progress, session) {
      if (!this.movin) return;
      this.bodymovin.update(progress, session);
    }
  }]);
  return SpriteElement;
}(Sprite);

/**
 * NullElement class
 * @class
 * @private
 */

var NullElement = function (_Container) {
  inherits(NullElement, _Container);

  /**
   * NullElement constructor
   * @param {object} layer layer data information
   * @param {object} session layer data information
   */
  function NullElement(layer) {
    var session = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    classCallCheck(this, NullElement);

    var _this = possibleConstructorReturn(this, (NullElement.__proto__ || Object.getPrototypeOf(NullElement)).call(this));

    var parentName = session.parentName,
        register = session.register;


    _this.name = parentName + '.' + layer.nm;

    register.setLayer(_this.name, _this);

    _this.initKeyFrames(layer, session);
    return _this;
  }

  /**
   * initKeyFrames
   * @param {object} layer layer
   * @param {object} session session
   */


  createClass(NullElement, [{
    key: 'initKeyFrames',
    value: function initKeyFrames(layer, session) {
      this.bodymovin = new Keyframes(this, layer, session);
      this.movin = true;
    }

    /**
     * initKeyFrames
     * @param {number} progress progress
     * @param {object} session session
     */

  }, {
    key: 'updateKeyframes',
    value: function updateKeyframes(progress, session) {
      if (!this.movin) return;
      this.bodymovin.update(progress, session);
    }
  }]);
  return NullElement;
}(Container);

/**
 * a
 * @param {*} type a
 * @param {*} len a
 * @return {*}
 */
function createRegularArray(type, len) {
  var i = 0;
  var arr = [];
  var value = void 0;
  switch (type) {
    case 'int16':
    case 'uint8c':
      value = 1;
      break;
    default:
      value = 1.1;
      break;
  }
  for (i = 0; i < len; i += 1) {
    arr.push(value);
  }
  return arr;
}

/**
 * a
 * @param {*} type a
 * @param {*} len a
 * @return {*}
 */
function _createTypedArray$1(type, len) {
  if (type === 'float32') {
    return new Float32Array(len);
  } else if (type === 'int16') {
    return new Int16Array(len);
  } else if (type === 'uint8c') {
    return new Uint8ClampedArray(len);
  }
}

var createTypedArray = void 0;
//  = createTypedArray
if (typeof Uint8ClampedArray === 'function' && typeof Float32Array === 'function') {
  createTypedArray = _createTypedArray$1;
} else {
  createTypedArray = createRegularArray;
}

/**
 * a
 * @param {*} len a
 * @return {*}
 */
function createSizedArray(len) {
  return new Array(len);
}

/* eslint-disable */
/*!
 Transformation Matrix v2.0
 (c) Epistemex 2014-2015
 www.epistemex.com
 By Ken Fyrstenberg
 Contributions by leeoniya.
 License: MIT, header required.
 */

/**
 * 2D transformation matrix object initialized with identity matrix.
 *
 * The matrix can synchronize a canvas context by supplying the context
 * as an argument, or later apply current absolute transform to an
 * existing context.
 *
 * All values are handled as floating point values.
 *
 * @param {CanvasRenderingContext2D} [context] - Optional context to sync with Matrix
 * @prop {number} a - scale x
 * @prop {number} b - shear y
 * @prop {number} c - shear x
 * @prop {number} d - scale y
 * @prop {number} e - translate x
 * @prop {number} f - translate y
 * @prop {CanvasRenderingContext2D|null} [context=null] - set or get current canvas context
 * @constructor
 */

var Matrix$1 = function () {

    var _cos = Math.cos;
    var _sin = Math.sin;
    var _tan = Math.tan;
    var _rnd = Math.round;

    function reset() {
        this.props[0] = 1;
        this.props[1] = 0;
        this.props[2] = 0;
        this.props[3] = 0;
        this.props[4] = 0;
        this.props[5] = 1;
        this.props[6] = 0;
        this.props[7] = 0;
        this.props[8] = 0;
        this.props[9] = 0;
        this.props[10] = 1;
        this.props[11] = 0;
        this.props[12] = 0;
        this.props[13] = 0;
        this.props[14] = 0;
        this.props[15] = 1;
        return this;
    }

    function rotate(angle) {
        if (angle === 0) {
            return this;
        }
        var mCos = _cos(angle);
        var mSin = _sin(angle);
        return this._t(mCos, -mSin, 0, 0, mSin, mCos, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    }

    function rotateX(angle) {
        if (angle === 0) {
            return this;
        }
        var mCos = _cos(angle);
        var mSin = _sin(angle);
        return this._t(1, 0, 0, 0, 0, mCos, -mSin, 0, 0, mSin, mCos, 0, 0, 0, 0, 1);
    }

    function rotateY(angle) {
        if (angle === 0) {
            return this;
        }
        var mCos = _cos(angle);
        var mSin = _sin(angle);
        return this._t(mCos, 0, mSin, 0, 0, 1, 0, 0, -mSin, 0, mCos, 0, 0, 0, 0, 1);
    }

    function rotateZ(angle) {
        if (angle === 0) {
            return this;
        }
        var mCos = _cos(angle);
        var mSin = _sin(angle);
        return this._t(mCos, -mSin, 0, 0, mSin, mCos, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    }

    function shear(sx, sy) {
        return this._t(1, sy, sx, 1, 0, 0);
    }

    function skew(ax, ay) {
        return this.shear(_tan(ax), _tan(ay));
    }

    function skewFromAxis(ax, angle) {
        var mCos = _cos(angle);
        var mSin = _sin(angle);
        return this._t(mCos, mSin, 0, 0, -mSin, mCos, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)._t(1, 0, 0, 0, _tan(ax), 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)._t(mCos, -mSin, 0, 0, mSin, mCos, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        //return this._t(mCos, mSin, -mSin, mCos, 0, 0)._t(1, 0, _tan(ax), 1, 0, 0)._t(mCos, -mSin, mSin, mCos, 0, 0);
    }

    function scale(sx, sy, sz) {
        if (!sz && sz !== 0) {
            sz = 1;
        }
        if (sx === 1 && sy === 1 && sz === 1) {
            return this;
        }
        return this._t(sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, sz, 0, 0, 0, 0, 1);
    }

    function setTransform(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) {
        this.props[0] = a;
        this.props[1] = b;
        this.props[2] = c;
        this.props[3] = d;
        this.props[4] = e;
        this.props[5] = f;
        this.props[6] = g;
        this.props[7] = h;
        this.props[8] = i;
        this.props[9] = j;
        this.props[10] = k;
        this.props[11] = l;
        this.props[12] = m;
        this.props[13] = n;
        this.props[14] = o;
        this.props[15] = p;
        return this;
    }

    function translate(tx, ty, tz) {
        tz = tz || 0;
        if (tx !== 0 || ty !== 0 || tz !== 0) {
            return this._t(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tx, ty, tz, 1);
        }
        return this;
    }

    function transform(a2, b2, c2, d2, e2, f2, g2, h2, i2, j2, k2, l2, m2, n2, o2, p2) {

        var _p = this.props;

        if (a2 === 1 && b2 === 0 && c2 === 0 && d2 === 0 && e2 === 0 && f2 === 1 && g2 === 0 && h2 === 0 && i2 === 0 && j2 === 0 && k2 === 1 && l2 === 0) {
            //NOTE: commenting this condition because TurboFan deoptimizes code when present
            //if(m2 !== 0 || n2 !== 0 || o2 !== 0){
            _p[12] = _p[12] * a2 + _p[15] * m2;
            _p[13] = _p[13] * f2 + _p[15] * n2;
            _p[14] = _p[14] * k2 + _p[15] * o2;
            _p[15] = _p[15] * p2;
            //}
            this._identityCalculated = false;
            return this;
        }

        var a1 = _p[0];
        var b1 = _p[1];
        var c1 = _p[2];
        var d1 = _p[3];
        var e1 = _p[4];
        var f1 = _p[5];
        var g1 = _p[6];
        var h1 = _p[7];
        var i1 = _p[8];
        var j1 = _p[9];
        var k1 = _p[10];
        var l1 = _p[11];
        var m1 = _p[12];
        var n1 = _p[13];
        var o1 = _p[14];
        var p1 = _p[15];

        /* matrix order (canvas compatible):
         * ace
         * bdf
         * 001
         */
        _p[0] = a1 * a2 + b1 * e2 + c1 * i2 + d1 * m2;
        _p[1] = a1 * b2 + b1 * f2 + c1 * j2 + d1 * n2;
        _p[2] = a1 * c2 + b1 * g2 + c1 * k2 + d1 * o2;
        _p[3] = a1 * d2 + b1 * h2 + c1 * l2 + d1 * p2;

        _p[4] = e1 * a2 + f1 * e2 + g1 * i2 + h1 * m2;
        _p[5] = e1 * b2 + f1 * f2 + g1 * j2 + h1 * n2;
        _p[6] = e1 * c2 + f1 * g2 + g1 * k2 + h1 * o2;
        _p[7] = e1 * d2 + f1 * h2 + g1 * l2 + h1 * p2;

        _p[8] = i1 * a2 + j1 * e2 + k1 * i2 + l1 * m2;
        _p[9] = i1 * b2 + j1 * f2 + k1 * j2 + l1 * n2;
        _p[10] = i1 * c2 + j1 * g2 + k1 * k2 + l1 * o2;
        _p[11] = i1 * d2 + j1 * h2 + k1 * l2 + l1 * p2;

        _p[12] = m1 * a2 + n1 * e2 + o1 * i2 + p1 * m2;
        _p[13] = m1 * b2 + n1 * f2 + o1 * j2 + p1 * n2;
        _p[14] = m1 * c2 + n1 * g2 + o1 * k2 + p1 * o2;
        _p[15] = m1 * d2 + n1 * h2 + o1 * l2 + p1 * p2;

        this._identityCalculated = false;
        return this;
    }

    function isIdentity() {
        if (!this._identityCalculated) {
            this._identity = !(this.props[0] !== 1 || this.props[1] !== 0 || this.props[2] !== 0 || this.props[3] !== 0 || this.props[4] !== 0 || this.props[5] !== 1 || this.props[6] !== 0 || this.props[7] !== 0 || this.props[8] !== 0 || this.props[9] !== 0 || this.props[10] !== 1 || this.props[11] !== 0 || this.props[12] !== 0 || this.props[13] !== 0 || this.props[14] !== 0 || this.props[15] !== 1);
            this._identityCalculated = true;
        }
        return this._identity;
    }

    function equals(matr) {
        var i = 0;
        while (i < 16) {
            if (matr.props[i] !== this.props[i]) {
                return false;
            }
            i += 1;
        }
        return true;
    }

    function clone(matr) {
        var i;
        for (i = 0; i < 16; i += 1) {
            matr.props[i] = this.props[i];
        }
    }

    function cloneFromProps(props) {
        var i;
        for (i = 0; i < 16; i += 1) {
            this.props[i] = props[i];
        }
    }

    function applyToPoint(x, y, z) {

        return {
            x: x * this.props[0] + y * this.props[4] + z * this.props[8] + this.props[12],
            y: x * this.props[1] + y * this.props[5] + z * this.props[9] + this.props[13],
            z: x * this.props[2] + y * this.props[6] + z * this.props[10] + this.props[14]
        };
        /*return {
         x: x * me.a + y * me.c + me.e,
         y: x * me.b + y * me.d + me.f
         };*/
    }
    function applyToX(x, y, z) {
        return x * this.props[0] + y * this.props[4] + z * this.props[8] + this.props[12];
    }
    function applyToY(x, y, z) {
        return x * this.props[1] + y * this.props[5] + z * this.props[9] + this.props[13];
    }
    function applyToZ(x, y, z) {
        return x * this.props[2] + y * this.props[6] + z * this.props[10] + this.props[14];
    }

    function inversePoint(pt) {
        var determinant = this.props[0] * this.props[5] - this.props[1] * this.props[4];
        var a = this.props[5] / determinant;
        var b = -this.props[1] / determinant;
        var c = -this.props[4] / determinant;
        var d = this.props[0] / determinant;
        var e = (this.props[4] * this.props[13] - this.props[5] * this.props[12]) / determinant;
        var f = -(this.props[0] * this.props[13] - this.props[1] * this.props[12]) / determinant;
        return [pt[0] * a + pt[1] * c + e, pt[0] * b + pt[1] * d + f, 0];
    }

    function inversePoints(pts) {
        var i,
            len = pts.length,
            retPts = [];
        for (i = 0; i < len; i += 1) {
            retPts[i] = inversePoint(pts[i]);
        }
        return retPts;
    }

    function applyToTriplePoints(pt1, pt2, pt3) {
        var arr = createTypedArray('float32', 6);
        if (this.isIdentity()) {
            arr[0] = pt1[0];
            arr[1] = pt1[1];
            arr[2] = pt2[0];
            arr[3] = pt2[1];
            arr[4] = pt3[0];
            arr[5] = pt3[1];
        } else {
            var p0 = this.props[0],
                p1 = this.props[1],
                p4 = this.props[4],
                p5 = this.props[5],
                p12 = this.props[12],
                p13 = this.props[13];
            arr[0] = pt1[0] * p0 + pt1[1] * p4 + p12;
            arr[1] = pt1[0] * p1 + pt1[1] * p5 + p13;
            arr[2] = pt2[0] * p0 + pt2[1] * p4 + p12;
            arr[3] = pt2[0] * p1 + pt2[1] * p5 + p13;
            arr[4] = pt3[0] * p0 + pt3[1] * p4 + p12;
            arr[5] = pt3[0] * p1 + pt3[1] * p5 + p13;
        }
        return arr;
    }

    function applyToPointArray(x, y, z) {
        var arr;
        if (this.isIdentity()) {
            arr = [x, y, z];
        } else {
            arr = [x * this.props[0] + y * this.props[4] + z * this.props[8] + this.props[12], x * this.props[1] + y * this.props[5] + z * this.props[9] + this.props[13], x * this.props[2] + y * this.props[6] + z * this.props[10] + this.props[14]];
        }
        return arr;
    }

    function applyToPointStringified(x, y) {
        if (this.isIdentity()) {
            return x + ',' + y;
        }
        var _p = this.props;
        return Math.round((x * _p[0] + y * _p[4] + _p[12]) * 100) / 100 + ',' + Math.round((x * _p[1] + y * _p[5] + _p[13]) * 100) / 100;
    }

    function toCSS() {
        //Doesn't make much sense to add this optimization. If it is an identity matrix, it's very likely this will get called only once since it won't be keyframed.
        /*if(this.isIdentity()) {
            return '';
        }*/
        var i = 0;
        var props = this.props;
        var cssValue = 'matrix3d(';
        var v = 10000;
        while (i < 16) {
            cssValue += _rnd(props[i] * v) / v;
            cssValue += i === 15 ? ')' : ',';
            i += 1;
        }
        return cssValue;
    }

    function roundMatrixProperty(val) {
        var v = 10000;
        if (val < 0.000001 && val > 0 || val > -0.000001 && val < 0) {
            return _rnd(val * v) / v;
        }
        return val;
    }

    function to2dCSS() {
        //Doesn't make much sense to add this optimization. If it is an identity matrix, it's very likely this will get called only once since it won't be keyframed.
        /*if(this.isIdentity()) {
            return '';
        }*/
        var props = this.props;
        var _a = roundMatrixProperty(props[0]);
        var _b = roundMatrixProperty(props[1]);
        var _c = roundMatrixProperty(props[4]);
        var _d = roundMatrixProperty(props[5]);
        var _e = roundMatrixProperty(props[12]);
        var _f = roundMatrixProperty(props[13]);
        return "matrix(" + _a + ',' + _b + ',' + _c + ',' + _d + ',' + _e + ',' + _f + ")";
    }

    return function () {
        this.reset = reset;
        this.rotate = rotate;
        this.rotateX = rotateX;
        this.rotateY = rotateY;
        this.rotateZ = rotateZ;
        this.skew = skew;
        this.skewFromAxis = skewFromAxis;
        this.shear = shear;
        this.scale = scale;
        this.setTransform = setTransform;
        this.translate = translate;
        this.transform = transform;
        this.applyToPoint = applyToPoint;
        this.applyToX = applyToX;
        this.applyToY = applyToY;
        this.applyToZ = applyToZ;
        this.applyToPointArray = applyToPointArray;
        this.applyToTriplePoints = applyToTriplePoints;
        this.applyToPointStringified = applyToPointStringified;
        this.toCSS = toCSS;
        this.to2dCSS = to2dCSS;
        this.clone = clone;
        this.cloneFromProps = cloneFromProps;
        this.equals = equals;
        this.inversePoints = inversePoints;
        this.inversePoint = inversePoint;
        this._t = this.transform;
        this.isIdentity = isIdentity;
        this._identity = true;
        this._identityCalculated = false;

        this.props = createTypedArray('float32', 16);
        this.reset();
    };
}();

/**
 * a
 */

var ShapeTransformManager = function () {
  /**
   * a
   */
  function ShapeTransformManager() {
    classCallCheck(this, ShapeTransformManager);

    this.sequences = {};
    this.sequenceList = [];
    this.transform_key_count = 0;
  }

  /**
   * a
   * @param {*} transforms a
   * @return {*}
   */


  createClass(ShapeTransformManager, [{
    key: 'addTransformSequence',
    value: function addTransformSequence(transforms) {
      var len = transforms.length;
      var key = '_';
      for (var i = 0; i < len; i += 1) {
        key += transforms[i].transform.key + '_';
      }
      var sequence = this.sequences[key];
      if (!sequence) {
        sequence = {
          transforms: [].concat(transforms),
          finalTransform: new Matrix$1(),
          _mdf: false
        };
        this.sequences[key] = sequence;
        this.sequenceList.push(sequence);
      }
      return sequence;
    }

    /**
     * a
     * @param {*} sequence a
     * @param {*} isFirstFrame a
     */

  }, {
    key: 'processSequence',
    value: function processSequence(sequence, isFirstFrame) {
      var i = 0;
      var _mdf = isFirstFrame;
      var len = sequence.transforms.length;
      while (i < len && !isFirstFrame) {
        if (sequence.transforms[i].transform.mProps._mdf) {
          _mdf = true;
          break;
        }
        i += 1;
      }
      if (_mdf) {
        var props = void 0;
        sequence.finalTransform.reset();
        for (i = len - 1; i >= 0; i -= 1) {
          props = sequence.transforms[i].transform.mProps.v.props;
          sequence.finalTransform.transform(props[0], props[1], props[2], props[3], props[4], props[5], props[6], props[7], props[8], props[9], props[10], props[11], props[12], props[13], props[14], props[15]);
        }
      }
      sequence._mdf = _mdf;
    }

    /**
     * a
     * @param {*} isFirstFrame a
     */

  }, {
    key: 'processSequences',
    value: function processSequences(isFirstFrame) {
      var len = this.sequenceList.length;
      for (var i = 0; i < len; i += 1) {
        this.processSequence(this.sequenceList[i], isFirstFrame);
      }
    }

    /**
     * a
     * @return {*}
     */

  }, {
    key: 'getNewKey',
    value: function getNewKey() {
      return '_' + this.transform_key_count++;
    }
  }]);
  return ShapeTransformManager;
}();

/* eslint-disable */
var BezierFactory = function () {
    /**
     * BezierEasing - use bezier curve for transition easing function
     * by Gaëtan Renaudeau 2014 - 2015 – MIT License
     *
     * Credits: is based on Firefox's nsSMILKeySpline.cpp
     * Usage:
     * var spline = BezierEasing([ 0.25, 0.1, 0.25, 1.0 ])
     * spline.get(x) => returns the easing value | x must be in [0, 1] range
     *
     */

    var ob = {};
    ob.getBezierEasing = getBezierEasing;
    var beziers = {};

    function getBezierEasing(a, b, c, d, nm) {
        var str = nm || ('bez_' + a + '_' + b + '_' + c + '_' + d).replace(/\./g, 'p');
        if (beziers[str]) {
            return beziers[str];
        }
        var bezEasing = new BezierEasing([a, b, c, d]);
        beziers[str] = bezEasing;
        return bezEasing;
    }

    // These values are established by empiricism with tests (tradeoff: performance VS precision)
    var NEWTON_ITERATIONS = 4;
    var NEWTON_MIN_SLOPE = 0.001;
    var SUBDIVISION_PRECISION = 0.0000001;
    var SUBDIVISION_MAX_ITERATIONS = 10;

    var kSplineTableSize = 11;
    var kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);

    var float32ArraySupported = typeof Float32Array === "function";

    function A(aA1, aA2) {
        return 1.0 - 3.0 * aA2 + 3.0 * aA1;
    }
    function B(aA1, aA2) {
        return 3.0 * aA2 - 6.0 * aA1;
    }
    function C(aA1) {
        return 3.0 * aA1;
    }

    // Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
    function calcBezier(aT, aA1, aA2) {
        return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT;
    }

    // Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.
    function getSlope(aT, aA1, aA2) {
        return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1);
    }

    function binarySubdivide(aX, aA, aB, mX1, mX2) {
        var currentX,
            currentT,
            i = 0;
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

    function newtonRaphsonIterate(aX, aGuessT, mX1, mX2) {
        for (var i = 0; i < NEWTON_ITERATIONS; ++i) {
            var currentSlope = getSlope(aGuessT, mX1, mX2);
            if (currentSlope === 0.0) return aGuessT;
            var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
            aGuessT -= currentX / currentSlope;
        }
        return aGuessT;
    }

    /**
     * points is an array of [ mX1, mY1, mX2, mY2 ]
     */
    function BezierEasing(points) {
        this._p = points;
        this._mSampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);
        this._precomputed = false;

        this.get = this.get.bind(this);
    }

    BezierEasing.prototype = {

        get: function get(x) {
            var mX1 = this._p[0],
                mY1 = this._p[1],
                mX2 = this._p[2],
                mY2 = this._p[3];
            if (!this._precomputed) this._precompute();
            if (mX1 === mY1 && mX2 === mY2) return x; // linear
            // Because JavaScript number are imprecise, we should guarantee the extremes are right.
            if (x === 0) return 0;
            if (x === 1) return 1;
            return calcBezier(this._getTForX(x), mY1, mY2);
        },

        // Private part

        _precompute: function _precompute() {
            var mX1 = this._p[0],
                mY1 = this._p[1],
                mX2 = this._p[2],
                mY2 = this._p[3];
            this._precomputed = true;
            if (mX1 !== mY1 || mX2 !== mY2) this._calcSampleValues();
        },

        _calcSampleValues: function _calcSampleValues() {
            var mX1 = this._p[0],
                mX2 = this._p[2];
            for (var i = 0; i < kSplineTableSize; ++i) {
                this._mSampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
            }
        },

        /**
         * getTForX chose the fastest heuristic to determine the percentage value precisely from a given X projection.
         */
        _getTForX: function _getTForX(aX) {
            var mX1 = this._p[0],
                mX2 = this._p[2],
                mSampleValues = this._mSampleValues;

            var intervalStart = 0.0;
            var currentSample = 1;
            var lastSample = kSplineTableSize - 1;

            for (; currentSample !== lastSample && mSampleValues[currentSample] <= aX; ++currentSample) {
                intervalStart += kSampleStepSize;
            }
            --currentSample;

            // Interpolate to provide an initial guess for t
            var dist = (aX - mSampleValues[currentSample]) / (mSampleValues[currentSample + 1] - mSampleValues[currentSample]);
            var guessForT = intervalStart + dist * kSampleStepSize;

            var initialSlope = getSlope(guessForT, mX1, mX2);
            if (initialSlope >= NEWTON_MIN_SLOPE) {
                return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
            } else if (initialSlope === 0.0) {
                return guessForT;
            } else {
                return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
            }
        }
    };

    return ob;
}();

/**
 * a
 * @param {*} arr a
 * @return {*}
 */
function double(arr) {
  return arr.concat(createSizedArray(arr.length));
}

var pooling = { double: double };

var pool_factory = function pool_factory(initialLength, _create, _release) {
  var _length = 0;
  var _maxLength = initialLength;
  var pool = createSizedArray(_maxLength);

  var ob = {
    newElement: newElement,
    release: release
  };

  /**
   * a
   * @return {*}
   */
  function newElement() {
    var element = void 0;
    if (_length) {
      _length -= 1;
      element = pool[_length];
    } else {
      element = _create();
    }
    return element;
  }

  /**
   * a
   * @param {*} element a
   */
  function release(element) {
    if (_length === _maxLength) {
      pool = pooling.double(pool);
      _maxLength = _maxLength * 2;
    }
    if (_release) {
      _release(element);
    }
    pool[_length] = element;
    _length += 1;
  }

  /**
   * @return {*}
   */
  // function clone() {
  //   var clonedElement = newElement();
  //   return _clone(clonedElement);
  // }

  return ob;
};

var defaultCurveSegments$1 = 200;
/**
 * a
 * @return {*}
 */
function create() {
  return {
    addedLength: 0,
    percents: createTypedArray('float32', defaultCurveSegments$1),
    lengths: createTypedArray('float32', defaultCurveSegments$1)
  };
}
var bezier_length_pool = pool_factory(8, create);

/**
 * @return {*}
 */
function create$1() {
  return {
    lengths: [],
    totalLength: 0
  };
}

/**
 * a
 * @param {*} element a
 */
function release(element) {
  var len = element.lengths.length;
  for (var i = 0; i < len; i += 1) {
    bezier_length_pool.release(element.lengths[i]);
  }
  element.lengths.length = 0;
}

var segments_length_pool = pool_factory(8, create$1, release);

// var easingFunctions = [];
// var math = Math;
var defaultCurveSegments = 200;

/**
 * a
 * @param {*} x1 a
 * @param {*} y1 a
 * @param {*} x2 a
 * @param {*} y2 a
 * @param {*} x3 a
 * @param {*} y3 a
 * @return {*}
 */
function pointOnLine2D(x1, y1, x2, y2, x3, y3) {
  var det1 = x1 * y2 + y1 * x3 + x2 * y3 - x3 * y2 - y3 * x1 - x2 * y1;
  return det1 > -0.001 && det1 < 0.001;
}

/**
 * a
 * @param {*} x1 a
 * @param {*} y1 a
 * @param {*} z1 a
 * @param {*} x2 a
 * @param {*} y2 a
 * @param {*} z2 a
 * @param {*} x3 a
 * @param {*} y3 a
 * @param {*} z3 a
 * @return {*}
 */
function pointOnLine3D(x1, y1, z1, x2, y2, z2, x3, y3, z3) {
  if (z1 === 0 && z2 === 0 && z3 === 0) {
    return pointOnLine2D(x1, y1, x2, y2, x3, y3);
  }
  var dist1 = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2));
  var dist2 = Math.sqrt(Math.pow(x3 - x1, 2) + Math.pow(y3 - y1, 2) + Math.pow(z3 - z1, 2));
  var dist3 = Math.sqrt(Math.pow(x3 - x2, 2) + Math.pow(y3 - y2, 2) + Math.pow(z3 - z2, 2));
  var diffDist = void 0;
  if (dist1 > dist2) {
    if (dist1 > dist3) {
      diffDist = dist1 - dist2 - dist3;
    } else {
      diffDist = dist3 - dist2 - dist1;
    }
  } else if (dist3 > dist2) {
    diffDist = dist3 - dist2 - dist1;
  } else {
    diffDist = dist2 - dist1 - dist3;
  }
  return diffDist > -0.0001 && diffDist < 0.0001;
}

/**
 * a
 * @param {*} pt1 a
 * @param {*} pt2 a
 * @param {*} pt3 a
 * @param {*} pt4 a
 * @return {*}
 */
function getBezierLength(pt1, pt2, pt3, pt4) {
  var curveSegments = defaultCurveSegments || 200;
  // var i, len;
  var addedLength = 0;
  var ptDistance = void 0;
  var point = [];
  var lastPoint = [];
  var lengthData = bezier_length_pool.newElement();
  var len = pt3.length;
  for (var k = 0; k < curveSegments; k += 1) {
    var perc = k / (curveSegments - 1);
    ptDistance = 0;
    for (var i = 0; i < len; i += 1) {
      var ptCoord = Math.pow(1 - perc, 3) * pt1[i] + 3 * Math.pow(1 - perc, 2) * perc * pt3[i] + 3 * (1 - perc) * Math.pow(perc, 2) * pt4[i] + Math.pow(perc, 3) * pt2[i];
      point[i] = ptCoord;
      if (lastPoint[i] !== null) {
        ptDistance += Math.pow(point[i] - lastPoint[i], 2);
      }
      lastPoint[i] = point[i];
    }
    if (ptDistance) {
      ptDistance = Math.sqrt(ptDistance);
      addedLength += ptDistance;
    }
    lengthData.percents[k] = perc;
    lengthData.lengths[k] = addedLength;
  }
  lengthData.addedLength = addedLength;
  return lengthData;
}

/**
 * a
 * @param {*} shapeData a
 * @return {*}
 */
function getSegmentsLength(shapeData) {
  var segmentsLength = segments_length_pool.newElement();
  var closed = shapeData.c;
  var pathV = shapeData.v;
  var pathO = shapeData.o;
  var pathI = shapeData.i;
  var len = shapeData._length;
  var lengths = segmentsLength.lengths;
  var totalLength = 0;
  var i = 0;
  for (; i < len - 1; i += 1) {
    lengths[i] = getBezierLength(pathV[i], pathV[i + 1], pathO[i], pathI[i + 1]);
    totalLength += lengths[i].addedLength;
  }
  if (closed && len) {
    lengths[i] = getBezierLength(pathV[i], pathV[0], pathO[i], pathI[0]);
    totalLength += lengths[i].addedLength;
  }
  segmentsLength.totalLength = totalLength;
  return segmentsLength;
}

/**
 * a
 * @param {*} length a
 */
function BezierData(length) {
  this.segmentLength = 0;
  this.points = new Array(length);
}

/**
 * a
 * @param {*} partial a
 * @param {*} point a
 */
function PointData(partial, point) {
  this.partialLength = partial;
  this.point = point;
}

var storedData = {};
/**
 * a
 * @param {*} pt1 a
 * @param {*} pt2 a
 * @param {*} pt3 a
 * @param {*} pt4 a
 * @return {*}
 */
function buildBezierData(pt1, pt2, pt3, pt4) {
  var bezierName = (pt1[0] + '_' + pt1[1] + '_' + pt2[0] + '_' + pt2[1] + '_' + pt3[0] + '_' + pt3[1] + '_' + pt4[0] + '_' + pt4[1]).replace(/\./g, 'p');
  if (!storedData[bezierName]) {
    var curveSegments = defaultCurveSegments;
    // var k, i, len;
    var addedLength = 0;
    var ptDistance = void 0;
    var point = void 0;
    var lastPoint = null;
    if (pt1.length === 2 && (pt1[0] != pt2[0] || pt1[1] != pt2[1]) && pointOnLine2D(pt1[0], pt1[1], pt2[0], pt2[1], pt1[0] + pt3[0], pt1[1] + pt3[1]) && pointOnLine2D(pt1[0], pt1[1], pt2[0], pt2[1], pt2[0] + pt4[0], pt2[1] + pt4[1])) {
      curveSegments = 2;
    }
    var bezierData = new BezierData(curveSegments);
    var len = pt3.length;
    for (var k = 0; k < curveSegments; k += 1) {
      point = createSizedArray(len);
      var perc = k / (curveSegments - 1);
      ptDistance = 0;
      for (var i = 0; i < len; i += 1) {
        var ptCoord = Math.pow(1 - perc, 3) * pt1[i] + 3 * Math.pow(1 - perc, 2) * perc * (pt1[i] + pt3[i]) + 3 * (1 - perc) * Math.pow(perc, 2) * (pt2[i] + pt4[i]) + Math.pow(perc, 3) * pt2[i];
        point[i] = ptCoord;
        if (lastPoint !== null) {
          ptDistance += Math.pow(point[i] - lastPoint[i], 2);
        }
      }
      ptDistance = Math.sqrt(ptDistance);
      addedLength += ptDistance;
      bezierData.points[k] = new PointData(ptDistance, point);
      lastPoint = point;
    }
    bezierData.segmentLength = addedLength;
    storedData[bezierName] = bezierData;
  }
  return storedData[bezierName];
}

/**
 * a
 * @param {*} perc a
 * @param {*} bezierData a
 * @return {*}
 */
function getDistancePerc(perc, bezierData) {
  var percents = bezierData.percents;
  var lengths = bezierData.lengths;
  var len = percents.length;
  var initPos = Math.floor((len - 1) * perc);
  var lengthPos = perc * bezierData.addedLength;
  var lPerc = 0;
  if (initPos === len - 1 || initPos === 0 || lengthPos === lengths[initPos]) {
    return percents[initPos];
  } else {
    var dir = lengths[initPos] > lengthPos ? -1 : 1;
    var flag = true;
    while (flag) {
      if (lengths[initPos] <= lengthPos && lengths[initPos + 1] > lengthPos) {
        lPerc = (lengthPos - lengths[initPos]) / (lengths[initPos + 1] - lengths[initPos]);
        flag = false;
      } else {
        initPos += dir;
      }
      if (initPos < 0 || initPos >= len - 1) {
        // FIX for TypedArrays that don't store floating point values with enough accuracy
        if (initPos === len - 1) {
          return percents[initPos];
        }
        flag = false;
      }
    }
    return percents[initPos] + (percents[initPos + 1] - percents[initPos]) * lPerc;
  }
}

/**
 * a
 * @param {*} pt1 a
 * @param {*} pt2 a
 * @param {*} pt3 a
 * @param {*} pt4 a
 * @param {*} percent a
 * @param {*} bezierData a
 * @return {*}
 */
function getPointInSegment(pt1, pt2, pt3, pt4, percent, bezierData) {
  var t1 = getDistancePerc(percent, bezierData);
  // var u0 = 1;
  var u1 = 1 - t1;
  var ptX = Math.round((u1 * u1 * u1 * pt1[0] + (t1 * u1 * u1 + u1 * t1 * u1 + u1 * u1 * t1) * pt3[0] + (t1 * t1 * u1 + u1 * t1 * t1 + t1 * u1 * t1) * pt4[0] + t1 * t1 * t1 * pt2[0]) * 1000) / 1000;
  var ptY = Math.round((u1 * u1 * u1 * pt1[1] + (t1 * u1 * u1 + u1 * t1 * u1 + u1 * u1 * t1) * pt3[1] + (t1 * t1 * u1 + u1 * t1 * t1 + t1 * u1 * t1) * pt4[1] + t1 * t1 * t1 * pt2[1]) * 1000) / 1000;
  return [ptX, ptY];
}

// function getSegmentArray() {

// }

var bezierSegmentPoints = createTypedArray('float32', 8);

/**
 * a
 * @param {*} pt1 a
 * @param {*} pt2 a
 * @param {*} pt3 a
 * @param {*} pt4 a
 * @param {*} startPerc a
 * @param {*} endPerc a
 * @param {*} bezierData a
 * @return {*}
 */
function getNewSegment(pt1, pt2, pt3, pt4, startPerc, endPerc, bezierData) {
  startPerc = startPerc < 0 ? 0 : startPerc > 1 ? 1 : startPerc;
  var t0 = getDistancePerc(startPerc, bezierData);
  endPerc = endPerc > 1 ? 1 : endPerc;
  var t1 = getDistancePerc(endPerc, bezierData);
  var len = pt1.length;
  var u0 = 1 - t0;
  var u1 = 1 - t1;
  var u0u0u0 = u0 * u0 * u0;
  var t0u0u0_3 = t0 * u0 * u0 * 3;
  var t0t0u0_3 = t0 * t0 * u0 * 3;
  var t0t0t0 = t0 * t0 * t0;
  //
  var u0u0u1 = u0 * u0 * u1;
  var t0u0u1_3 = t0 * u0 * u1 + u0 * t0 * u1 + u0 * u0 * t1;
  var t0t0u1_3 = t0 * t0 * u1 + u0 * t0 * t1 + t0 * u0 * t1;
  var t0t0t1 = t0 * t0 * t1;
  //
  var u0u1u1 = u0 * u1 * u1;
  var t0u1u1_3 = t0 * u1 * u1 + u0 * t1 * u1 + u0 * u1 * t1;
  var t0t1u1_3 = t0 * t1 * u1 + u0 * t1 * t1 + t0 * u1 * t1;
  var t0t1t1 = t0 * t1 * t1;
  //
  var u1u1u1 = u1 * u1 * u1;
  var t1u1u1_3 = t1 * u1 * u1 + u1 * t1 * u1 + u1 * u1 * t1;
  var t1t1u1_3 = t1 * t1 * u1 + u1 * t1 * t1 + t1 * u1 * t1;
  var t1t1t1 = t1 * t1 * t1;
  for (var i = 0; i < len; i += 1) {
    bezierSegmentPoints[i * 4] = Math.round((u0u0u0 * pt1[i] + t0u0u0_3 * pt3[i] + t0t0u0_3 * pt4[i] + t0t0t0 * pt2[i]) * 1000) / 1000;
    bezierSegmentPoints[i * 4 + 1] = Math.round((u0u0u1 * pt1[i] + t0u0u1_3 * pt3[i] + t0t0u1_3 * pt4[i] + t0t0t1 * pt2[i]) * 1000) / 1000;
    bezierSegmentPoints[i * 4 + 2] = Math.round((u0u1u1 * pt1[i] + t0u1u1_3 * pt3[i] + t0t1u1_3 * pt4[i] + t0t1t1 * pt2[i]) * 1000) / 1000;
    bezierSegmentPoints[i * 4 + 3] = Math.round((u1u1u1 * pt1[i] + t1u1u1_3 * pt3[i] + t1t1u1_3 * pt4[i] + t1t1t1 * pt2[i]) * 1000) / 1000;
  }

  return bezierSegmentPoints;
}

var bez = {
  getSegmentsLength: getSegmentsLength,
  getNewSegment: getNewSegment,
  getPointInSegment: getPointInSegment,
  buildBezierData: buildBezierData,
  pointOnLine2D: pointOnLine2D,
  pointOnLine3D: pointOnLine3D
};

var initFrame = -999999;
var mathAbs = Math.abs;
var degToRads$1 = Math.PI / 180;

/**
 * based on @Toji's https://github.com/toji/gl-matrix/
 * @param {*} a a
 * @param {*} b a
 * @param {*} t a
 * @return {*}
 */
function slerp(a, b, t) {
  var out = [];
  var ax = a[0];
  var ay = a[1];
  var az = a[2];
  var aw = a[3];
  var bx = b[0];
  var by = b[1];
  var bz = b[2];
  var bw = b[3];

  var omega = void 0;
  var cosom = void 0;
  var sinom = void 0;
  var scale0 = void 0;
  var scale1 = void 0;

  cosom = ax * bx + ay * by + az * bz + aw * bw;
  if (cosom < 0.0) {
    cosom = -cosom;
    bx = -bx;
    by = -by;
    bz = -bz;
    bw = -bw;
  }
  if (1.0 - cosom > 0.000001) {
    omega = Math.acos(cosom);
    sinom = Math.sin(omega);
    scale0 = Math.sin((1.0 - t) * omega) / sinom;
    scale1 = Math.sin(t * omega) / sinom;
  } else {
    scale0 = 1.0 - t;
    scale1 = t;
  }
  out[0] = scale0 * ax + scale1 * bx;
  out[1] = scale0 * ay + scale1 * by;
  out[2] = scale0 * az + scale1 * bz;
  out[3] = scale0 * aw + scale1 * bw;

  return out;
}

/**
 * a
 * @param {*} out a
 * @param {*} quat a
 */
function quaternionToEuler(out, quat) {
  var qx = quat[0];
  var qy = quat[1];
  var qz = quat[2];
  var qw = quat[3];
  var heading = Math.atan2(2 * qy * qw - 2 * qx * qz, 1 - 2 * qy * qy - 2 * qz * qz);
  var attitude = Math.asin(2 * qx * qy + 2 * qz * qw);
  var bank = Math.atan2(2 * qx * qw - 2 * qy * qz, 1 - 2 * qx * qx - 2 * qz * qz);
  out[0] = heading / degToRads$1;
  out[1] = attitude / degToRads$1;
  out[2] = bank / degToRads$1;
}

/**
 * a
 * @param {*} values a
 * @return {*}
 */
function createQuaternion(values) {
  var heading = values[0] * degToRads$1;
  var attitude = values[1] * degToRads$1;
  var bank = values[2] * degToRads$1;
  var c1 = Math.cos(heading / 2);
  var c2 = Math.cos(attitude / 2);
  var c3 = Math.cos(bank / 2);
  var s1 = Math.sin(heading / 2);
  var s2 = Math.sin(attitude / 2);
  var s3 = Math.sin(bank / 2);
  var w = c1 * c2 * c3 - s1 * s2 * s3;
  var x = s1 * s2 * c3 + c1 * c2 * s3;
  var y = s1 * c2 * c3 + c1 * s2 * s3;
  var z = c1 * s2 * c3 - s1 * c2 * s3;

  return [x, y, z, w];
}

/**
 * a
 */

var BaseProperty = function () {
  /**
   * a
   */
  function BaseProperty() {
    classCallCheck(this, BaseProperty);

    this.offsetTime = 0;
    this.keyframes = null;
    this.propType = '';
  }

  /**
   * a
   * @param {*} frameNum a
   * @param {*} caching a
   * @return {*}
   */


  createClass(BaseProperty, [{
    key: 'interpolateValue',
    value: function interpolateValue(frameNum, caching) {
      var offsetTime = this.offsetTime;
      var newValue = void 0;
      if (this.propType === 'multidimensional') {
        newValue = createTypedArray('float32', this.pv.length);
      }
      var iterationIndex = caching.lastIndex;
      var i = iterationIndex;
      var len = this.keyframes.length - 1;
      var flag = true;
      var keyData = void 0;
      var nextKeyData = void 0;

      while (flag) {
        keyData = this.keyframes[i];
        nextKeyData = this.keyframes[i + 1];
        if (i === len - 1 && frameNum >= nextKeyData.t - offsetTime) {
          if (keyData.h) {
            keyData = nextKeyData;
          }
          iterationIndex = 0;
          break;
        }
        if (nextKeyData.t - offsetTime > frameNum) {
          iterationIndex = i;
          break;
        }
        if (i < len - 1) {
          i += 1;
        } else {
          iterationIndex = 0;
          flag = false;
        }
      }

      var k = void 0;
      var kLen = void 0;
      var perc = void 0;
      var jLen = void 0;
      var j = void 0;
      var fnc = void 0;
      var nextKeyTime = nextKeyData.t - offsetTime;
      var keyTime = keyData.t - offsetTime;
      var endValue = void 0;
      if (keyData.to) {
        if (!keyData.bezierData) {
          keyData.bezierData = bez.buildBezierData(keyData.s, nextKeyData.s || keyData.e, keyData.to, keyData.ti);
        }
        var bezierData = keyData.bezierData;
        if (frameNum >= nextKeyTime || frameNum < keyTime) {
          var ind = frameNum >= nextKeyTime ? bezierData.points.length - 1 : 0;
          kLen = bezierData.points[ind].point.length;
          for (k = 0; k < kLen; k += 1) {
            newValue[k] = bezierData.points[ind].point[k];
          }
          // caching._lastKeyframeIndex = -1;
        } else {
          if (keyData.__fnct) {
            fnc = keyData.__fnct;
          } else {
            fnc = BezierFactory.getBezierEasing(keyData.o.x, keyData.o.y, keyData.i.x, keyData.i.y, keyData.n).get;
            keyData.__fnct = fnc;
          }
          perc = fnc((frameNum - keyTime) / (nextKeyTime - keyTime));
          var distanceInLine = bezierData.segmentLength * perc;

          var segmentPerc = void 0;
          var addedLength = caching.lastFrame < frameNum && caching._lastKeyframeIndex === i ? caching._lastAddedLength : 0;
          j = caching.lastFrame < frameNum && caching._lastKeyframeIndex === i ? caching._lastPoint : 0;
          flag = true;
          jLen = bezierData.points.length;
          while (flag) {
            addedLength += bezierData.points[j].partialLength;
            if (distanceInLine === 0 || perc === 0 || j === bezierData.points.length - 1) {
              kLen = bezierData.points[j].point.length;
              for (k = 0; k < kLen; k += 1) {
                newValue[k] = bezierData.points[j].point[k];
              }
              break;
            } else if (distanceInLine >= addedLength && distanceInLine < addedLength + bezierData.points[j + 1].partialLength) {
              segmentPerc = (distanceInLine - addedLength) / bezierData.points[j + 1].partialLength;
              kLen = bezierData.points[j].point.length;
              for (k = 0; k < kLen; k += 1) {
                newValue[k] = bezierData.points[j].point[k] + (bezierData.points[j + 1].point[k] - bezierData.points[j].point[k]) * segmentPerc;
              }
              break;
            }
            if (j < jLen - 1) {
              j += 1;
            } else {
              flag = false;
            }
          }
          caching._lastPoint = j;
          caching._lastAddedLength = addedLength - bezierData.points[j].partialLength;
          caching._lastKeyframeIndex = i;
        }
      } else {
        var outX = void 0;
        var outY = void 0;
        var inX = void 0;
        var inY = void 0;
        var keyValue = void 0;
        var _len = keyData.s.length;
        endValue = nextKeyData.s || keyData.e;
        if (this.sh && keyData.h !== 1) {
          if (frameNum >= nextKeyTime) {
            newValue[0] = endValue[0];
            newValue[1] = endValue[1];
            newValue[2] = endValue[2];
          } else if (frameNum <= keyTime) {
            newValue[0] = keyData.s[0];
            newValue[1] = keyData.s[1];
            newValue[2] = keyData.s[2];
          } else {
            var quatStart = createQuaternion(keyData.s);
            var quatEnd = createQuaternion(endValue);
            var time = (frameNum - keyTime) / (nextKeyTime - keyTime);
            quaternionToEuler(newValue, slerp(quatStart, quatEnd, time));
          }
        } else {
          for (i = 0; i < _len; i += 1) {
            if (keyData.h !== 1) {
              if (frameNum >= nextKeyTime) {
                perc = 1;
              } else if (frameNum < keyTime) {
                perc = 0;
              } else {
                if (keyData.o.x.constructor === Array) {
                  if (!keyData.__fnct) {
                    keyData.__fnct = [];
                  }
                  if (!keyData.__fnct[i]) {
                    outX = typeof keyData.o.x[i] === 'undefined' ? keyData.o.x[0] : keyData.o.x[i];
                    outY = typeof keyData.o.y[i] === 'undefined' ? keyData.o.y[0] : keyData.o.y[i];
                    inX = typeof keyData.i.x[i] === 'undefined' ? keyData.i.x[0] : keyData.i.x[i];
                    inY = typeof keyData.i.y[i] === 'undefined' ? keyData.i.y[0] : keyData.i.y[i];
                    fnc = BezierFactory.getBezierEasing(outX, outY, inX, inY).get;
                    keyData.__fnct[i] = fnc;
                  } else {
                    fnc = keyData.__fnct[i];
                  }
                } else {
                  if (!keyData.__fnct) {
                    outX = keyData.o.x;
                    outY = keyData.o.y;
                    inX = keyData.i.x;
                    inY = keyData.i.y;
                    fnc = BezierFactory.getBezierEasing(outX, outY, inX, inY).get;
                    keyData.__fnct = fnc;
                  } else {
                    fnc = keyData.__fnct;
                  }
                }
                perc = fnc((frameNum - keyTime) / (nextKeyTime - keyTime));
              }
            }

            endValue = nextKeyData.s || keyData.e;
            keyValue = keyData.h === 1 ? keyData.s[i] : keyData.s[i] + (endValue[i] - keyData.s[i]) * perc;

            if (_len === 1) {
              newValue = keyValue;
            } else {
              newValue[i] = keyValue;
            }
          }
        }
      }
      caching.lastIndex = iterationIndex;
      return newValue;
    }

    /**
     * a
     * @param {*} _frameNum a
     * @return {*}
     */

  }, {
    key: 'getValueAtCurrentTime',
    value: function getValueAtCurrentTime(_frameNum) {
      var frameNum = _frameNum - this.offsetTime;
      var initTime = this.keyframes[0].t - this.offsetTime;
      var endTime = this.keyframes[this.keyframes.length - 1].t - this.offsetTime;
      if (!(frameNum === this._caching.lastFrame || this._caching.lastFrame !== initFrame && (this._caching.lastFrame >= endTime && frameNum >= endTime || this._caching.lastFrame < initTime && frameNum < initTime))) {
        if (this._caching.lastFrame >= frameNum) {
          this._caching._lastKeyframeIndex = -1;
          this._caching.lastIndex = 0;
        }

        var renderResult = this.interpolateValue(frameNum, this._caching);
        this.pv = renderResult;
      }
      this._caching.lastFrame = frameNum;
      return this.pv;
    }

    /**
     * a
     * @param {*} val a
     */

  }, {
    key: 'setVValue',
    value: function setVValue(val) {
      var multipliedValue = void 0;
      if (this.propType === 'unidimensional') {
        multipliedValue = val * this.mult;
        if (mathAbs(this.v - multipliedValue) > 0.00001) {
          this.v = multipliedValue;
          this._mdf = true;
        }
      } else {
        var i = 0;
        var len = this.v.length;
        while (i < len) {
          multipliedValue = val[i] * this.mult;
          if (mathAbs(this.v[i] - multipliedValue) > 0.00001) {
            this.v[i] = multipliedValue;
            this._mdf = true;
          }
          i += 1;
        }
      }
    }

    /**
     * a
     * @param {*} frameNum a
     */

  }, {
    key: 'processEffectsSequence',
    value: function processEffectsSequence(frameNum) {
      if (!this.effectsSequence.length) {
        return;
      }
      if (this.lock) {
        this.setVValue(this.pv);
        return;
      }
      this.lock = true;
      this._mdf = this._isFirstFrame;
      // var multipliedValue;
      var len = this.effectsSequence.length;
      var finalValue = this.kf ? this.pv : this.data.k;
      for (var i = 0; i < len; i += 1) {
        finalValue = this.effectsSequence[i](frameNum);
      }
      this.setVValue(finalValue);
      this._isFirstFrame = false;
      this.lock = false;
    }

    /**
     * a
     * @param {*} effectFunction a
     */

  }, {
    key: 'addEffect',
    value: function addEffect(effectFunction) {
      this.effectsSequence.push(effectFunction);
      this.container.addDynamicProperty(this);
    }
  }]);
  return BaseProperty;
}();

/**
 * a
 */


var ValueProperty = function (_BaseProperty) {
  inherits(ValueProperty, _BaseProperty);

  /**
   * a
   * @param {*} elem a
   * @param {*} data a
   * @param {*} mult a
   * @param {*} container a
   */
  function ValueProperty(elem, data, mult, container) {
    classCallCheck(this, ValueProperty);

    var _this = possibleConstructorReturn(this, (ValueProperty.__proto__ || Object.getPrototypeOf(ValueProperty)).call(this));

    _this.propType = 'unidimensional';
    _this.mult = mult || 1;
    _this.data = data;
    _this.v = mult ? data.k * mult : data.k;
    _this.pv = data.k;
    _this._mdf = false;
    _this.elem = elem;
    _this.container = container;
    _this.k = false;
    _this.kf = false;
    _this.vel = 0;
    _this.effectsSequence = [];
    _this._isFirstFrame = true;
    _this.getValue = _this.processEffectsSequence;
    return _this;
  }

  return ValueProperty;
}(BaseProperty);

/**
 * a
 */


var MultiDimensionalProperty = function (_BaseProperty2) {
  inherits(MultiDimensionalProperty, _BaseProperty2);

  /**
   * a
   * @param {*} elem a
   * @param {*} data a
   * @param {*} mult a
   * @param {*} container a
   */
  function MultiDimensionalProperty(elem, data, mult, container) {
    classCallCheck(this, MultiDimensionalProperty);

    var _this2 = possibleConstructorReturn(this, (MultiDimensionalProperty.__proto__ || Object.getPrototypeOf(MultiDimensionalProperty)).call(this));

    _this2.propType = 'multidimensional';
    _this2.mult = mult || 1;
    _this2.data = data;
    _this2._mdf = false;
    _this2.elem = elem;
    _this2.container = container;
    _this2.k = false;
    _this2.kf = false;
    var len = data.k.length;
    _this2.v = createTypedArray('float32', len);
    _this2.pv = createTypedArray('float32', len);
    // var arr = createTypedArray('float32', len);
    _this2.vel = createTypedArray('float32', len);
    for (var i = 0; i < len; i += 1) {
      _this2.v[i] = data.k[i] * _this2.mult;
      _this2.pv[i] = data.k[i];
    }
    _this2._isFirstFrame = true;
    _this2.effectsSequence = [];
    _this2.getValue = _this2.processEffectsSequence;
    // this.setVValue = setVValue;
    // this.addEffect = addEffect;
    return _this2;
  }

  return MultiDimensionalProperty;
}(BaseProperty);

/**
 * a
 */


var KeyframedValueProperty = function (_BaseProperty3) {
  inherits(KeyframedValueProperty, _BaseProperty3);

  /**
   * a
   * @param {*} elem a
   * @param {*} data a
   * @param {*} mult a
   * @param {*} container a
   */
  function KeyframedValueProperty(elem, data, mult, container) {
    classCallCheck(this, KeyframedValueProperty);

    var _this3 = possibleConstructorReturn(this, (KeyframedValueProperty.__proto__ || Object.getPrototypeOf(KeyframedValueProperty)).call(this));

    _this3.propType = 'unidimensional';
    _this3.keyframes = data.k;
    _this3.offsetTime = elem.data.st;
    _this3._caching = {
      lastFrame: initFrame,
      lastIndex: 0,
      value: 0,
      _lastKeyframeIndex: -1
    };
    _this3.k = true;
    _this3.kf = true;
    _this3.data = data;
    _this3.mult = mult || 1;
    _this3.elem = elem;
    _this3.container = container;
    _this3.v = initFrame;
    _this3.pv = initFrame;
    _this3._isFirstFrame = true;
    _this3.getValue = _this3.processEffectsSequence;
    _this3.effectsSequence = [_this3.getValueAtCurrentTime.bind(_this3)];
    return _this3;
  }

  return KeyframedValueProperty;
}(BaseProperty);

/**
 * a
 */


var KeyframedMultidimensionalProperty = function (_BaseProperty4) {
  inherits(KeyframedMultidimensionalProperty, _BaseProperty4);

  /**
   * a
   * @param {*} elem a
   * @param {*} data a
   * @param {*} mult a
   * @param {*} container a
   */
  function KeyframedMultidimensionalProperty(elem, data, mult, container) {
    classCallCheck(this, KeyframedMultidimensionalProperty);

    var _this4 = possibleConstructorReturn(this, (KeyframedMultidimensionalProperty.__proto__ || Object.getPrototypeOf(KeyframedMultidimensionalProperty)).call(this));

    _this4.propType = 'multidimensional';
    var len = data.k.length;
    var s = void 0;
    var e = void 0;
    var to = void 0;
    var ti = void 0;
    for (var i = 0; i < len - 1; i += 1) {
      if (data.k[i].to && data.k[i].s && data.k[i].e) {
        s = data.k[i].s;
        e = data.k[i].e;
        to = data.k[i].to;
        ti = data.k[i].ti;
        if (s.length === 2 && !(s[0] === e[0] && s[1] === e[1]) && bez.pointOnLine2D(s[0], s[1], e[0], e[1], s[0] + to[0], s[1] + to[1]) && bez.pointOnLine2D(s[0], s[1], e[0], e[1], e[0] + ti[0], e[1] + ti[1]) || s.length === 3 && !(s[0] === e[0] && s[1] === e[1] && s[2] === e[2]) && bez.pointOnLine3D(s[0], s[1], s[2], e[0], e[1], e[2], s[0] + to[0], s[1] + to[1], s[2] + to[2]) && bez.pointOnLine3D(s[0], s[1], s[2], e[0], e[1], e[2], e[0] + ti[0], e[1] + ti[1], e[2] + ti[2])) {
          data.k[i].to = null;
          data.k[i].ti = null;
        }
        if (s[0] === e[0] && s[1] === e[1] && to[0] === 0 && to[1] === 0 && ti[0] === 0 && ti[1] === 0) {
          if (s.length === 2 || s[2] === e[2] && to[2] === 0 && ti[2] === 0) {
            data.k[i].to = null;
            data.k[i].ti = null;
          }
        }
      }
    }
    _this4.effectsSequence = [_this4.getValueAtCurrentTime.bind(_this4)];
    _this4.keyframes = data.k;
    _this4.offsetTime = elem.data.st;
    _this4.k = true;
    _this4.kf = true;
    _this4._isFirstFrame = true;
    _this4.mult = mult || 1;
    _this4.elem = elem;
    _this4.container = container;
    _this4.getValue = _this4.processEffectsSequence;
    var arrLen = data.k[0].s.length;
    _this4.v = createTypedArray('float32', arrLen);
    _this4.pv = createTypedArray('float32', arrLen);
    for (var _i = 0; _i < arrLen; _i += 1) {
      _this4.v[_i] = initFrame;
      _this4.pv[_i] = initFrame;
    }
    _this4._caching = {
      lastFrame: initFrame,
      lastIndex: 0,
      value: createTypedArray('float32', arrLen)
    };
    return _this4;
  }

  return KeyframedMultidimensionalProperty;
}(BaseProperty);

/**
 * a
 * @param {*} elem a
 * @param {*} data a
 * @param {*} type a
 * @param {*} mult a
 * @param {*} container a
 * @return {*}
 */


function PropertyFactory(elem, data, type, mult, container) {
  var p = void 0;
  if (!data.k.length) {
    p = new ValueProperty(elem, data, mult, container);
  } else if (typeof data.k[0] === 'number') {
    p = new MultiDimensionalProperty(elem, data, mult, container);
  } else {
    switch (type) {
      case 0:
        p = new KeyframedValueProperty(elem, data, mult, container);
        break;
      case 1:
        p = new KeyframedMultidimensionalProperty(elem, data, mult, container);
        break;
    }
  }
  if (p.effectsSequence.length) {
    container.addDynamicProperty(p);
  }
  return p;
}

/**
 * a
 * @return {*}
 */
function create$3() {
  return createTypedArray('float32', 2);
}
var point_pool = pool_factory(8, create$3);

/**
 * a
 */

var ShapePath = function () {
  /**
   * a
   */
  function ShapePath() {
    classCallCheck(this, ShapePath);

    this.c = false;
    this._length = 0;
    this._maxLength = 8;
    this.v = createSizedArray(this._maxLength);
    this.o = createSizedArray(this._maxLength);
    this.i = createSizedArray(this._maxLength);
  }

  /**
   * a
   * @param {*} closed a
   * @param {*} len a
   */


  createClass(ShapePath, [{
    key: 'setPathData',
    value: function setPathData(closed, len) {
      this.c = closed;
      this.setLength(len);
      var i = 0;
      while (i < len) {
        this.v[i] = point_pool.newElement();
        this.o[i] = point_pool.newElement();
        this.i[i] = point_pool.newElement();
        i += 1;
      }
    }

    /**
     * a
     * @param {*} len a
     */

  }, {
    key: 'setLength',
    value: function setLength(len) {
      while (this._maxLength < len) {
        this.doubleArrayLength();
      }
      this._length = len;
    }

    /**
     * a
     */

  }, {
    key: 'doubleArrayLength',
    value: function doubleArrayLength() {
      this.v = this.v.concat(createSizedArray(this._maxLength));
      this.i = this.i.concat(createSizedArray(this._maxLength));
      this.o = this.o.concat(createSizedArray(this._maxLength));
      this._maxLength *= 2;
    }

    /**
     * a
     * @param {*} x a
     * @param {*} y a
     * @param {*} type a
     * @param {*} pos a
     * @param {*} replace a
     */

  }, {
    key: 'setXYAt',
    value: function setXYAt(x, y, type, pos, replace) {
      var arr = void 0;
      this._length = Math.max(this._length, pos + 1);
      if (this._length >= this._maxLength) {
        this.doubleArrayLength();
      }
      switch (type) {
        case 'v':
          arr = this.v;
          break;
        case 'i':
          arr = this.i;
          break;
        case 'o':
          arr = this.o;
          break;
      }
      if (!arr[pos] || arr[pos] && !replace) {
        arr[pos] = point_pool.newElement();
      }
      arr[pos][0] = x;
      arr[pos][1] = y;
    }

    /**
     * a
     * @param {*} vX a
     * @param {*} vY a
     * @param {*} oX a
     * @param {*} oY a
     * @param {*} iX a
     * @param {*} iY a
     * @param {*} pos a
     * @param {*} replace a
     */

  }, {
    key: 'setTripleAt',
    value: function setTripleAt(vX, vY, oX, oY, iX, iY, pos, replace) {
      this.setXYAt(vX, vY, 'v', pos, replace);
      this.setXYAt(oX, oY, 'o', pos, replace);
      this.setXYAt(iX, iY, 'i', pos, replace);
    }

    /**
     * a
     * @return {*}
     */

  }, {
    key: 'reverse',
    value: function reverse() {
      var newPath = new ShapePath();
      newPath.setPathData(this.c, this._length);
      var vertices = this.v;
      var outPoints = this.o;
      var inPoints = this.i;
      var init = 0;
      if (this.c) {
        newPath.setTripleAt(vertices[0][0], vertices[0][1], inPoints[0][0], inPoints[0][1], outPoints[0][0], outPoints[0][1], 0, false);
        init = 1;
      }
      var cnt = this._length - 1;
      var len = this._length;

      for (var i = init; i < len; i += 1) {
        newPath.setTripleAt(vertices[cnt][0], vertices[cnt][1], inPoints[cnt][0], inPoints[cnt][1], outPoints[cnt][0], outPoints[cnt][1], i, false);
        cnt -= 1;
      }
      return newPath;
    }
  }]);
  return ShapePath;
}();

/**
 * a
 * @return {*}
 */
function create$2() {
  return new ShapePath();
}

/**
 * a
 * @param {*} shapePath a
 */
function release$1(shapePath) {
  var len = shapePath._length;
  for (var i = 0; i < len; i += 1) {
    point_pool.release(shapePath.v[i]);
    point_pool.release(shapePath.i[i]);
    point_pool.release(shapePath.o[i]);
    shapePath.v[i] = null;
    shapePath.i[i] = null;
    shapePath.o[i] = null;
  }
  shapePath._length = 0;
  shapePath.c = false;
}

/**
 * a
 * @param {*} shape a
 * @return {*}
 */
function clone(shape) {
  var cloned = shape_pool.newElement();
  var len = shape._length === undefined ? shape.v.length : shape._length;
  cloned.setLength(len);
  cloned.c = shape.c;
  // var pt;

  for (var i = 0; i < len; i += 1) {
    cloned.setTripleAt(shape.v[i][0], shape.v[i][1], shape.o[i][0], shape.o[i][1], shape.i[i][0], shape.i[i][1], i);
  }
  return cloned;
}

var shape_pool = pool_factory(4, create$2, release$1);
shape_pool.clone = clone;

/**
 * a
 */

var ShapeCollection = function () {
  /**
   * a
   */
  function ShapeCollection() {
    classCallCheck(this, ShapeCollection);

    this._length = 0;
    this._maxLength = 4;
    this.shapes = createSizedArray(this._maxLength);
  }

  /**
   * a
   * @param {*} shapeData a
   */


  createClass(ShapeCollection, [{
    key: 'addShape',
    value: function addShape(shapeData) {
      if (this._length === this._maxLength) {
        this.shapes = this.shapes.concat(createSizedArray(this._maxLength));
        this._maxLength *= 2;
      }
      this.shapes[this._length] = shapeData;
      this._length += 1;
    }

    /**
     * a
     */

  }, {
    key: 'releaseShapes',
    value: function releaseShapes() {
      for (var i = 0; i < this._length; i += 1) {
        shape_pool.release(this.shapes[i]);
      }
      this._length = 0;
    }
  }]);
  return ShapeCollection;
}();

var _length = 0;
var _maxLength = 4;
var pool = createSizedArray(_maxLength);

/**
 * a
 * @return {*}
 */
function newShapeCollection() {
  var shapeCollection = void 0;
  if (_length) {
    _length -= 1;
    shapeCollection = pool[_length];
  } else {
    shapeCollection = new ShapeCollection();
  }
  return shapeCollection;
}

/**
 * a
 * @param {*} shapeCollection a
 */
function release$2(shapeCollection) {
  var len = shapeCollection._length;
  for (var i = 0; i < len; i += 1) {
    shape_pool.release(shapeCollection.shapes[i]);
  }
  shapeCollection._length = 0;

  if (_length === _maxLength) {
    pool = pooling.double(pool);
    _maxLength = _maxLength * 2;
  }
  pool[_length] = shapeCollection;
  _length += 1;
}

var shapeCollection_pool = { newShapeCollection: newShapeCollection, release: release$2 };

/**
 * a
 */
var DynamicPropertyContainer = function () {
  function DynamicPropertyContainer() {
    classCallCheck(this, DynamicPropertyContainer);
  }

  createClass(DynamicPropertyContainer, [{
    key: "addDynamicProperty",

    /**
     * a
     * @param {*} prop a
     */
    value: function addDynamicProperty(prop) {
      if (this.dynamicProperties.indexOf(prop) === -1) {
        this.dynamicProperties.push(prop);
        this.container.addDynamicProperty(this);
        this._isAnimated = true;
      }
    }

    /**
     * a
     */

  }, {
    key: "iterateDynamicProperties",
    value: function iterateDynamicProperties(frameNum) {
      this._mdf = false;
      var len = this.dynamicProperties.length;
      for (var i = 0; i < len; i += 1) {
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

  }, {
    key: "initDynamicPropertyContainer",
    value: function initDynamicPropertyContainer(container) {
      this.container = container;
      this.dynamicProperties = [];
      this._mdf = false;
      this._isAnimated = false;
    }
  }]);
  return DynamicPropertyContainer;
}();

var initFrame$1 = -999999;
var degToRads$2 = Math.PI / 180;

/**
 * a
 */

var BaseShapeProperty = function () {
  function BaseShapeProperty() {
    classCallCheck(this, BaseShapeProperty);
  }

  createClass(BaseShapeProperty, [{
    key: 'interpolateShape',

    /**
     * a
     * @param {*} frameNum a
     * @param {*} previousValue a
     * @param {*} caching a
     */
    value: function interpolateShape(frameNum, previousValue, caching) {
      var iterationIndex = caching.lastIndex;
      var keyPropS = void 0;
      var keyPropE = void 0;
      var isHold = void 0;
      var perc = void 0;
      var kf = this.keyframes;
      if (frameNum < kf[0].t - this.offsetTime) {
        keyPropS = kf[0].s[0];
        isHold = true;
        iterationIndex = 0;
      } else if (frameNum >= kf[kf.length - 1].t - this.offsetTime) {
        keyPropS = kf[kf.length - 1].s ? kf[kf.length - 1].s[0] : kf[kf.length - 2].e[0];
        // /*if(kf[kf.length - 1].s){
        //     keyPropS = kf[kf.length - 1].s[0];
        // }else{
        //     keyPropS = kf[kf.length - 2].e[0];
        // }*/
        isHold = true;
      } else {
        var i = iterationIndex;
        var len = kf.length - 1;
        var flag = true;
        var keyData = void 0;
        var nextKeyData = void 0;
        while (flag) {
          keyData = kf[i];
          nextKeyData = kf[i + 1];
          if (nextKeyData.t - this.offsetTime > frameNum) {
            break;
          }
          if (i < len - 1) {
            i += 1;
          } else {
            flag = false;
          }
        }
        isHold = keyData.h === 1;
        iterationIndex = i;
        if (!isHold) {
          if (frameNum >= nextKeyData.t - this.offsetTime) {
            perc = 1;
          } else if (frameNum < keyData.t - this.offsetTime) {
            perc = 0;
          } else {
            var fnc = void 0;
            if (keyData.__fnct) {
              fnc = keyData.__fnct;
            } else {
              fnc = BezierFactory.getBezierEasing(keyData.o.x, keyData.o.y, keyData.i.x, keyData.i.y).get;
              keyData.__fnct = fnc;
            }
            perc = fnc((frameNum - (keyData.t - this.offsetTime)) / (nextKeyData.t - this.offsetTime - (keyData.t - this.offsetTime)));
          }
          keyPropE = nextKeyData.s ? nextKeyData.s[0] : keyData.e[0];
        }
        keyPropS = keyData.s[0];
      }
      var jLen = previousValue._length;
      var kLen = keyPropS.i[0].length;
      var vertexValue = void 0;
      caching.lastIndex = iterationIndex;

      for (var j = 0; j < jLen; j++) {
        for (var k = 0; k < kLen; k++) {
          vertexValue = isHold ? keyPropS.i[j][k] : keyPropS.i[j][k] + (keyPropE.i[j][k] - keyPropS.i[j][k]) * perc;
          previousValue.i[j][k] = vertexValue;
          vertexValue = isHold ? keyPropS.o[j][k] : keyPropS.o[j][k] + (keyPropE.o[j][k] - keyPropS.o[j][k]) * perc;
          previousValue.o[j][k] = vertexValue;
          vertexValue = isHold ? keyPropS.v[j][k] : keyPropS.v[j][k] + (keyPropE.v[j][k] - keyPropS.v[j][k]) * perc;
          previousValue.v[j][k] = vertexValue;
        }
      }
    }

    /**
     * a
     * @return {*}
     */

  }, {
    key: 'interpolateShapeCurrentTime',
    value: function interpolateShapeCurrentTime(_frameNum) {
      var frameNum = _frameNum - this.offsetTime;
      var initTime = this.keyframes[0].t - this.offsetTime;
      var endTime = this.keyframes[this.keyframes.length - 1].t - this.offsetTime;
      var lastFrame = this._caching.lastFrame;
      if (!(lastFrame !== initFrame$1 && (lastFrame < initTime && frameNum < initTime || lastFrame > endTime && frameNum > endTime))) {
        this._caching.lastIndex = lastFrame < frameNum ? this._caching.lastIndex : 0;
        this.interpolateShape(frameNum, this.pv, this._caching);
      }
      this._caching.lastFrame = frameNum;
      return this.pv;
    }

    /**
     * a
     */

  }, {
    key: 'resetShape',
    value: function resetShape() {
      this.paths = this.localShapeCollection;
    }

    /**
     * a
     * @param {*} shape1 a
     * @param {*} shape2 a
     * @return {*}
     */

  }, {
    key: 'shapesEqual',
    value: function shapesEqual(shape1, shape2) {
      if (shape1._length !== shape2._length || shape1.c !== shape2.c) {
        return false;
      }
      var len = shape1._length;
      for (var i = 0; i < len; i += 1) {
        if (shape1.v[i][0] !== shape2.v[i][0] || shape1.v[i][1] !== shape2.v[i][1] || shape1.o[i][0] !== shape2.o[i][0] || shape1.o[i][1] !== shape2.o[i][1] || shape1.i[i][0] !== shape2.i[i][0] || shape1.i[i][1] !== shape2.i[i][1]) {
          return false;
        }
      }
      return true;
    }

    /**
     * a
     * @param {*} newPath a
     */

  }, {
    key: 'setVValue',
    value: function setVValue(newPath) {
      if (!this.shapesEqual(this.v, newPath)) {
        this.v = shape_pool.clone(newPath);
        this.localShapeCollection.releaseShapes();
        this.localShapeCollection.addShape(this.v);
        this._mdf = true;
        this.paths = this.localShapeCollection;
      }
    }

    /**
     * a
     */

  }, {
    key: 'processEffectsSequence',
    value: function processEffectsSequence() {
      if (!this.effectsSequence.length) {
        return;
      }
      if (this.lock) {
        this.setVValue(this.pv);
        return;
      }
      this.lock = true;
      this._mdf = false;
      var finalValue = this.kf ? this.pv : this.data.ks ? this.data.ks.k : this.data.pt.k;
      var len = this.effectsSequence.length;
      for (var i = 0; i < len; i += 1) {
        finalValue = this.effectsSequence[i](finalValue);
      }
      this.setVValue(finalValue);
      this.lock = false;
    }
  }]);
  return BaseShapeProperty;
}();

/**
 * a
 */


var ShapeProperty = function (_BaseShapeProperty) {
  inherits(ShapeProperty, _BaseShapeProperty);

  /**
   * a
   * @param {*} elem a
   * @param {*} data a
   * @param {*} type a
   */
  function ShapeProperty(elem, data, type) {
    classCallCheck(this, ShapeProperty);

    var _this = possibleConstructorReturn(this, (ShapeProperty.__proto__ || Object.getPrototypeOf(ShapeProperty)).call(this));

    _this.propType = 'shape';
    _this.container = elem;
    _this.elem = elem;
    _this.data = data;
    _this.k = false;
    _this.kf = false;
    _this._mdf = false;
    var pathData = type === 3 ? data.pt.k : data.ks.k;
    _this.v = shape_pool.clone(pathData);
    _this.pv = shape_pool.clone(_this.v);
    _this.localShapeCollection = shapeCollection_pool.newShapeCollection();
    _this.paths = _this.localShapeCollection;
    _this.paths.addShape(_this.v);
    _this.reset = _this.resetShape;
    _this.effectsSequence = [];
    _this.getValue = _this.processEffectsSequence;
    return _this;
  }

  /**
   * a
   * @param {*} effectFunction a
   */


  createClass(ShapeProperty, [{
    key: 'addEffect',
    value: function addEffect(effectFunction) {
      this.effectsSequence.push(effectFunction);
      this.container.addDynamicProperty(this);
    }
  }]);
  return ShapeProperty;
}(BaseShapeProperty);

/**
 * a
 */


var KeyframedShapeProperty = function (_BaseShapeProperty2) {
  inherits(KeyframedShapeProperty, _BaseShapeProperty2);

  /**
   * a
   * @param {*} elem a
   * @param {*} data a
   * @param {*} type a
   */
  function KeyframedShapeProperty(elem, data, type) {
    classCallCheck(this, KeyframedShapeProperty);

    var _this2 = possibleConstructorReturn(this, (KeyframedShapeProperty.__proto__ || Object.getPrototypeOf(KeyframedShapeProperty)).call(this));

    _this2.propType = 'shape';
    _this2.elem = elem;
    _this2.container = elem;
    _this2.offsetTime = elem.data.st;
    _this2.keyframes = type === 3 ? data.pt.k : data.ks.k;
    _this2.k = true;
    _this2.kf = true;
    var len = _this2.keyframes[0].s[0].i.length;
    _this2.v = shape_pool.newElement();
    _this2.v.setPathData(_this2.keyframes[0].s[0].c, len);
    _this2.pv = shape_pool.clone(_this2.v);
    _this2.localShapeCollection = shapeCollection_pool.newShapeCollection();
    _this2.paths = _this2.localShapeCollection;
    _this2.paths.addShape(_this2.v);
    _this2.lastFrame = initFrame$1;
    _this2.reset = _this2.resetShape;
    _this2._caching = { lastFrame: initFrame$1, lastIndex: 0 };
    _this2.effectsSequence = [_this2.interpolateShapeCurrentTime.bind(_this2)];
    _this2.getValue = _this2.processEffectsSequence;
    return _this2;
  }

  /**
   * a
   * @param {*} effectFunction a
   */


  createClass(KeyframedShapeProperty, [{
    key: 'addEffect',
    value: function addEffect(effectFunction) {
      this.effectsSequence.push(effectFunction);
      this.container.addDynamicProperty(this);
    }
  }]);
  return KeyframedShapeProperty;
}(BaseShapeProperty);

var roundCorner = 0.5519;
var cPoint = roundCorner;

/**
 * a
 */

var EllShapeProperty = function (_DynamicPropertyConta) {
  inherits(EllShapeProperty, _DynamicPropertyConta);

  /**
   * a
   * @param {*} elem a
   * @param {*} data a
   */
  function EllShapeProperty(elem, data) {
    classCallCheck(this, EllShapeProperty);

    // /*this.v = {
    //     v: createSizedArray(4),
    //     i: createSizedArray(4),
    //     o: createSizedArray(4),
    //     c: true
    // };*/
    var _this3 = possibleConstructorReturn(this, (EllShapeProperty.__proto__ || Object.getPrototypeOf(EllShapeProperty)).call(this));

    _this3.v = shape_pool.newElement();
    _this3.v.setPathData(true, 4);
    _this3.localShapeCollection = shapeCollection_pool.newShapeCollection();
    _this3.paths = _this3.localShapeCollection;
    _this3.localShapeCollection.addShape(_this3.v);
    _this3.d = data.d;
    _this3.elem = elem;
    _this3.initDynamicPropertyContainer(elem);
    _this3.p = PropertyFactory(elem, data.p, 1, 0, _this3);
    _this3.s = PropertyFactory(elem, data.s, 1, 0, _this3);
    if (_this3.dynamicProperties.length) {
      _this3.k = true;
    } else {
      _this3.k = false;
      _this3.convertEllToPath();
    }
    return _this3;
  }

  /**
   * a
   */


  createClass(EllShapeProperty, [{
    key: 'reset',
    value: function reset() {
      this.paths = this.localShapeCollection;
    }

    /**
     * a
     */

  }, {
    key: 'getValue',
    value: function getValue(frameNum) {
      this.iterateDynamicProperties(frameNum);

      if (this._mdf) {
        this.convertEllToPath();
      }
    }

    /**
     * a
     */

  }, {
    key: 'convertEllToPath',
    value: function convertEllToPath() {
      var p0 = this.p.v[0];
      var p1 = this.p.v[1];
      var s0 = this.s.v[0] / 2;
      var s1 = this.s.v[1] / 2;
      var _cw = this.d !== 3;
      var _v = this.v;
      _v.v[0][0] = p0;
      _v.v[0][1] = p1 - s1;
      _v.v[1][0] = _cw ? p0 + s0 : p0 - s0;
      _v.v[1][1] = p1;
      _v.v[2][0] = p0;
      _v.v[2][1] = p1 + s1;
      _v.v[3][0] = _cw ? p0 - s0 : p0 + s0;
      _v.v[3][1] = p1;
      _v.i[0][0] = _cw ? p0 - s0 * cPoint : p0 + s0 * cPoint;
      _v.i[0][1] = p1 - s1;
      _v.i[1][0] = _cw ? p0 + s0 : p0 - s0;
      _v.i[1][1] = p1 - s1 * cPoint;
      _v.i[2][0] = _cw ? p0 + s0 * cPoint : p0 - s0 * cPoint;
      _v.i[2][1] = p1 + s1;
      _v.i[3][0] = _cw ? p0 - s0 : p0 + s0;
      _v.i[3][1] = p1 + s1 * cPoint;
      _v.o[0][0] = _cw ? p0 + s0 * cPoint : p0 - s0 * cPoint;
      _v.o[0][1] = p1 - s1;
      _v.o[1][0] = _cw ? p0 + s0 : p0 - s0;
      _v.o[1][1] = p1 + s1 * cPoint;
      _v.o[2][0] = _cw ? p0 - s0 * cPoint : p0 + s0 * cPoint;
      _v.o[2][1] = p1 + s1;
      _v.o[3][0] = _cw ? p0 - s0 : p0 + s0;
      _v.o[3][1] = p1 - s1 * cPoint;
    }
  }]);
  return EllShapeProperty;
}(DynamicPropertyContainer);

/**
 * a
 */


var StarShapeProperty = function (_DynamicPropertyConta2) {
  inherits(StarShapeProperty, _DynamicPropertyConta2);

  /**
   * a
   * @param {*} elem a
   * @param {*} data a
   */
  function StarShapeProperty(elem, data) {
    classCallCheck(this, StarShapeProperty);

    var _this4 = possibleConstructorReturn(this, (StarShapeProperty.__proto__ || Object.getPrototypeOf(StarShapeProperty)).call(this));

    _this4.v = shape_pool.newElement();
    _this4.v.setPathData(true, 0);
    _this4.elem = elem;
    _this4.data = data;
    _this4.d = data.d;
    _this4.initDynamicPropertyContainer(elem);
    if (data.sy === 1) {
      _this4.ir = PropertyFactory(elem, data.ir, 0, 0, _this4);
      _this4.is = PropertyFactory(elem, data.is, 0, 0.01, _this4);
      _this4.convertToPath = _this4.convertStarToPath;
    } else {
      _this4.convertToPath = _this4.convertPolygonToPath;
    }
    _this4.pt = PropertyFactory(elem, data.pt, 0, 0, _this4);
    _this4.p = PropertyFactory(elem, data.p, 1, 0, _this4);
    _this4.r = PropertyFactory(elem, data.r, 0, degToRads$2, _this4);
    _this4.or = PropertyFactory(elem, data.or, 0, 0, _this4);
    _this4.os = PropertyFactory(elem, data.os, 0, 0.01, _this4);
    _this4.localShapeCollection = shapeCollection_pool.newShapeCollection();
    _this4.localShapeCollection.addShape(_this4.v);
    _this4.paths = _this4.localShapeCollection;
    if (_this4.dynamicProperties.length) {
      _this4.k = true;
    } else {
      _this4.k = false;
      _this4.convertToPath();
    }
    return _this4;
  }

  /**
   * a
   */


  createClass(StarShapeProperty, [{
    key: 'reset',
    value: function reset() {
      this.paths = this.localShapeCollection;
    }

    /**
     * a
     */

  }, {
    key: 'getValue',
    value: function getValue(frameNum) {
      this.iterateDynamicProperties(frameNum);
      if (this._mdf) {
        this.convertToPath();
      }
    }

    /**
     * a
     */

  }, {
    key: 'convertStarToPath',
    value: function convertStarToPath() {
      var numPts = Math.floor(this.pt.v) * 2;
      var angle = Math.PI * 2 / numPts;
      // /*this.v.v.length = numPts;
      // this.v.i.length = numPts;
      // this.v.o.length = numPts;*/
      var longFlag = true;
      var longRad = this.or.v;
      var shortRad = this.ir.v;
      var longRound = this.os.v;
      var shortRound = this.is.v;
      var longPerimSegment = 2 * Math.PI * longRad / (numPts * 2);
      var shortPerimSegment = 2 * Math.PI * shortRad / (numPts * 2);
      var currentAng = -Math.PI / 2;
      currentAng += this.r.v;
      var dir = this.data.d === 3 ? -1 : 1;
      this.v._length = 0;
      for (var i = 0; i < numPts; i++) {
        var rad = longFlag ? longRad : shortRad;
        var roundness = longFlag ? longRound : shortRound;
        var perimSegment = longFlag ? longPerimSegment : shortPerimSegment;
        var x = rad * Math.cos(currentAng);
        var y = rad * Math.sin(currentAng);
        var ox = x === 0 && y === 0 ? 0 : y / Math.sqrt(x * x + y * y);
        var oy = x === 0 && y === 0 ? 0 : -x / Math.sqrt(x * x + y * y);
        x += +this.p.v[0];
        y += +this.p.v[1];
        this.v.setTripleAt(x, y, x - ox * perimSegment * roundness * dir, y - oy * perimSegment * roundness * dir, x + ox * perimSegment * roundness * dir, y + oy * perimSegment * roundness * dir, i, true);

        // /*this.v.v[i] = [x,y];
        // this.v.i[i] = [x+ox*perimSegment*roundness*dir,y+oy*perimSegment*roundness*dir];
        // this.v.o[i] = [x-ox*perimSegment*roundness*dir,y-oy*perimSegment*roundness*dir];
        // this.v._length = numPts;*/
        longFlag = !longFlag;
        currentAng += angle * dir;
      }
    }

    /**
     * a
     */

  }, {
    key: 'convertPolygonToPath',
    value: function convertPolygonToPath() {
      var numPts = Math.floor(this.pt.v);
      var angle = Math.PI * 2 / numPts;
      var rad = this.or.v;
      var roundness = this.os.v;
      var perimSegment = 2 * Math.PI * rad / (numPts * 4);
      var currentAng = -Math.PI / 2;
      var dir = this.data.d === 3 ? -1 : 1;
      currentAng += this.r.v;
      this.v._length = 0;
      for (var i = 0; i < numPts; i++) {
        var x = rad * Math.cos(currentAng);
        var y = rad * Math.sin(currentAng);
        var ox = x === 0 && y === 0 ? 0 : y / Math.sqrt(x * x + y * y);
        var oy = x === 0 && y === 0 ? 0 : -x / Math.sqrt(x * x + y * y);
        x += +this.p.v[0];
        y += +this.p.v[1];
        this.v.setTripleAt(x, y, x - ox * perimSegment * roundness * dir, y - oy * perimSegment * roundness * dir, x + ox * perimSegment * roundness * dir, y + oy * perimSegment * roundness * dir, i, true);
        currentAng += angle * dir;
      }
      this.paths.length = 0;
      this.paths[0] = this.v;
    }
  }]);
  return StarShapeProperty;
}(DynamicPropertyContainer);

/**
 * a
 */


var RectShapeProperty = function (_DynamicPropertyConta3) {
  inherits(RectShapeProperty, _DynamicPropertyConta3);

  /**
   * a
   * @param {*} elem a
   * @param {*} data a
   */
  function RectShapeProperty(elem, data) {
    classCallCheck(this, RectShapeProperty);

    var _this5 = possibleConstructorReturn(this, (RectShapeProperty.__proto__ || Object.getPrototypeOf(RectShapeProperty)).call(this));

    _this5.v = shape_pool.newElement();
    _this5.v.c = true;
    _this5.localShapeCollection = shapeCollection_pool.newShapeCollection();
    _this5.localShapeCollection.addShape(_this5.v);
    _this5.paths = _this5.localShapeCollection;
    _this5.elem = elem;
    _this5.d = data.d;
    _this5.initDynamicPropertyContainer(elem);
    _this5.p = PropertyFactory(elem, data.p, 1, 0, _this5);
    _this5.s = PropertyFactory(elem, data.s, 1, 0, _this5);
    _this5.r = PropertyFactory(elem, data.r, 0, 0, _this5);
    if (_this5.dynamicProperties.length) {
      _this5.k = true;
    } else {
      _this5.k = false;
      _this5.convertRectToPath();
    }
    return _this5;
  }

  /**
   * a
   */


  createClass(RectShapeProperty, [{
    key: 'reset',
    value: function reset() {
      this.paths = this.localShapeCollection;
    }

    /**
     * a
     */

  }, {
    key: 'convertRectToPath',
    value: function convertRectToPath() {
      var p0 = this.p.v[0];
      var p1 = this.p.v[1];
      var v0 = this.s.v[0] / 2;
      var v1 = this.s.v[1] / 2;
      var round = Math.min(v0, v1, this.r.v);
      var cPoint = round * (1 - roundCorner);
      this.v._length = 0;

      if (this.d === 2 || this.d === 1) {
        this.v.setTripleAt(p0 + v0, p1 - v1 + round, p0 + v0, p1 - v1 + round, p0 + v0, p1 - v1 + cPoint, 0, true);
        this.v.setTripleAt(p0 + v0, p1 + v1 - round, p0 + v0, p1 + v1 - cPoint, p0 + v0, p1 + v1 - round, 1, true);
        if (round !== 0) {
          this.v.setTripleAt(p0 + v0 - round, p1 + v1, p0 + v0 - round, p1 + v1, p0 + v0 - cPoint, p1 + v1, 2, true);
          this.v.setTripleAt(p0 - v0 + round, p1 + v1, p0 - v0 + cPoint, p1 + v1, p0 - v0 + round, p1 + v1, 3, true);
          this.v.setTripleAt(p0 - v0, p1 + v1 - round, p0 - v0, p1 + v1 - round, p0 - v0, p1 + v1 - cPoint, 4, true);
          this.v.setTripleAt(p0 - v0, p1 - v1 + round, p0 - v0, p1 - v1 + cPoint, p0 - v0, p1 - v1 + round, 5, true);
          this.v.setTripleAt(p0 - v0 + round, p1 - v1, p0 - v0 + round, p1 - v1, p0 - v0 + cPoint, p1 - v1, 6, true);
          this.v.setTripleAt(p0 + v0 - round, p1 - v1, p0 + v0 - cPoint, p1 - v1, p0 + v0 - round, p1 - v1, 7, true);
        } else {
          this.v.setTripleAt(p0 - v0, p1 + v1, p0 - v0 + cPoint, p1 + v1, p0 - v0, p1 + v1, 2);
          this.v.setTripleAt(p0 - v0, p1 - v1, p0 - v0, p1 - v1 + cPoint, p0 - v0, p1 - v1, 3);
        }
      } else {
        this.v.setTripleAt(p0 + v0, p1 - v1 + round, p0 + v0, p1 - v1 + cPoint, p0 + v0, p1 - v1 + round, 0, true);
        if (round !== 0) {
          this.v.setTripleAt(p0 + v0 - round, p1 - v1, p0 + v0 - round, p1 - v1, p0 + v0 - cPoint, p1 - v1, 1, true);
          this.v.setTripleAt(p0 - v0 + round, p1 - v1, p0 - v0 + cPoint, p1 - v1, p0 - v0 + round, p1 - v1, 2, true);
          this.v.setTripleAt(p0 - v0, p1 - v1 + round, p0 - v0, p1 - v1 + round, p0 - v0, p1 - v1 + cPoint, 3, true);
          this.v.setTripleAt(p0 - v0, p1 + v1 - round, p0 - v0, p1 + v1 - cPoint, p0 - v0, p1 + v1 - round, 4, true);
          this.v.setTripleAt(p0 - v0 + round, p1 + v1, p0 - v0 + round, p1 + v1, p0 - v0 + cPoint, p1 + v1, 5, true);
          this.v.setTripleAt(p0 + v0 - round, p1 + v1, p0 + v0 - cPoint, p1 + v1, p0 + v0 - round, p1 + v1, 6, true);
          this.v.setTripleAt(p0 + v0, p1 + v1 - round, p0 + v0, p1 + v1 - round, p0 + v0, p1 + v1 - cPoint, 7, true);
        } else {
          this.v.setTripleAt(p0 - v0, p1 - v1, p0 - v0 + cPoint, p1 - v1, p0 - v0, p1 - v1, 1, true);
          this.v.setTripleAt(p0 - v0, p1 + v1, p0 - v0, p1 + v1 - cPoint, p0 - v0, p1 + v1, 2, true);
          this.v.setTripleAt(p0 + v0, p1 + v1, p0 + v0 - cPoint, p1 + v1, p0 + v0, p1 + v1, 3, true);
        }
      }
    }

    /**
     * a
     * @param {*} frameNum a
     */

  }, {
    key: 'getValue',
    value: function getValue(frameNum) {
      this.iterateDynamicProperties(frameNum);
      if (this._mdf) {
        this.convertRectToPath();
      }
    }
  }]);
  return RectShapeProperty;
}(DynamicPropertyContainer);

/**
 * a
 * @param {*} elem a
 * @param {*} data a
 * @param {*} type a
 * @return {*}
 */


function getShapeProp(elem, data, type) {
  var prop = void 0;
  if (type === 3 || type === 4) {
    var dataProp = type === 3 ? data.pt : data.ks;
    var keys = dataProp.k;
    if (keys.length) {
      prop = new KeyframedShapeProperty(elem, data, type);
    } else {
      prop = new ShapeProperty(elem, data, type);
    }
  } else if (type === 5) {
    prop = new RectShapeProperty(elem, data);
  } else if (type === 6) {
    prop = new EllShapeProperty(elem, data);
  } else if (type === 7) {
    prop = new StarShapeProperty(elem, data);
  }
  if (prop.k) {
    elem.addDynamicProperty(prop);
  }
  return prop;
}

/**
 * a
 * @return {*}
 */
function getConstructorFunction() {
  return ShapeProperty;
}

/**
 * a
 * @return {*}
 */
function getKeyframedConstructorFunction() {
  return KeyframedShapeProperty;
}

var ShapePropertyFactory = { getShapeProp: getShapeProp, getConstructorFunction: getConstructorFunction, getKeyframedConstructorFunction: getKeyframedConstructorFunction };

/**
 * a
 */

var CVShapeData = function () {
  /**
   * a
   * @param {*} element a
   * @param {*} data a
   * @param {*} styles a
   * @param {*} transformsManager a
   */
  function CVShapeData(element, data, styles, transformsManager) {
    classCallCheck(this, CVShapeData);

    this.styledShapes = [];
    this.tr = [0, 0, 0, 0, 0, 0];
    var ty = 4;
    if (data.ty == 'rc') {
      ty = 5;
    } else if (data.ty == 'el') {
      ty = 6;
    } else if (data.ty == 'sr') {
      ty = 7;
    }
    this.sh = ShapePropertyFactory.getShapeProp(element, data, ty, element);
    var len = styles.length;
    var styledShape = void 0;
    for (var i = 0; i < len; i += 1) {
      if (!styles[i].closed) {
        styledShape = {
          transforms: transformsManager.addTransformSequence(styles[i].transforms),
          trNodes: []
        };
        this.styledShapes.push(styledShape);
        styles[i].elements.push(styledShape);
      }
    }
  }

  /**
   * a
   */


  createClass(CVShapeData, [{
    key: 'setAsAnimated',
    value: function setAsAnimated() {
      this._isAnimated = true;
    }
  }]);
  return CVShapeData;
}();

var degToRads$3 = Math.PI / 180;

/**
 * a
 */

var TransformProperty = function (_DynamicPropertyConta) {
  inherits(TransformProperty, _DynamicPropertyConta);

  /**
   * a
   * @param {*} elem a
   * @param {*} data a
   * @param {*} container a
   */
  function TransformProperty(elem, data, container) {
    classCallCheck(this, TransformProperty);

    var _this = possibleConstructorReturn(this, (TransformProperty.__proto__ || Object.getPrototypeOf(TransformProperty)).call(this));

    _this.elem = elem;
    _this.frameId = -1;
    _this.propType = 'transform';
    _this.data = data;
    _this.v = new Matrix$1();
    // Precalculated matrix with non animated properties
    _this.pre = new Matrix$1();
    _this.appliedTransformations = 0;
    _this.initDynamicPropertyContainer(container || elem);
    if (data.p && data.p.s) {
      _this.px = PropertyFactory(elem, data.p.x, 0, 0, _this);
      _this.py = PropertyFactory(elem, data.p.y, 0, 0, _this);
      if (data.p.z) {
        _this.pz = PropertyFactory(elem, data.p.z, 0, 0, _this);
      }
    } else {
      _this.p = PropertyFactory(elem, data.p || { k: [0, 0, 0] }, 1, 0, _this);
    }
    if (data.rx) {
      _this.rx = PropertyFactory(elem, data.rx, 0, degToRads$3, _this);
      _this.ry = PropertyFactory(elem, data.ry, 0, degToRads$3, _this);
      _this.rz = PropertyFactory(elem, data.rz, 0, degToRads$3, _this);
      if (data.or.k[0].ti) {
        var len = data.or.k.length;
        for (var i = 0; i < len; i += 1) {
          data.or.k[i].to = data.or.k[i].ti = null;
        }
      }
      _this.or = PropertyFactory(elem, data.or, 1, degToRads$3, _this);
      // sh Indicates it needs to be capped between -180 and 180
      _this.or.sh = true;
    } else {
      _this.r = PropertyFactory(elem, data.r || { k: 0 }, 0, degToRads$3, _this);
    }
    if (data.sk) {
      _this.sk = PropertyFactory(elem, data.sk, 0, degToRads$3, _this);
      _this.sa = PropertyFactory(elem, data.sa, 0, degToRads$3, _this);
    }
    _this.a = PropertyFactory(elem, data.a || { k: [0, 0, 0] }, 1, 0, _this);
    _this.s = PropertyFactory(elem, data.s || { k: [100, 100, 100] }, 1, 0.01, _this);
    // Opacity is not part of the transform properties, that's why it won't use this.dynamicProperties. That way transforms won't get updated if opacity changes.
    if (data.o) {
      _this.o = PropertyFactory(elem, data.o, 0, 0.01, elem);
    } else {
      _this.o = { _mdf: false, v: 1 };
    }
    _this._isDirty = true;
    if (!_this.dynamicProperties.length) {
      _this.getValue(-999999, true);
    }
    return _this;
  }

  /**
   * a
   * @param {*} prop a
   */


  createClass(TransformProperty, [{
    key: '_addDynamicProperty',
    value: function _addDynamicProperty(prop) {
      if (this.dynamicProperties.indexOf(prop) === -1) {
        this.dynamicProperties.push(prop);
        this.container.addDynamicProperty(this);
        this._isAnimated = true;
      }
    }

    /**
     * a
     * @param {*} prop a
     */

  }, {
    key: 'addDynamicProperty',
    value: function addDynamicProperty(prop) {
      this._addDynamicProperty(prop);
      this.elem.addDynamicProperty(prop);
      this._isDirty = true;
    }

    /**
     * a
     * @param {*} forceRender a
     */

  }, {
    key: 'getValue',
    value: function getValue(frameNum, forceRender) {
      if (this._isDirty) {
        this.precalculateMatrix();
        this._isDirty = false;
      }

      this.iterateDynamicProperties(frameNum);

      if (this._mdf || forceRender) {
        this.v.cloneFromProps(this.pre.props);
        if (this.appliedTransformations < 1) {
          this.v.translate(-this.a.v[0], -this.a.v[1], this.a.v[2]);
        }
        if (this.appliedTransformations < 2) {
          this.v.scale(this.s.v[0], this.s.v[1], this.s.v[2]);
        }
        if (this.sk && this.appliedTransformations < 3) {
          this.v.skewFromAxis(-this.sk.v, this.sa.v);
        }
        if (this.r && this.appliedTransformations < 4) {
          this.v.rotate(-this.r.v);
        } else if (!this.r && this.appliedTransformations < 4) {
          this.v.rotateZ(-this.rz.v).rotateY(this.ry.v).rotateX(this.rx.v).rotateZ(-this.or.v[2]).rotateY(this.or.v[1]).rotateX(this.or.v[0]);
        }
        if (this.autoOriented) {
          var v1 = void 0;
          var v2 = void 0;
          // TODO: 需要从外部传入
          var frameRate = this.elem.globalData.frameRate;
          if (this.p && this.p.keyframes && this.p.getValueAtTime) {
            if (this.p._caching.lastFrame + this.p.offsetTime <= this.p.keyframes[0].t) {
              v1 = this.p.getValueAtTime((this.p.keyframes[0].t + 0.01) / frameRate, 0);
              v2 = this.p.getValueAtTime(this.p.keyframes[0].t / frameRate, 0);
            } else if (this.p._caching.lastFrame + this.p.offsetTime >= this.p.keyframes[this.p.keyframes.length - 1].t) {
              v1 = this.p.getValueAtTime(this.p.keyframes[this.p.keyframes.length - 1].t / frameRate, 0);
              v2 = this.p.getValueAtTime((this.p.keyframes[this.p.keyframes.length - 1].t - 0.01) / frameRate, 0);
            } else {
              v1 = this.p.pv;
              v2 = this.p.getValueAtTime((this.p._caching.lastFrame + this.p.offsetTime - 0.01) / frameRate, this.p.offsetTime);
            }
          } else if (this.px && this.px.keyframes && this.py.keyframes && this.px.getValueAtTime && this.py.getValueAtTime) {
            v1 = [];
            v2 = [];
            var px = this.px;
            var py = this.py;
            // frameRate;
            if (px._caching.lastFrame + px.offsetTime <= px.keyframes[0].t) {
              v1[0] = px.getValueAtTime((px.keyframes[0].t + 0.01) / frameRate, 0);
              v1[1] = py.getValueAtTime((py.keyframes[0].t + 0.01) / frameRate, 0);
              v2[0] = px.getValueAtTime(px.keyframes[0].t / frameRate, 0);
              v2[1] = py.getValueAtTime(py.keyframes[0].t / frameRate, 0);
            } else if (px._caching.lastFrame + px.offsetTime >= px.keyframes[px.keyframes.length - 1].t) {
              v1[0] = px.getValueAtTime(px.keyframes[px.keyframes.length - 1].t / frameRate, 0);
              v1[1] = py.getValueAtTime(py.keyframes[py.keyframes.length - 1].t / frameRate, 0);
              v2[0] = px.getValueAtTime((px.keyframes[px.keyframes.length - 1].t - 0.01) / frameRate, 0);
              v2[1] = py.getValueAtTime((py.keyframes[py.keyframes.length - 1].t - 0.01) / frameRate, 0);
            } else {
              v1 = [px.pv, py.pv];
              v2[0] = px.getValueAtTime((px._caching.lastFrame + px.offsetTime - 0.01) / frameRate, px.offsetTime);
              v2[1] = py.getValueAtTime((py._caching.lastFrame + py.offsetTime - 0.01) / frameRate, py.offsetTime);
            }
          }
          this.v.rotate(-Math.atan2(v1[1] - v2[1], v1[0] - v2[0]));
        }
        if (this.data.p && this.data.p.s) {
          if (this.data.p.z) {
            this.v.translate(this.px.v, this.py.v, -this.pz.v);
          } else {
            this.v.translate(this.px.v, this.py.v, 0);
          }
        } else {
          this.v.translate(this.p.v[0], this.p.v[1], -this.p.v[2]);
        }
      }
    }

    /**
     * a
     */

  }, {
    key: 'precalculateMatrix',
    value: function precalculateMatrix() {
      if (!this.a.k) {
        this.pre.translate(-this.a.v[0], -this.a.v[1], this.a.v[2]);
        this.appliedTransformations = 1;
      } else {
        return;
      }
      if (!this.s.effectsSequence.length) {
        this.pre.scale(this.s.v[0], this.s.v[1], this.s.v[2]);
        this.appliedTransformations = 2;
      } else {
        return;
      }
      if (this.sk) {
        if (!this.sk.effectsSequence.length && !this.sa.effectsSequence.length) {
          this.pre.skewFromAxis(-this.sk.v, this.sa.v);
          this.appliedTransformations = 3;
        } else {
          return;
        }
      }
      if (this.r) {
        if (!this.r.effectsSequence.length) {
          this.pre.rotate(-this.r.v);
          this.appliedTransformations = 4;
        } else {
          return;
        }
      } else if (!this.rz.effectsSequence.length && !this.ry.effectsSequence.length && !this.rx.effectsSequence.length && !this.or.effectsSequence.length) {
        this.pre.rotateZ(-this.rz.v).rotateY(this.ry.v).rotateX(this.rx.v).rotateZ(-this.or.v[2]).rotateY(this.or.v[1]).rotateX(this.or.v[0]);
        this.appliedTransformations = 4;
      }
    }

    /**
     * a
     */

  }, {
    key: 'autoOrient',
    value: function autoOrient() {}
  }]);
  return TransformProperty;
}(DynamicPropertyContainer);

/**
 * a
 * @param {*} elem a
 * @param {*} data a
 * @param {*} container a
 * @return {*}
 */


function getTransformProperty(elem, data, container) {
  return new TransformProperty(elem, data, container);
}

var TransformPropertyFactory = { getTransformProperty: getTransformProperty };

/**
 * a
 */

var ShapeModifier = function (_DynamicPropertyConta) {
  inherits(ShapeModifier, _DynamicPropertyConta);

  function ShapeModifier() {
    classCallCheck(this, ShapeModifier);
    return possibleConstructorReturn(this, (ShapeModifier.__proto__ || Object.getPrototypeOf(ShapeModifier)).apply(this, arguments));
  }

  createClass(ShapeModifier, [{
    key: 'initModifierProperties',

    /**
     * a
     */
    value: function initModifierProperties() {}
    /**
     * a
     */

  }, {
    key: 'addShapeToModifier',
    value: function addShapeToModifier() {}
    /**
     * a
     * @param {*} data a
     */

  }, {
    key: 'addShape',
    value: function addShape(data) {
      if (!this.closed) {
        var shapeData = { shape: data.sh, data: data, localShapeCollection: shapeCollection_pool.newShapeCollection() };
        this.shapes.push(shapeData);
        this.addShapeToModifier(shapeData);
        if (this._isAnimated) {
          data.setAsAnimated();
        }
      }
    }

    /**
     * a
     * @param {*} elem a
     * @param {*} data a
     */

  }, {
    key: 'init',
    value: function init(elem, data) {
      this.shapes = [];
      this.elem = elem;
      this.initDynamicPropertyContainer(elem);
      this.initModifierProperties(elem, data);
      this.closed = false;
      this.k = false;
      if (this.dynamicProperties.length) {
        this.k = true;
      } else {
        this.getValue(-999999, true);
      }
    }

    /**
     * a
     */

  }, {
    key: 'processKeys',
    value: function processKeys(frameNum) {
      this.iterateDynamicProperties(frameNum);
    }
  }]);
  return ShapeModifier;
}(DynamicPropertyContainer);

// import { registerModifier } from './ShapeModifiers';
/**
 * a
 */

var TrimModifier = function (_ShapeModifier) {
  inherits(TrimModifier, _ShapeModifier);

  function TrimModifier() {
    classCallCheck(this, TrimModifier);
    return possibleConstructorReturn(this, (TrimModifier.__proto__ || Object.getPrototypeOf(TrimModifier)).apply(this, arguments));
  }

  createClass(TrimModifier, [{
    key: 'initModifierProperties',

    /**
     * a
     * @param {*} elem a
     * @param {*} data a
     */
    value: function initModifierProperties(elem, data) {
      this.s = PropertyFactory(elem, data.s, 0, 0.01, this);
      this.e = PropertyFactory(elem, data.e, 0, 0.01, this);
      this.o = PropertyFactory(elem, data.o, 0, 0, this);
      this.sValue = 0;
      this.eValue = 0;
      this.getValue = this.processKeys;
      this.m = data.m;
      this._isAnimated = !!this.s.effectsSequence.length || !!this.e.effectsSequence.length || !!this.o.effectsSequence.length;
    }

    /**
     * a
     * @param {*} shapeData a
     */

  }, {
    key: 'addShapeToModifier',
    value: function addShapeToModifier(shapeData) {
      shapeData.pathsData = [];
    }

    /**
     * a
     * @param {*} s a
     * @param {*} e a
     * @param {*} shapeLength a
     * @param {*} addedLength a
     * @param {*} totalModifierLength a
     * @return {*}
     */

  }, {
    key: 'calculateShapeEdges',
    value: function calculateShapeEdges(s, e, shapeLength, addedLength, totalModifierLength) {
      var segments = [];
      if (e <= 1) {
        segments.push({
          s: s,
          e: e
        });
      } else if (s >= 1) {
        segments.push({
          s: s - 1,
          e: e - 1
        });
      } else {
        segments.push({
          s: s,
          e: 1
        });
        segments.push({
          s: 0,
          e: e - 1
        });
      }
      var shapeSegments = [];
      var len = segments.length;
      for (var i = 0; i < len; i += 1) {
        var segmentOb = segments[i];
        if (segmentOb.e * totalModifierLength < addedLength || segmentOb.s * totalModifierLength > addedLength + shapeLength) {
          continue;
        } else {
          var shapeS = void 0;
          var shapeE = void 0;
          if (segmentOb.s * totalModifierLength <= addedLength) {
            shapeS = 0;
          } else {
            shapeS = (segmentOb.s * totalModifierLength - addedLength) / shapeLength;
          }
          if (segmentOb.e * totalModifierLength >= addedLength + shapeLength) {
            shapeE = 1;
          } else {
            shapeE = (segmentOb.e * totalModifierLength - addedLength) / shapeLength;
          }
          shapeSegments.push([shapeS, shapeE]);
        }
      }
      if (!shapeSegments.length) {
        shapeSegments.push([0, 0]);
      }
      return shapeSegments;
    }

    /**
     * a
     * @param {*} pathsData a
     * @return {*}
     */

  }, {
    key: 'releasePathsData',
    value: function releasePathsData(pathsData) {
      var len = pathsData.length;
      for (var i = 0; i < len; i += 1) {
        segments_length_pool.release(pathsData[i]);
      }
      pathsData.length = 0;
      return pathsData;
    }

    /**
     * a
     * @param {*} _isFirstFrame a
     */

  }, {
    key: 'processShapes',
    value: function processShapes(_isFirstFrame) {
      var s = void 0;
      var e = void 0;
      if (this._mdf || _isFirstFrame) {
        var o = this.o.v % 360 / 360;
        if (o < 0) {
          o += 1;
        }
        s = (this.s.v > 1 ? 1 : this.s.v < 0 ? 0 : this.s.v) + o;
        e = (this.e.v > 1 ? 1 : this.e.v < 0 ? 0 : this.e.v) + o;
        // if (s === e) {}
        if (s > e) {
          var _s = s;
          s = e;
          e = _s;
        }
        s = Math.round(s * 10000) * 0.0001;
        e = Math.round(e * 10000) * 0.0001;
        this.sValue = s;
        this.eValue = e;
      } else {
        s = this.sValue;
        e = this.eValue;
      }
      var shapePaths = void 0;
      var len = this.shapes.length;
      var pathsData = void 0;
      var pathData = void 0;
      var totalShapeLength = void 0;
      var totalModifierLength = 0;

      if (e === s) {
        for (var i = 0; i < len; i += 1) {
          this.shapes[i].localShapeCollection.releaseShapes();
          this.shapes[i].shape._mdf = true;
          this.shapes[i].shape.paths = this.shapes[i].localShapeCollection;
        }
      } else if (!(e === 1 && s === 0 || e === 0 && s === 1)) {
        var segments = [];
        var shapeData = void 0;
        var localShapeCollection = void 0;
        for (var _i = 0; _i < len; _i += 1) {
          shapeData = this.shapes[_i];
          // if shape hasn't changed and trim properties haven't changed, cached previous path can be used
          if (!shapeData.shape._mdf && !this._mdf && !_isFirstFrame && this.m !== 2) {
            shapeData.shape.paths = shapeData.localShapeCollection;
          } else {
            shapePaths = shapeData.shape.paths;
            var jLen = shapePaths._length;
            totalShapeLength = 0;
            if (!shapeData.shape._mdf && shapeData.pathsData.length) {
              totalShapeLength = shapeData.totalShapeLength;
            } else {
              pathsData = this.releasePathsData(shapeData.pathsData);
              for (var j = 0; j < jLen; j += 1) {
                pathData = bez.getSegmentsLength(shapePaths.shapes[j]);
                pathsData.push(pathData);
                totalShapeLength += pathData.totalLength;
              }
              shapeData.totalShapeLength = totalShapeLength;
              shapeData.pathsData = pathsData;
            }

            totalModifierLength += totalShapeLength;
            shapeData.shape._mdf = true;
          }
        }
        var shapeS = s;
        var shapeE = e;
        var addedLength = 0;
        var edges = void 0;
        for (var _i2 = len - 1; _i2 >= 0; _i2 -= 1) {
          shapeData = this.shapes[_i2];
          if (shapeData.shape._mdf) {
            localShapeCollection = shapeData.localShapeCollection;
            localShapeCollection.releaseShapes();
            // if m === 2 means paths are trimmed individually so edges need to be found for this specific shape relative to whoel group
            if (this.m === 2 && len > 1) {
              edges = this.calculateShapeEdges(s, e, shapeData.totalShapeLength, addedLength, totalModifierLength);
              addedLength += shapeData.totalShapeLength;
            } else {
              edges = [[shapeS, shapeE]];
            }
            var _jLen = edges.length;
            for (var _j = 0; _j < _jLen; _j += 1) {
              shapeS = edges[_j][0];
              shapeE = edges[_j][1];
              segments.length = 0;
              if (shapeE <= 1) {
                segments.push({
                  s: shapeData.totalShapeLength * shapeS,
                  e: shapeData.totalShapeLength * shapeE
                });
              } else if (shapeS >= 1) {
                segments.push({
                  s: shapeData.totalShapeLength * (shapeS - 1),
                  e: shapeData.totalShapeLength * (shapeE - 1)
                });
              } else {
                segments.push({
                  s: shapeData.totalShapeLength * shapeS,
                  e: shapeData.totalShapeLength
                });
                segments.push({
                  s: 0,
                  e: shapeData.totalShapeLength * (shapeE - 1)
                });
              }
              var newShapesData = this.addShapes(shapeData, segments[0]);
              if (segments[0].s !== segments[0].e) {
                if (segments.length > 1) {
                  var lastShapeInCollection = shapeData.shape.paths.shapes[shapeData.shape.paths._length - 1];
                  if (lastShapeInCollection.c) {
                    var lastShape = newShapesData.pop();
                    this.addPaths(newShapesData, localShapeCollection);
                    newShapesData = this.addShapes(shapeData, segments[1], lastShape);
                  } else {
                    this.addPaths(newShapesData, localShapeCollection);
                    newShapesData = this.addShapes(shapeData, segments[1]);
                  }
                }
                this.addPaths(newShapesData, localShapeCollection);
              }
            }
            shapeData.shape.paths = localShapeCollection;
          }
        }
      } else if (this._mdf) {
        for (var _i3 = 0; _i3 < len; _i3 += 1) {
          // Releasign Trim Cached paths data when no trim applied in case shapes are modified inbetween.
          // Don't remove this even if it's losing cached info.
          this.shapes[_i3].pathsData.length = 0;
          this.shapes[_i3].shape._mdf = true;
        }
      }
    }

    /**
     * a
     * @param {*} newPaths a
     * @param {*} localShapeCollection a
     */

  }, {
    key: 'addPaths',
    value: function addPaths(newPaths, localShapeCollection) {
      var len = newPaths.length;
      for (var i = 0; i < len; i += 1) {
        localShapeCollection.addShape(newPaths[i]);
      }
    }

    /**
     * a
     * @param {*} pt1 a
     * @param {*} pt2 a
     * @param {*} pt3 a
     * @param {*} pt4 a
     * @param {*} shapePath a
     * @param {*} pos a
     * @param {*} newShape a
     */

  }, {
    key: 'addSegment',
    value: function addSegment(pt1, pt2, pt3, pt4, shapePath, pos, newShape) {
      shapePath.setXYAt(pt2[0], pt2[1], 'o', pos);
      shapePath.setXYAt(pt3[0], pt3[1], 'i', pos + 1);
      if (newShape) {
        shapePath.setXYAt(pt1[0], pt1[1], 'v', pos);
      }
      shapePath.setXYAt(pt4[0], pt4[1], 'v', pos + 1);
    }

    /**
     * a
     * @param {*} points a
     * @param {*} shapePath a
     * @param {*} pos a
     * @param {*} newShape a
     */

  }, {
    key: 'addSegmentFromArray',
    value: function addSegmentFromArray(points, shapePath, pos, newShape) {
      shapePath.setXYAt(points[1], points[5], 'o', pos);
      shapePath.setXYAt(points[2], points[6], 'i', pos + 1);
      if (newShape) {
        shapePath.setXYAt(points[0], points[4], 'v', pos);
      }
      shapePath.setXYAt(points[3], points[7], 'v', pos + 1);
    }

    /**
     * a
     * @param {*} shapeData a
     * @param {*} shapeSegment a
     * @param {*} shapePath a
     * @return {*}
     */

  }, {
    key: 'addShapes',
    value: function addShapes(shapeData, shapeSegment, shapePath) {
      var pathsData = shapeData.pathsData;
      var shapePaths = shapeData.shape.paths.shapes;
      var len = shapeData.shape.paths._length;
      var addedLength = 0;
      var currentLengthData = void 0;
      var segmentCount = void 0;
      var lengths = void 0;
      var segment = void 0;
      var shapes = [];
      var initPos = void 0;
      var newShape = true;
      if (!shapePath) {
        shapePath = shape_pool.newElement();
        segmentCount = 0;
        initPos = 0;
      } else {
        segmentCount = shapePath._length;
        initPos = shapePath._length;
      }
      shapes.push(shapePath);
      for (var i = 0; i < len; i += 1) {
        lengths = pathsData[i].lengths;
        shapePath.c = shapePaths[i].c;
        var jLen = shapePaths[i].c ? lengths.length : lengths.length + 1;
        var j = 1;
        for (; j < jLen; j += 1) {
          currentLengthData = lengths[j - 1];
          if (addedLength + currentLengthData.addedLength < shapeSegment.s) {
            addedLength += currentLengthData.addedLength;
            shapePath.c = false;
          } else if (addedLength > shapeSegment.e) {
            shapePath.c = false;
            break;
          } else {
            if (shapeSegment.s <= addedLength && shapeSegment.e >= addedLength + currentLengthData.addedLength) {
              this.addSegment(shapePaths[i].v[j - 1], shapePaths[i].o[j - 1], shapePaths[i].i[j], shapePaths[i].v[j], shapePath, segmentCount, newShape);
              newShape = false;
            } else {
              segment = bez.getNewSegment(shapePaths[i].v[j - 1], shapePaths[i].v[j], shapePaths[i].o[j - 1], shapePaths[i].i[j], (shapeSegment.s - addedLength) / currentLengthData.addedLength, (shapeSegment.e - addedLength) / currentLengthData.addedLength, lengths[j - 1]);
              this.addSegmentFromArray(segment, shapePath, segmentCount, newShape);
              // this.addSegment(segment.pt1, segment.pt3, segment.pt4, segment.pt2, shapePath, segmentCount, newShape);
              newShape = false;
              shapePath.c = false;
            }
            addedLength += currentLengthData.addedLength;
            segmentCount += 1;
          }
        }
        if (shapePaths[i].c && lengths.length) {
          currentLengthData = lengths[j - 1];
          if (addedLength <= shapeSegment.e) {
            var segmentLength = lengths[j - 1].addedLength;
            if (shapeSegment.s <= addedLength && shapeSegment.e >= addedLength + segmentLength) {
              this.addSegment(shapePaths[i].v[j - 1], shapePaths[i].o[j - 1], shapePaths[i].i[0], shapePaths[i].v[0], shapePath, segmentCount, newShape);
              newShape = false;
            } else {
              segment = bez.getNewSegment(shapePaths[i].v[j - 1], shapePaths[i].v[0], shapePaths[i].o[j - 1], shapePaths[i].i[0], (shapeSegment.s - addedLength) / segmentLength, (shapeSegment.e - addedLength) / segmentLength, lengths[j - 1]);
              this.addSegmentFromArray(segment, shapePath, segmentCount, newShape);
              // this.addSegment(segment.pt1, segment.pt3, segment.pt4, segment.pt2, shapePath, segmentCount, newShape);
              newShape = false;
              shapePath.c = false;
            }
          } else {
            shapePath.c = false;
          }
          addedLength += currentLengthData.addedLength;
          segmentCount += 1;
        }
        if (shapePath._length) {
          shapePath.setXYAt(shapePath.v[initPos][0], shapePath.v[initPos][1], 'i', initPos);
          shapePath.setXYAt(shapePath.v[shapePath._length - 1][0], shapePath.v[shapePath._length - 1][1], 'o', shapePath._length - 1);
        }
        if (addedLength > shapeSegment.e) {
          break;
        }
        if (i < len - 1) {
          shapePath = shape_pool.newElement();
          newShape = true;
          shapes.push(shapePath);
          segmentCount = 0;
        }
      }
      return shapes;
    }
  }]);
  return TrimModifier;
}(ShapeModifier);

// import { registerModifier } from './ShapeModifiers';
var roundCorner$1 = 0.5519;

/**
 * a
 */

var RoundCornersModifier = function (_ShapeModifier) {
  inherits(RoundCornersModifier, _ShapeModifier);

  function RoundCornersModifier() {
    classCallCheck(this, RoundCornersModifier);
    return possibleConstructorReturn(this, (RoundCornersModifier.__proto__ || Object.getPrototypeOf(RoundCornersModifier)).apply(this, arguments));
  }

  createClass(RoundCornersModifier, [{
    key: 'initModifierProperties',

    /**
     * a
     * @param {*} elem a
     * @param {*} data a
     */
    value: function initModifierProperties(elem, data) {
      this.getValue = this.processKeys;
      this.rd = PropertyFactory.getProp(elem, data.r, 0, null, this);
      this._isAnimated = !!this.rd.effectsSequence.length;
    }

    /**
     * a
     * @param {*} path a
     * @param {*} round a
     * @return {*}
     */

  }, {
    key: 'processPath',
    value: function processPath(path, round) {
      var cloned_path = shape_pool.newElement();
      cloned_path.c = path.c;
      var len = path._length;
      var currentV = void 0;
      var currentI = void 0;
      var currentO = void 0;
      var closerV = void 0;
      var distance = void 0;
      var newPosPerc = void 0;
      var index = 0;
      var vX = void 0;
      var vY = void 0;
      var oX = void 0;
      var oY = void 0;
      var iX = void 0;
      var iY = void 0;
      for (var i = 0; i < len; i++) {
        currentV = path.v[i];
        currentO = path.o[i];
        currentI = path.i[i];
        if (currentV[0] === currentO[0] && currentV[1] === currentO[1] && currentV[0] === currentI[0] && currentV[1] === currentI[1]) {
          if ((i === 0 || i === len - 1) && !path.c) {
            cloned_path.setTripleAt(currentV[0], currentV[1], currentO[0], currentO[1], currentI[0], currentI[1], index);
            // /*cloned_path.v[index] = currentV;
            // cloned_path.o[index] = currentO;
            // cloned_path.i[index] = currentI;*/
            index += 1;
          } else {
            if (i === 0) {
              closerV = path.v[len - 1];
            } else {
              closerV = path.v[i - 1];
            }
            distance = Math.sqrt(Math.pow(currentV[0] - closerV[0], 2) + Math.pow(currentV[1] - closerV[1], 2));
            newPosPerc = distance ? Math.min(distance / 2, round) / distance : 0;
            vX = iX = currentV[0] + (closerV[0] - currentV[0]) * newPosPerc;
            vY = iY = currentV[1] - (currentV[1] - closerV[1]) * newPosPerc;
            oX = vX - (vX - currentV[0]) * roundCorner$1;
            oY = vY - (vY - currentV[1]) * roundCorner$1;
            cloned_path.setTripleAt(vX, vY, oX, oY, iX, iY, index);
            index += 1;

            if (i === len - 1) {
              closerV = path.v[0];
            } else {
              closerV = path.v[i + 1];
            }
            distance = Math.sqrt(Math.pow(currentV[0] - closerV[0], 2) + Math.pow(currentV[1] - closerV[1], 2));
            newPosPerc = distance ? Math.min(distance / 2, round) / distance : 0;
            vX = oX = currentV[0] + (closerV[0] - currentV[0]) * newPosPerc;
            vY = oY = currentV[1] + (closerV[1] - currentV[1]) * newPosPerc;
            iX = vX - (vX - currentV[0]) * roundCorner$1;
            iY = vY - (vY - currentV[1]) * roundCorner$1;
            cloned_path.setTripleAt(vX, vY, oX, oY, iX, iY, index);
            index += 1;
          }
        } else {
          cloned_path.setTripleAt(path.v[i][0], path.v[i][1], path.o[i][0], path.o[i][1], path.i[i][0], path.i[i][1], index);
          index += 1;
        }
      }
      return cloned_path;
    }

    /**
     * a
     * @param {*} _isFirstFrame a
     */

  }, {
    key: 'processShapes',
    value: function processShapes(_isFirstFrame) {
      var shapePaths = void 0;
      var len = this.shapes.length;
      var rd = this.rd.v;

      if (rd !== 0) {
        var shapeData = void 0;
        // let newPaths;
        var localShapeCollection = void 0;
        for (var i = 0; i < len; i++) {
          shapeData = this.shapes[i];
          // newPaths = shapeData.shape.paths;
          localShapeCollection = shapeData.localShapeCollection;
          if (!(!shapeData.shape._mdf && !this._mdf && !_isFirstFrame)) {
            localShapeCollection.releaseShapes();
            shapeData.shape._mdf = true;
            shapePaths = shapeData.shape.paths.shapes;
            var jLen = shapeData.shape.paths._length;
            for (var j = 0; j < jLen; j += 1) {
              localShapeCollection.addShape(this.processPath(shapePaths[j], rd));
            }
          }
          shapeData.shape.paths = shapeData.localShapeCollection;
        }
      }
      if (!this.dynamicProperties.length) {
        this._mdf = false;
      }
    }
  }]);
  return RoundCornersModifier;
}(ShapeModifier);

/**
 * a
 */

var RepeaterModifier = function (_ShapeModifier) {
  inherits(RepeaterModifier, _ShapeModifier);

  function RepeaterModifier() {
    classCallCheck(this, RepeaterModifier);
    return possibleConstructorReturn(this, (RepeaterModifier.__proto__ || Object.getPrototypeOf(RepeaterModifier)).apply(this, arguments));
  }

  createClass(RepeaterModifier, [{
    key: 'initModifierProperties',

    /**
     * a
     * @param {*} elem a
     * @param {*} data a
     */
    value: function initModifierProperties(elem, data) {
      this.getValue = this.processKeys;
      this.c = PropertyFactory.getProp(elem, data.c, 0, null, this);
      this.o = PropertyFactory.getProp(elem, data.o, 0, null, this);
      this.tr = TransformPropertyFactory.getTransformProperty(elem, data.tr, this);
      this.so = PropertyFactory.getProp(elem, data.tr.so, 0, 0.01, this);
      this.eo = PropertyFactory.getProp(elem, data.tr.eo, 0, 0.01, this);
      this.data = data;
      if (!this.dynamicProperties.length) {
        this.getValue(true);
      }
      this._isAnimated = !!this.dynamicProperties.length;
      this.pMatrix = new Matrix$1();
      this.rMatrix = new Matrix$1();
      this.sMatrix = new Matrix$1();
      this.tMatrix = new Matrix$1();
      this.matrix = new Matrix$1();
    }

    /**
     * a
     * @param {*} pMatrix a
     * @param {*} rMatrix a
     * @param {*} sMatrix a
     * @param {*} transform a
     * @param {*} perc a
     * @param {*} inv a
     */

  }, {
    key: 'applyTransforms',
    value: function applyTransforms(pMatrix, rMatrix, sMatrix, transform, perc, inv) {
      var dir = inv ? -1 : 1;
      var scaleX = transform.s.v[0] + (1 - transform.s.v[0]) * (1 - perc);
      var scaleY = transform.s.v[1] + (1 - transform.s.v[1]) * (1 - perc);
      pMatrix.translate(transform.p.v[0] * dir * perc, transform.p.v[1] * dir * perc, transform.p.v[2]);
      rMatrix.translate(-transform.a.v[0], -transform.a.v[1], transform.a.v[2]);
      rMatrix.rotate(-transform.r.v * dir * perc);
      rMatrix.translate(transform.a.v[0], transform.a.v[1], transform.a.v[2]);
      sMatrix.translate(-transform.a.v[0], -transform.a.v[1], transform.a.v[2]);
      sMatrix.scale(inv ? 1 / scaleX : scaleX, inv ? 1 / scaleY : scaleY);
      sMatrix.translate(transform.a.v[0], transform.a.v[1], transform.a.v[2]);
    }

    /**
     * a
     * @param {*} elem a
     * @param {*} arr a
     * @param {*} pos a
     * @param {*} elemsData a
     */

  }, {
    key: 'init',
    value: function init(elem, arr, pos, elemsData) {
      this.elem = elem;
      this.arr = arr;
      this.pos = pos;
      this.elemsData = elemsData;
      this._currentCopies = 0;
      this._elements = [];
      this._groups = [];
      this.frameId = -1;
      this.initDynamicPropertyContainer(elem);
      this.initModifierProperties(elem, arr[pos]);
      while (pos > 0) {
        pos -= 1;
        // this._elements.unshift(arr.splice(pos,1)[0]);
        this._elements.unshift(arr[pos]);
      }
      if (this.dynamicProperties.length) {
        this.k = true;
      } else {
        this.getValue(true);
      }
    }

    /**
     * a
     * @param {*} elements a
     */

  }, {
    key: 'resetElements',
    value: function resetElements(elements) {
      var len = elements.length;
      for (var i = 0; i < len; i += 1) {
        elements[i]._processed = false;
        if (elements[i].ty === 'gr') {
          this.resetElements(elements[i].it);
        }
      }
    }

    /**
     * a
     * @param {*} elements a
     */

  }, {
    key: 'cloneElements',
    value: function cloneElements(elements) {
      var newElements = JSON.parse(JSON.stringify(elements));
      this.resetElements(newElements);
      return newElements;
    }

    /**
     * a
     * @param {*} elements a
     * @param {*} renderFlag a
     */

  }, {
    key: 'changeGroupRender',
    value: function changeGroupRender(elements, renderFlag) {
      var len = elements.length;
      for (var i = 0; i < len; i += 1) {
        elements[i]._render = renderFlag;
        if (elements[i].ty === 'gr') {
          this.changeGroupRender(elements[i].it, renderFlag);
        }
      }
    }

    /**
     * a
     * @param {*} _isFirstFrame a
     */

  }, {
    key: 'processShapes',
    value: function processShapes(_isFirstFrame) {
      // let items, itemsTransform, i, dir, cont;
      if (this._mdf || _isFirstFrame) {
        var copies = Math.ceil(this.c.v);
        if (this._groups.length < copies) {
          while (this._groups.length < copies) {
            var group = {
              it: this.cloneElements(this._elements),
              ty: 'gr'
            };
            group.it.push({ 'a': { 'a': 0, 'ix': 1, 'k': [0, 0] }, 'nm': 'Transform', 'o': { 'a': 0, 'ix': 7, 'k': 100 }, 'p': { 'a': 0, 'ix': 2, 'k': [0, 0] }, 'r': { 'a': 1, 'ix': 6, 'k': [{ s: 0, e: 0, t: 0 }, { s: 0, e: 0, t: 1 }] }, 's': { 'a': 0, 'ix': 3, 'k': [100, 100] }, 'sa': { 'a': 0, 'ix': 5, 'k': 0 }, 'sk': { 'a': 0, 'ix': 4, 'k': 0 }, 'ty': 'tr' });

            this.arr.splice(0, 0, group);
            this._groups.splice(0, 0, group);
            this._currentCopies += 1;
          }
          this.elem.reloadShapes();
        }
        var cont = 0;
        var i = void 0;
        var renderFlag = void 0;
        for (i = 0; i <= this._groups.length - 1; i += 1) {
          renderFlag = cont < copies;
          this._groups[i]._render = renderFlag;
          this.changeGroupRender(this._groups[i].it, renderFlag);
          cont += 1;
        }

        this._currentCopies = copies;
        // //

        var offset = this.o.v;
        var offsetModulo = offset % 1;
        var roundOffset = offset > 0 ? Math.floor(offset) : Math.ceil(offset);
        // let k;
        // let tMat = this.tr.v.props;
        var pProps = this.pMatrix.props;
        var rProps = this.rMatrix.props;
        var sProps = this.sMatrix.props;
        this.pMatrix.reset();
        this.rMatrix.reset();
        this.sMatrix.reset();
        this.tMatrix.reset();
        this.matrix.reset();
        var iteration = 0;

        if (offset > 0) {
          while (iteration < roundOffset) {
            this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, 1, false);
            iteration += 1;
          }
          if (offsetModulo) {
            this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, offsetModulo, false);
            iteration += offsetModulo;
          }
        } else if (offset < 0) {
          while (iteration > roundOffset) {
            this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, 1, true);
            iteration -= 1;
          }
          if (offsetModulo) {
            this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, -offsetModulo, true);
            iteration -= offsetModulo;
          }
        }
        i = this.data.m === 1 ? 0 : this._currentCopies - 1;
        var dir = this.data.m === 1 ? 1 : -1;
        cont = this._currentCopies;
        while (cont) {
          var items = this.elemsData[i].it;
          var itemsTransform = items[items.length - 1].transform.mProps.v.props;
          var jLen = itemsTransform.length;
          items[items.length - 1].transform.mProps._mdf = true;
          items[items.length - 1].transform.op._mdf = true;
          items[items.length - 1].transform.op.v = this.so.v + (this.eo.v - this.so.v) * (i / (this._currentCopies - 1));
          if (iteration !== 0) {
            if (i !== 0 && dir === 1 || i !== this._currentCopies - 1 && dir === -1) {
              this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, 1, false);
            }
            this.matrix.transform(rProps[0], rProps[1], rProps[2], rProps[3], rProps[4], rProps[5], rProps[6], rProps[7], rProps[8], rProps[9], rProps[10], rProps[11], rProps[12], rProps[13], rProps[14], rProps[15]);
            this.matrix.transform(sProps[0], sProps[1], sProps[2], sProps[3], sProps[4], sProps[5], sProps[6], sProps[7], sProps[8], sProps[9], sProps[10], sProps[11], sProps[12], sProps[13], sProps[14], sProps[15]);
            this.matrix.transform(pProps[0], pProps[1], pProps[2], pProps[3], pProps[4], pProps[5], pProps[6], pProps[7], pProps[8], pProps[9], pProps[10], pProps[11], pProps[12], pProps[13], pProps[14], pProps[15]);

            for (var j = 0; j < jLen; j += 1) {
              itemsTransform[j] = this.matrix.props[j];
            }
            this.matrix.reset();
          } else {
            this.matrix.reset();
            for (var _j = 0; _j < jLen; _j += 1) {
              itemsTransform[_j] = this.matrix.props[_j];
            }
          }
          iteration += 1;
          cont -= 1;
          i += dir;
        }
      } else {
        var _cont = this._currentCopies;
        var _i = 0;
        var _dir = 1;
        while (_cont) {
          var _items = this.elemsData[_i].it;
          // const itemsTransform = items[items.length - 1].transform.mProps.v.props;
          _items[_items.length - 1].transform.mProps._mdf = false;
          _items[_items.length - 1].transform.op._mdf = false;
          _cont -= 1;
          _i += _dir;
        }
      }
    }

    /**
     * a
     */

  }, {
    key: 'addShape',
    value: function addShape() {}
  }]);
  return RepeaterModifier;
}(ShapeModifier);

/**
 * a
 */

var MouseModifier = function (_ShapeModifier) {
  inherits(MouseModifier, _ShapeModifier);

  function MouseModifier() {
    classCallCheck(this, MouseModifier);
    return possibleConstructorReturn(this, (MouseModifier.__proto__ || Object.getPrototypeOf(MouseModifier)).apply(this, arguments));
  }

  createClass(MouseModifier, [{
    key: 'processKeys',

    /**
     * a
     * @param {*} forceRender a
     */
    value: function processKeys(forceRender) {
      if (this.elem.globalData.frameId === this.frameId && !forceRender) {
        return;
      }
      this._mdf = true;
    }

    /**
     * a
     */

  }, {
    key: 'addShapeToModifier',
    value: function addShapeToModifier() {
      this.positions.push([]);
    }

    /**
     * a
     * @param {*} path a
     * @param {*} mouseCoords a
     * @param {*} positions a
     */

  }, {
    key: 'processPath',
    value: function processPath(path, mouseCoords, positions) {
      var len = path.v.length;
      var vValues = [];
      var oValues = [];
      var iValues = [];
      // let dist;
      var theta = void 0;
      var x = void 0;
      var y = void 0;
      // // OPTION A
      for (var i = 0; i < len; i += 1) {
        if (!positions.v[i]) {
          positions.v[i] = [path.v[i][0], path.v[i][1]];
          positions.o[i] = [path.o[i][0], path.o[i][1]];
          positions.i[i] = [path.i[i][0], path.i[i][1]];
          positions.distV[i] = 0;
          positions.distO[i] = 0;
          positions.distI[i] = 0;
        }
        theta = Math.atan2(path.v[i][1] - mouseCoords[1], path.v[i][0] - mouseCoords[0]);

        x = mouseCoords[0] - positions.v[i][0];
        y = mouseCoords[1] - positions.v[i][1];
        var distance = Math.sqrt(x * x + y * y);
        positions.distV[i] += (distance - positions.distV[i]) * this.data.dc;

        positions.v[i][0] = Math.cos(theta) * Math.max(0, this.data.maxDist - positions.distV[i]) / 2 + path.v[i][0];
        positions.v[i][1] = Math.sin(theta) * Math.max(0, this.data.maxDist - positions.distV[i]) / 2 + path.v[i][1];

        theta = Math.atan2(path.o[i][1] - mouseCoords[1], path.o[i][0] - mouseCoords[0]);

        x = mouseCoords[0] - positions.o[i][0];
        y = mouseCoords[1] - positions.o[i][1];
        distance = Math.sqrt(x * x + y * y);
        positions.distO[i] += (distance - positions.distO[i]) * this.data.dc;

        positions.o[i][0] = Math.cos(theta) * Math.max(0, this.data.maxDist - positions.distO[i]) / 2 + path.o[i][0];
        positions.o[i][1] = Math.sin(theta) * Math.max(0, this.data.maxDist - positions.distO[i]) / 2 + path.o[i][1];

        theta = Math.atan2(path.i[i][1] - mouseCoords[1], path.i[i][0] - mouseCoords[0]);

        x = mouseCoords[0] - positions.i[i][0];
        y = mouseCoords[1] - positions.i[i][1];
        distance = Math.sqrt(x * x + y * y);
        positions.distI[i] += (distance - positions.distI[i]) * this.data.dc;

        positions.i[i][0] = Math.cos(theta) * Math.max(0, this.data.maxDist - positions.distI[i]) / 2 + path.i[i][0];
        positions.i[i][1] = Math.sin(theta) * Math.max(0, this.data.maxDist - positions.distI[i]) / 2 + path.i[i][1];

        // ///OPTION 1
        vValues.push(positions.v[i]);
        oValues.push(positions.o[i]);
        iValues.push(positions.i[i]);

        // ///OPTION 2
        // vValues.push(positions.v[i]);
        // iValues.push([path.i[i][0]+(positions.v[i][0]-path.v[i][0]),path.i[i][1]+(positions.v[i][1]-path.v[i][1])]);
        // oValues.push([path.o[i][0]+(positions.v[i][0]-path.v[i][0]),path.o[i][1]+(positions.v[i][1]-path.v[i][1])]);


        // ///OPTION 3
        // vValues.push(positions.v[i]);
        // iValues.push(path.i[i]);
        // oValues.push(path.o[i]);


        // ///OPTION 4
        // vValues.push(path.v[i]);
        // oValues.push(positions.o[i]);
        // iValues.push(positions.i[i]);
      }

      // // OPTION B
      /* for(i=0;i<len;i+=1){
          if(!positions.v[i]){
              positions.v[i] = [path.v[i][0],path.v[i][1]];
              positions.o[i] = [path.o[i][0],path.o[i][1]];
              positions.i[i] = [path.i[i][0],path.i[i][1]];
              positions.distV[i] = 0;
           }
          theta = Math.atan2(
              positions.v[i][1] - mouseCoords[1],
              positions.v[i][0] - mouseCoords[0]
          );
          x = mouseCoords[0] - positions.v[i][0];
          y = mouseCoords[1] - positions.v[i][1];
          var distance = this.data.ss * this.data.mx / Math.sqrt( (x * x) + (y * y) );
           positions.v[i][0] += Math.cos(theta) * distance + (path.v[i][0] - positions.v[i][0]) * this.data.dc;
          positions.v[i][1] += Math.sin(theta) * distance + (path.v[i][1] - positions.v[i][1]) * this.data.dc;
            theta = Math.atan2(
              positions.o[i][1] - mouseCoords[1],
              positions.o[i][0] - mouseCoords[0]
          );
          x = mouseCoords[0] - positions.o[i][0];
          y = mouseCoords[1] - positions.o[i][1];
          var distance =  this.data.ss * this.data.mx / Math.sqrt( (x * x) + (y * y) );
           positions.o[i][0] += Math.cos(theta) * distance + (path.o[i][0] - positions.o[i][0]) * this.data.dc;
          positions.o[i][1] += Math.sin(theta) * distance + (path.o[i][1] - positions.o[i][1]) * this.data.dc;
            theta = Math.atan2(
              positions.i[i][1] - mouseCoords[1],
              positions.i[i][0] - mouseCoords[0]
          );
          x = mouseCoords[0] - positions.i[i][0];
          y = mouseCoords[1] - positions.i[i][1];
          var distance =  this.data.ss * this.data.mx / Math.sqrt( (x * x) + (y * y) );
           positions.i[i][0] += Math.cos(theta) * distance + (path.i[i][0] - positions.i[i][0]) * this.data.dc;
          positions.i[i][1] += Math.sin(theta) * distance + (path.i[i][1] - positions.i[i][1]) * this.data.dc;
           /////OPTION 1
          //vValues.push(positions.v[i]);
          // oValues.push(positions.o[i]);
          // iValues.push(positions.i[i]);
            /////OPTION 2
          //vValues.push(positions.v[i]);
          // iValues.push([path.i[i][0]+(positions.v[i][0]-path.v[i][0]),path.i[i][1]+(positions.v[i][1]-path.v[i][1])]);
          // oValues.push([path.o[i][0]+(positions.v[i][0]-path.v[i][0]),path.o[i][1]+(positions.v[i][1]-path.v[i][1])]);
            /////OPTION 3
          //vValues.push(positions.v[i]);
          //iValues.push(path.i[i]);
          //oValues.push(path.o[i]);
            /////OPTION 4
          //vValues.push(path.v[i]);
          // oValues.push(positions.o[i]);
          // iValues.push(positions.i[i]);
      }*/

      return {
        v: vValues,
        o: oValues,
        i: iValues,
        c: path.c
      };
    }

    /**
     * a
     */

  }, {
    key: 'processShapes',
    value: function processShapes() {
      var mouseX = this.elem.globalData.mouseX;
      var mouseY = this.elem.globalData.mouseY;
      var shapePaths = void 0;
      var len = this.shapes.length;
      // let j, jLen;

      if (mouseX) {
        var localMouseCoords = this.elem.globalToLocal([mouseX, mouseY, 0]);

        var shapeData = void 0;
        var newPaths = [];
        for (var i = 0; i < len; i += 1) {
          shapeData = this.shapes[i];
          if (!shapeData.shape._mdf && !this._mdf) {
            shapeData.shape.paths = shapeData.last;
          } else {
            shapeData.shape._mdf = true;
            shapePaths = shapeData.shape.paths;
            var jLen = shapePaths.length;
            for (var j = 0; j < jLen; j += 1) {
              if (!this.positions[i][j]) {
                this.positions[i][j] = {
                  v: [],
                  o: [],
                  i: [],
                  distV: [],
                  distO: [],
                  distI: []
                };
              }
              newPaths.push(this.processPath(shapePaths[j], localMouseCoords, this.positions[i][j]));
            }
            shapeData.shape.paths = newPaths;
            shapeData.last = newPaths;
          }
        }
      }
    }

    /**
     * a
     * @param {*} elem a
     * @param {*} data a
     */

  }, {
    key: 'initModifierProperties',
    value: function initModifierProperties(elem, data) {
      this.getValue = this.processKeys;
      this.data = data;
      this.positions = [];
    }
  }]);
  return MouseModifier;
}(ShapeModifier);

var modifiers = {};

/**
 * a
 * @param {*} nm a
 * @param {*} factory a
 */
function registerModifier(nm, factory) {
  if (!modifiers[nm]) {
    modifiers[nm] = factory;
  }
}

/**
 * a
 * @param {*} nm a
 * @param {*} elem a
 * @param {*} data a
 * @return {*}
 */
function getModifier(nm, elem, data) {
  return new modifiers[nm](elem, data);
}

registerModifier('tm', TrimModifier);
registerModifier('rd', RoundCornersModifier);
registerModifier('rp', RepeaterModifier);
registerModifier('ms', MouseModifier);

var degToRads = Math.PI / 180;

/**
 * a
 * @param {*} element a
 * @param {*} position a
 */
function ProcessedElement(element, position) {
  this.elem = element;
  this.pos = position;
}

/**
 * a
 */

var CVShapeElement = function () {
  /**
   * a
   * @param {*} data a
   */
  function CVShapeElement(data) {
    classCallCheck(this, CVShapeElement);

    this.data = data;
    this.shapes = [];
    this.shapesData = data.shapes;
    this.stylesList = [];
    this.itemsData = [];
    this.prevViewData = [];
    this.shapeModifiers = [];
    this.processedElements = [];
    this.transformsManager = new ShapeTransformManager();
    this.lcEnum = {
      '1': 'butt',
      '2': 'round',
      '3': 'square'
    };
    this.ljEnum = {
      '1': 'miter',
      '2': 'round',
      '3': 'bevel'
    };

    // set to true when inpoint is rendered
    this._isFirstFrame = true;
    // list of animated properties
    this.dynamicProperties = [];
    // If layer has been modified in current tick this will be true
    this._mdf = false;

    this.finalTransform = {
      mProp: this.data.ks ? TransformPropertyFactory.getTransformProperty(this, this.data.ks, this) : { o: 0 },
      _matMdf: false,
      _opMdf: false,
      mat: new Matrix$1()
    };
    if (this.data.ao) {
      this.finalTransform.mProp.autoOriented = true;
    }

    this.transformHelper = { opacity: 1, _opMdf: false };
    this.createContent();
  }

  /**
   * a
   * @param {*} elem a
   */


  createClass(CVShapeElement, [{
    key: 'searchProcessedElement',
    value: function searchProcessedElement(elem) {
      var elements = this.processedElements;
      var i = 0;
      var len = elements.length;
      while (i < len) {
        if (elements[i].elem === elem) {
          return elements[i].pos;
        }
        i += 1;
      }
      return 0;
    }

    /**
     * a
     * @param {*} elem a
     * @param {*} pos a
     */

  }, {
    key: 'addProcessedElement',
    value: function addProcessedElement(elem, pos) {
      var elements = this.processedElements;
      var i = elements.length;
      while (i) {
        i -= 1;
        if (elements[i].elem === elem) {
          elements[i].pos = pos;
          return;
        }
      }
      elements.push(new ProcessedElement(elem, pos));
    }

    /**
     * a
     * @param {*} data a
     */

  }, {
    key: 'addShapeToModifiers',
    value: function addShapeToModifiers(data) {
      var i = void 0;
      var len = this.shapeModifiers.length;
      for (i = 0; i < len; i += 1) {
        this.shapeModifiers[i].addShape(data);
      }
    }

    /**
     * a
     * @param {*} num a
     */

  }, {
    key: 'prepareFrame',
    value: function prepareFrame(num) {
      this.prepareProperties(num);
    }

    /**
     * @function
     * Calculates all dynamic values
     *
     * @param {number} num current frame number in Layer's time
     * @param {boolean} isVisible if layers is currently in range
     *
     */

  }, {
    key: 'prepareProperties',
    value: function prepareProperties(num) {
      var i = void 0;
      var len = this.dynamicProperties.length;
      for (i = 0; i < len; i += 1) {
        this.dynamicProperties[i].getValue(num);
        if (this.dynamicProperties[i]._mdf) {
          this._mdf = true;
        }
      }
    }

    /**
     * a
     * @param {*} prop a
     */

  }, {
    key: 'addDynamicProperty',
    value: function addDynamicProperty(prop) {
      if (this.dynamicProperties.indexOf(prop) === -1) {
        this.dynamicProperties.push(prop);
      }
    }

    /**
     * a
     * @param {*} ctx a
     */

  }, {
    key: 'renderFrame',
    value: function renderFrame(ctx) {
      if (this.data.hd) {
        return;
      }
      this.renderInnerContent(ctx);
      if (this._isFirstFrame) {
        this._isFirstFrame = false;
      }
    }

    /**
     * a
     */

  }, {
    key: 'createContent',
    value: function createContent() {
      this.searchShapes(this.shapesData, this.itemsData, this.prevViewData, true, []);
    }

    /**
     * a
     * @param {*} data a
     * @param {*} transforms a
     * @return {*}
     */

  }, {
    key: 'createStyleElement',
    value: function createStyleElement(data, transforms) {
      var styleElem = {
        data: data,
        type: data.ty,
        preTransforms: this.transformsManager.addTransformSequence(transforms),
        transforms: [],
        elements: [],
        closed: data.hd === true
      };
      var elementData = {};
      if (data.ty == 'fl' || data.ty == 'st') {
        elementData.c = PropertyFactory(this, data.c, 1, 255, this);
        if (!elementData.c.k) {
          styleElem.co = 'rgb(' + Math.floor(elementData.c.v[0]) + ',' + Math.floor(elementData.c.v[1]) + ',' + Math.floor(elementData.c.v[2]) + ')';
        }
      } else if (data.ty === 'gf' || data.ty === 'gs') {
        elementData.s = PropertyFactory(this, data.s, 1, null, this);
        elementData.e = PropertyFactory(this, data.e, 1, null, this);
        elementData.h = PropertyFactory(this, data.h || { k: 0 }, 0, 0.01, this);
        elementData.a = PropertyFactory(this, data.a || { k: 0 }, 0, degToRads, this);
        // elementData.g = new GradientProperty(this, data.g, this);
      }
      elementData.o = PropertyFactory(this, data.o, 0, 0.01, this);
      if (data.ty == 'st' || data.ty == 'gs') {
        styleElem.lc = this.lcEnum[data.lc] || 'round';
        styleElem.lj = this.ljEnum[data.lj] || 'round';
        if (data.lj == 1) {
          styleElem.ml = data.ml;
        }
        elementData.w = PropertyFactory(this, data.w, 0, null, this);
        if (!elementData.w.k) {
          styleElem.wi = elementData.w.v;
        }
        // if (data.d) {
        //   const d = new DashProperty(this, data.d, 'canvas', this);
        //   elementData.d = d;
        //   if (!elementData.d.k) {
        //     styleElem.da = elementData.d.dashArray;
        //     styleElem.do = elementData.d.dashoffset[0];
        //   }
        // }
      } else {
        styleElem.r = data.r === 2 ? 'evenodd' : 'nonzero';
      }
      this.stylesList.push(styleElem);
      elementData.style = styleElem;
      return elementData;
    }

    /**
     * a
     * @param {*} data a
     * @return {*}
     */

  }, {
    key: 'createGroupElement',
    value: function createGroupElement() {
      return {
        it: [],
        prevViewData: []
      };
    }

    /**
     * a
     * @param {*} data a
     * @return {*}
     */

  }, {
    key: 'createTransformElement',
    value: function createTransformElement(data) {
      return {
        transform: {
          opacity: 1,
          _opMdf: false,
          key: this.transformsManager.getNewKey(),
          op: PropertyFactory(this, data.o, 0, 0.01, this),
          mProps: TransformPropertyFactory.getTransformProperty(this, data, this)
        }
      };
    }

    /**
     * a
     * @param {*} data a
     * @return {*}
     */

  }, {
    key: 'createShapeElement',
    value: function createShapeElement(data) {
      var elementData = new CVShapeData(this, data, this.stylesList, this.transformsManager);

      this.shapes.push(elementData);
      this.addShapeToModifiers(elementData);
      return elementData;
    }

    /**
     * a
     * @param {*} transform a
     */

  }, {
    key: 'addTransformToStyleList',
    value: function addTransformToStyleList(transform) {
      var len = this.stylesList.length;
      for (var i = 0; i < len; i += 1) {
        if (!this.stylesList[i].closed) {
          this.stylesList[i].transforms.push(transform);
        }
      }
    }

    /**
     * a
     */

  }, {
    key: 'removeTransformFromStyleList',
    value: function removeTransformFromStyleList() {
      var len = this.stylesList.length;
      for (var i = 0; i < len; i += 1) {
        if (!this.stylesList[i].closed) {
          this.stylesList[i].transforms.pop();
        }
      }
    }

    /**
     * a
     * @param {*} styles a
     */

  }, {
    key: 'closeStyles',
    value: function closeStyles(styles) {
      var len = styles.length;
      for (var i = 0; i < len; i += 1) {
        styles[i].closed = true;
      }
    }

    /**
     * a
     * @param {*} arr a
     * @param {*} itemsData a
     * @param {*} prevViewData a
     * @param {*} shouldRender a
     * @param {*} transforms a
     */

  }, {
    key: 'searchShapes',
    value: function searchShapes(arr, itemsData, prevViewData, shouldRender, transforms) {
      var len = arr.length - 1;
      var ownStyles = [];
      var ownModifiers = [];
      var processedPos = void 0;
      var modifier = void 0;
      var ownTransforms = [].concat(transforms);
      for (var i = len; i >= 0; i -= 1) {
        processedPos = this.searchProcessedElement(arr[i]);
        if (!processedPos) {
          arr[i]._shouldRender = shouldRender;
        } else {
          itemsData[i] = prevViewData[processedPos - 1];
        }
        if (arr[i].ty == 'fl' || arr[i].ty == 'st' || arr[i].ty == 'gf' || arr[i].ty == 'gs') {
          if (!processedPos) {
            itemsData[i] = this.createStyleElement(arr[i], ownTransforms);
          } else {
            itemsData[i].style.closed = false;
          }
          ownStyles.push(itemsData[i].style);
        } else if (arr[i].ty == 'gr') {
          if (!processedPos) {
            itemsData[i] = this.createGroupElement(arr[i]);
          } else {
            var jLen = itemsData[i].it.length;
            for (var j = 0; j < jLen; j += 1) {
              itemsData[i].prevViewData[j] = itemsData[i].it[j];
            }
          }
          this.searchShapes(arr[i].it, itemsData[i].it, itemsData[i].prevViewData, shouldRender, ownTransforms);
        } else if (arr[i].ty == 'tr') {
          if (!processedPos) {
            var currentTransform = this.createTransformElement(arr[i]);
            itemsData[i] = currentTransform;
          }
          ownTransforms.push(itemsData[i]);
          this.addTransformToStyleList(itemsData[i]);
        } else if (arr[i].ty == 'sh' || arr[i].ty == 'rc' || arr[i].ty == 'el' || arr[i].ty == 'sr') {
          if (!processedPos) {
            itemsData[i] = this.createShapeElement(arr[i]);
          }
        } else if (arr[i].ty == 'tm' || arr[i].ty == 'rd') {
          if (!processedPos) {
            modifier = getModifier(arr[i].ty);
            modifier.init(this, arr[i]);
            itemsData[i] = modifier;
            this.shapeModifiers.push(modifier);
          } else {
            modifier = itemsData[i];
            modifier.closed = false;
          }
          ownModifiers.push(modifier);
        } else if (arr[i].ty == 'rp') {
          if (!processedPos) {
            modifier = getModifier(arr[i].ty);
            itemsData[i] = modifier;
            modifier.init(this, arr, i, itemsData);
            this.shapeModifiers.push(modifier);
            shouldRender = false;
          } else {
            modifier = itemsData[i];
            modifier.closed = true;
          }
          ownModifiers.push(modifier);
        }
        this.addProcessedElement(arr[i], i + 1);
      }
      this.removeTransformFromStyleList();
      this.closeStyles(ownStyles);
      var olen = ownModifiers.length;
      for (var _i = 0; _i < olen; _i += 1) {
        ownModifiers[_i].closed = true;
      }
    }

    /**
     * a
     */

  }, {
    key: 'renderModifiers',
    value: function renderModifiers() {
      if (!this.shapeModifiers.length) return;
      var len = this.shapes.length;
      for (var _i2 = 0; _i2 < len; _i2 += 1) {
        this.shapes[_i2].sh.reset();
      }

      var i = this.shapeModifiers.length - 1;
      for (; i >= 0; i -= 1) {
        this.shapeModifiers[i].processShapes(this._isFirstFrame);
      }
    }

    /**
     * a
     */

  }, {
    key: 'renderInnerContent',
    value: function renderInnerContent(ctx) {
      this.transformHelper.opacity = 1;
      this.transformHelper._opMdf = false;
      this.renderModifiers();
      this.transformsManager.processSequences(this._isFirstFrame);
      this.renderShape(this.transformHelper, this.shapesData, this.itemsData, ctx);
    }

    /**
     * a
     * @param {*} parentTransform a
     * @param {*} groupTransform a
     */

  }, {
    key: 'renderShapeTransform',
    value: function renderShapeTransform(parentTransform, groupTransform) {
      if (parentTransform._opMdf || groupTransform.op._mdf || this._isFirstFrame) {
        groupTransform.opacity = parentTransform.opacity;
        groupTransform.opacity *= groupTransform.op.v;
        groupTransform._opMdf = true;
      }
    }

    /**
     * a
     * @param {*} parentTransform a
     * @param {*} items a
     * @param {*} data a
     * @param {*} ctx a
     */

  }, {
    key: 'renderShape',
    value: function renderShape(parentTransform, items, data, ctx) {
      var len = items.length - 1;
      var groupTransform = parentTransform;
      for (var i = len; i >= 0; i -= 1) {
        if (items[i].ty == 'tr') {
          groupTransform = data[i].transform;
          this.renderShapeTransform(parentTransform, groupTransform);
        } else if (items[i].ty == 'sh' || items[i].ty == 'el' || items[i].ty == 'rc' || items[i].ty == 'sr') {
          this.renderPath(items[i], data[i]);
        } else if (items[i].ty == 'fl') {
          this.renderFill(items[i], data[i], groupTransform);
        } else if (items[i].ty == 'st') {
          this.renderStroke(items[i], data[i], groupTransform);
        } else if (items[i].ty == 'gf' || items[i].ty == 'gs') {
          this.renderGradientFill(items[i], data[i], groupTransform);
        } else if (items[i].ty == 'gr') {
          this.renderShape(groupTransform, items[i].it, data[i].it);
        }
      }
      if (ctx) {
        this.drawLayer(ctx);
      }
    }

    /**
     * a
     */

  }, {
    key: 'drawLayer',
    value: function drawLayer(ctx) {
      var len = this.stylesList.length;
      for (var i = 0; i < len; i += 1) {
        var currentStyle = this.stylesList[i];
        var type = currentStyle.type;

        // Skipping style when
        // Stroke width equals 0
        // style should not be rendered (extra unused repeaters)
        // current opacity equals 0
        // global opacity equals 0
        if ((type === 'st' || type === 'gs') && currentStyle.wi === 0 || !currentStyle.data._shouldRender || currentStyle.coOp === 0) {
          continue;
        }
        ctx.save();
        var elems = currentStyle.elements;
        if (type === 'st' || type === 'gs') {
          ctx.strokeStyle = type === 'st' ? currentStyle.co : currentStyle.grd;
          ctx.lineWidth = currentStyle.wi;
          ctx.lineCap = currentStyle.lc;
          ctx.lineJoin = currentStyle.lj;
          ctx.miterLimit = currentStyle.ml || 0;
        } else {
          ctx.fillStyle = type === 'fl' ? currentStyle.co : currentStyle.grd;
        }
        ctx.globalAlpha = currentStyle.coOp * this.finalTransform.mProp.o.v;
        if (type !== 'st' && type !== 'gs') {
          ctx.beginPath();
        }
        var trProps = currentStyle.preTransforms.finalTransform.props;
        ctx.transform(trProps[0], trProps[1], trProps[4], trProps[5], trProps[12], trProps[13]);
        var jLen = elems.length;
        for (var j = 0; j < jLen; j += 1) {
          if (type === 'st' || type === 'gs') {
            ctx.beginPath();
            if (currentStyle.da) {
              ctx.setLineDash(currentStyle.da);
              ctx.lineDashOffset = currentStyle.do;
            }
          }
          var nodes = elems[j].trNodes;
          var kLen = nodes.length;

          for (var k = 0; k < kLen; k++) {
            if (nodes[k].t == 'm') {
              ctx.moveTo(nodes[k].p[0], nodes[k].p[1]);
            } else if (nodes[k].t == 'c') {
              ctx.bezierCurveTo(nodes[k].pts[0], nodes[k].pts[1], nodes[k].pts[2], nodes[k].pts[3], nodes[k].pts[4], nodes[k].pts[5]);
            } else {
              ctx.closePath();
            }
          }
          if (type === 'st' || type === 'gs') {
            ctx.stroke();
            if (currentStyle.da) {
              ctx.setLineDash(this.dashResetter);
            }
          }
        }
        if (type !== 'st' && type !== 'gs') {
          ctx.fill(currentStyle.r);
        }
        ctx.restore();
      }
    }

    /**
     * a
     * @param {*} pathData a
     * @param {*} itemData a
     */

  }, {
    key: 'renderPath',
    value: function renderPath(pathData, itemData) {
      if (pathData.hd !== true && pathData._shouldRender) {
        var len = itemData.styledShapes.length;
        for (var i = 0; i < len; i += 1) {
          this.renderStyledShape(itemData.styledShapes[i], itemData.sh);
        }
      }
    }

    /**
     * a
     * @param {*} styledShape a
     * @param {*} shape a
     */

  }, {
    key: 'renderStyledShape',
    value: function renderStyledShape(styledShape, shape) {
      if (this._isFirstFrame || shape._mdf || styledShape.transforms._mdf) {
        var shapeNodes = styledShape.trNodes;
        var paths = shape.paths;
        var jLen = paths._length;
        shapeNodes.length = 0;
        var groupTransformMat = styledShape.transforms.finalTransform;
        for (var j = 0; j < jLen; j += 1) {
          var pathNodes = paths.shapes[j];
          if (pathNodes && pathNodes.v) {
            var i = 1;
            var len = pathNodes._length;
            for (; i < len; i += 1) {
              if (i === 1) {
                shapeNodes.push({
                  t: 'm',
                  p: groupTransformMat.applyToPointArray(pathNodes.v[0][0], pathNodes.v[0][1], 0)
                });
              }
              shapeNodes.push({
                t: 'c',
                pts: groupTransformMat.applyToTriplePoints(pathNodes.o[i - 1], pathNodes.i[i], pathNodes.v[i])
              });
            }
            if (len === 1) {
              shapeNodes.push({
                t: 'm',
                p: groupTransformMat.applyToPointArray(pathNodes.v[0][0], pathNodes.v[0][1], 0)
              });
            }
            if (pathNodes.c && len) {
              shapeNodes.push({
                t: 'c',
                pts: groupTransformMat.applyToTriplePoints(pathNodes.o[i - 1], pathNodes.i[0], pathNodes.v[0])
              });
              shapeNodes.push({
                t: 'z'
              });
            }
          }
        }
        styledShape.trNodes = shapeNodes;
      }
    }

    /**
     * a
     * @param {*} styleData a
     * @param {*} itemData a
     * @param {*} groupTransform a
     */

  }, {
    key: 'renderFill',
    value: function renderFill(styleData, itemData, groupTransform) {
      var styleElem = itemData.style;

      if (itemData.c._mdf || this._isFirstFrame) {
        styleElem.co = 'rgb(' + Math.floor(itemData.c.v[0]) + ',' + Math.floor(itemData.c.v[1]) + ',' + Math.floor(itemData.c.v[2]) + ')';
      }
      if (itemData.o._mdf || groupTransform._opMdf || this._isFirstFrame) {
        styleElem.coOp = itemData.o.v * groupTransform.opacity;
      }
    }

    /**
     * a
     * @param {*} styleData a
     * @param {*} itemData a
     * @param {*} groupTransform a
     */

  }, {
    key: 'renderGradientFill',
    value: function renderGradientFill(styleData, itemData, groupTransform) {
      var styleElem = itemData.style;
      if (!styleElem.grd || itemData.g._mdf || itemData.s._mdf || itemData.e._mdf || styleData.t !== 1 && (itemData.h._mdf || itemData.a._mdf)) {
        var ctx = this.renderer;
        var grd = void 0;
        var pt1 = itemData.s.v;
        var pt2 = itemData.e.v;
        if (styleData.t === 1) {
          grd = ctx.createLinearGradient(pt1[0], pt1[1], pt2[0], pt2[1]);
        } else {
          var rad = Math.sqrt(Math.pow(pt1[0] - pt2[0], 2) + Math.pow(pt1[1] - pt2[1], 2));
          var ang = Math.atan2(pt2[1] - pt1[1], pt2[0] - pt1[0]);

          var percent = itemData.h.v >= 1 ? 0.99 : itemData.h.v <= -1 ? -0.99 : itemData.h.v;
          var dist = rad * percent;
          var x = Math.cos(ang + itemData.a.v) * dist + pt1[0];
          var y = Math.sin(ang + itemData.a.v) * dist + pt1[1];
          grd = ctx.createRadialGradient(x, y, 0, pt1[0], pt1[1], rad);
        }

        var len = styleData.g.p;
        var cValues = itemData.g.c;
        var opacity = 1;

        for (var i = 0; i < len; i += 1) {
          if (itemData.g._hasOpacity && itemData.g._collapsable) {
            opacity = itemData.g.o[i * 2 + 1];
          }
          grd.addColorStop(cValues[i * 4] / 100, 'rgba(' + cValues[i * 4 + 1] + ',' + cValues[i * 4 + 2] + ',' + cValues[i * 4 + 3] + ',' + opacity + ')');
        }
        styleElem.grd = grd;
      }
      styleElem.coOp = itemData.o.v * groupTransform.opacity;
    }

    /**
     * a
     * @param {*} styleData a
     * @param {*} itemData a
     * @param {*} groupTransform a
     */

  }, {
    key: 'renderStroke',
    value: function renderStroke(styleData, itemData, groupTransform) {
      var styleElem = itemData.style;
      var d = itemData.d;
      if (d && (d._mdf || this._isFirstFrame)) {
        styleElem.da = d.dashArray;
        styleElem.do = d.dashoffset[0];
      }
      if (itemData.c._mdf || this._isFirstFrame) {
        styleElem.co = 'rgb(' + Math.floor(itemData.c.v[0]) + ',' + Math.floor(itemData.c.v[1]) + ',' + Math.floor(itemData.c.v[2]) + ')';
      }
      if (itemData.o._mdf || groupTransform._opMdf || this._isFirstFrame) {
        styleElem.coOp = itemData.o.v * groupTransform.opacity;
      }
      if (itemData.w._mdf || this._isFirstFrame) {
        styleElem.wi = itemData.w.v;
      }
    }
  }]);
  return CVShapeElement;
}();

/**
 * ShapeElement class
 * @class
 * @private
 */

var ShapeElement = function (_Container) {
  inherits(ShapeElement, _Container);

  /**
   * ShapeElement constructor
   * @param {object} layer layer data information
   * @param {object} session layer data information
   */
  function ShapeElement(layer) {
    var session = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    classCallCheck(this, ShapeElement);

    var _this = possibleConstructorReturn(this, (ShapeElement.__proto__ || Object.getPrototypeOf(ShapeElement)).call(this));

    var parentName = session.parentName,
        register = session.register;


    _this.name = parentName + '.' + layer.nm;
    _this.bProgress = -999999;

    register.setLayer(_this.name, _this);

    _this.initKeyFrames(layer, session);

    _this.shapes = new CVShapeElement(layer, session);
    _this.adds(new Graphics(function (ctx) {
      _this.shapes.prepareFrame(_this.bProgress);
      _this.shapes.renderFrame(ctx);
    }));
    return _this;
  }

  /**
   * initKeyFrames
   * @param {object} layer layer
   * @param {object} session session
   */


  createClass(ShapeElement, [{
    key: 'initKeyFrames',
    value: function initKeyFrames(layer, session) {
      this.bodymovin = new Keyframes(this, layer, session);
      this.movin = true;
    }

    /**
     * initKeyFrames
     * @param {number} progress progress
     * @param {object} session session
     */

  }, {
    key: 'updateKeyframes',
    value: function updateKeyframes(progress, session) {
      if (!this.movin) return;
      this.bProgress = progress;
      this.bodymovin.update(progress, session);
    }
  }]);
  return ShapeElement;
}(Container);

/**
 * CompElement class
 * @class
 * @private
 */

var CompElement = function (_Container) {
  inherits(CompElement, _Container);

  /**
   * CompElement constructor
   * @param {object} layer layer data information
   * @param {object} session global session information
   */
  function CompElement(layer) {
    var session = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    classCallCheck(this, CompElement);

    var _this = possibleConstructorReturn(this, (CompElement.__proto__ || Object.getPrototypeOf(CompElement)).call(this));

    var assets = session.assets,
        size = session.size,
        prefix = session.prefix,
        register = session.register;

    var parentName = session.parentName;
    var ist = 0;
    var layers = [];

    var mySize = {
      w: size.w,
      h: size.h
    };
    if (Utils.isArray(layer)) {
      layers = layer;
      _this.name = parentName;
    } else {
      _this.initKeyFrames(layer, session);
      mySize.w = layer.w;
      mySize.h = layer.h;
      layers = getAssets(layer.refId, assets).layers;
      ist = layer.st;
      parentName = _this.name = parentName + '.' + layer.nm;
    }

    register.setLayer(parentName, _this);

    _this.parseLayers(layers, { assets: assets, st: ist, size: mySize, prefix: prefix, register: register, parentName: parentName });
    return _this;
  }

  /**
   * initKeyFrames
   * @param {object} layer layer
   * @param {object} session session
   */


  createClass(CompElement, [{
    key: 'initKeyFrames',
    value: function initKeyFrames(layer, session) {
      this.bodymovin = new Keyframes(this, layer, session);
      this.movin = true;
    }

    /**
     * initKeyFrames
     * @param {number} progress progress
     * @param {object} session session
     */

  }, {
    key: 'updateKeyframes',
    value: function updateKeyframes(progress, session) {
      if (!this.movin) return;
      this.bodymovin.update(progress, session);
    }

    /**
     * parse layers
     * @param {array} layers layers data
     * @param {object} session assets data
     */

  }, {
    key: 'parseLayers',
    value: function parseLayers(layers, session) {
      var elementsMap = this.createElements(layers, session);
      for (var i = layers.length - 1; i >= 0; i--) {
        var layer = layers[i];
        var item = elementsMap[layer.ind];
        if (!item) continue;
        if (layer.parent) {
          item.hierarchy = elementsMap[layer.parent];
        }
        this.adds(item);
      }
    }

    /**
     * createElements
     * @param {arrya} layers layers
     * @param {object} session object
     * @return {object}
     */

  }, {
    key: 'createElements',
    value: function createElements(layers, session) {
      var elementsMap = {};
      for (var i = layers.length - 1; i >= 0; i--) {
        var layer = layers[i];
        var element = null;

        switch (layer.ty) {
          case 0:
            element = new CompElement(layer, session);
            break;
          case 1:
            element = new SolidElement(layer, session);
            break;
          case 2:
            element = new SpriteElement(layer, session);
            break;
          case 3:
            element = new NullElement(layer, session);
            break;
          case 4:
            element = new ShapeElement(layer, session);
            break;
          default:
            continue;
        }

        if (element) {
          elementsMap[layer.ind] = element;
        }
      }
      return elementsMap;
    }
  }]);
  return CompElement;
}(Container);

/* eslint-disable */

function completeLayers(layers, comps, fontManager) {
  var layerData;
  var i,
      len = layers.length;
  var j, jLen, k, kLen;
  for (i = 0; i < len; i += 1) {
    layerData = layers[i];
    if (!('ks' in layerData) || layerData.completed) {
      continue;
    }
    layerData.completed = true;
    if (layerData.tt) {
      layers[i - 1].td = layerData.tt;
    }
    if (layerData.hasMask) {
      var maskProps = layerData.masksProperties;
      jLen = maskProps.length;
      for (j = 0; j < jLen; j += 1) {
        if (maskProps[j].pt.k.i) {
          convertPathsToAbsoluteValues(maskProps[j].pt.k);
        } else {
          kLen = maskProps[j].pt.k.length;
          for (k = 0; k < kLen; k += 1) {
            if (maskProps[j].pt.k[k].s) {
              convertPathsToAbsoluteValues(maskProps[j].pt.k[k].s[0]);
            }
            if (maskProps[j].pt.k[k].e) {
              convertPathsToAbsoluteValues(maskProps[j].pt.k[k].e[0]);
            }
          }
        }
      }
    }
    if (layerData.ty === 0) {
      layerData.layers = findCompLayers(layerData.refId, comps);
      completeLayers(layerData.layers, comps, fontManager);
    } else if (layerData.ty === 4) {
      completeShapes(layerData.shapes);
    } else if (layerData.ty == 5) {
      completeText(layerData, fontManager);
    }
  }
}

function findCompLayers(id, comps) {
  var i = 0,
      len = comps.length;
  while (i < len) {
    if (comps[i].id === id) {
      if (!comps[i].layers.__used) {
        comps[i].layers.__used = true;
        return comps[i].layers;
      }
      return JSON.parse(JSON.stringify(comps[i].layers));
    }
    i += 1;
  }
}

function completeShapes(arr) {
  var i,
      len = arr.length;
  var j, jLen;
  // var hasPaths = false;
  for (i = len - 1; i >= 0; i -= 1) {
    if (arr[i].ty == 'sh') {
      if (arr[i].ks.k.i) {
        convertPathsToAbsoluteValues(arr[i].ks.k);
      } else {
        jLen = arr[i].ks.k.length;
        for (j = 0; j < jLen; j += 1) {
          if (arr[i].ks.k[j].s) {
            convertPathsToAbsoluteValues(arr[i].ks.k[j].s[0]);
          }
          if (arr[i].ks.k[j].e) {
            convertPathsToAbsoluteValues(arr[i].ks.k[j].e[0]);
          }
        }
      }
      // hasPaths = true;
    } else if (arr[i].ty == 'gr') {
      completeShapes(arr[i].it);
    }
  }
  /*if(hasPaths){
      //mx: distance
      //ss: sensitivity
      //dc: decay
      arr.splice(arr.length-1,0,{
          "ty": "ms",
          "mx":20,
          "ss":10,
            "dc":0.001,
          "maxDist":200
      });
  }*/
}

function completeText(data) {
  if (data.t.a.length === 0 && !('m' in data.t.p)) {
    data.singleShape = true;
  }
}

function convertPathsToAbsoluteValues(path) {
  var i,
      len = path.i.length;
  for (i = 0; i < len; i += 1) {
    path.i[i][0] += path.v[i][0];
    path.i[i][1] += path.v[i][1];
    path.o[i][0] += path.v[i][0];
    path.o[i][1] += path.v[i][1];
  }
}

function checkVersion(minimum, animVersionString) {
  var animVersion = animVersionString ? animVersionString.split('.') : [100, 100, 100];
  if (minimum[0] > animVersion[0]) {
    return true;
  } else if (animVersion[0] > minimum[0]) {
    return false;
  }
  if (minimum[1] > animVersion[1]) {
    return true;
  } else if (animVersion[1] > minimum[1]) {
    return false;
  }
  if (minimum[2] > animVersion[2]) {
    return true;
  } else if (animVersion[2] > minimum[2]) {
    return false;
  }
}

var checkText = function () {
  var minimumVersion = [4, 4, 14];

  function updateTextLayer(textLayer) {
    var documentData = textLayer.t.d;
    textLayer.t.d = {
      k: [{
        s: documentData,
        t: 0
      }]
    };
  }

  function iterateLayers(layers) {
    var i,
        len = layers.length;
    for (i = 0; i < len; i += 1) {
      if (layers[i].ty === 5) {
        updateTextLayer(layers[i]);
      }
    }
  }

  return function (animationData) {
    if (checkVersion(minimumVersion, animationData.v)) {
      iterateLayers(animationData.layers);
      if (animationData.assets) {
        var i,
            len = animationData.assets.length;
        for (i = 0; i < len; i += 1) {
          if (animationData.assets[i].layers) {
            iterateLayers(animationData.assets[i].layers);
          }
        }
      }
    }
  };
}();

var checkChars = function () {
  var minimumVersion = [4, 7, 99];
  return function (animationData) {
    if (animationData.chars && !checkVersion(minimumVersion, animationData.v)) {
      var i,
          len = animationData.chars.length,
          j,
          jLen;
      var pathData, paths;
      for (i = 0; i < len; i += 1) {
        if (animationData.chars[i].data && animationData.chars[i].data.shapes) {
          paths = animationData.chars[i].data.shapes[0].it;
          jLen = paths.length;

          for (j = 0; j < jLen; j += 1) {
            pathData = paths[j].ks.k;
            if (!pathData.__converted) {
              convertPathsToAbsoluteValues(paths[j].ks.k);
              pathData.__converted = true;
            }
          }
        }
      }
    }
  };
}();

var checkColors = function () {
  var minimumVersion = [4, 1, 9];

  function iterateShapes(shapes) {
    var i,
        len = shapes.length;
    var j, jLen;
    for (i = 0; i < len; i += 1) {
      if (shapes[i].ty === 'gr') {
        iterateShapes(shapes[i].it);
      } else if (shapes[i].ty === 'fl' || shapes[i].ty === 'st') {
        if (shapes[i].c.k && shapes[i].c.k[0].i) {
          jLen = shapes[i].c.k.length;
          for (j = 0; j < jLen; j += 1) {
            if (shapes[i].c.k[j].s) {
              shapes[i].c.k[j].s[0] /= 255;
              shapes[i].c.k[j].s[1] /= 255;
              shapes[i].c.k[j].s[2] /= 255;
              shapes[i].c.k[j].s[3] /= 255;
            }
            if (shapes[i].c.k[j].e) {
              shapes[i].c.k[j].e[0] /= 255;
              shapes[i].c.k[j].e[1] /= 255;
              shapes[i].c.k[j].e[2] /= 255;
              shapes[i].c.k[j].e[3] /= 255;
            }
          }
        } else {
          shapes[i].c.k[0] /= 255;
          shapes[i].c.k[1] /= 255;
          shapes[i].c.k[2] /= 255;
          shapes[i].c.k[3] /= 255;
        }
      }
    }
  }

  function iterateLayers(layers) {
    var i,
        len = layers.length;
    for (i = 0; i < len; i += 1) {
      if (layers[i].ty === 4) {
        iterateShapes(layers[i].shapes);
      }
    }
  }

  return function (animationData) {
    if (checkVersion(minimumVersion, animationData.v)) {
      iterateLayers(animationData.layers);
      if (animationData.assets) {
        var i,
            len = animationData.assets.length;
        for (i = 0; i < len; i += 1) {
          if (animationData.assets[i].layers) {
            iterateLayers(animationData.assets[i].layers);
          }
        }
      }
    }
  };
}();

var checkShapes = function () {
  var minimumVersion = [4, 4, 18];

  function completeShapes(arr) {
    var i,
        len = arr.length;
    var j, jLen;
    // var hasPaths = false;
    for (i = len - 1; i >= 0; i -= 1) {
      if (arr[i].ty == 'sh') {
        if (arr[i].ks.k.i) {
          arr[i].ks.k.c = arr[i].closed;
        } else {
          jLen = arr[i].ks.k.length;
          for (j = 0; j < jLen; j += 1) {
            if (arr[i].ks.k[j].s) {
              arr[i].ks.k[j].s[0].c = arr[i].closed;
            }
            if (arr[i].ks.k[j].e) {
              arr[i].ks.k[j].e[0].c = arr[i].closed;
            }
          }
        }
        // hasPaths = true;
      } else if (arr[i].ty == 'gr') {
        completeShapes(arr[i].it);
      }
    }
  }

  function iterateLayers(layers) {
    var layerData;
    var i,
        len = layers.length;
    var j, jLen, k, kLen;
    for (i = 0; i < len; i += 1) {
      layerData = layers[i];
      if (layerData.hasMask) {
        var maskProps = layerData.masksProperties;
        jLen = maskProps.length;
        for (j = 0; j < jLen; j += 1) {
          if (maskProps[j].pt.k.i) {
            maskProps[j].pt.k.c = maskProps[j].cl;
          } else {
            kLen = maskProps[j].pt.k.length;
            for (k = 0; k < kLen; k += 1) {
              if (maskProps[j].pt.k[k].s) {
                maskProps[j].pt.k[k].s[0].c = maskProps[j].cl;
              }
              if (maskProps[j].pt.k[k].e) {
                maskProps[j].pt.k[k].e[0].c = maskProps[j].cl;
              }
            }
          }
        }
      }
      if (layerData.ty === 4) {
        completeShapes(layerData.shapes);
      }
    }
  }

  return function (animationData) {
    if (checkVersion(minimumVersion, animationData.v)) {
      iterateLayers(animationData.layers);
      if (animationData.assets) {
        var i,
            len = animationData.assets.length;
        for (i = 0; i < len; i += 1) {
          if (animationData.assets[i].layers) {
            iterateLayers(animationData.assets[i].layers);
          }
        }
      }
    }
  };
}();

function completeData(animationData, fontManager) {
  if (animationData.__complete) {
    return;
  }
  checkColors(animationData);
  checkText(animationData);
  checkChars(animationData);
  checkShapes(animationData);
  completeLayers(animationData.layers, animationData.assets, fontManager);
  animationData.__complete = true;
  //blitAnimation(animationData, animationData.assets, fontManager);
}

/**
 * an animation group, store and compute frame information
 * @class
 */

var AnimationGroup = function () {
  /**
   * pass a data and extra config
   * @param {object} options config and keyframes
   * @param {Object} options.keyframes bodymovin data, which export from AE
   * @param {Number} [options.repeats=0] need repeat somt times?
   * @param {Boolean} [options.infinite=false] play this animation round and round forever
   * @param {Boolean} [options.alternate=false] alternate direction every round
   * @param {Number} [options.wait=0] need wait how much time to start
   * @param {Number} [options.delay=0] need delay how much time to begin, effect every round
   * @param {String} [options.prefix=''] assets url prefix, like link path
   * @param {Number} [options.timeScale=1] animation speed
   * @param {Number} [options.autoStart=true] auto start animation after assets loaded
   * @param {Boolean} [options.mask=false] auto start animation after assets loaded
   */
  function AnimationGroup(options) {
    var _this = this;

    classCallCheck(this, AnimationGroup);

    this.prefix = options.prefix || options.keyframes.prefix || '';
    completeData(options.keyframes);
    this.keyframes = options.keyframes;
    this.fr = this.keyframes.fr;
    this.ip = this.keyframes.ip;
    this.op = this.keyframes.op;

    this.tpf = 1000 / this.fr;
    this.tfs = Math.floor(this.op - this.ip);

    this.living = true;
    this.alternate = options.alternate || false;
    this.infinite = options.infinite || false;
    this.repeats = options.repeats || 0;
    this.delay = options.delay || 0;
    this.wait = options.wait || 0;
    this.duration = this.tfs;
    this.progress = 0;
    this._pf = -10000;

    this.timeScale = Utils.isNumber(options.timeScale) ? options.timeScale : 1;

    this.direction = 1;
    this.repeatsCut = this.repeats;
    this.delayCut = this.delay;
    this.waitCut = this.wait;

    this._paused = true;

    this.register = new Register(this.keyframes.assets, this.prefix);

    var images = this.keyframes.assets.filter(function (it) {
      return it.u && it.p;
    });
    if (images.length > 0) {
      this.register.loader.once('complete', function () {
        _this._paused = Utils.isBoolean(options.autoStart) ? !options.autoStart : false;
      });
    } else {
      this._paused = false;
    }

    var _keyframes = this.keyframes,
        layers = _keyframes.layers,
        w = _keyframes.w,
        h = _keyframes.h,
        nm = _keyframes.nm,
        assets = _keyframes.assets;


    this.group = new CompElement(layers, {
      assets: assets,
      size: { w: w, h: h },
      prefix: this.prefix,
      register: this.register,
      parentName: nm
    });
    this.group._aniRoot = true;

    /**
     * generate a mask for animation
     */
    if (options.mask) {
      var mask = {
        render: function render(ctx) {
          ctx.beginPath();
          ctx.rect(0, 0, w, h);
          ctx.clip();
        }
      };
      this.group.mask = mask;
    }

    this.updateSession = { forever: this.isForever() };
  }

  /**
   * get layer by name path
   * @param {string} name layer name path, example: root.gift.star1
   * @return {object}
   */


  createClass(AnimationGroup, [{
    key: 'getLayerByName',
    value: function getLayerByName(name) {
      return this.register.getLayer(name);
    }

    /**
     * bind other animation group to this animation group with name path
     * @param {*} name
     * @param {*} slot
     */

  }, {
    key: 'bindSlot',
    value: function bindSlot(name, slot) {
      var slotDot = this.getLayerByName(name);
      if (slotDot) slotDot.add(slot);
    }

    /**
     * emit frame
     * @private
     * @param {*} np now frame
     */

  }, {
    key: 'emitFrame',
    value: function emitFrame(np) {
      this.emit('@' + np);
    }

    /**
     * update with time snippet
     * @private
     * @param {number} snippetCache snippet
     */

  }, {
    key: 'update',
    value: function update(snippetCache) {
      if (!this.living) return;

      var isEnd = this.updateTime(snippetCache);

      this.group.updateMovin(this.progress, this.updateSession);

      var np = this.progress >> 0;
      if (this._pf !== np) {
        this.emitFrame(this.direction > 0 ? np : this._pf);
        this._pf = np;
      }
      if (isEnd === false) {
        this.emit('update', this.progress / this.duration);
      } else if (isEnd === true) {
        this.emit('complete');
      }
    }

    /**
     * update timeline with time snippet
     * @private
     * @param {number} snippet snippet
     * @return {boolean} progress status
     */

  }, {
    key: 'updateTime',
    value: function updateTime(snippet) {
      var snippetCache = this.direction * this.timeScale * snippet;
      if (this.waitCut > 0) {
        this.waitCut -= Math.abs(snippetCache);
        return null;
      }
      if (this._paused || this.delayCut > 0) {
        if (this.delayCut > 0) this.delayCut -= Math.abs(snippetCache);
        return null;
      }

      this.progress += snippetCache / this.tpf;
      var isEnd = false;

      if (!this.updateSession.forever && this.spill()) {
        if (this.repeatsCut > 0 || this.infinite) {
          if (this.repeatsCut > 0) --this.repeatsCut;
          this.delayCut = this.delay;
          if (this.alternate) {
            this.direction *= -1;
            this.progress = Utils.codomainBounce(this.progress, 0, this.duration);
          } else {
            this.direction = 1;
            this.progress = Utils.euclideanModulo(this.progress, this.duration);
          }
        } else {
          this.progress = Utils.clamp(this.progress, 0, this.duration);
          isEnd = true;
          this.living = false;
        }
      }

      return isEnd;
    }

    /**
     * check the animation group was in forever mode
     * @private
     * @return {boolean}
     */

  }, {
    key: 'isForever',
    value: function isForever() {
      return this.register._forever;
    }

    /**
     * is this time progress spill the range
     * @private
     * @return {boolean}
     */

  }, {
    key: 'spill',
    value: function spill() {
      var bottomSpill = this.progress <= 0 && this.direction === -1;
      var topSpill = this.progress >= this.duration && this.direction === 1;
      return bottomSpill || topSpill;
    }

    /**
     * get time
     * @param {number} frame frame index
     * @return {number}
     */

  }, {
    key: 'frameToTime',
    value: function frameToTime(frame) {
      return frame * this.tpf;
    }

    /**
     * set animation speed, time scale
     * @param {number} speed
     */

  }, {
    key: 'setSpeed',
    value: function setSpeed(speed) {
      this.timeScale = speed;
    }

    /**
     * pause this animation group
     * @return {this}
     */

  }, {
    key: 'pause',
    value: function pause() {
      this._paused = true;
      return this;
    }

    /**
     * resume or play this animation group
     * @return {this}
     */

  }, {
    key: 'resume',
    value: function resume() {
      this._paused = false;
      return this;
    }

    /**
     * play this animation group
     * @return {this}
     */

  }, {
    key: 'play',
    value: function play() {
      this._paused = false;
      return this;
    }

    /**
     * replay this animation group
     * @return {this}
     */

  }, {
    key: 'replay',
    value: function replay() {
      this._paused = false;
      this.living = true;
      this.progress = 0;
      return this;
    }

    /**
     * proxy this.group event-emit
     * Emit an event to all registered event listeners.
     *
     * @param {String} event The name of the event.
     */

  }, {
    key: 'emit',
    value: function emit() {
      var _group;

      (_group = this.group).emit.apply(_group, arguments);
    }

    /**
     * proxy this.group event-on
     * Register a new EventListener for the given event.
     *
     * @param {String} event Name of the event.
     * @param {Function} fn Callback function.
     * @param {Mixed} [context=this] The context of the function.
     */

  }, {
    key: 'on',
    value: function on() {
      var _group2;

      (_group2 = this.group).on.apply(_group2, arguments);
    }

    /**
     * proxy this.group event-once
     * Add an EventListener that's only called once.
     *
     * @param {String} event Name of the event.
     * @param {Function} fn Callback function.
     * @param {Mixed} [context=this] The context of the function.
     */

  }, {
    key: 'once',
    value: function once() {
      var _group3;

      (_group3 = this.group).once.apply(_group3, arguments);
    }

    /**
     * proxy this.group event-off
     * @param {String} event The event we want to remove.
     * @param {Function} fn The listener that we need to find.
     * @param {Mixed} context Only remove listeners matching this context.
     * @param {Boolean} once Only remove once listeners.
     */

  }, {
    key: 'off',
    value: function off() {
      var _group4;

      (_group4 = this.group).off.apply(_group4, arguments);
    }

    /**
     * proxy this.group event-removeAllListeners
     * Remove event listeners.
     *
     * @param {String} event The event we want to remove.
     * @param {Function} fn The listener that we need to find.
     * @param {Mixed} context Only remove listeners matching this context.
     * @param {Boolean} once Only remove once listeners.
     */

  }, {
    key: 'removeAllListeners',
    value: function removeAllListeners() {
      var _group5;

      (_group5 = this.group).removeAllListeners.apply(_group5, arguments);
    }
  }]);
  return AnimationGroup;
}();

/**
 * all animation manager, manage ticker and animation groups
 * @example
 * var manager = new PIXI.AnimationManager(app.ticker);
 * var ani = manager.parseAnimation({
 *   keyframes: data,
 *   infinite: true,
 * });
 * @class
 */

var AnimationManager = function () {
  /**
   * animation manager, optional a ticker param
   * @param {Ticker} _ticker
   */
  function AnimationManager(_ticker) {
    var _this = this;

    classCallCheck(this, AnimationManager);

    /**
     * time scale, just like speed scalar
     *
     * @member {Number}
     */
    this.timeScale = 1;

    /**
     * mark the manager was pause or not
     *
     * @member {Boolean}
     */
    this.paused = false;

    /**
     * ticker engine
     * @private
     */
    this.ticker = _ticker || new Ticker();

    /**
     * all animation groups
     * @private
     */
    this.groups = [];

    this.ticker.on('update', function (snippet) {
      _this.update(snippet);
    });
  }

  /**
   * add a animationGroup child to array
   * @param {AnimationGroup} child AnimationGroup instance
   * @return {AnimationGroup} child
   */


  createClass(AnimationManager, [{
    key: 'add',
    value: function add(child) {
      var argumentsLength = arguments.length;

      if (argumentsLength > 1) {
        for (var i = 0; i < argumentsLength; i++) {
          /* eslint prefer-rest-params: 0 */
          this.add(arguments[i]);
        }
      } else {
        this.groups.push(child);
      }

      return child;
    }

    /**
     * parser a bodymovin data, and post some config for this animation group
     * @param {object} options bodymovin data
     * @param {Object} options.keyframes bodymovin data, which export from AE
     * @param {Number} [options.repeats=0] need repeat somt times?
     * @param {Boolean} [options.infinite=false] play this animation round and round forever
     * @param {Boolean} [options.alternate=false] alternate direction every round
     * @param {Number} [options.wait=0] need wait how much time to start
     * @param {Number} [options.delay=0] need delay how much time to begin, effect every round
     * @param {String} [options.prefix=''] assets url prefix, like link path
     * @param {Number} [options.timeScale=1] animation speed
     * @param {Number} [options.autoStart=true] auto start animation after assets loaded
     * @return {AnimationGroup}
     * @example
     * var manager = new PIXI.AnimationManager(app.ticker);
     * var ani = manager.parseAnimation({
     *   keyframes: data,
     *   infinite: true,
     * });
     */

  }, {
    key: 'parseAnimation',
    value: function parseAnimation(options) {
      var animate = new AnimationGroup(options);
      return this.add(animate);
    }

    /**
     * set animation speed, time scale
     * @param {number} speed
     */

  }, {
    key: 'setSpeed',
    value: function setSpeed(speed) {
      this.timeScale = speed;
    }

    /**
     * pause all animation groups
     * @return {this}
     */

  }, {
    key: 'pause',
    value: function pause() {
      this.paused = true;
      return this;
    }

    /**
     * pause all animation groups
     * @return {this}
     */

  }, {
    key: 'resume',
    value: function resume() {
      this.paused = false;
      return this;
    }

    /**
     * update
     * @private
     * @param {number} snippet
     */

  }, {
    key: 'update',
    value: function update(snippet) {
      if (this.paused) return;
      var snippetCache = this.timeScale * snippet;
      var length = this.groups.length;
      for (var i = 0; i < length; i++) {
        var animationGroup = this.groups[i];
        animationGroup.update(snippetCache);
      }
    }
  }]);
  return AnimationManager;
}();

exports.Eventer = Eventer;
exports.Animation = Animation;
exports.Tween = Tween;
exports.Utils = Utils;
exports.Texture = Texture;
exports.Loader = Loader;
exports.loaderUtil = loaderUtil;
exports.Ticker = Ticker;
exports.Bounds = Bounds;
exports.Point = Point;
exports.Rectangle = Rectangle;
exports.Matrix = Matrix;
exports.IDENTITY = IDENTITY;
exports.TEMP_MATRIX = TEMP_MATRIX;
exports.BezierCurve = BezierCurve;
exports.CatmullRom = CatmullRom;
exports.DisplayObject = DisplayObject;
exports.Container = Container;
exports.Sprite = Sprite;
exports.Graphics = Graphics;
exports.Scene = Scene;
exports.Renderer = Renderer;
exports.Application = Application;
exports.AnimationManager = AnimationManager;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=jcc2d.light.js.map
