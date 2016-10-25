import { Matrix } from './math/Matrix';
import { Container } from './display/Container';
import { Eventer } from '../eventer/Eventer';
import { InteractionManager } from '../eventer/InteractionManager';
import { UTILS } from '../util/UTILS';

/**
 * 舞台对象，继承至Container
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
function Stage(canvas, bgColor) {
    Eventer.call(this);

    /**
     * 场景的canvas的dom
     *
     * @member {CANVAS}
     */
    this.canvas = UTILS.isString(canvas) ? document.getElementById(canvas) : canvas;

    /**
     * 场景的canvas的绘图环境
     *
     * @member {context2d}
     */
    this.ctx = this.canvas.getContext('2d');
    this.canvas.style.backgroundColor = bgColor || 'transparent';

    /**
     * 渲染对象的列表
     *
     * @member {Array}
     */
    this.childs = [];

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
    this.width = this.canvas.width;

    /**
     * canvas的高度
     *
     * @member {Number}
     */
    this.height = this.canvas.height;

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

    /**
     * 自身及后代动画的缩放比例
     *
     * @member {Number}
     */
    this.timeScale = 1;

    /**
     * 当前对象所应用的矩阵状态
     *
     * @member {JC.Matrix}
     * @private
     */
    this.worldTransform = new Matrix();

    /**
     * 根层级的透明参数
     *
     * @member {Number}
     * @private
     */
    this.worldAlpha = 1;


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
}
Stage.prototype = Object.create(Eventer.prototype);

/**
 * 对渲染对象进行x、y轴同时缩放
 *
 * @member {Boolean}
 * @name interactive
 * @memberof JC.InteractionManager#
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
 * 向容器添加一个物体
 *
 * ```js
 * stage.adds(sprite,sprite2,text3,graphice);
 * ```
 *
 * @param object {JC.Container}
 * @return {JC.Container}
 */
Stage.prototype.adds = function(object) {
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
    } else {
        console.error('adds: object not an instance of Container', object);
    }
    return this;
};

/**
 * 从容器移除一个物体
 *
 * ```js
 * stage.remove(sprite,sprite2,text3,graphice);
 * ```
 *
 * @param object {JC.Container}
 * @return {JC.Container}
 */
Stage.prototype.remove = function(object) {
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
 * 舞台尺寸设置
 *
 *
 * @param w {number} canvas的width值
 * @param h {number} canvas的height值
 * @param sw {number} canvas的style.width值，需将舞台属性autoStyle设置为true
 * @param sh {number} canvas的style.height值，需将舞台属性autoStyle设置为true
 */
Stage.prototype.resize = function(w, h, sw, sh) {
    this.width = this.canvas.width = w;
    this.height = this.canvas.height = h;
    if (this.autoStyle && sw && sh) {
        this.canvas.style.width = sw + 'px';
        this.canvas.style.height = sh + 'px';
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

    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
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
        this.averageFps = this._takeTime / this._renderTimes >> 0;
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
