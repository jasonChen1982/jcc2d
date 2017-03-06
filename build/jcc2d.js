(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.JC = global.JC || {})));
}(this, (function (exports) { 'use strict';

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||
            window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }

    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }

    window.RAF = window.requestAnimationFrame;
    window.CAF = window.cancelAnimationFrame;
})();

/**
 * 二维空间内坐标点类
 *
 * @class
 * @memberof JC
 * @param [x=0] {number} x轴的位置
 * @param [y=0] {number} y轴的位置
 */
function Point(x, y)
{
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
}

/**
 * 克隆一这个坐标点
 *
 * @return {JC.Point} 克隆的坐标点
 */
Point.prototype.clone = function ()
{
    return new Point(this.x, this.y);
};

/**
 * 拷贝传入的坐标点来设置当前坐标点
 *
 * @param p {JC.Point}
 */
Point.prototype.copy = function (p) {
    this.set(p.x, p.y);
};

/**
 * 判断坐标点是否相等
 *
 * @param p {JC.Point}
 * @returns {boolean}
 */
Point.prototype.equals = function (p) {
    return (p.x === this.x) && (p.y === this.y);
};

/**
 * 设置坐标点
 *
 * @param [x=0] {number} x轴的位置
 * @param [y=0] {number} y轴的位置
 */
Point.prototype.set = function (x, y)
{
    this.x = x || 0;
    this.y = y || ( (y !== 0) ? this.x : 0 ) ;
};

/**
 * 事件系统的事件消息对象的基本类型
 *
 * @class
 * @memberof JC
 */
