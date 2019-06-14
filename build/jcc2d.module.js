
/**
 * jcc2d.js
 * (c) 2014-2019 jason chen
 * Released under the MIT License.
 */

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
    return this.texture ? this.texture.naturalWidth : 0;
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
    return this.texture ? this.texture.naturalHeight : 0;
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
  this.timeline();
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
 * @class
 * @memberof JC
 * @param {JC.Point} points 坐标点数组，可以是JC.Point类型的数组项数组，也可以是连续两个数分别代表x、y坐标的数组。
 */
function Polygon(points) {
  if (!Utils.isArray(points)) {
    points = new Array(arguments.length);
    /* eslint-disable */
    for (var a = 0; a < points.length; ++a) {
      points[a] = arguments[a];
    }
  }

  if (points[0] instanceof Point) {
    var p = [];
    for (var i = 0, il = points.length; i < il; i++) {
      p.push(points[i].x, points[i].y);
    }

    points = p;
  }

  this.closed = true;

  this.points = points;
}

/**
 * 克隆一个属性相同的多边型对象
 *
 * @return {PIXI.Polygon} 克隆的对象
 */
Polygon.prototype.clone = function () {
  return new Polygon(this.points.slice());
};

/**
 * 检查坐标点是否在多边形内部
 *
 * @param {number} x 坐标点的x轴坐标
 * @param {number} y 坐标点的y轴坐标
 * @return {boolean} 是否在多边形内部
 */
Polygon.prototype.contains = function (x, y) {
  var inside = false;

  var length = this.points.length / 2;

  for (var i = 0, j = length - 1; i < length; j = i++) {
    var xi = this.points[i * 2];
    var yi = this.points[i * 2 + 1];
    var xj = this.points[j * 2];
    var yj = this.points[j * 2 + 1];
    var intersect = yi > y !== yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi;

    if (intersect) {
      inside = !inside;
    }
  }

  return inside;
};

/**
 * 圆形对象
 *
 * @class
 * @memberof JC
 * @param {number} x x轴的坐标
 * @param {number} y y轴的坐标
 * @param {number} radius 圆的半径
 */
function Circle(x, y, radius) {
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
  this.radius = radius || 0;
}

/**
 * 克隆一个该圆对象
 *
 * @return {PIXI.Circle} 克隆出来的圆对象
 */
Circle.prototype.clone = function () {
  return new Circle(this.x, this.y, this.radius);
};

/**
 * 检测坐标点是否在园内
 *
 * @param {number} x 坐标点的x轴坐标
 * @param {number} y 坐标点的y轴坐标
 * @return {boolean} 坐标点是否在园内
 */
Circle.prototype.contains = function (x, y) {
  if (this.radius <= 0) {
    return false;
  }

  var dx = this.x - x;
  var dy = this.y - y;
  var r2 = this.radius * this.radius;

  dx *= dx;
  dy *= dy;

  return dx + dy <= r2;
};

