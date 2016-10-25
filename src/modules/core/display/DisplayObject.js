import { Matrix, TEMP_MATRIX, } from '../math/Matrix';
import { Point } from '../math/Point';
import { Eventer } from '../../eventer/Eventer';
import { Animation } from '../../animation/Animation';
import { UTILS } from '../../util/UTILS';
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
     * 当前对象是否穿透自身的事件监测
     *
     * @member {Boolean}
     */
    this.passEvent = false;

    /**
     * 当前对象的事件监测边界
     *
     * @member {JC.Shape}
     * @private
     */
    this.bound = null;


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
 * @method setVal
 * @private
 */
DisplayObject.prototype.setVal = function(vals) {
    if (vals === undefined) return;
    for (var key in vals) {
        if (this[key] === undefined) {
            continue;
        } else {
            this[key] = vals[key];
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
 * 设置显示对象的监测区域
 *
 * @param shape {JC.Polygon|JC.Rectangle} JC内置形状类型的实例
 * @param needless {boolean} 当该值为true，当且仅当this.bound为空时才会更新点击区域。默认为false，总是更新点击区域。
 * @return {Array}
 */
DisplayObject.prototype.setBound = function(shape, needless) {
    if (this.bound !== null && needless) return;
    this.bound = shape;
};

/**
 * 监测坐标点是否在多变性内
 *
 * @method contains
 * @private
 */
DisplayObject.prototype.contains = function (global) {
    if (this.bound === null) return false;
    var point = new Point();
    this.worldTransform.applyInverse(global, point);
    return this.bound && this.bound.contains(point.x, point.y);
};

export { DisplayObject };
