// import { Matrix } from './math/Matrix';
import { Container } from './display/Container';
// import { Eventer } from '../eventer/Eventer';
import { InteractionManager } from '../eventer/InteractionManager';
import { UTILS } from '../util/UTILS';

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

export { Stage };
