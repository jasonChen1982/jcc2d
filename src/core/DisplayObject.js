/* eslint max-len: "off" */

import {Matrix, TEMP_MATRIX, IDENTITY} from '../math/Matrix';
import {Point} from '../math/Point';
import {Eventer} from '../eventer/Eventer';
import {Animation} from '../animation/Animation';

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
  get: function() {
    return this.scaleX;
  },
  set: function(scale) {
    this.scaleX = this.scaleY = scale;
  },
});

/**
 * 对渲染对象进行x、y轴同时缩放
 *
 * @name scale
 * @member {Number}
 * @memberof JC.DisplayObject#
 */
Object.defineProperty(DisplayObject.prototype, 'trackedPointers', {
  get: function() {
    if (this._trackedPointers === undefined) this._trackedPointers = {};
    return this._trackedPointers;
  },
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
DisplayObject.prototype.animate = function(options, clear) {
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
DisplayObject.prototype.motion = function(options, clear) {
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
DisplayObject.prototype.keyFrames = function(options, clear) {
  return this.animation.keyFrames(options, clear);
};

/**
 * 播放一个bodymovin动画
 *
 * ```js
 * import data from './animations/data.js';
 * display.bodymovin({
 *   keyframes: data.layers[3],
 *   frameRate: data.fr,
 *   ignoreProps: [ 'position', 'scaleX ],
 * }, clear).on('complete', function() {
 *   console.log('end queues');
 * });
 * ```
 *
 * @memberof JC.DisplayObject
 * @param {Object} options 动画配置参数
 * @param {Object} options.keyframes lottie 动画数据
 * @param {Number} [options.frameRate] lottie 动画帧率，对应 json 里面的 fr
 * @param {Array} [options.ignoreProps] 忽略 keyframes 动画数据中的哪些属性的动画描述 position|x|y|pivot|pivotX|pivotY|scale|scaleX|scaleY|rotation|alpha
 * @param {Number} [options.repeats] 设置动画执行完成后再重复多少次，优先级没有infinite高
 * @param {Boolean} [options.infinite] 设置动画无限循环，优先级高于repeats
 * @param {Boolean} [options.alternate] 设置动画是否偶数次回返
 * @param {Number} [options.duration] 设置动画执行时间 默认 300ms
 * @param {Number} [options.wait] 设置动画延迟时间，在重复动画不会生效 默认 0ms
 * @param {Number} [options.delay] 设置动画延迟时间，在重复动画也会生效 默认 0ms
 * @param {Function} [options.onUpdate] 设置动画更新时的回调函数
 * @param {Function} [options.onComplete] 设置动画结束时的回调函数，如果infinite为true该事件将不会触发
 * @param {Boolean} clear 是否清除该对象上之前所有的动画
 * @return {Bodymovin}
 */
DisplayObject.prototype.bodymovin = function(options, clear) {
  return this.animation.bodymovin(options, clear);
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
DisplayObject.prototype.runners = function(options, clear) {
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
DisplayObject.prototype.queues = function(runner, options = {}, clear) {
  return this.animation.queues(runner, options, clear);
};

/**
 * 检查对象是否可见
 *
 * @return {Boolean} 对象是否可见
 */
DisplayObject.prototype.isVisible = function() {
  return !!(this.visible && this.alpha > 0 && this.scaleX * this.scaleY !== 0);
};

/**
 * 移除对象上的遮罩
 */
DisplayObject.prototype.removeMask = function() {
  this.mask = null;
};

/**
 * 设置对象上的属性值
 *
 * @private
 * @param {Object} props
 */
DisplayObject.prototype.setProps = function(props) {
  if (props === undefined) return;
  for (let key in props) {
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
DisplayObject.prototype.updateTransform = function(rootMatrix) {
  const pt = rootMatrix || (this.hierarchy && this.hierarchy.worldTransform) || (this.parent && this.parent.worldTransform) || IDENTITY;
  const wt = this.worldTransform;
  const worldAlpha = (this.parent && this.parent.worldAlpha) || 1;

  let a;
  let b;
  let c;
  let d;
  let tx;
  let ty;

  const pox = this.pivotX + this.originX;
  const poy = this.pivotY + this.originY;

  if (this.skewX || this.skewY) {
    TEMP_MATRIX.setTransform(
      this.x,
      this.y,
      this.pivotX,
      this.pivotY,
      this.scaleX,
      this.scaleY,
      this.rotation,
      this.skewX,
      this.skewY,
      this.originX,
      this.originY
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
DisplayObject.prototype.updateAnimation = function(snippet) {
  this.animation.update(snippet);
};

/**
 * 设置矩阵和透明度到当前绘图上下文
 *
 * @private
 * @param {context} ctx
 */
DisplayObject.prototype.setTransform = function(ctx) {
  const matrix = this.worldTransform;
  ctx.globalAlpha = this.worldAlpha;
  ctx.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
};

/**
 * 获取物体相对于canvas世界坐标系的坐标位置
 *
 * @return {Object}
 */
DisplayObject.prototype.getGlobalPos = function() {
  return {x: this.worldTransform.tx, y: this.worldTransform.ty};
};

/**
 * 设置显示对象的事件检测区域
 *
 * @param {JC.Polygon|JC.Rectangle} shape JC内置形状类型的实例
 * @param {Boolean} clock 是否锁住当前设置的监测区域不会被内部更新修改。
 */
DisplayObject.prototype.setArea = function(shape, clock) {
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
DisplayObject.prototype.contains = function(global) {
  if (this.eventArea === null) return false;
  const point = new Point();
  this.worldTransform.applyInverse(global, point);
  return this.eventArea && this.eventArea.contains(point.x, point.y);
};

export {DisplayObject};