function InteractionData(){
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
InteractionData.prototype.clone = function() {
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

/* eslint no-cond-assign: "off" */


/**
 * TWEEN 缓动时间运动函数集合
 *
 * ```js
 * dispay.fromTo({
 *   from: {x: 100},
 *   to: {x: 200},
 *   ease: 'linear' // 配置要调用的运动函数
 * })
 * ```
 * @namespace JC.TWEEN
 */

var TWEEN = {
    /**
     * 匀速运动函数
     *
     * @static
     * @memberof JC.TWEEN
     */
    linear: function (t, b, c, d){
        return c*t/d + b;
    },

    /**
     * 加速运动函数
     *
     * @static
     * @memberof JC.TWEEN
     */
    easeIn: function(t, b, c, d){
        return c*(t/=d)*t + b;
    },

    /**
     * 减速运动函数
     *
     * @static
     * @memberof JC.TWEEN
     */
    easeOut: function(t, b, c, d){
        return -c *(t/=d)*(t-2) + b;
    },

    /**
     * 先加速再减速运动函数
     *
     * @static
     * @memberof JC.TWEEN
     */
    easeBoth: function(t, b, c, d){
        if ((t/=d/2) < 1) {
            return c/2*t*t + b;
        }
        return -c/2 * ((--t)*(t-2) - 1) + b;
    },

    /**
     * 扩展运动函数
     *
     * ```js
     * JC.TWEEN.extend({
     *   elasticIn: function(t, b, c, d){....},
     *   elasticOut: function(t, b, c, d){....},
     *   ......
     * })
     * ```
     * @static
     * @memberof JC.TWEEN
     */
    extend: function(opts){
        if(!opts)return;
        for(var key in opts){
            if(key!=='extend'&&opts[key])this[key]=opts[key];
        }
    }
};

function _rt(val){
    return Object.prototype.toString.call(val);
}

/**
 * UTILS 引擎工具箱
 *
 * @namespace JC.UTILS
 */
var UTILS = {
    /**
     * 简单拷贝纯数据的JSON对象
     *
     * @static
     * @memberof JC.UTILS
     * @param {JSON} json 待拷贝的纯数据JSON
     * @return {JSON} 拷贝后的纯数据JSON
     */
    copyJSON: function(json){
        return JSON.parse(JSON.stringify(json));
    },

    /**
     * 将角度转化成弧度的乘法因子
     *
     * @static
     * @memberof JC.UTILS
     * @type {number}
     */
    DTR: Math.PI/180,

    /**
     * 将弧度转化成角度的乘法因子
     *
     * @static
     * @memberof JC.UTILS
     * @type {number}
     */
    RTD: 180/Math.PI,

    /**
     * 判断变量是否为数组类型
     *
     * @static
     * @method
     * @memberof JC.UTILS
     * @param {Array} variable 待判断的变量
     * @return {Boolean} 判断的结果
     */
    isArray: (function(){
        var ks = _rt([]);
        return function(object){
            return _rt(object) === ks;
        };
    })(),

    /**
     * 判断变量是否为对象类型
     *
     * @static
     * @method
     * @memberof JC.UTILS
     * @param {Object} variable 待判断的变量
     * @return {Boolean} 判断的结果
     */
    isObject: (function(){
        var ks = _rt({});
        return function(object){
            return _rt(object) === ks;
        };
    })(),

    /**
     * 判断变量是否为字符串类型
     *
     * @static
     * @method
     * @memberof JC.UTILS
     * @param {String} variable 待判断的变量
     * @return {Boolean} 判断的结果
     */
    isString: (function(){
        var ks = _rt('s');
        return function(object){
            return _rt(object) === ks;
        };
    })(),

    /**
     * 判断变量是否为数字类型
     *
     * @static
     * @method
     * @memberof JC.UTILS
     * @param {Number} variable 待判断的变量
     * @return {Boolean} 判断的结果
     */
    isNumber: (function(){
        var ks = _rt(1);
        return function(object){
            return _rt(object) === ks;
        };
    })(),

    /**
     * 判断变量是否为函数类型
     *
     * @static
     * @method
     * @memberof JC.UTILS
     * @param {Function} variable 待判断的变量
     * @return {Boolean} 判断的结果
     */
    isFunction: (function(){
        var ks = _rt(function(){});
        return function(object){
            return _rt(object) === ks;
        };
    })(),

    /**
     * 强化的随机数，可以随机产生给定区间内的数字、随机输出数字内的项
     *
     * @static
     * @method
     * @memberof JC.UTILS
     * @param {Array | Number} min 当只传入一个变量时变量应该为数字，否则为所给定区间较小的数字
     * @param {Number} max 所给定区间较大的数字
     * @return {ArrayItem | Number} 返回数组中大一项或者给定区间内的数字
     */
    random: function(min, max){
        if (this.isArray(min))
            return min[~~(Math.random() * min.length)];
        if (!this.isNumber(max))
            max = min || 1, min = 0;
        return min + Math.random() * (max - min);
    },

    /**
     * 阿基米德求模
     *
     * @static
     * @method
     * @memberof JC.UTILS
     * @param {Number} n 索引
     * @param {Number} m 模
     * @return {Number} 映射到模长内到索引
     */
    euclideanModulo: function(n, m){
        return ((n % m) + m) % m;
    },

    /**
     * 数字区间闭合，避免超出区间
     *
     * @static
     * @method
     * @memberof JC.UTILS
     * @param {Number} x 待闭合到值
     * @param {Number} a 闭合区间左边界
     * @param {Number} b 闭合区间右边界
     * @return {Number} 闭合后的值
     */
    clamp: function(x, a, b) {
        return (x < a) ? a : ((x > b) ? b : x);
    },
};

/**
 * 动画对象的基本类型
 *
 * @class
 * @memberof JC
 * @param [opts] {object} 动画配置信息
 */
function Animate(opts) {
    this.element = opts.element || {};
    this.duration = opts.duration || 300;
    this.living = true;

    this.onCompelete = opts.onCompelete || null;
    this.onUpdate = opts.onUpdate || null;

    this.infinity = opts.infinity || false;
    this.alternate = opts.alternate || false;
    this.ease = opts.ease || 'easeBoth';
    this.repeats = opts.repeats || 0;
    this.delay = opts.delay || 0;
    this.wait = opts.wait || 0;
    this.delayCut = this.delay;
    this.progress = 0;
    this.direction = 1;

    this.timeScale = opts.timeScale || 1;

    this.totalTime = 0;

    this.paused = false;
}
Animate.prototype._swapEase = function() {
    var ease = this.ease;
    if (ease.indexOf('In') > 0) {
        ease = ease.replace('In', 'Out');
    } else if (ease.indexOf('Out') > 0) {
        ease = ease.replace('Out', 'In');
    }
    this.ease = ease;
};
Animate.prototype.update = function(snippet) {
    if (this.wait > 0) {
        this.wait -= Math.abs(snippet);
        return;
    }
    if (this.paused || !this.living || this.delayCut > 0) {
        if (this.delayCut > 0) this.delayCut -= Math.abs(snippet);
        return;
    }

    var snippetCache = this.direction * this.timeScale * snippet;
    this.progress = UTILS.clamp(this.progress + snippetCache, 0, this.duration);
    this.totalTime += Math.abs(snippetCache);

    var pose = this.nextPose();
    if (this.onUpdate) this.onUpdate(pose, this.progress / this.duration);

    if (this.totalTime >= this.duration) {
        if (this.repeats > 0 || this.infinity) {
            if (this.repeats > 0) --this.repeats;
            this.delayCut = this.delay;
            this.totalTime = 0;
            if (this.alternate) {
                this.direction *= -1;
                this._swapEase();
            } else {
                this.direction = 1;
                this.progress = 0;
            }
        } else {
            this.living = false;
            if (this.onCompelete) this.onCompelete(pose);
        }
    }
};
Animate.prototype.nextPose = function() {
    var cache = {};
    for (var i in this.to) {
        cache[i] = TWEEN[this.ease](this.progress, this.from[i], this.to[i] - this.from[i], this.duration);
        if (this.element[i] !== undefined) this.element[i] = cache[i];
    }
    return cache; //this.onUpdate
};
Animate.prototype.pause = function() {
    this.paused = true;
};
Animate.prototype.start = function() {
    this.paused = false;
};
Animate.prototype.stop = function() {
    this.progress = this.duration;
};
Animate.prototype.cancle = function() {
    this.living = false;
};

// import { UTILS } from '../util/UTILS';

/**
 * Transition类型动画对象
 *
 * @class
 * @memberof JC
 * @param [opts] {object} 动画所具备的特性
 */
function Transition(opts) {
    Animate.call(this, opts);

    this.from = opts.from;
    this.to = opts.to;

}
Transition.prototype = Object.create(Animate.prototype);

/**
 * PathMotion类型动画对象
 *
 * @class
 * @memberof JC
 * @param [opts] {object} 动画所具备的特性
 */
function PathMotion(opts) {
    Animate.call(this, opts);

    this.points = opts.points;
    this.attachTangent = opts.attachTangent || false;
    this._cacheRotate = this.element.rotation;
    var radian = this._cacheRotate * UTILS.DTR;
    this._cacheVector = { x: 10 * Math.cos(radian), y: 10 * Math.sin(radian) };
}
PathMotion.prototype = Object.create(Animate.prototype);
PathMotion.prototype.nextPose = function() {
    var cache = {},
        _rotate = 0,
        t = TWEEN[this.ease](this.progress, 0, 1, this.duration),
        pos = this.getPoint(t, this.points);

    cache.x = pos.x;
    cache.y = pos.y;
    if (this.attachTangent) {
        _rotate = this.decomposeRotate(t, pos);
        cache.rotation = _rotate === false ? this.preDegree : _rotate;
        cache.rotation += this._cacheRotate;
        if (_rotate !== false) this.preDegree = _rotate;
    }
    this.element.setProps(cache);
    return cache;
};
PathMotion.prototype.getPoint = function(t, points) {
    var a = points,
        len = a.length,
        rT = 1 - t,
        l = a.slice(0, len - 1),
        r = a.slice(1),
        oP = {};
    if (len > 3) {
        var oL = this.getPoint(t, l),
            oR = this.getPoint(t, r);
        oP.x = rT * oL.x + t * oR.x;
        oP.y = rT * oL.y + t * oR.y;
        return oP;
    } else {
        oP.x = rT * rT * points[0].x + 2 * t * rT * points[1].x + t * t * points[2].x;
        oP.y = rT * rT * points[0].y + 2 * t * rT * points[1].y + t * t * points[2].y;
        return oP;
    }
};
PathMotion.prototype.decomposeRotate = function(t, pos) {
    var p1 = pos || this.getPoint(t, this.points);
    var p2 = this.getPoint(t + 0.01, this.points);
    var vector = { x: p2.x - p1.x, y: p2.y - p1.y };

    var nor = this._cacheVector.x * vector.y - vector.x * this._cacheVector.y;
    var pi = nor > 0 ? 1 : -1;
    var cos = (vector.x * this._cacheVector.x + vector.y * this._cacheVector.y) / (Math.sqrt(vector.x * vector.x + vector.y * vector.y) * Math.sqrt(this._cacheVector.x * this._cacheVector.x + this._cacheVector.y * this._cacheVector.y));
    if (isNaN(cos)) return false;
    return pi * Math.acos(cos) * UTILS.RTD;
};

/**
 * KeyFrames类型动画对象
 *
 * @class
 * @memberof JC
 * @param [opts] {object} 动画配置信息
 */
function KeyFrames(opts) {
    Animate.call(this, opts);

    this._keyframes = opts.keys;
    this._keyIndex = 0;
    this._cursor = 1;
    this._keyConfig = opts.keyConfig;

    this.configKey();
}
KeyFrames.prototype = Object.create(Animate.prototype);
KeyFrames.prototype.configKey = function() {
    this.from = this._keyframes[this._keyIndex];
    this._keyIndex += this._cursor;
    this.to = this._keyframes[this._keyIndex];
    var config = this._keyConfig[Math.min(this._keyIndex, this._keyIndex - this._cursor)] || {};
    this.ease = config.ease || this.ease;
    this.duration = config.duration || this.duration;
    this.progress = 0;
};
KeyFrames.prototype.update = function(snippet) {
    if (this.wait > 0) {
        this.wait -= Math.abs(snippet);
        return;
    }
    if (this.paused || !this.living || this.delayCut > 0) {
        if (this.delayCut > 0) this.delayCut -= Math.abs(snippet);
        return;
    }
    // if (this.paused || !this.living) return;

    var snippetCache = this.direction * this.timeScale * snippet;
    this.progress = UTILS.clamp(this.progress + snippetCache, 0, this.duration);
    this.totalTime += Math.abs(snippetCache);

    var pose = this.nextPose();
    if (this.onUpdate) this.onUpdate(pose, this.progress / this.duration, this._keyIndex);

    // this.progress += this.timeScale * snippet;
    if (this.totalTime >= this.duration) {
        this.totalTime = 0;
        if (this._keyIndex < this._keyframes.length - 1 && this._keyIndex > 0) {
            this.configKey();
        } else {
            if (this.repeats > 0 || this.infinity) {
                if (this.repeats > 0) --this.repeats;
                this.delayCut = this.delay;
                if (this.alternate) {
                    this._cursor *= -1;
                } else {
                    this._cursor = 1;
                    this._keyIndex = 0;
                }
                this.configKey();
            } else {
                this.living = false;
                if (this.onCompelete) this.onCompelete();
            }
        }
    }
};

/**
 * Animation类型动画对象
 *
 * @class
 * @memberof JC
 */
function Animation(element) {
    this.element = element;
    // this.start = false;
    this.animates = [];
}
Animation.prototype.update = function(snippet) {
    for (var i = 0; i < this.animates.length; i++) {
        if (!this.animates[i].living) this.animates.splice(i, 1);
        if (this.animates[i]) this.animates[i].update(snippet);
    }
};
Animation.prototype.fromTo = function(opts, clear) {
    this.element.setProps(opts.from);
    opts.element = this.element;
    return this._addMove(new Transition(opts), clear);
};
Animation.prototype.to = function(opts, clear) {
    opts.from = {};
    for (var i in opts.to) {
        opts.from[i] = this.element[i];
    }
    opts.element = this.element;
    return this._addMove(new Transition(opts), clear);
};
Animation.prototype.motion = function(opts, clear) {
    opts.element = this.element;
    return this._addMove(new PathMotion(opts), clear);
};
Animation.prototype.keyFrames = function(opts, clear) {
    opts.element = this.element;
    return this._addMove(new KeyFrames(opts), clear);
};
Animation.prototype._addMove = function(animate, clear) {
    if (clear) this.clear();
    this.animates.push(animate);
    return animate;
};
Animation.prototype.clear = function() {
    this.animates.length = 0;
};

/**
 * 图片纹理类
 *
 * @class
 * @memberof JC
 * @param {string | Image} img 图片url或者图片对象.
 * @extends JC.Eventer
 */
function Texture(img, lazy) {
    Eventer.call(this);
    this.texture = null;
    this.width = 0;
    this.height = 0;
    this.naturalWidth = 0;
    this.naturalHeight = 0;
    this.loaded = false;
    this.hadload = false;
    this.src = img;
    this.resole(img);
    if (!lazy || !UTILS.isString(img)) this.load(img);

}
Texture.prototype = Object.create(Eventer.prototype);

/**
 * 预先处理一些数据
 *
 * @static
 * @param {string | Image} 先生成对应的对象
 * @private
 */
Texture.prototype.resole = function(img) {
    if (UTILS.isString(img)) {
        this.texture = new Image();
    }
    if (img instanceof Image || img.nodeName === 'IMG') {
        this.texture = img;
    }
};

/**
 * 尝试加载图片
 *
 * @static
 * @param {string | Image} img 图片url或者图片对象.
 * @private
 */
Texture.prototype.load = function(img) {
    if (this.hadload) return;
    var This = this;
    this.hadload = true;
    img = img || this.src;
    if (UTILS.isString(img)) {
        this.texture.crossOrigin = '';
        this.texture.src = img;
        this.texture.onload = function() {
            This.loaded = true;
            This.emit('load');
        };
        this.texture.onerror = function() {
            This.emit('error');
        };
        this.on('load', function() {
            This.width = This.texture.width;
            This.height = This.texture.height;
            This.naturalWidth = This.texture.naturalWidth;
            This.naturalHeight = This.texture.naturalHeight;
        });
    }
    if ((img instanceof Image || img.nodeName === 'IMG') && img.naturalWidth * img.naturalHeight > 0) {
        this.width = img.width;
        this.height = img.height;
        this.naturalWidth = img.naturalWidth;
        this.naturalHeight = img.naturalHeight;
    }
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
 * @memberof JC.Loader
 * @param {object} srcMap 配置了key－value的json格式数据
 * @return {JC.Loader} 返回本实例对象
 */
Loader.prototype.load = function(srcMap) {
    var This = this;
    this._total = 0;
    this._failed = 0;
    this._received = 0;
    for (var src in srcMap) {
        this._total++;
        this.textures[src] = new Texture(srcMap[src]);
        bind(this.textures[src]);
    }

    function bind(texture) {
        texture.on('load', function() {
            This._received++;
            This.emit('update');
            if (This._received + This._failed >= This._total) This.emit('compelete');
        });
        texture.on('error', function() {
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
 * @memberof JC.Loader
 * @param {string} id 之前加载时配置的key值
 * @return {JC.Texture} 包装出来的JC.Texture对象
 */
Loader.prototype.getById = function(id) {
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
    get: function() {
        return this._total === 0 ? 1 : (this._received + this._failed) / this._total;
    }
});



/**
 * 资源加载工具
 *
 * @function
 * @memberof JC
 * @param srcMap {object} key-src map
 * @return {JC.Loader}
 */
var loaderUtil = function(srcMap) {
    return new Loader().load(srcMap);
};

/**
 * 矩形类
 *
 * @class
 * @memberof JC
 * @param x {number} 左上角的x坐标
 * @param y {number} 左上角的y坐标
 * @param width {number} 矩形的宽度
 * @param height {number} 矩形的高度
 */
function Rectangle(x, y, width, height)
{
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
Rectangle.prototype.clone = function ()
{
    return new Rectangle(this.x, this.y, this.width, this.height);
};

/**
 * 检查坐标点是否在矩形区域内
 *
 * @param x {number} 坐标点的x轴位置
 * @param y {number} 坐标点的y轴位置
 * @return {boolean} 坐标点是否在矩形区域内
 */
Rectangle.prototype.contains = function (x, y)
{
    if (this.width <= 0 || this.height <= 0)
    {
        return false;
    }

    if (x >= this.x && x < this.x + this.width)
    {
        if (y >= this.y && y < this.y + this.height)
        {
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

Bounds.prototype.isEmpty = function() {
    return this.minX > this.maxX || this.minY > this.maxY;
};

Bounds.prototype.clear = function() {
    // this.updateID++;

    this.minX = Infinity;
    this.minY = Infinity;
    this.maxX = -Infinity;
    this.maxY = -Infinity;
};

/**
 * 将包围盒子转换成矩形描述
 *
 * @param rect {JC.Rectangle} 待转换的矩形
 * @returns {JC.Rectangle}
 */
Bounds.prototype.getRectangle = function(rect) {
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
 * @param point {JC.Point}
 */
Bounds.prototype.addPoint = function(point) {
    this.minX = Math.min(this.minX, point.x);
    this.maxX = Math.max(this.maxX, point.x);
    this.minY = Math.min(this.minY, point.y);
    this.maxY = Math.max(this.maxY, point.y);
};

/**
 * 往包围盒增加矩形区域，更新包围盒区域
 *
 * @param point {JC.Rectangle}
 */
Bounds.prototype.addRect = function(rect) {
    this.minX = rect.x;
    this.maxX = rect.width + rect.x;
    this.minY = rect.y;
    this.maxY = rect.height + rect.y;
};

/**
 * 往包围盒增加顶点数组，更新包围盒区域
 *
 * @param point {Array}
 */
Bounds.prototype.addVert = function(vertices) {
    var minX = this.minX,
        minY = this.minY,
        maxX = this.maxX,
        maxY = this.maxY;

    for (var i = 0; i < vertices.length; i += 2) {
        var x = vertices[i    ];
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
 * @param point {JC.Bounds}
 */
Bounds.prototype.addBounds = function(bounds) {
    var minX = this.minX,
        minY = this.minY,
        maxX = this.maxX,
        maxY = this.maxY;

    this.minX = bounds.minX < minX ? bounds.minX : minX;
    this.minY = bounds.minY < minY ? bounds.minY : minY;
    this.maxX = bounds.maxX > maxX ? bounds.maxX : maxX;
    this.maxY = bounds.maxY > maxY ? bounds.maxY : maxY;
};

/**
 * @class
 * @memberof JC
 * @param points {JC.Point[]|number[]|...JC.Point|...number} 坐标点数组，可以是JC.Point类型的数组项数组，也可以是连续两个数分别代表x、y坐标的数组。
 *
 *
 *
 *
 */
function Polygon(points_) {
    var points = points_;

    if (!UTILS.isArray(points)) {
        points = new Array(arguments.length);

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
Polygon.prototype.clone = function ()
{
    return new Polygon(this.points.slice());
};

/**
 * 检查坐标点是否在多边形内部
 *
 * @param x {number} 坐标点的x轴坐标
 * @param y {number} 坐标点的y轴坐标
 * @return {boolean} 是否在多边形内部
 */
Polygon.prototype.contains = function (x, y)
{
    var inside = false;

    var length = this.points.length / 2;

    for (var i = 0, j = length - 1; i < length; j = i++)
    {
        var xi = this.points[i * 2], yi = this.points[i * 2 + 1],
            xj = this.points[j * 2], yj = this.points[j * 2 + 1],
            intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);

        if (intersect)
        {
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
 * @param x {number} x轴的坐标
 * @param y {number} y轴的坐标
 * @param radius {number} 圆的半径
 */
function Circle(x, y, radius)
{
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
Circle.prototype.clone = function ()
{
    return new Circle(this.x, this.y, this.radius);
};

/**
 * 检测坐标点是否在园内
 *
 * @param x {number} 坐标点的x轴坐标
 * @param y {number} 坐标点的y轴坐标
 * @return {boolean} 坐标点是否在园内
 */
Circle.prototype.contains = function (x, y)
{
    if (this.radius <= 0)
    {
        return false;
    }

    var dx = (this.x - x),
        dy = (this.y - y),
        r2 = this.radius * this.radius;

    dx *= dx;
    dy *= dy;

    return (dx + dy <= r2);
};

/**
* 返回对象所占的矩形区域
*
* @return {PIXI.Rectangle} 矩形对象
*/
Circle.prototype.getBounds = function ()
{
    return new Rectangle(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
};

/**
 * 椭圆对象
 *
 * @class
 * @memberof JC
 * @param x {number} x轴的坐标
 * @param y {number} y轴的坐标
 * @param width {number} 椭圆的宽度
 * @param height {number} 椭圆的高度
 */
function Ellipse(x, y, width, height)
{
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
Ellipse.prototype.clone = function ()
{
    return new Ellipse(this.x, this.y, this.width, this.height);
};

/**
 * 检测坐标点是否在椭园内
 *
 * @param x {number} 坐标点的x轴坐标
 * @param y {number} 坐标点的y轴坐标
 * @return {boolean} 坐标点是否在椭园内
 */
Ellipse.prototype.contains = function (x, y)
{
    if (this.width <= 0 || this.height <= 0)
    {
        return false;
    }

    //normalize the coords to an ellipse with center 0,0
    var normx = ((x - this.x) / this.width),
        normy = ((y - this.y) / this.height);

    normx *= normx;
    normy *= normy;

    return (normx + normy <= 1);
};

/**
 * 返回对象所占的矩形区域
 *
 * @return {PIXI.Rectangle} 矩形对象
 */
Ellipse.prototype.getBounds = function ()
{
    return new Rectangle(this.x - this.width, this.y - this.height, this.width, this.height);
};

/**
 * 矩阵对象，用来描述和记录对象的tansform 状态信息
 *
 * @class
 * @memberof JC
 */
function Matrix(){
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
 * @param array {number[]}
 */
Matrix.prototype.fromArray = function(array){
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
 * @param transpose {boolean} 是否对矩阵进行转置
 * @return {number[]} 返回数组
 */
Matrix.prototype.toArray = function(transpose){
    if(!this.array) this.array = new Float32Array(9);
    var array = this.array;

    if(transpose){
        array[0] = this.a;
        array[1] = this.b;
        array[2] = 0;
        array[3] = this.c;
        array[4] = this.d;
        array[5] = 0;
        array[6] = this.tx;
        array[7] = this.ty;
        array[8] = 1;
    }else{
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
 * @param pos {object} 原始点
 * @param newPos {object} 变换之后的点
 * @return {object} 返回数组
 */
Matrix.prototype.apply = function(pos, newPos){
    newPos = newPos || {};
    newPos.x = this.a * pos.x + this.c * pos.y + this.tx;
    newPos.y = this.b * pos.x + this.d * pos.y + this.ty;
    return newPos;
};
/**
 * 将坐标点与转置矩阵左乘
 *
 * @param pos {object} 原始点
 * @param newPos {object} 变换之后的点
 * @return {object} 变换之后的点
 */
Matrix.prototype.applyInverse = function(pos, newPos){
    var id = 1 / (this.a * this.d + this.c * -this.b);
    newPos.x = this.d * id * pos.x + -this.c * id * pos.y + (this.ty * this.c - this.tx * this.d) * id;
    newPos.y = this.a * id * pos.y + -this.b * id * pos.x + (-this.ty * this.a + this.tx * this.b) * id;
    return newPos;
};
/**
 * 位移操作
 *
 * @return {this}
 */
Matrix.prototype.translate = function(x, y){
    this.tx += x;
    this.ty += y;
    return this;
};
/**
 * 缩放操作
 *
 * @return {this}
 */
Matrix.prototype.scale = function(x, y){
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
 *
 * @return {this}
 */
Matrix.prototype.rotate = function(angle){
    var cos = Math.cos( angle );
    var sin = Math.sin( angle );
    var a1 = this.a;
    var c1 = this.c;
    var tx1 = this.tx;
    this.a = a1 * cos-this.b * sin;
    this.b = a1 * sin+this.b * cos;
    this.c = c1 * cos-this.d * sin;
    this.d = c1 * sin+this.d * cos;
    this.tx = tx1 * cos - this.ty * sin;
    this.ty = tx1 * sin + this.ty * cos;
    return this;
};
/**
 * 矩阵相乘
 *
 * @return {this}
 */
Matrix.prototype.append = function(matrix){
    var a1 = this.a;
    var b1 = this.b;
    var c1 = this.c;
    var d1 = this.d;
    this.a  = matrix.a * a1 + matrix.b * c1;
    this.b  = matrix.a * b1 + matrix.b * d1;
    this.c  = matrix.c * a1 + matrix.d * c1;
    this.d  = matrix.c * b1 + matrix.d * d1;
    this.tx = matrix.tx * a1 + matrix.ty * c1 + this.tx;
    this.ty = matrix.tx * b1 + matrix.ty * d1 + this.ty;
    return this;
};
/**
 * 单位矩阵
 *
 * @return {this}
 */
Matrix.prototype.identity = function(){
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
 *
 * @return {this}
 */
Matrix.prototype.setTransform = function (x, y, pivotX, pivotY, scaleX, scaleY, rotation, skewX, skewY)
{
    var a, b, c, d, sr, cr, sy, nsx; // cy, cx,

    sr  = Math.sin(rotation);
    cr  = Math.cos(rotation);
    // cy  = Math.cos(skewY);
    sy  = Math.tan(skewY);
    nsx = Math.tan(skewX);
    // cx  =  Math.cos(skewX);

    a  =  cr * scaleX;
    b  =  sr * scaleX;
    c  = -sr * scaleY;
    d  =  cr * scaleY;

    this.a  = a + sy * c;
    this.b  = b + sy * d;
    this.c  = nsx * a + c;
    this.d  = nsx * b + d;

    this.tx = x + ( pivotX * a + pivotY * c );
    this.ty = y + ( pivotX * b + pivotY * d );

    return this;
};
var IDENTITY = new Matrix();
var TEMP_MATRIX = new Matrix();

/**
 * 显示对象的基类，继承至Eventer
 *
 * @class
 * @extends JC.Eventer
 * @memberof JC
 */
function DisplayObject() {
    Eventer.call(this);
    /**
     * 标记渲染对象是否就绪
     *
     * @member {Boolean}
     * @private
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
     * @member {Number}
     * @private
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
     * @member {JC.Container}
     * @private
     */
    this.parent = null;

    /**
     * 当前对象所应用的矩阵状态
     *
     * @member {JC.Matrix}
     * @private
     */
    this.worldTransform = new Matrix();

    /**
     * 当前对象的事件管家
     *
     * @member {JC.Eventer}
     * @private
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
     * @member {JC.Shape}
     * @private
     */
    this.eventArea = null;


    /**
     * 当前对象的动画管家
     *
     * @member {Array}
     * @private
     */
    this.Animation = new Animation(this);


    /**
     * 标记当前对象是否为touchstart触发状态
     *
     * @member {Boolean}
     * @private
     */
    this._touchstarted = false;

    /**
     * 标记当前对象是否为mousedown触发状态
     *
     * @member {Boolean}
     * @private
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
 * @member {number}
 * @name scale
 * @memberof JC.DisplayObject#
 */
Object.defineProperty(DisplayObject.prototype, 'scale', {
    get: function() {
        return this.scaleX;
    },
    set: function(scale) {
        this.scaleX = this.scaleY = scale;
    }
});

/**
 * fromTo动画，指定动画的启始位置和结束位置
 *
 * ```js
 * dispay.fromTo({
 *   from: {x: 100},
 *   to: {x: 200},
 *   ease: 'bounceOut', // 执行动画使用的缓动函数 默认值为 easeBoth
 *   repeats: 10, // 动画运动完后再重复10次
 *   infinity: true, // 无限循环动画
 *   alternate: true, // 偶数次的时候动画回放
 *   duration: 1000, // 动画时长 ms单位 默认 300ms
 *   onUpdate: function(state,rate){},
 *   onCompelete: function(){ console.log('end'); } // 动画执行结束回调
 * });
 * ```
 *
 * @param [opts] {object} 动画配置参数
 * @param [opts.from] {json} json格式，设置对象的起始位置和起始姿态等
 * @param [opts.to] {json} json格式，设置对象的结束位置和结束姿态等
 * @param [opts.ease] {String} 执行动画使用的缓动函数 默认值为 easeBoth
 * @param [opts.repeats] {Number} 设置动画执行完成后再重复多少次，优先级没有infinity高
 * @param [opts.infinity] {Boolean} 设置动画无限次执行，优先级高于repeats
 * @param [opts.alternate] {Boolean} 设置动画是否偶数次回返
 * @param [opts.duration] {Number} 设置动画执行时间 默认 300ms
 * @param [opts.onUpdate] {Function} 设置动画更新时的回调函数
 * @param [opts.onCompelete] {Function} 设置动画结束时的回调函数，如果infinity为true该事件将不会触发
 * @param clear {Boolean} 是否去掉之前的动画
 */
DisplayObject.prototype.fromTo = function(opts, clear) {
    return this.Animation.fromTo(opts, clear);
};

/**
 * to动画，物体当前位置为动画的启始位置，只需制定动画的结束位置
 *
 * ```js
 * dispay.to({
 *   to: {x: 200},
 *   ease: 'bounceOut', // 执行动画使用的缓动函数 默认值为 easeBoth
 *   repeats: 10, // 动画运动完后再重复10次
 *   infinity: true, // 无限循环动画
 *   alternate: true, // 偶数次的时候动画回放
 *   duration: 1000, // 动画时长 ms单位 默认 300ms
 *   onUpdate: function(state,rate){},
 *   onCompelete: function(){ console.log('end'); } // 动画执行结束回调
 * });
 * ```
 *
 * @param [opts] {object} 动画配置参数
 * @param [opts.to] {json} json格式，设置对象的结束位置和结束姿态等
 * @param [opts.ease] {String} 执行动画使用的缓动函数 默认值为 easeBoth
 * @param [opts.repeats] {Number} 设置动画执行完成后再重复多少次，优先级没有infinity高
 * @param [opts.infinity] {Boolean} 设置动画无限次执行，优先级高于repeats
 * @param [opts.alternate] {Boolean} 设置动画是否偶数次回返
 * @param [opts.duration] {Number} 设置动画执行时间 默认 300ms
 * @param [opts.onUpdate] {Function} 设置动画更新时的回调函数
 * @param [opts.onCompelete] {Function} 设置动画结束时的回调函数，如果infinity为true该事件将不会触发
 * @param clear {Boolean} 是否去掉之前的动画
 */
DisplayObject.prototype.to = function(opts, clear) {
    return this.Animation.to(opts, clear);
};

/**
 * motion动画，让物体按照设定好的曲线运动
 *
 * ```js
 * dispay.motion({
 *   points: [{x: 0,y: 0}, {x: 30,y: 20}, {x: -50,y: -40}, {x: 50,y: 90}], // path路径，数组首尾的分别为贝塞尔曲线的起始点和结束点，其余为控制点
 *   attachTangent: true, // 物体是否捕获切线方向
 *   ease: 'bounceOut', // 执行动画使用的缓动函数 默认值为 easeBoth
 *   repeats: 10, // 动画运动完后再重复10次
 *   infinity: true, // 无限循环动画
 *   alternate: true, // 偶数次的时候动画回放
 *   duration: 1000, // 动画时长 ms单位 默认 300ms
 *   onUpdate: function(state,rate){}, // 动画更新回调
 *   onCompelete: function(){ console.log('end'); } // 动画执行结束回调
 * });
 * ```
 * @param [opts] {object} 动画配置参数
 * @param [opts.points] {Array} path路径，数组首尾的分别为贝塞尔曲线的起始点和结束点，其余为控制点
 * @param [opts.attachTangent] {Boolean} 物体是否捕获切线方向
 * @param [opts.ease] {String} 执行动画使用的缓动函数 默认值为 easeBoth
 * @param [opts.repeats] {Number} 设置动画执行完成后再重复多少次，优先级没有infinity高
 * @param [opts.infinity] {Boolean} 设置动画无限次执行，优先级高于repeats
 * @param [opts.alternate] {Boolean} 设置动画是否偶数次回返
 * @param [opts.duration] {Number} 设置动画执行时间 默认 300ms
 * @param [opts.onUpdate] {Function} 设置动画更新时的回调函数
 * @param [opts.onCompelete] {Function} 设置动画结束时的回调函数，如果infinity为true该事件将不会触发
 * @param clear {Boolean} 是否去掉之前的动画
 */
DisplayObject.prototype.motion = function(opts, clear) {
    return this.Animation.motion(opts, clear);
};

/**
 * keyFrames动画，设置物体动画的keyframe，可以为相邻的两个keyFrames之前配置差值时间及时间函数
 *
 * ```js
 * dispay.keyFrames({
 *   keys: [{x:-100,y:-200,rotation:0},{x:100,y:-200,rotation:-180},{x:-100,y:200,rotation:90}],
 *   keyConfig: [{ease:'elasticIn',duration: 1000},{ease:'backIn',duration: 1000}],
 *   ease: 'bounceOut', // 执行动画使用的缓动函数 默认值为 easeBoth
 *   repeats: 10, // 动画运动完后再重复10次
 *   infinity: true, // 无限循环动画
 *   alternate: true, // 偶数次的时候动画回放
 *   duration: 1000, // 动画时长 ms单位 默认 300ms
 *   onUpdate: function(state,rate){},
 *   onCompelete: function(){ console.log('end'); } // 动画执行结束回调
 * });
 * ```
 *
 * @param [opts] {object} 动画配置参数
 * @param [opts.keys] {json} 配置关键帧的位置、姿态
 * @param [opts.keyConfig] {json} 相邻两个关键帧之间的动画运动配置
 * @param [opts.ease] {String} 执行动画使用的缓动函数 默认值为 easeBoth
 * @param [opts.repeats] {Number} 设置动画执行完成后再重复多少次，优先级没有infinity高
 * @param [opts.infinity] {Boolean} 设置动画无限次执行，优先级高于repeats
 * @param [opts.alternate] {Boolean} 设置动画是否偶数次回返
 * @param [opts.duration] {Number} 设置动画执行时间 默认 300ms
 * @param [opts.onUpdate] {Function} 设置动画更新时的回调函数
 * @param [opts.onCompelete] {Function} 设置动画结束时的回调函数，如果infinity为true该事件将不会触发
 * @param clear {Boolean} 是否去掉之前的动画
 */
DisplayObject.prototype.keyFrames = function(opts, clear) {
    return this.Animation.keyFrames(opts, clear);
};

/**
 * 检查对象是否可见
 *
 * @method isVisible
 * @private
 */
DisplayObject.prototype.isVisible = function() {
    return !!(this.visible && this.alpha > 0 && this.scaleX * this.scaleY !== 0);
};

/**
 * 移除对象上的遮罩
 *
 */
DisplayObject.prototype.removeMask = function() {
    this.mask = null;
};

/**
 * 设置对象上的属性值
 *
 * @method setProps
 * @private
 */
DisplayObject.prototype.setProps = function(props) {
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
 * @method updateTransform
 * @private
 */
DisplayObject.prototype.updateTransform = function() {
    var pt = this.parent.worldTransform;
    var wt = this.worldTransform;

    var a, b, c, d, tx, ty;

    if (this.skewX || this.skewY) {

        TEMP_MATRIX.setTransform(
            this.x,
            this.y,
            this.pivotX,
            this.pivotY,
            this.scaleX,
            this.scaleY,
            this.rotation * UTILS.DTR,
            this.skewX * UTILS.DTR,
            this.skewY * UTILS.DTR
        );

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
                this._sr = Math.sin(this.rotation * UTILS.DTR);
                this._cr = Math.cos(this.rotation * UTILS.DTR);
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
    this.worldAlpha = this.alpha * this.parent.worldAlpha;
};

/**
 * 更新对象本身的动画
 *
 * @method updateAnimation
 * @private
 */
DisplayObject.prototype.updateAnimation = function(snippet) {
    this.Animation.update(snippet);
};

/**
 * 设置矩阵和透明度到当前绘图上下文
 *
 * @method setTransform
 * @private
 */
DisplayObject.prototype.setTransform = function(ctx) {
    var matrix = this.worldTransform;
    ctx.globalAlpha = this.worldAlpha;
    ctx.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
};

/**
 * 获取物体相对于canvas世界坐标系的坐标位置
 *
 * @return {object}
 */
DisplayObject.prototype.getGlobalPos = function() {
    return { x: this.worldTransform.tx, y: this.worldTransform.ty };
};

/**
 * 显示对象的事件绑定函数
 *
 * @param type {String} 事件类型
 * @param fn {Function} 回调函数
 */
// DisplayObject.prototype.on = function(type, fn) {
//     this.event.on(type, fn);
// };

/**
 * 显示对象的事件解绑函数
 *
 * @param type {String} 事件类型
 * @param fn {Function} 注册时回调函数的引用
 */
// DisplayObject.prototype.off = function(type, fn) {
//     this.event.off(type, fn);
// };

/**
 * 显示对象的一次性事件绑定函数
 *
 * @param type {String} 事件类型
 * @param fn {Function} 回调函数
 */
// DisplayObject.prototype.once = function(type, fn) {
//     this.event.once(type, fn);
// };

/**
 * 设置显示对象的事件检测区域
 *
 * @param shape {JC.Polygon|JC.Rectangle} JC内置形状类型的实例
 * @param needless {boolean} 当该值为true，当且仅当this.eventArea为空时才会更新点击区域。默认为false，总是更新点击区域。
 * @return {Array}
 */
DisplayObject.prototype.setArea = function(shape, needless) {
    if (this.eventArea !== null && needless) return;
    this.eventArea = shape;
};

/**
 * 检测坐标点是否在多变性内
 *
 * @method contains
 * @private
 */
DisplayObject.prototype.contains = function (global) {
    if (this.eventArea === null) return false;
    var point = new Point();
    this.worldTransform.applyInverse(global, point);
    return this.eventArea && this.eventArea.contains(point.x, point.y);
};

/**
 * 显示对象容器，继承至DisplayObject
 *
 * ```js
 * var container = new JC.Container();
 * container.addChilds(sprite);
 * ```
 *
 * @class
 * @extends JC.DisplayObject
 * @memberof JC
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
     * @member {Number}
     * @private
     */
    this._zIndex = 0;

    /**
     * 强制该对象在渲染子集之前为他们排序
     *
     * @member {Boolean}
     */
    this.souldSort = false;

    /**
     * 强制该对象在渲染子集之前为他们排序
     *
     * @member {JC.Bounds}
     */
    this.bounds = new Bounds();

    /**
     * 显示对象内部表示的边界
     *
     * @member {JC.Bounds}
     * @private
     */
    this._bounds = new Bounds();

    this.vertexData = new Float32Array(8);
}
Container.prototype = Object.create(DisplayObject.prototype);

/**
 * 当前对象的z-index层级，z-index的值只会影响该对象在其所在的渲染列表内产生影响
 *
 * @member {number}
 * @name zIndex
 * @memberof JC.Container#
 */
Object.defineProperty(Container.prototype, 'zIndex', {
    get: function() {
        return this._zIndex;
    },
    set: function(zIndex) {
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
 * @method _sortList
 * @private
 */
Container.prototype._sortList = function() {
    this.childs.sort(function(a, b){
        if (a.zIndex > b.zIndex) {
            return 1;
        }
        if (a.zIndex < b.zIndex) {
            return -1;
        }
        return 0;
    });
    this.souldSort = false;
};

/**
 * 向容器添加一个物体
 *
 * ```js
 * container.adds(sprite,sprite2,text3,graphice);
 * ```
 *
 * @param object {JC.Container}
 * @return {JC.Container}
 */
Container.prototype.adds = function(object) {
    if (arguments.length > 1) {
        for (var i = 0; i < arguments.length; i++) {
            this.adds(arguments[i]);
        }
        return this;
    }
    if (object === this) {
        console.error('adds: object can\'t be added as a child of itself.', object);
        return this;
    }
    if ((object && object instanceof Container)) {
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
 * @param object {JC.Container}
 * @return {JC.Container}
 */
Container.prototype.remove = function(object) {
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
 * @method updatePosture
 * @private
 */
Container.prototype.updatePosture = function(snippet) {
    if (!this._ready) return;
    if (this.souldSort) this._sortList();
    snippet = this.timeScale * snippet;
    if (!this.paused) this.updateAnimation(snippet);
    this.updateTransform();
    // if (this.childs.length > 0) this.updateChilds(snippet);
    for (var i = 0, l = this.childs.length; i < l; i++) {
        var child = this.childs[i];
        child.updatePosture(snippet);
    }
};

/**
 * 渲染自己并触发后代渲染
 *
 * @method render
 * @private
 */
Container.prototype.render = function(ctx) {
    ctx.save();
    this.setTransform(ctx);
    if (this.mask) this.mask.render(ctx);
    this.renderMe(ctx);
    // if (this.childs.length > 0) this.renderChilds(ctx);
    for (var i = 0, l = this.childs.length; i < l; i++) {
        var child = this.childs[i];
        if (!child.isVisible() || !child._ready) continue;
        child.render(ctx);
    }
    ctx.restore();
};

/**
 * 渲染自己
 *
 * @method renderMe
 * @private
 */
Container.prototype.renderMe = function() {
    return true;
};

Container.prototype.calculateVertices = function() {
    var wt = this.worldTransform,
        a = wt.a,
        b = wt.b,
        c = wt.c,
        d = wt.d,
        tx = wt.tx,
        ty = wt.ty,
        vertexData = this.vertexData,
        w0, w1, h0, h1;

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
    if(!this.visible) {
        return;
    }
    this._calculateBounds();

    for (var i = 0; i < this.childs.length; i++) {
        var child = this.childs[i];

        child.calculateBounds();

        this.bounds.addBounds(child.bounds);
    }
    // this._boundsID = this._lastBoundsID;
};

Container.prototype._calculateBounds = function () {
    this.calculateVertices();
    this.bounds.addVert(this.vertexData);
};


/**
 * 设置渲染物体的包围盒
 *
 * @method setBounds
 */
Container.prototype.setBounds = function(bounds){
    if (bounds instanceof Bounds) {
        this._bounds = bounds;
    }
};

/**
 * 暂停自身的动画进度
 *
 *
 */
Container.prototype.pause = function() {
    this.paused = true;
};

/**
 * 恢复自身的动画进度
 *
 *
 */
Container.prototype.start = function() {
    this.paused = false;
};

/**
 * 取消自身的所有动画
 *
 *
 */
Container.prototype.cancle = function() {
    this.Animator.clear();
};

// TODO 继承事件对象
/**
 * MovieClip类型动画对象
 *
 * @class
 * @memberof JC
 * @param [element] {object} 动画对象 内部传入
 * @param [opts] {object} 动画配置信息 内部传入
 */
function MovieClip(element, opts) {
    this.element = element;
    this.living = false;

    this.onCompelete = null;
    // this.onUpdate = null;

    this.infinity = false;
    this.alternate = false;
    this.repeats = 0;

    this.animations = opts.animations || {};

    this.index = 0;
    this.preIndex = -1;
    this.direction = 1;
    this.frames = [];
    this.preFrame = null;
    // this.sy = opts.sy || 0;
    // this.sx = opts.sx || 0;
    this.fillMode = 0;
    this.fps = 16;

    this.paused = false;

    this.pt = 0;
    this.nt = 0;
}
MovieClip.prototype.update = function(snippet) {
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
        if (this.repeats > 0 || this.infinity) {
            if (this.repeats > 0) --this.repeats;
            if (this.alternate) {
                this.direction *= -1;
                this.index += this.direction;
            } else {
                this.direction = 1;
                this.index = 0;
            }
            // Do you need this handler???
            // this.onUpdate&&this.onUpdate(this.index);
        } else {
            this.living = false;
            this.index = this.fillMode;
            if (this.onCompelete) this.onCompelete();
            if (this.next) this.next();
        }
    }
};
MovieClip.prototype.getFrame = function() {
    if (this.index === this.preIndex && this.preFrame !== null) return this.preFrame;
    var frame = this.element.frame.clone();
    var cf = this.frames[this.index];
    if (cf > 0) {
        var row = this.element.naturalWidth / this.element.frame.width >> 0;
        var lintRow = this.element.frame.x / this.element.frame.width >> 0;
        // var lintCol = this.element.frame.y / this.element.frame.height >> 0;
        var mCol = (lintRow + cf) / row >> 0;
        var mRow = (lintRow + cf) % row;
        frame.x = mRow * this.element.frame.width;
        frame.y += mCol * this.element.frame.height;
    }
    this.preIndex = this.index;
    this.preFrame = frame;
    return frame;
};
MovieClip.prototype.playMovie = function(opts) {
    this.next = null;
    var movie = this.format(opts.movie);
    if (!UTILS.isArray(movie)) return;
    this.frames = movie;
    this.index = 0;
    this.direction = 1;
    this.fillMode = opts.fillMode || 0;
    this.fps = opts.fps || this.fps;
    this.infinity = opts.infinity || false;
    this.alternate = opts.alternate || false;
    this.repeats = opts.repeats || 0;
    this.living = true;
    this.onCompelete = opts.onCompelete || null;
};
MovieClip.prototype.format = function(movie) {
    if (UTILS.isString(movie)) {
        var config = this.animations[movie];
        if (config) {
            return this.format(config);
        } else {
            console.warn(
                '%c JC.MovieClip warn %c: you didn\`t config %c' + movie + '%c in animations ',
                'color: #f98165; background: #80a89e',
                'color: #80a89e; background: #cad9d5;',
                'color: #f98165; background: #cad9d5',
                'color: #80a89e; background: #cad9d5'
            );
            return false;
        }
    } else if (UTILS.isArray(movie)) {
        return movie;
    } else if (UTILS.isObject(movie)) {
        var arr = [];
        for (var i = movie.start; i <= movie.end; i++) {
            arr.push(i);
        }
        if (movie.next && this.animations[movie.next]) {
            var This = this;
            var conf = {};
            if(UTILS.isString(movie.next) && this.animations[movie.next]){
                conf.movie = movie.next;
                conf.infinity = true;
            } else if(UTILS.isObject(movie.next)) {
                conf = movie.next;
            }
            if (UTILS.isString(conf.movie)) {
                this.next = function() {
                    This.playMovie(conf);
                };
            }
        }
        return arr;
    }
};
MovieClip.prototype.pause = function() {
    this.paused = true;
};
MovieClip.prototype.start = function() {
    this.paused = false;
};
MovieClip.prototype.cancle = function() {
    this.living = false;
};
Object.defineProperty(MovieClip.prototype, 'interval', {
    get: function() {
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
 *      count: 38,
 *      animations: {
 *          fall: {start: 0,end: 4,next: 'stand'},
 *          fly: {start: 5,end: 9,next: {movie: 'stand', repeats: 2}},
 *          stand: {start: 10,end: 39},
 *          walk: {start: 40,end: 59,next: 'stand'}
 *      }
 * });
 * ```
 *
 * @class
 * @extends JC.Container
 * @memberof JC
 */
function Sprite(opts) {
    Container.call(this);

    this.texture = opts.texture;
    if (this.texture.loaded) {
        this.upTexture(opts);
    } else {
        var This = this;
        this._ready = false;
        this.texture.on('load', function() {
            This.upTexture(opts);
            This._ready = true;
        });
    }

    this.MovieClip = new MovieClip(this, opts);

}
Sprite.prototype = Object.create(Container.prototype);

/**
 * 更新纹理对象
 *
 * @method upTexture
 * @private
 */
Sprite.prototype.upTexture = function(opts) {
    this.naturalWidth = opts.texture.naturalWidth;
    this.naturalHeight = opts.texture.naturalHeight;
    this.frame = opts.frame || new Rectangle(0, 0, this.naturalWidth, this.naturalHeight);
    this.width = opts.width || this.frame.width || this.naturalWidth;
    this.height = opts.height || this.frame.height || this.naturalHeight;
    this.regX = this.width >> 1;
    this.regY = this.height >> 1;
    var rect = new Rectangle(-this.regX, -this.regY, this.width, this.height);
    this._bounds.addRect(rect);
    this.setArea(rect, true);
};

/**
 * 更新对象的动画姿态
 *
 * @method updateAnimation
 * @private
 */
Sprite.prototype.updateAnimation = function(snippet) {
    this.Animation.update(snippet);
    this.MovieClip.update(snippet);
};

/**
 * 播放逐帧动画
 *
 */
Sprite.prototype.playMovie = function(opts) {
    this.MovieClip.playMovie(opts);
};

/**
 * 更新对象本身的矩阵姿态以及透明度
 *
 * @method updateMe
 * @private
 */
Sprite.prototype.renderMe = function(ctx) {
    if (!this._ready) return;
    var frame = this.MovieClip.getFrame();
    ctx.drawImage(this.texture.texture, frame.x, frame.y, frame.width, frame.height, -this.regX, -this.regY, this.width, this.height);
};

function FrameBuffer() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    // document.body.appendChild(this.canvas);
}
FrameBuffer.prototype.setSize = function(rect) {
    this.width = this.canvas.width = rect.width + rect.px*2;
    this.height = this.canvas.height = rect.height + rect.py*2;
};
FrameBuffer.prototype.clear = function() {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.width, this.height);
};
FrameBuffer.prototype.setTransform = function(a, b, c, d, e, f) {
    this.ctx.setTransform(a, b, c, d, e, f);
};
FrameBuffer.prototype.getBuffer = function() {
    this.bufferData = this.ctx.getImageData(0, 0, this.width, this.height);
    return this.bufferData;
};
FrameBuffer.prototype.putBuffer = function() {
    this.ctx.putImageData(this.bufferData, 0, 0);
    return this.canvas;
};
FrameBuffer.prototype.createBuffer = function() {
};

/**
 * 形状对象，继承至Container
 *
 *
 * ```js
 * var graphics = new JC.Graphics();
 * ```
 *
 * @class
 * @extends JC.Container
 * @memberof JC
 */
function Graphics() {
    Container.call(this);
    this.frameBuffer = null;
}
Graphics.prototype = Object.create(Container.prototype);

/**
 * 更新对象本身的矩阵姿态以及透明度
 *
 * @method updateMe
 * @private
 */
Graphics.prototype.renderMe = function(ctx) {
    if (!this.draw) return;
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
Graphics.prototype._drawBack = function(ctx) {
    if (typeof this.draw === 'function') {
        this.draw(ctx);
    } else if (typeof this.draw === 'object' && typeof this.draw.render === 'function') {
        this.draw.render(ctx);
    }
};
/**
 * 图形绘制挂载函数
 *
 *```js
 *  var cacheMap = new JC.Graphics();  // 创建形状绘制对象
 *
 *  cacheMap.drawCall(function(ctx){
 *      for(var i = 50;i>0;i--){
 *          ctx.strokeStyle = COLOURS[i%COLOURS.length];
 *          ctx.beginPath();
 *          ctx.arc( 0, 0, i, 0, Math.PI*2 );
 *          ctx.stroke();
 *      }
 *  },{
 *      cache: true,
 *      bounds: new JC.Bounds(-50, -50, 50, 50)
 *  });
 * ```
 *
 * @param fn {function}
 * @param opts {object}
 */
Graphics.prototype.drawCall = function(fn, opts) {
    if (fn === undefined) return;
    opts = opts || {};
    this.cache = opts.cache || false;
    this.cached = false;
    // this.session = opts.session || { bounds: { x: 0, y: 0 }, width: 100, height: 100 };
    this.draw = fn || null;

    this.setBounds(opts.bounds);
};

/**
 * 文本，继承至Container
 *
 *
 * ```js
 * var text = new JC.TextFace('JC jcc2d canvas renderer','bold 36px Arial','#f00');
 * ```
 *
 * @class
 * @extends JC.Container
 * @memberof JC
 */
function TextFace(text,font,color){
    Container.call( this );
    this.text = text.toString();
    this.font = font || 'bold 12px Arial';
    this.color = color || '#000000';

    this.textAlign = 'center'; // start left center end right
    this.textBaseline = 'middle'; // top bottom middle alphabetic hanging


    this.outline = 0;
    this.lineWidth = 1;

    this.US = false; // use stroke
    this.UF = true; // use fill

    // ctx.measureText(str) 返回指定文本的宽度
}
TextFace.prototype = Object.create( Container.prototype );

/**
 * 更新对象本身的矩阵姿态以及透明度
 *
 * @method updateMe
 * @private
 */
TextFace.prototype.renderMe = function(ctx){
    ctx.font = this.font;
    ctx.textAlign = this.textAlign;
    ctx.textBaseline = this.textBaseline;
    if(this.UF){
        ctx.fillStyle = this.color;
        ctx.fillText(this.text,0,0);
    }
    if(this.US){
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.color;
        ctx.strokeText(this.text,0,0);
    }
};

function BlurFilter(blurX, blurY, quality) {
    Container.call(this);

    if (isNaN(blurX) || blurX < 0) blurX = 0;
    if (isNaN(blurY) || blurY < 0) blurY = 0;
    if (isNaN(quality) || quality < 1) quality = 1;

    this.frameBuffer = new FrameBuffer();

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
     * @default false
     * @type Boolean
     **/
    this.padding = false;
}
BlurFilter.prototype = Object.create( Container.prototype );

/**
 * 对渲染对象进行x、y轴同时设置模糊半径
 *
 * @member {number}
 * @name blur
 * @memberof JC.BlurFilter#
 */
Object.defineProperty(BlurFilter.prototype, 'blur', {
    get: function() {
        return this.blurX;
    },
    set: function(blur) {
        this.blurX = this.blurY = blur;
    }
});

BlurFilter.prototype.updatePosture = function(snippet) {
    if (!this._ready) return;
    if (this.souldSort) this._sortList();
    snippet = this.timeScale * snippet;
    if (!this.paused) this.updateAnimation(snippet);

    this.updateTransform();

    if (this.needUpdateBuffer || this.autoUpdateBuffer) {
        this.cacheMatrix = this.worldTransform;
        this.worldTransform = __tmpMatrix.identity();
        this._upc(snippet);

        this.calculateBounds();
        this.__o = this.bounds.getRectangle();
        this.__o.px = this.__o.py = 0;
        if (this.padding) {
            this.__o.px = this.blurX;
            this.__o.py = this.blurY;
        }
        this.worldTransform.translate(-this.__o.x + this.__o.px, -this.__o.y + this.__o.py);
        this._upc(0);

        this.worldTransform = this.cacheMatrix;
    } else {
        this._upc(snippet);
    }
};

BlurFilter.prototype._upc = function(snippet) {
    for (var i = 0, l = this.childs.length; i < l; i++) {
        var child = this.childs[i];
        child.updatePosture(snippet);
    }
};

BlurFilter.prototype.render = function(ctx) {
    if (this.needUpdateBuffer || this.autoUpdateBuffer) {
        var i = 0,
            l = this.childs.length,
            child = null;

        this.frameBuffer.clear();
        this.frameBuffer.setSize(this.__o);
        for (i = 0; i < l; i++) {
            child = this.childs[i];
            if (!child.isVisible() || !child._ready) continue;
            child.render(this.frameBuffer.ctx);
        }
        this._applyFilter(this.frameBuffer.getBuffer());

        this.needUpdateBuffer = false;
    }
    this.renderMe(ctx, this.__o.x - this.__o.px, this.__o.y - this.__o.py, this.frameBuffer.width, this.frameBuffer.height);
};

BlurFilter.prototype.renderMe = function(ctx ,x ,y, w, h) {
    this.setTransform(ctx);
    ctx.drawImage(this.frameBuffer.putBuffer(), 0, 0, w, h, x, y, w, h);
};


var __tmpMatrix = new Matrix();


var MUL_TABLE = [1, 171, 205, 293, 57, 373, 79, 137, 241, 27, 391, 357, 41, 19, 283, 265, 497, 469, 443, 421, 25, 191, 365, 349, 335, 161, 155, 149, 9, 278, 269, 261, 505, 245, 475, 231, 449, 437, 213, 415, 405, 395, 193, 377, 369, 361, 353, 345, 169, 331, 325, 319, 313, 307, 301, 37, 145, 285, 281, 69, 271, 267, 263, 259, 509, 501, 493, 243, 479, 118, 465, 459, 113, 446, 55, 435, 429, 423, 209, 413, 51, 403, 199, 393, 97, 3, 379, 375, 371, 367, 363, 359, 355, 351, 347, 43, 85, 337, 333, 165, 327, 323, 5, 317, 157, 311, 77, 305, 303, 75, 297, 294, 73, 289, 287, 71, 141, 279, 277, 275, 68, 135, 67, 133, 33, 262, 260, 129, 511, 507, 503, 499, 495, 491, 61, 121, 481, 477, 237, 235, 467, 232, 115, 457, 227, 451, 7, 445, 221, 439, 218, 433, 215, 427, 425, 211, 419, 417, 207, 411, 409, 203, 202, 401, 399, 396, 197, 49, 389, 387, 385, 383, 95, 189, 47, 187, 93, 185, 23, 183, 91, 181, 45, 179, 89, 177, 11, 175, 87, 173, 345, 343, 341, 339, 337, 21, 167, 83, 331, 329, 327, 163, 81, 323, 321, 319, 159, 79, 315, 313, 39, 155, 309, 307, 153, 305, 303, 151, 75, 299, 149, 37, 295, 147, 73, 291, 145, 289, 287, 143, 285, 71, 141, 281, 35, 279, 139, 69, 275, 137, 273, 17, 271, 135, 269, 267, 133, 265, 33, 263, 131, 261, 130, 259, 129, 257, 1];



var SHG_TABLE = [0, 9, 10, 11, 9, 12, 10, 11, 12, 9, 13, 13, 10, 9, 13, 13, 14, 14, 14, 14, 10, 13, 14, 14, 14, 13, 13, 13, 9, 14, 14, 14, 15, 14, 15, 14, 15, 15, 14, 15, 15, 15, 14, 15, 15, 15, 15, 15, 14, 15, 15, 15, 15, 15, 15, 12, 14, 15, 15, 13, 15, 15, 15, 15, 16, 16, 16, 15, 16, 14, 16, 16, 14, 16, 13, 16, 16, 16, 15, 16, 13, 16, 15, 16, 14, 9, 16, 16, 16, 16, 16, 16, 16, 16, 16, 13, 14, 16, 16, 15, 16, 16, 10, 16, 15, 16, 14, 16, 16, 14, 16, 16, 14, 16, 16, 14, 15, 16, 16, 16, 14, 15, 14, 15, 13, 16, 16, 15, 17, 17, 17, 17, 17, 17, 14, 15, 17, 17, 16, 16, 17, 16, 15, 17, 16, 17, 11, 17, 16, 17, 16, 17, 16, 17, 17, 16, 17, 17, 16, 17, 17, 16, 16, 17, 17, 17, 16, 14, 17, 17, 17, 17, 15, 16, 14, 16, 15, 16, 13, 16, 15, 16, 14, 16, 15, 16, 12, 16, 15, 16, 17, 17, 17, 17, 17, 13, 16, 15, 17, 17, 17, 16, 15, 17, 17, 17, 16, 15, 17, 17, 14, 16, 17, 17, 16, 17, 17, 16, 15, 17, 16, 14, 17, 16, 15, 17, 16, 17, 17, 16, 17, 15, 16, 17, 14, 17, 16, 15, 17, 16, 17, 13, 17, 16, 17, 17, 16, 17, 14, 17, 16, 17, 16, 17, 16, 17, 9];

/* eslint-disable */
BlurFilter.prototype._applyFilter = function(imageData) {

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

    var divx = (radiusX + radiusX + 1) | 0;
    var divy = (radiusY + radiusY + 1) | 0;
    var w = imageData.width | 0;
    var h = imageData.height | 0;

    var w1 = (w - 1) | 0;
    var h1 = (h - 1) | 0;
    var rxp1 = (radiusX + 1) | 0;
    var ryp1 = (radiusY + 1) | 0;

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
            r = rxp1 * (pr = px[(yi) | 0]);
            g = rxp1 * (pg = px[(yi + 1) | 0]);
            b = rxp1 * (pb = px[(yi + 2) | 0]);
            a = rxp1 * (pa = px[(yi + 3) | 0]);

            sx = ssx;

            for (i = rxp1; --i > -1;) {
                sx.r = pr;
                sx.g = pg;
                sx.b = pb;
                sx.a = pa;
                sx = sx.n;
            }

            for (i = 1; i < rxp1; i++) {
                p = (yi + ((w1 < i ? w1 : i) << 2)) | 0;
                r += (sx.r = px[p]);
                g += (sx.g = px[p + 1]);
                b += (sx.b = px[p + 2]);
                a += (sx.a = px[p + 3]);

                sx = sx.n;
            }

            si = ssx;
            for (x = 0; x < w; x++) {
                px[yi++] = (r * ms) >>> ss;
                px[yi++] = (g * ms) >>> ss;
                px[yi++] = (b * ms) >>> ss;
                px[yi++] = (a * ms) >>> ss;

                p = ((yw + ((p = x + radiusX + 1) < w1 ? p : w1)) << 2);

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
            yi = (x << 2) | 0;

            r = (ryp1 * (pr = px[yi])) | 0;
            g = (ryp1 * (pg = px[(yi + 1) | 0])) | 0;
            b = (ryp1 * (pb = px[(yi + 2) | 0])) | 0;
            a = (ryp1 * (pa = px[(yi + 3) | 0])) | 0;

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
                yi = (yp + x) << 2;

                r += (sy.r = px[yi]);
                g += (sy.g = px[yi + 1]);
                b += (sy.b = px[yi + 2]);
                a += (sy.a = px[yi + 3]);

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
                    px[p + 3] = pa = (a * ms) >>> ss;
                    if (pa > 0) {
                        px[p] = ((r * ms) >>> ss);
                        px[p + 1] = ((g * ms) >>> ss);
                        px[p + 2] = ((b * ms) >>> ss);
                    } else {
                        px[p] = px[p + 1] = px[p + 2] = 0;
                    }

                    p = (x + (((p = y + ryp1) < h1 ? p : h1) * w)) << 2;

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
                    px[p + 3] = pa = (a * ms) >>> ss;
                    if (pa > 0) {
                        pa = 255 / pa;
                        px[p] = ((r * ms) >>> ss) * pa;
                        px[p + 1] = ((g * ms) >>> ss) * pa;
                        px[p + 2] = ((b * ms) >>> ss) * pa;
                    } else {
                        px[p] = px[p + 1] = px[p + 2] = 0;
                    }

                    p = (x + (((p = y + ryp1) < h1 ? p : h1) * w)) << 2;

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

InteractionManager.prototype.addEvents = function() {
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

InteractionManager.prototype.removeEvents = function() {
    if (!this.canvas) {
        return;
    }

    window.document.removeEventListener('mousemove', this.onMouseMove, true);
    this.canvas.removeEventListener('mousedown', this.onMouseDown, true);
    this.canvas.removeEventListener('click', this.onClick, true);
    this.canvas.removeEventListener('mouseout',  this.onMouseOut, true);
    this.canvas.removeEventListener('mouseover', this.onMouseOver, true);

    this.canvas.removeEventListener('touchstart', this.onTouchStart, true);
    this.canvas.removeEventListener('touchend',  this.onTouchEnd, true);
    this.canvas.removeEventListener('touchmove', this.onTouchMove, true);

    window.removeEventListener('mouseup',  this.onMouseUp, true);

    this.eventsAdded = false;
};

InteractionManager.prototype.onMouseMove = function(event) {
    var eventd = this.fixCoord(event);

    this.cursor = this.defaultCursorStyle;
    this.processInteractive(this.stage, eventd, this.processMouseMove, true);

    if (this.currentCursorStyle !== this.cursor) {
        this.currentCursorStyle = this.cursor;
        this.canvas.style.cursor = this.cursor;
    }

    this.emit('mousemove',eventd);
};

InteractionManager.prototype.processMouseMove = function(displayObject, event, hit) {
    this.processMouseOverOut(displayObject, event, hit);
    if (hit) {
        this.dispatchEvent(displayObject, 'mousemove', event);
    }
};

InteractionManager.prototype.processMouseOverOut = function(displayObject, event, hit) {
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

InteractionManager.prototype.onMouseDown = function(event) {
    if (this.autoPreventDefault) {
        event.preventDefault();
    }
    var eventd = this.fixCoord(event);
    this.processInteractive(this.stage, eventd, this.processMouseDown, true);

    this.emit('mousedown',eventd);
};

InteractionManager.prototype.processMouseDown = function(displayObject, event, hit) {
    if (hit) {
        // displayObject._mousedowned = true;
        this.dispatchEvent(displayObject, event.type, event);
    }
};

InteractionManager.prototype.onClick = function(event) {
    if (this.autoPreventDefault) {
        event.preventDefault();
    }
    var eventd = this.fixCoord(event);
    this.processInteractive(this.stage, eventd, this.processClick, true);

    this.emit('click',eventd);
};

InteractionManager.prototype.processClick = function(displayObject, event, hit) {
    if (hit) {
        // displayObject._mousedowned = true;
        this.dispatchEvent(displayObject, event.type, event);
    }
};

InteractionManager.prototype.onMouseUp = function(event) {
    // if (this.autoPreventDefault) {
    //     event.preventDefault();
    // }
    var eventd = this.fixCoord(event);
    this.processInteractive(this.stage, eventd, this.processMouseUp, true);

    this.emit('mouseup',eventd);
};

InteractionManager.prototype.processMouseUp = function(displayObject, event, hit) {
    if (hit) {
        // displayObject._mousedowned = false;
        this.dispatchEvent(displayObject, event.type, event);
    }
};

InteractionManager.prototype.onMouseOut = function(event) {
    var eventd = this.fixCoord(event);

    this.processInteractive(this.stage, eventd, this.processMouseOverOut, false);

    this.emit('mouseout', event);
};

InteractionManager.prototype.onMouseOver = function(event) {
    this.emit('mouseover', event);
};

InteractionManager.prototype.onTouchStart = function(event) {
    // if (this.autoPreventDefault) {
        // event.preventDefault();
    // }
    // console.log(event);
    var eventd = this.fixCoord(event);
    this.processInteractive(this.stage, eventd, this.processTouchStart, true);

    this.emit('touchstart', eventd);
};

InteractionManager.prototype.processTouchStart = function(displayObject, event, hit) {
    if (hit) {
        displayObject._touchstarted = true;
        this.dispatchEvent(displayObject, 'touchstart', event);
    }
};

InteractionManager.prototype.onTouchEnd = function(event) {
    // if (this.autoPreventDefault) {
        // event.preventDefault();
    // }
    var eventd = this.fixCoord(event);
    this.processInteractive(this.stage, eventd, this.processTouchEnd, this.strictMode);

    this.emit('touchend', eventd);
};

InteractionManager.prototype.processTouchEnd = function(displayObject, event) {
    if (displayObject._touchstarted) {
        displayObject._touchstarted = false;
        this.dispatchEvent(displayObject, 'touchend', event);
    }
};

InteractionManager.prototype.onTouchMove = function(event) {
    if (this.autoPreventDefault) {
        event.preventDefault();
    }
    var eventd = this.fixCoord(event);
    this.processInteractive(this.stage, eventd, this.processTouchMove, this.strictMode);

    this.emit('touchmove', eventd);
};

InteractionManager.prototype.processTouchMove = function(displayObject, event, hit) {
    if ((!this.strictMode && displayObject._touchstarted) || hit) {
        this.dispatchEvent(displayObject, 'touchmove', event);
    }
};

InteractionManager.prototype.processInteractive = function(object, event, func, hitTest) {
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

InteractionManager.prototype.dispatchEvent = function(displayObject, eventString, event) {
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

InteractionManager.prototype.fixCoord = function(event) {
    var eventd = new InteractionData(),
        offset = this.getPos(this.canvas);
    eventd.originalEvent = event;
    eventd.type = event.type;

    eventd.ratio = this.canvas.width / this.canvas.offsetWidth;
    if (event.touches) {
        eventd.touches = [];
        if (event.touches.length > 0) {
            for (var i = 0; i < event.touches.length; i++) {
                eventd.touches[i] = {};
                eventd.touches[i].global = new Point(
                    (event.touches[i].pageX - offset.x) * eventd.ratio,
                    (event.touches[i].pageY - offset.y) * eventd.ratio
                );
            }
            eventd.global = eventd.touches[0].global;
        }
    } else {
        eventd.global.x = (event.pageX - offset.x) * eventd.ratio;
        eventd.global.y = (event.pageY - offset.y) * eventd.ratio;
    }
    return eventd;
};

InteractionManager.prototype.getPos = function(obj) {
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

// import { Matrix } from './math/Matrix';
// import { Eventer } from '../eventer/Eventer';
/**
 * 舞台对象，继承至Eventer
 *
 *
 * ```js
 * var stage = new JC.Stage('demo_canvas','#fff');
 * ```
 *
 * @class
 * @extends JC.Container
 * @memberof JC
 */
function Stage(options) { // canvas, bgColor, resolution
    options = options || {};
    Container.call(this);

    /**
     * 场景的canvas的dom
     *
     * @member {CANVAS}
     */
    this.canvas = UTILS.isString(options.dom) ? document.getElementById(options.dom) : options.dom;

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
     */
    this._resolution = 0;

    /**
     * 场景分辨率
     *
     * @member {Number}
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
    this.enableFPS = true;

    this.interactionManager = new InteractionManager(this);

    this._interactive = false;


    this.interactiveOnChange = function() {
        if (this.interactive) {
            this.interactionManager.addEvents();
        } else {
            this.interactionManager.removeEvents();
        }
    };

    /**
     * 设置canvas是否可交互
     *
     * @member {Boolean}
     */
    this.interactive = true;

    this.proxyOn();
}
Stage.prototype = Object.create(Container.prototype);

Stage.prototype.proxyOn = function() {
    var This = this;
    this.interactionManager.on('click', function(ev){
        This.emit('click', ev);
    });

    this.interactionManager.on('mousemove', function(ev){
        This.emit('mousemove', ev);
    });

    this.interactionManager.on('mousedown', function(ev){
        This.emit('mousedown', ev);
    });

    this.interactionManager.on('mouseout', function(ev){
        This.emit('mouseout', ev);
    });

    this.interactionManager.on('mouseover', function(ev){
        This.emit('mouseover', ev);
    });

    this.interactionManager.on('touchstart', function(ev){
        This.emit('touchstart', ev);
    });

    this.interactionManager.on('touchend', function(ev){
        This.emit('touchend', ev);
    });

    this.interactionManager.on('touchmove', function(ev){
        This.emit('touchmove', ev);
    });

    this.interactionManager.on('mouseup', function(ev){
        This.emit('mouseup', ev);
    });
};

/**
 * 标记场景是否可交互，涉及到是否进行事件检测
 *
 * @member {Boolean}
 * @name interactive
 * @memberof JC.Stage#
 */
Object.defineProperty(Stage.prototype, 'interactive', {
    get: function() {
        return this._interactive;
    },
    set: function(value) {
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
    get: function() {
        return this._resolution;
    },
    set: function(value) {
        if (this._resolution !== value) {
            this._resolution = value;
            this.worldTransform.identity().scale(value, value);
            this.resize();
        }
    }
});

/**
 * 舞台尺寸设置
 *
 *
 * @param w {number} canvas的width值
 * @param h {number} canvas的height值
 * @param sw {number} canvas的style.width值，需将舞台属性autoStyle设置为true
 * @param sh {number} canvas的style.height值，需将舞台属性autoStyle设置为true
 */
Stage.prototype.resize = function(w, h, sw, sh) {
    if (UTILS.isNumber(w) && UTILS.isNumber(h)) {
        this.realWidth = w;
        this.realHeight = h;
    } else {
        w = this.realWidth;
        h = this.realHeight;
    }
    this.width = this.canvas.width = w * this.resolution;
    this.height = this.canvas.height = h * this.resolution;
    if (this.autoStyle && sw && sh) {
        this.canvas.style.width = UTILS.isString(sw) ? sw : sw + 'px';
        this.canvas.style.height = UTILS.isString(sh) ? sh : sh + 'px';
    }
};

/**
 * 渲染舞台内的所有可见渲染对象
 *
 *
 */
Stage.prototype.render = function() {
    this.emit('prerender');

    this.timeline();

    if (this.autoUpdate) this.update();

    this.ctx.setTransform(this.worldTransform.a, this.worldTransform.b, this.worldTransform.c, this.worldTransform.d, this.worldTransform.tx, this.worldTransform.ty);
    if (this.autoClear) this.ctx.clearRect(0, 0, this.width, this.height);

    for (var i = 0, l = this.childs.length; i < l; i++) {
        var child = this.childs[i];
        if (!child.isVisible() || !child._ready) continue;
        child.render(this.ctx);
    }

    this.emit('postrender');
};

/**
 * 更新场景内物体状态
 *
 *
 */
Stage.prototype.update = function() {
    this.updatePosture(this.timeScale * this.snippet);
};

/**
 * 引擎的时间轴
 *
 * @method timeline
 * @private
 */
Stage.prototype.timeline = function() {
    this.snippet = Date.now() - this.pt;
    if (this.pt === null || this.snippet > 200) {
        this.pt = Date.now();
        this.snippet = Date.now() - this.pt;
    }

    if(this.enableFPS){
        this._renderTimes++;
        this._takeTime += Math.max(15, this.snippet);
        this.fps = 1000 / Math.max(15, this.snippet) >> 0;
        this.averageFps = 1000 / (this._takeTime / this._renderTimes) >> 0;
    }

    this.pt += this.snippet;
};

/**
 * 更新场景内物体的姿态
 *
 *
 * @method updatePosture
 * @private
 */
Stage.prototype.updatePosture = function(snippet) {
    for (var i = 0, l = this.childs.length; i < l; i++) {
        var child = this.childs[i];
        child.updatePosture(snippet);
    }
};

exports.TWEEN = TWEEN;
exports.UTILS = UTILS;
exports.Texture = Texture;
exports.Loader = Loader;
exports.loaderUtil = loaderUtil;
exports.Bounds = Bounds;
exports.Point = Point;
exports.Rectangle = Rectangle;
exports.Polygon = Polygon;
exports.Circle = Circle;
exports.Ellipse = Ellipse;
exports.Matrix = Matrix;
exports.IDENTITY = IDENTITY;
exports.TEMP_MATRIX = TEMP_MATRIX;
exports.DisplayObject = DisplayObject;
exports.Container = Container;
exports.Sprite = Sprite;
exports.Graphics = Graphics;
exports.TextFace = TextFace;
exports.BlurFilter = BlurFilter;
exports.Stage = Stage;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=jcc2d.js.map