/**
* 返回对象所占的矩形区域
*
* @return {PIXI.Rectangle} 矩形对象
*/
Circle.prototype.getBounds = function () {
  return new Rectangle(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
};

/**
 * 椭圆对象
 *
 * @class
 * @memberof JC
 * @param {number} x x轴的坐标
 * @param {number} y y轴的坐标
 * @param {number} width 椭圆的宽度
 * @param {number} height 椭圆的高度
 */
function Ellipse(x, y, width, height) {
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
 * 克隆一个该椭圆对象
 *
 * @return {PIXI.Ellipse} 克隆出来的椭圆对象
 */
Ellipse.prototype.clone = function () {
  return new Ellipse(this.x, this.y, this.width, this.height);
};

/**
 * 检测坐标点是否在椭园内
 *
 * @param {number} x 坐标点的x轴坐标
 * @param {number} y 坐标点的y轴坐标
 * @return {boolean} 坐标点是否在椭园内
 */
Ellipse.prototype.contains = function (x, y) {
  if (this.width <= 0 || this.height <= 0) {
    return false;
  }

  // normalize the coords to an ellipse with center 0,0
  var normx = (x - this.x) / this.width;
  var normy = (y - this.y) / this.height;

  normx *= normx;
  normy *= normy;

  return normx + normy <= 1;
};

/**
 * 返回对象所占的矩形区域
 *
 * @return {PIXI.Rectangle} 矩形对象
 */
Ellipse.prototype.getBounds = function () {
  return new Rectangle(this.x - this.width, this.y - this.height, this.width, this.height);
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

// SvgCurve.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); // NOTE: some like don`t need svg tag to wrap

/**
 *
 * @class
 * @memberof JC
 * @param {String}  path  array of points
 */
function SvgCurve(path) {
  if (Utils.isString(path)) {
    this.path = this.createPath(path);
  } else if (path.nodeName === 'path' && path.getAttribute('d')) {
    this.path = path;
  } else {
    /* eslint max-len: "off" */
    console.warn('path just accept <path d="M10 10"> element or "M10 10" string but found ' + path);
  }
  this.totalLength = this.path.getTotalLength();
}

SvgCurve.prototype = Object.create(Curve.prototype);

SvgCurve.prototype.createPath = function (d) {
  var p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  return p.setAttribute(d);
};

SvgCurve.prototype.getPoint = function (t) {
  var point = this.path.getPointAtLength(t * this.totalLength);
  return new Point(point.x, point.y);
};

var NURBSUtils = {

  /**
   * Finds knot vector span.
   * @param {number} p degree
   * @param {number} u parametric value
   * @param {number} U knot vector
   * @return {number} span
   */
  findSpan: function findSpan(p, u, U) {
    var n = U.length - p - 1;

    if (u >= U[n]) {
      return n - 1;
    }

    if (u <= U[p]) {
      return p;
    }

    var low = p;
    var high = n;
    var mid = Math.floor((low + high) / 2);

    while (u < U[mid] || u >= U[mid + 1]) {
      if (u < U[mid]) {
        high = mid;
      } else {
        low = mid;
      }

      mid = Math.floor((low + high) / 2);
    }

    return mid;
  },

  /**
   * Calculate basis functions. See The NURBS Book, page 70, algorithm A2.2
   * @param {number} span span in which u lies
   * @param {number} u parametric point
   * @param {number} p degree
   * @param {number} U knot vector
   * @return {array} array[p+1] with basis functions values.
   */
  calcBasisFunctions: function calcBasisFunctions(span, u, p, U) {
    var N = [];
    var left = [];
    var right = [];
    N[0] = 1.0;

    for (var j = 1; j <= p; ++j) {
      left[j] = u - U[span + 1 - j];
      right[j] = U[span + j] - u;

      var saved = 0.0;

      for (var r = 0; r < j; ++r) {
        var rv = right[r + 1];
        var lv = left[j - r];
        var temp = N[r] / (rv + lv);
        N[r] = saved + rv * temp;
        saved = lv * temp;
      }

      N[j] = saved;
    }

    return N;
  },

  /**
   * Calculate B-Spline curve points. See The NURBS Book, page 82
   * @param {number} p degree of B-Spline
   * @param {vector} U knot vector
   * @param {vector} P control points (x, y, z, w)
   * @param {vector} u parametric point
   * @return {point} point for given u
  */
  calcBSplinePoint: function calcBSplinePoint(p, U, P, u) {
    var span = this.findSpan(p, u, U);
    var N = this.calcBasisFunctions(span, u, p, U);
    var C = new Point(0, 0, 0, 0);

    for (var j = 0; j <= p; ++j) {
      var point = P[span - p + j];
      var Nj = N[j];
      var wNj = point.w * Nj;
      C.x += point.x * wNj;
      C.y += point.y * wNj;
      C.z += point.z * wNj;
      C.w += point.w * Nj;
    }

    return C;
  },

  /**
   * Calculate basis functions derivatives.
   * See The NURBS Book, page 72, algorithm A2.3.
   * @param {number} span span in which u lies
   * @param {number} u    parametric point
   * @param {number} p    degree
   * @param {number} n    number of derivatives to calculate
   * @param {number} U    knot vector
   * @return {array} ders
   */
  calcBasisFunctionDerivatives: function calcBasisFunctionDerivatives(span, u, p, n, U) {
    var zeroArr = [];
    var i = 0;
    for (i = 0; i <= p; ++i) {
      zeroArr[i] = 0.0;
    }

    var ders = [];
    for (i = 0; i <= n; ++i) {
      ders[i] = zeroArr.slice(0);
    }

    var ndu = [];
    for (i = 0; i <= p; ++i) {
      ndu[i] = zeroArr.slice(0);
    }

    ndu[0][0] = 1.0;

    var left = zeroArr.slice(0);
    var right = zeroArr.slice(0);
    var j = 1;
    var r = 0;
    var k = 1;

    for (j = 1; j <= p; ++j) {
      left[j] = u - U[span + 1 - j];
      right[j] = U[span + j] - u;

      var saved = 0.0;
      for (r = 0; r < j; ++r) {
        var rv = right[r + 1];
        var lv = left[j - r];
        ndu[j][r] = rv + lv;

        var temp = ndu[r][j - 1] / ndu[j][r];
        ndu[r][j] = saved + rv * temp;
        saved = lv * temp;
      }

      ndu[j][j] = saved;
    }

    for (j = 0; j <= p; ++j) {
      ders[0][j] = ndu[j][p];
    }

    for (r = 0; r <= p; ++r) {
      var s1 = 0;
      var s2 = 1;

      var a = [];
      for (i = 0; i <= p; ++i) {
        a[i] = zeroArr.slice(0);
      }
      a[0][0] = 1.0;

      for (k = 1; k <= n; ++k) {
        var d = 0.0;
        var rk = r - k;
        var pk = p - k;

        if (r >= k) {
          a[s2][0] = a[s1][0] / ndu[pk + 1][rk];
          d = a[s2][0] * ndu[rk][pk];
        }

        var j1 = rk >= -1 ? 1 : -rk;
        var j2 = r - 1 <= pk ? k - 1 : p - r;

        for (j = j1; j <= j2; ++j) {
          a[s2][j] = (a[s1][j] - a[s1][j - 1]) / ndu[pk + 1][rk + j];
          d += a[s2][j] * ndu[rk + j][pk];
        }

        if (r <= pk) {
          a[s2][k] = -a[s1][k - 1] / ndu[pk + 1][r];
          d += a[s2][k] * ndu[r][pk];
        }

        ders[k][r] = d;

        j = s1;
        s1 = s2;
        s2 = j;
      }
    }

    r = p;

    for (k = 1; k <= n; ++k) {
      for (j = 0; j <= p; ++j) {
        ders[k][j] *= r;
      }
      r *= p - k;
    }

    return ders;
  },

  /**
   * Calculate derivatives of a B-Spline.
   * See The NURBS Book, page 93, algorithm A3.2.
   * @param {number} p   degree
   * @param {number} U   knot vector
   * @param {number} P   control points
   * @param {number} u   Parametric points
   * @param {number} nd  number of derivatives
   * @return {array} array[d+1] with derivatives
   */
  calcBSplineDerivatives: function calcBSplineDerivatives(p, U, P, u, nd) {
    var du = nd < p ? nd : p;
    var CK = [];
    var span = this.findSpan(p, u, U);
    var nders = this.calcBasisFunctionDerivatives(span, u, p, du, U);
    var Pw = [];
    var point = void 0;
    var i = 0;
    var k = 0;

    for (; i < P.length; ++i) {
      point = P[i].clone();
      var w = point.w;

      point.x *= w;
      point.y *= w;
      point.z *= w;

      Pw[i] = point;
    }
    for (; k <= du; ++k) {
      point = Pw[span - p].clone().multiplyScalar(nders[k][0]);

      for (var j = 1; j <= p; ++j) {
        point.add(Pw[span - p + j].clone().multiplyScalar(nders[k][j]));
      }

      CK[k] = point;
    }

    for (k = du + 1; k <= nd + 1; ++k) {
      CK[k] = new Point(0, 0, 0);
    }

    return CK;
  },

  /*
  Calculate "K over I"
   returns k!/(i!(k-i)!)
  */
  calcKoverI: function calcKoverI(k, i) {
    var nom = 1;
    var j = 2;

    for (j = 2; j <= k; ++j) {
      nom *= j;
    }

    var denom = 1;

    for (j = 2; j <= i; ++j) {
      denom *= j;
    }

    for (j = 2; j <= k - i; ++j) {
      denom *= j;
    }

    return nom / denom;
  },

  /**
   * Calculate derivatives (0-nd) of rational curve.
   * See The NURBS Book, page 127, algorithm A4.2.
   * @param {array} Pders result of function calcBSplineDerivatives
   * @return {array} with derivatives for rational curve.
   */
  calcRationalCurveDerivatives: function calcRationalCurveDerivatives(Pders) {
    var nd = Pders.length;
    var Aders = [];
    var wders = [];
    var i = 0;

    for (i = 0; i < nd; ++i) {
      var point = Pders[i];
      Aders[i] = new Point(point.x, point.y, point.z);
      wders[i] = point.w;
    }

    var CK = [];

    for (var k = 0; k < nd; ++k) {
      var v = Aders[k].clone();

      for (i = 1; i <= k; ++i) {
        v.sub(CK[k - i].clone().multiplyScalar(this.calcKoverI(k, i) * wders[i]));
      }

      CK[k] = v.divideScalar(wders[0]);
    }

    return CK;
  },

  /**
   * Calculate NURBS curve derivatives.
   * See The NURBS Book, page 127, algorithm A4.2.
   * @param {number} p  degree
   * @param {number} U  knot vector
   * @param {number} P  control points in homogeneous space
   * @param {number} u  parametric points
   * @param {number} nd number of derivatives
   * @return {array} returns array with derivatives.
   */
  calcNURBSDerivatives: function calcNURBSDerivatives(p, U, P, u, nd) {
    var Pders = this.calcBSplineDerivatives(p, U, P, u, nd);
    return this.calcRationalCurveDerivatives(Pders);
  },

  /**
   * Calculate rational B-Spline surface point.
   * See The NURBS Book, page 134, algorithm A4.3.
   * @param {number} p degrees of B-Spline surface
   * @param {number} q degrees of B-Spline surface
   *
   * @param {number} U knot vectors
   * @param {number} V knot vectors
   *
   * @param {number} P control points (x, y, z, w)
   *
   * @param {number} u parametric values
   * @param {number} v parametric values
   * @return {JC.Point} point for given (u, v)
   */
  calcSurfacePoint: function calcSurfacePoint(p, q, U, V, P, u, v) {
    var uspan = this.findSpan(p, u, U);
    var vspan = this.findSpan(q, v, V);
    var Nu = this.calcBasisFunctions(uspan, u, p, U);
    var Nv = this.calcBasisFunctions(vspan, v, q, V);
    var temp = [];
    var l = 0;

    for (; l <= q; ++l) {
      temp[l] = new Point(0, 0, 0, 0);
      for (var k = 0; k <= p; ++k) {
        var point = P[uspan - p + k][vspan - q + l].clone();
        var w = point.w;
        point.x *= w;
        point.y *= w;
        point.z *= w;
        temp[l].add(point.multiplyScalar(Nu[k]));
      }
    }

    var Sw = new Point(0, 0, 0, 0);
    for (l = 0; l <= q; ++l) {
      Sw.add(temp[l].multiplyScalar(Nv[l]));
    }

    Sw.divideScalar(Sw.w);
    return new Point(Sw.x, Sw.y, Sw.z);
  }

};

/**
 *
 * @class
 * @memberof JC
 * @param {Number} degree
 * @param {Array}  knots           array of reals
 * @param {Array}  controlPoints   array of Point
 */
function NURBSCurve(degree, knots, controlPoints) {
  this.degree = degree;
  this.knots = knots;
  this.controlPoints = controlPoints; // [];
}

NURBSCurve.prototype = Object.create(Curve.prototype);
NURBSCurve.prototype.constructor = NURBSCurve;

NURBSCurve.prototype.getPoint = function (t) {
  var u = this.knots[0] + t * (this.knots[this.knots.length - 1] - this.knots[0]); // linear mapping t->u

  // following results in (wx, wy, wz, w) homogeneous point
  var hpoint = NURBSUtils.calcBSplinePoint(this.degree, this.knots, this.controlPoints, u);

  if (hpoint.w !== 1.0) {
    // project to 3D space: (wx, wy, wz, w) -> (x, y, z, 1)
    hpoint.divideScalar(hpoint.w);
  }

  return new Point(hpoint.x, hpoint.y, hpoint.z);
};

NURBSCurve.prototype.getTangent = function (t) {
  var u = this.knots[0] + t * (this.knots[this.knots.length - 1] - this.knots[0]);
  var ders = NURBSUtils.calcNURBSDerivatives(this.degree, this.knots, this.controlPoints, u, 1);
  var tangent = ders[1].clone();
  tangent.normalize();

  return tangent;
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
  var pt = rootMatrix || this.parent && this.parent.worldTransform || IDENTITY;
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
function Sprite(options) {
  Container.call(this);

  this._width = 0;

  this._height = 0;

  this.ready = true;

  var texture = options.texture;
  if (texture.loaded) {
    this.upTexture(options);
  } else {
    var This = this;
    this.ready = false;
    texture.on('load', function () {
      This.upTexture(options);
      This.ready = true;
    });
  }

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

/* eslint max-len: 0 */

/**
 * 文本，继承至Container
 *
 *
 * ```js
 * var text = new JC.TextFace(
 *   'JC jcc2d canvas renderer',
 *   {
 *     fontSize: '16px',
 *     ...
 *   }
 * );
 * ```
 *
 * @class
 * @extends JC.Container
 * @memberof JC
 * @param {string} text
 * @param {object} style
 * @param {string} [style.fontSize] 文字的字号
 * @param {string} [style.fontFamily] 文字的字体
 * @param {string} [style.fontStyle] 文字的 style ('normal', 'italic' or 'oblique')
 * @param {string} [style.fontWeight] 文字的 weight ('normal', 'bold', 'bolder', 'lighter' and '100', '200', '300', '400', '500', '600', '700', 800' or '900')
 * @param {boolean} [style.fill] 文字填充模式 默认为: ture
 * @param {string} [style.fillColor] 文字填充的颜色
 * @param {boolean} [style.stroke] 文字描边模式 默认为: false
 * @param {string} [style.strokeColor] 文字描边的颜色
 * @param {number} [style.lineWidth] 文字描边的宽度
 * @param {string} [style.textAlign] 文字的水平对齐方式 默认值: 'center' (top|bottom|middle|alphabetic|hanging)
 * @param {string} [style.textBaseline] 文字的垂直对齐方式 默认值: 'middle' (top|bottom|middle|alphabetic|hanging)
 */
function TextFace(text, style) {
  Container.call(this);
  this.text = text.toString();

  // ctx.font 缩写的顺序 fontStyle + fontVariant + fontWeight + fontSizeString + fontFamily
  this.fontStyle = style.fontStyle || 'normal';
  this.fontWeight = style.fontWeight || 'normal';
  this.fontSize = style.fontSize || '12px';
  this.fontFamily = style.fontFamily || 'Arial';

  this.fillColor = style.fillColor || 'black';
  this.strokeColor = style.strokeColor || 'red';

  // 对齐方式
  this.textAlign = style.textAlign || 'center';
  this.textBaseline = style.textBaseline || 'middle';

  this.lineWidth = Utils.isNumber(style.lineWidth) ? style.lineWidth : 1;

  this.stroke = Utils.isBoolean(style.stroke) ? style.stroke : false;

  this.fill = Utils.isBoolean(style.fill) ? style.fill : true;

  // ctx.measureText(str); // 返回指定文本的宽度
}
TextFace.prototype = Object.create(Container.prototype);

/**
 * 更新对象本身的矩阵姿态以及透明度
 *
 * @method updateMe
 * @private
 * @param {context} ctx
 */
TextFace.prototype.renderMe = function (ctx) {
  ctx.font = this.fontStyle + ' ' + this.fontWeight + ' ' + this.fontSize + ' ' + this.fontFamily;
  ctx.textAlign = this.textAlign;
  ctx.textBaseline = this.textBaseline;
  if (this.fill) {
    ctx.fillStyle = this.fillColor;
    ctx.fillText(this.text, 0, 0);
  }
  if (this.stroke) {
    ctx.lineWidth = this.lineWidth;
    ctx.strokeStyle = this.strokeColor;
    ctx.strokeText(this.text, 0, 0);
  }
};

/**
 *
 * @class
 * @memberof JC
 * @param {number} blurX x轴的模糊值
 * @param {number} blurY y轴的模糊值
 * @param {number} quality 模糊的质量，模糊计算会被递归多少次
 */
function FilterGroup() {
  Container.call(this);

  /**
   * 帧缓冲区
   * @property frameBuffer
   * @default FrameBuffer
   * @type FrameBuffer
   **/
  this.frameBuffer = new FrameBuffer();

  /**
   * 帧缓冲区
   * @property frameBuffer
   * @default []
   * @type {FrameBuffer}
   **/
  this.filters = [];

  /**
   * 下一帧的图像需要更新
   * @property needUpdateBuffer
   * @default false
   * @type Boolean
   **/
  this.needUpdateBuffer = true;

  /**
   * 每一帧渲染都重新绘制
   * @property autoUpdateBuffer
   * @default false
   * @type Boolean
   **/
  this.autoUpdateBuffer = false;

  /**
   * 时候给帧缓冲区加padding
   * @property padding
   * @default {x:0,y:0}
   * @type Object
   **/
  this.padding = {
    x: 0,
    y: 0
  };
}

FilterGroup.prototype = Object.create(Container.prototype);

FilterGroup.prototype.updatePosture = function () {
  if (this.souldSort) this._sortList();
  this.updateTransform();

  if (this.needUpdateBuffer || this.autoUpdateBuffer) {
    this.cacheMatrix = this.worldTransform;
    this.worldTransform = __tmpMatrix.identity();
    this._upc();

    this.calculateBounds();
    this.__o = this.bounds.getRectangle();

    this.__o.px = this.padding.x;
    this.__o.py = this.padding.y;

    // 保证子级是以(0, 0)点写入帧缓冲区
    this.worldTransform.translate(-this.__o.x + this.__o.px, -this.__o.y + this.__o.py);
    this._upc();

    this.worldTransform = this.cacheMatrix;
  } else {
    this._upc();
  }
};

FilterGroup.prototype._upc = function () {
  var i = 0;
  var l = this.childs.length;
  while (i < l) {
    var child = this.childs[i];
    child.updatePosture();
    i++;
  }
};

FilterGroup.prototype.addFilter = function (filter, idx) {
  if (idx >= 0) {
    this.filters.splice(idx, 0, filter);
  } else if (Utils.isUndefined(idx)) {
    this.filters.push(filter);
  } else {
    console.warn('add filter error');
  }
};

FilterGroup.prototype.render = function (ctx) {
  ctx.save();
  if (this.needUpdateBuffer || this.autoUpdateBuffer) {
    var i = 0;
    var l = this.childs.length;
    var child = null;

    this.frameBuffer.clear();
    this.frameBuffer.setSize(this.__o);
    for (i = 0; i < l; i++) {
      child = this.childs[i];
      if (!child.isVisible()) continue;
      child.render(this.frameBuffer.ctx);
    }
    this.filtersRunner(this.frameBuffer.getBuffer());

    this.needUpdateBuffer = false;
  }
  this.renderMe(ctx);
  ctx.restore();
};

FilterGroup.prototype.renderMe = function (ctx) {
  var x = this.__o.x - this.__o.px;
  var y = this.__o.y - this.__o.py;
  var w = this.frameBuffer.width;
  var h = this.frameBuffer.height;
  this.setTransform(ctx);
  if (this.mask) this.mask.render(ctx);
  ctx.drawImage(this.frameBuffer.putBuffer(), 0, 0, w, h, x, y, w, h);
};

FilterGroup.prototype.filtersRunner = function (buffer) {
  if (this.filters.length === 0) return;
  this.filters.forEach(function (filter) {
    filter.applyFilter(buffer);
  });
};

var __tmpMatrix = new Matrix();

/**
 *
 * @class
 * @memberof JC
 * @param {number} blurX x轴的模糊值
 * @param {number} blurY y轴的模糊值
 * @param {number} quality 模糊的质量，模糊计算会被递归多少次
 */
function BlurFilter(blurX, blurY, quality) {
    if (Utils.isNumber(blurX) || blurX < 0) blurX = 0;
    if (Utils.isNumber(blurY) || blurY < 0) blurY = 0;
    if (Utils.isNumber(quality) || quality < 1) quality = 1;

    /**
     * x轴的模糊值
     * @property blurX
     * @default 0
     * @type Number
     **/
    this.blurX = blurX | 0;

    /**
     * y轴的模糊值
     * @property blurY
     * @default 0
     * @type Number
     **/
    this.blurY = blurY | 0;

    /**
     * 模糊的质量，模糊计算会被递归多少次
     * @property quality
     * @default 1
     * @type Number
     **/
    this.quality = quality | 0;
}

/**
 * 对渲染对象进行x、y轴同时设置模糊半径
 *
 * @member {number}
 * @name blur
 * @memberof JC.BlurFilter#
 */
Object.defineProperty(BlurFilter.prototype, 'blur', {
    get: function get() {
        return this.blurX;
    },
    set: function set(blur) {
        this.blurX = this.blurY = blur;
    }
});

/* eslint max-len: "off" */
var MUL_TABLE = [1, 171, 205, 293, 57, 373, 79, 137, 241, 27, 391, 357, 41, 19, 283, 265, 497, 469, 443, 421, 25, 191, 365, 349, 335, 161, 155, 149, 9, 278, 269, 261, 505, 245, 475, 231, 449, 437, 213, 415, 405, 395, 193, 377, 369, 361, 353, 345, 169, 331, 325, 319, 313, 307, 301, 37, 145, 285, 281, 69, 271, 267, 263, 259, 509, 501, 493, 243, 479, 118, 465, 459, 113, 446, 55, 435, 429, 423, 209, 413, 51, 403, 199, 393, 97, 3, 379, 375, 371, 367, 363, 359, 355, 351, 347, 43, 85, 337, 333, 165, 327, 323, 5, 317, 157, 311, 77, 305, 303, 75, 297, 294, 73, 289, 287, 71, 141, 279, 277, 275, 68, 135, 67, 133, 33, 262, 260, 129, 511, 507, 503, 499, 495, 491, 61, 121, 481, 477, 237, 235, 467, 232, 115, 457, 227, 451, 7, 445, 221, 439, 218, 433, 215, 427, 425, 211, 419, 417, 207, 411, 409, 203, 202, 401, 399, 396, 197, 49, 389, 387, 385, 383, 95, 189, 47, 187, 93, 185, 23, 183, 91, 181, 45, 179, 89, 177, 11, 175, 87, 173, 345, 343, 341, 339, 337, 21, 167, 83, 331, 329, 327, 163, 81, 323, 321, 319, 159, 79, 315, 313, 39, 155, 309, 307, 153, 305, 303, 151, 75, 299, 149, 37, 295, 147, 73, 291, 145, 289, 287, 143, 285, 71, 141, 281, 35, 279, 139, 69, 275, 137, 273, 17, 271, 135, 269, 267, 133, 265, 33, 263, 131, 261, 130, 259, 129, 257, 1];

var SHG_TABLE = [0, 9, 10, 11, 9, 12, 10, 11, 12, 9, 13, 13, 10, 9, 13, 13, 14, 14, 14, 14, 10, 13, 14, 14, 14, 13, 13, 13, 9, 14, 14, 14, 15, 14, 15, 14, 15, 15, 14, 15, 15, 15, 14, 15, 15, 15, 15, 15, 14, 15, 15, 15, 15, 15, 15, 12, 14, 15, 15, 13, 15, 15, 15, 15, 16, 16, 16, 15, 16, 14, 16, 16, 14, 16, 13, 16, 16, 16, 15, 16, 13, 16, 15, 16, 14, 9, 16, 16, 16, 16, 16, 16, 16, 16, 16, 13, 14, 16, 16, 15, 16, 16, 10, 16, 15, 16, 14, 16, 16, 14, 16, 16, 14, 16, 16, 14, 15, 16, 16, 16, 14, 15, 14, 15, 13, 16, 16, 15, 17, 17, 17, 17, 17, 17, 14, 15, 17, 17, 16, 16, 17, 16, 15, 17, 16, 17, 11, 17, 16, 17, 16, 17, 16, 17, 17, 16, 17, 17, 16, 17, 17, 16, 16, 17, 17, 17, 16, 14, 17, 17, 17, 17, 15, 16, 14, 16, 15, 16, 13, 16, 15, 16, 14, 16, 15, 16, 12, 16, 15, 16, 17, 17, 17, 17, 17, 13, 16, 15, 17, 17, 17, 16, 15, 17, 17, 17, 16, 15, 17, 17, 14, 16, 17, 17, 16, 17, 17, 16, 15, 17, 16, 14, 17, 16, 15, 17, 16, 17, 17, 16, 17, 15, 16, 17, 14, 17, 16, 15, 17, 16, 17, 13, 17, 16, 17, 17, 16, 17, 14, 17, 16, 17, 16, 17, 16, 17, 9];

/* eslint-disable */
BlurFilter.prototype.applyFilter = function (imageData) {

    var radiusX = this.blurX >> 1;
    if (isNaN(radiusX) || radiusX < 0) return false;
    var radiusY = this.blurY >> 1;
    if (isNaN(radiusY) || radiusY < 0) return false;
    if (radiusX == 0 && radiusY == 0) return false;

    var iterations = this.quality;
    if (isNaN(iterations) || iterations < 1) iterations = 1;
    iterations |= 0;
    if (iterations > 3) iterations = 3;
    if (iterations < 1) iterations = 1;

    var px = imageData.data;
    var x = 0,
        y = 0,
        i = 0,
        p = 0,
        yp = 0,
        yi = 0,
        yw = 0,
        r = 0,
        g = 0,
        b = 0,
        a = 0,
        pr = 0,
        pg = 0,
        pb = 0,
        pa = 0;

    var divx = radiusX + radiusX + 1 | 0;
    var divy = radiusY + radiusY + 1 | 0;
    var w = imageData.width | 0;
    var h = imageData.height | 0;

    var w1 = w - 1 | 0;
    var h1 = h - 1 | 0;
    var rxp1 = radiusX + 1 | 0;
    var ryp1 = radiusY + 1 | 0;

    var ssx = { r: 0, b: 0, g: 0, a: 0 };
    var sx = ssx;
    for (i = 1; i < divx; i++) {
        sx = sx.n = { r: 0, b: 0, g: 0, a: 0 };
    }
    sx.n = ssx;

    var ssy = { r: 0, b: 0, g: 0, a: 0 };
    var sy = ssy;
    for (i = 1; i < divy; i++) {
        sy = sy.n = { r: 0, b: 0, g: 0, a: 0 };
    }
    sy.n = ssy;

    var si = null;

    var mtx = MUL_TABLE[radiusX] | 0;
    var stx = SHG_TABLE[radiusX] | 0;
    var mty = MUL_TABLE[radiusY] | 0;
    var sty = SHG_TABLE[radiusY] | 0;

    while (iterations-- > 0) {

        yw = yi = 0;
        var ms = mtx;
        var ss = stx;
        for (y = h; --y > -1;) {
            r = rxp1 * (pr = px[yi | 0]);
            g = rxp1 * (pg = px[yi + 1 | 0]);
            b = rxp1 * (pb = px[yi + 2 | 0]);
            a = rxp1 * (pa = px[yi + 3 | 0]);

            sx = ssx;

            for (i = rxp1; --i > -1;) {
                sx.r = pr;
                sx.g = pg;
                sx.b = pb;
                sx.a = pa;
                sx = sx.n;
            }

            for (i = 1; i < rxp1; i++) {
                p = yi + ((w1 < i ? w1 : i) << 2) | 0;
                r += sx.r = px[p];
                g += sx.g = px[p + 1];
                b += sx.b = px[p + 2];
                a += sx.a = px[p + 3];

                sx = sx.n;
            }

            si = ssx;
            for (x = 0; x < w; x++) {
                px[yi++] = r * ms >>> ss;
                px[yi++] = g * ms >>> ss;
                px[yi++] = b * ms >>> ss;
                px[yi++] = a * ms >>> ss;

                p = yw + ((p = x + radiusX + 1) < w1 ? p : w1) << 2;

                r -= si.r - (si.r = px[p]);
                g -= si.g - (si.g = px[p + 1]);
                b -= si.b - (si.b = px[p + 2]);
                a -= si.a - (si.a = px[p + 3]);

                si = si.n;
            }
            yw += w;
        }

        ms = mty;
        ss = sty;
        for (x = 0; x < w; x++) {
            yi = x << 2 | 0;

            r = ryp1 * (pr = px[yi]) | 0;
            g = ryp1 * (pg = px[yi + 1 | 0]) | 0;
            b = ryp1 * (pb = px[yi + 2 | 0]) | 0;
            a = ryp1 * (pa = px[yi + 3 | 0]) | 0;

            sy = ssy;
            for (i = 0; i < ryp1; i++) {
                sy.r = pr;
                sy.g = pg;
                sy.b = pb;
                sy.a = pa;
                sy = sy.n;
            }

            yp = w;

            for (i = 1; i <= radiusY; i++) {
                yi = yp + x << 2;

                r += sy.r = px[yi];
                g += sy.g = px[yi + 1];
                b += sy.b = px[yi + 2];
                a += sy.a = px[yi + 3];

                sy = sy.n;

                if (i < h1) {
                    yp += w;
                }
            }

            yi = x;
            si = ssy;
            if (iterations > 0) {
                for (y = 0; y < h; y++) {
                    p = yi << 2;
                    px[p + 3] = pa = a * ms >>> ss;
                    if (pa > 0) {
                        px[p] = r * ms >>> ss;
                        px[p + 1] = g * ms >>> ss;
                        px[p + 2] = b * ms >>> ss;
                    } else {
                        px[p] = px[p + 1] = px[p + 2] = 0;
                    }

                    p = x + ((p = y + ryp1) < h1 ? p : h1) * w << 2;

                    r -= si.r - (si.r = px[p]);
                    g -= si.g - (si.g = px[p + 1]);
                    b -= si.b - (si.b = px[p + 2]);
                    a -= si.a - (si.a = px[p + 3]);

                    si = si.n;

                    yi += w;
                }
            } else {
                for (y = 0; y < h; y++) {
                    p = yi << 2;
                    px[p + 3] = pa = a * ms >>> ss;
                    if (pa > 0) {
                        pa = 255 / pa;
                        px[p] = (r * ms >>> ss) * pa;
                        px[p + 1] = (g * ms >>> ss) * pa;
                        px[p + 2] = (b * ms >>> ss) * pa;
                    } else {
                        px[p] = px[p + 1] = px[p + 2] = 0;
                    }

                    p = x + ((p = y + ryp1) < h1 ? p : h1) * w << 2;

                    r -= si.r - (si.r = px[p]);
                    g -= si.g - (si.g = px[p + 1]);
                    b -= si.b - (si.b = px[p + 2]);
                    a -= si.a - (si.a = px[p + 3]);

                    si = si.n;

                    yi += w;
                }
            }
        }
    }
    return true;
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

Renderer.prototype.render = function (scene, snippet) {
  this.currentScene = scene;

  this.emit('preupdate', snippet);
  this.currentScene.updateTimeline(snippet);
  this.currentScene.updatePosture(this.rootMatrix);
  this.emit('postupdate', snippet);

  this.emit('prerender', snippet);
  if (this.autoClear) {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
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
  var pre = start;
  for (; j < jLen; j++) {
    var _oj = data.o[j - 1];
    var _ij = data.i[j];
    var _vj = data.v[j];
    ctx.bezierCurveTo(pre[0] + _oj[0], pre[1] + _oj[1], _vj[0] + _ij[0], _vj[1] + _ij[1], _vj[0], _vj[1]);
    pre = _vj;
  }
  var oj = data.o[j - 1];
  var ij = data.i[0];
  var vj = data.v[0];
  ctx.bezierCurveTo(pre[0] + oj[0], pre[1] + oj[1], vj[0] + ij[0], vj[1] + ij[1], vj[0], vj[1]);
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

/**
 * CurveShape
 * @class
 * @private
 */

var CurveShape = function (_CurveData) {
  inherits(CurveShape, _CurveData);

  /**
   * CurveShape
   * @param {object} data curve config data
   * @param {object} session session
   * @param {boolean} mask is mask or not
   */
  function CurveShape(data, session) {
    classCallCheck(this, CurveShape);

    var _this = possibleConstructorReturn(this, (CurveShape.__proto__ || Object.getPrototypeOf(CurveShape)).call(this, data, session));

    _this.curve = null;
    return _this;
  }

  /**
   * update curve by progress
   * @param {number} progress progress
   */


  createClass(CurveShape, [{
    key: 'update',
    value: function update(progress) {
      this.curve = this.getCurve(progress);
    }

    /**
     * a
     * @param {*} ctx a
     */

  }, {
    key: 'render',
    value: function render(ctx) {
      drawCurve(ctx, this.curve);
    }
  }]);
  return CurveShape;
}(CurveData);

// import EllipseShape from './EllipseShape';
// import RectShape from './RectShape';
// import StartShape from './StartShape';

/**
 * getShape
 * @ignore
 * @param {*} item data
 * @param {*} session session
 * @return {shape}
 */
function getShape(item, session) {
  var shape = null;
  switch (item.ty) {
    case 'sh':
      shape = new CurveShape(item, session);
      break;
    // case 'el':
    //   shape = new EllipseShape(item, session);
    //   break;
    // case 'rc':
    //   shape = new RectShape(item, session);
    //   break;
    // case 'sr':
    //   shape = new StartShape(item, session);
    //   break;
    default:
      break;
  }
  return shape;
}

/**
 * translate rgba array to hex
 * @ignore
 * @param {array} color an array with rgba
 * @param {*} _ just a placeholder param
 * @return {hex}
 */
function toColor(color, _) {
  color = color.slice(0, 3);
  return color.map(function (c) {
    return c * 255 >> 0;
  });
}

/**
 * just return the value * 2.55 >> 0
 * @ignore
 * @param {array} value an array with some number value
 * @param {*} _ just a placeholder param
 * @return {number}
 */
function to255(value, _) {
  return value[0] * 2.55 >> 0;
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

var FILL_MAP = {
  o: {
    props: ['alpha'],
    translate: to255
  },
  c: {
    props: ['color'],
    translate: toColor
  }
};

var STROKE_MAP = {
  o: {
    props: ['alpha'],
    translate: to255
  },
  c: {
    props: ['color'],
    translate: toColor
  },
  w: {
    props: ['lineWidth'],
    translate: toBack
  }
};

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
 * Fill keyframes class
 * @class
 * @private
 */

var Fill = function () {
  /**
   * generate a fill-type keyframes buffer
   * @param {object} item item data
   * @param {object} session now session
   * @param {object} session.size time of pre-frame
   * @param {number} session.st time of start position
   */
  function Fill(item, session) {
    classCallCheck(this, Fill);
    var _session$st = session.st,
        st = _session$st === undefined ? 0 : _session$st;

    this.item = item;

    this.alpha = 255;
    this.color = [0, 0, 0];

    this.st = st;
    this.aks = {};
    this.kic = {};

    this.preParse(item);
  }

  /**
   * preParse
   * @param {object} item fill tiem config
   */


  createClass(Fill, [{
    key: 'preParse',
    value: function preParse(item) {
      for (var key in FILL_MAP) {
        if (item[key] && item[key].a) {
          this.parseDynamic(key);
        } else if (item[key]) {
          this.parseStatic(key);
        }
      }
    }

    /**
     * parse dynamic property
     * @param {string} key property name
     */

  }, {
    key: 'parseDynamic',
    value: function parseDynamic(key) {
      var prop = this.item[key];
      var propk = prop.k;
      var last = propk.length - 1;

      prop.ost = this.st + propk[0].t;
      prop.oet = this.st + propk[last].t;

      for (var i = 0; i < last; i++) {
        var sbk = propk[i];
        var sek = propk[i + 1];

        sbk.ost = this.st + sbk.t;
        sbk.oet = this.st + sek.t;

        prepareEaseing(sbk.o.x, sbk.o.y, sbk.i.x, sbk.i.y);
      }
      this.aks[key] = prop;
    }

    /**
     * parse static property
     * @param {string} key property name
     */

  }, {
    key: 'parseStatic',
    value: function parseStatic(key) {
      var propk = this.item[key].k;
      if (Utils.isNumber(propk)) propk = [propk];
      this.setValue(key, propk);
    }

    /**
     * update fill information
     * @param {number} progress progress
     * @param {object} session update session
     */

  }, {
    key: 'update',
    value: function update(progress, session) {
      for (var key in this.aks) {
        if (this.aks[key]) {
          var value = interpolation(this.aks[key], progress, this.kic, key);
          this.setValue(key, value);
        }
      }

      // this.element.beginFill(this.color, this.alpha);
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
      var _FILL_MAP$key = FILL_MAP[key],
          props = _FILL_MAP$key.props,
          translate = _FILL_MAP$key.translate;

      for (var i = 0; i < props.length; i++) {
        this[props[i]] = translate(value, i);
      }
    }

    /**
     * a
     * @param {*} ctx a
     */

  }, {
    key: 'render',
    value: function render(ctx) {
      ctx.fillStyle = 'rgba(' + this.color.join(', ') + ', ' + this.alpha + ')';
    }
  }]);
  return Fill;
}();

/**
 * Stroke
 * @class
 * @private
 */

var Stroke = function () {
  /**
   * generate a keyframes buffer
   * @param {object} item item data
   * @param {object} session now session
   * @param {object} session.size time of pre-frame
   * @param {number} session.st time of start position
   */
  function Stroke(item, session) {
    classCallCheck(this, Stroke);
    var _session$st = session.st,
        st = _session$st === undefined ? 0 : _session$st;

    this.item = item;

    this.alpha = 255;
    this.lineWidth = 1;
    this.color = [0, 0, 0];

    this.st = st;
    this.aks = {};
    this.kic = {};

    this.preParse(item);
  }

  /**
   * preParse
   * @param {object} item fill tiem config
   */


  createClass(Stroke, [{
    key: 'preParse',
    value: function preParse(item) {
      for (var key in STROKE_MAP) {
        if (item[key] && item[key].a) {
          this.parseDynamic(key);
        } else if (item[key]) {
          this.parseStatic(key);
        }
      }
    }

    /**
     * parse dynamic property
     * @param {string} key property name
     */

  }, {
    key: 'parseDynamic',
    value: function parseDynamic(key) {
      var prop = this.item[key];
      var propk = prop.k;
      var last = propk.length - 1;

      prop.ost = this.st + propk[0].t;
      prop.oet = this.st + propk[last].t;

      for (var i = 0; i < last; i++) {
        var sbk = propk[i];
        var sek = propk[i + 1];

        sbk.ost = this.st + sbk.t;
        sbk.oet = this.st + sek.t;

        prepareEaseing(sbk.o.x, sbk.o.y, sbk.i.x, sbk.i.y);
      }
      this.aks[key] = prop;
    }

    /**
     * parse static property
     * @param {string} key property name
     */

  }, {
    key: 'parseStatic',
    value: function parseStatic(key) {
      var propk = this.item[key].k;
      if (Utils.isNumber(propk)) propk = [propk];
      this.setValue(key, propk);
    }

    /**
     * update fill information
     * @param {number} progress progress
     * @param {object} session update session
     */

  }, {
    key: 'update',
    value: function update(progress, session) {
      for (var key in this.aks) {
        if (this.aks[key]) {
          var value = interpolation(this.aks[key], progress, this.kic, key);
          this.setValue(key, value);
        }
      }
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
      var _STROKE_MAP$key = STROKE_MAP[key],
          props = _STROKE_MAP$key.props,
          translate = _STROKE_MAP$key.translate;

      for (var i = 0; i < props.length; i++) {
        this[props[i]] = translate(value, i);
      }
    }

    /**
     * a
     * @param {*} ctx a
     */

  }, {
    key: 'render',
    value: function render(ctx) {
      ctx.strokeStyle = 'rgba(' + this.color.join(', ') + ', ' + this.alpha + ')';
      ctx.lineWidth = this.lineWidth;
    }
  }]);
  return Stroke;
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

/**
 * Graphics class
 * @class
 * @private
 */

var Graphics$1 = function (_Container) {
  inherits(Graphics, _Container);

  /**
   * Graphics constructor
   * @param {object} layer layer data information
   * @param {object} items items data information
   * @param {object} session layer data information
   */
  function Graphics(layer, items) {
    var session = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    classCallCheck(this, Graphics);

    var _this = possibleConstructorReturn(this, (Graphics.__proto__ || Object.getPrototypeOf(Graphics)).call(this));

    _this.fill = null;
    _this.stroke = null;
    _this.shape = null;

    _this.layer = layer;
    _this.itemCache = [];

    _this.parseItems(items.it, session);
    return _this;
  }

  /**
   * parseItems
   * @param {object} items items
   * @param {object} session session
   */


  createClass(Graphics, [{
    key: 'parseItems',
    value: function parseItems(items, session) {
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.ty == 'tr') {
          var ip = this.layer.ip;
          var op = this.layer.op;
          this.itemCache.push(new Transform(this, { ks: item, ip: ip, op: op }, session));
        } else if (item.ty == 'sh' || item.ty == 'el' || item.ty == 'rc' || item.ty == 'sr') {
          var shape = getShape(item, session);
          if (!shape) continue;
          this.shape = shape;
          this.itemCache.push(this.shape);
        } else if (items[i].ty == 'fl') {
          this.fill = new Fill(item, session);
          this.itemCache.push(this.fill);
        } else if (items[i].ty == 'st') {
          this.stroke = new Stroke(item, session);
          this.itemCache.push(this.stroke);
        } else if (items[i].ty == 'tm') {
          // TODO:
        }
      }
    }

    /**
     * update
     * @param {number} progress
     * @param {object} session update session
     */

  }, {
    key: 'update',
    value: function update(progress, session) {
      for (var i = 0; i < this.itemCache.length; i++) {
        this.itemCache[i].update(progress, session);
      }
    }

    /**
     * render content
     * @param {object} ctx
     */

  }, {
    key: 'renderMe',
    value: function renderMe(ctx) {
      if (this.fill) this.fill.render(ctx);
      if (this.stroke) this.stroke.render(ctx);
      if (this.shape) {
        ctx.beginPath();
        this.shape.render(ctx);
      }
      if (this.fill) ctx.fill();
      if (this.stroke) ctx.stroke();
    }
  }]);
  return Graphics;
}(Container);

/**
 * Shapes
 * @class
 * @private
 */

var Shapes = function () {
  /**
   * generate a keyframes buffer
   * @param {Container} element host element
   * @param {object} layer layer data
   * @param {object} session now session
   * @param {object} session.size time of pre-frame
   * @param {number} session.st time of start position
   */
  function Shapes(element, layer, session) {
    classCallCheck(this, Shapes);

    this.element = element;
    this.shapes = [];
    this.createShapes(layer, session);
  }

  /**
   * createShapes
   * @param {object} layer layer data
   * @param {object} session now session
   */


  createClass(Shapes, [{
    key: 'createShapes',
    value: function createShapes(layer, session) {
      var shapes = layer.shapes;
      for (var i = 0; i < shapes.length; i++) {
        var shape = shapes[i];
        if (shape.ty === 'gr') {
          var ge = new Graphics$1(layer, shape, session);
          this.element.adds(ge);
          this.shapes.push(ge);
        }
      }
    }

    /**
     * update
     * @param {number} progress progress
     * @param {object} session update session
     */

  }, {
    key: 'update',
    value: function update(progress, session) {
      for (var i = 0; i < this.shapes.length; i++) {
        this.shapes[i].update(progress, session);
      }
    }
  }]);
  return Shapes;
}();

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
      if (layer.shapes) this.shapes(element, layer, session);
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

  }, {
    key: 'shapes',
    value: function shapes(element, layer, session) {
      this.add(new Shapes(element, layer, session));
    }

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

    register.setLayer(_this.name, _this);

    _this.initKeyFrames(layer, session);
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
          var parent = elementsMap[layer.parent];
          parent.adds(item);
        } else {
          this.adds(item);
        }
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
          case 2:
            element = new SpriteElement(layer, session);
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
   */
  function AnimationGroup(options) {
    var _this = this;

    classCallCheck(this, AnimationGroup);

    this.prefix = options.prefix || options.keyframes.prefix || '';
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

    this.register.loader.once('complete', function () {
      _this._paused = Utils.isBoolean(options.autoStart) ? !options.autoStart : false;
    });

    this.group = new CompElement(this.keyframes.layers, {
      assets: this.keyframes.assets,
      size: { w: this.keyframes.w, h: this.keyframes.h },
      prefix: this.prefix,
      register: this.register,
      parentName: this.keyframes.nm
    });
    this.group._aniRoot = true;

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

export { Eventer, Animation, Tween, Utils, Texture, Loader, loaderUtil, Ticker, Bounds, Point, Rectangle, Polygon, Circle, Ellipse, Matrix, IDENTITY, TEMP_MATRIX, CatmullRom, BezierCurve, SvgCurve, NURBSCurve, DisplayObject, Container, Sprite, Graphics, TextFace, FilterGroup, BlurFilter, Scene, Renderer, Application, AnimationManager };
//# sourceMappingURL=jcc2d.module.js.map
