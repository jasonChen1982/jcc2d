import { Matrix, TEMP_MATRIX,  } from '../math/Matrix';
import { Eventer } from '../../eventer/Eventer';
import { Animation } from '../../animation/Animation';
/**
 * 显示对象的基类
 *
 * @class
 * @memberof JC
 */
function DisplayObject(){
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
    this.event = new Eventer();

    /**
     * 当前对象是否穿透自身的事件监测
     *
     * @member {Boolean}
     */
    this.passEvent = false;

    /**
     * 当前对象的事件监测边界
     *
     * @member {Array}
     * @private
     */
    this.bound = [];


    /**
     * 当前对象的动画管家
     *
     * @member {Array}
     * @private
     */
    this.Animation = new Animation(this);
}

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
DisplayObject.prototype.fromTo = function(opts,clear){
    return this.Animator.fromTo(opts,clear);
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
DisplayObject.prototype.to = function(opts,clear){
    return this.Animator.to(opts,clear);
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
DisplayObject.prototype.motion = function(opts,clear){
    return this.Animator.motion(opts,clear);
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
DisplayObject.prototype.keyFrames = function(opts,clear){
    return this.Animator.keyFrames(opts,clear);
};

/**
 * 检测是否可见
 *
 * @method isVisible
 * @private
 */
DisplayObject.prototype.isVisible = function(){
    return !!(this.visible && this.alpha>0 && this.scaleX*this.scaleY!==0);
};

/**
 * 移除遮罩
 *
 */
DisplayObject.prototype.removeMask = function(){
    this.mask = null;
};

/**
 * 设置对象上的属性值
 *
 * @method setVal
 * @private
 */
DisplayObject.prototype.setVal = function(vals){
    if(vals===undefined)return;
    for(var key in vals){
        if(this[key]===undefined){
            continue;
        }else{
            this[key] = vals[key];
        }
    }
};
DisplayObject.prototype.updateMe = function(){
    var pt = this.parent.worldTransform;
    var wt = this.worldTransform;

    var a, b, c, d, tx, ty;

    if(this.skewX || this.skewY){

        TEMP_MATRIX.setTransform(
            this.x,
            this.y,
            this.pivotX,
            this.pivotY,
            this.scaleX,
            this.scaleY,
            this.rotation*JC.DTR,
            this.skewX*JC.DTR,
            this.skewY*JC.DTR
        );

        wt.a  = JC.TEMP_MATRIX.a  * pt.a + JC.TEMP_MATRIX.b  * pt.c;
        wt.b  = JC.TEMP_MATRIX.a  * pt.b + JC.TEMP_MATRIX.b  * pt.d;
        wt.c  = JC.TEMP_MATRIX.c  * pt.a + JC.TEMP_MATRIX.d  * pt.c;
        wt.d  = JC.TEMP_MATRIX.c  * pt.b + JC.TEMP_MATRIX.d  * pt.d;
        wt.tx = JC.TEMP_MATRIX.tx * pt.a + JC.TEMP_MATRIX.ty * pt.c + pt.tx;
        wt.ty = JC.TEMP_MATRIX.tx * pt.b + JC.TEMP_MATRIX.ty * pt.d + pt.ty;
    }else{
        if(this.rotation % 360){
            if(this.rotation !== this.rotationCache){
                this.rotationCache = this.rotation;
                this._sr = Math.sin(this.rotation*JC.DTR);
                this._cr = Math.cos(this.rotation*JC.DTR);
            }

            a  =  this._cr * this.scaleX;
            b  =  this._sr * this.scaleX;
            c  = -this._sr * this.scaleY;
            d  =  this._cr * this.scaleY;
            tx =  this.x;
            ty =  this.y;

            if(this.pivotX || this.pivotY){
                tx -= this.pivotX * a + this.pivotY * c;
                ty -= this.pivotX * b + this.pivotY * d;
            }
            wt.a  = a  * pt.a + b  * pt.c;
            wt.b  = a  * pt.b + b  * pt.d;
            wt.c  = c  * pt.a + d  * pt.c;
            wt.d  = c  * pt.b + d  * pt.d;
            wt.tx = tx * pt.a + ty * pt.c + pt.tx;
            wt.ty = tx * pt.b + ty * pt.d + pt.ty;
        }else{
            a  = this.scaleX;
            d  = this.scaleY;

            tx = this.x - this.pivotX * a;
            ty = this.y - this.pivotY * d;

            wt.a  = a  * pt.a;
            wt.b  = a  * pt.b;
            wt.c  = d  * pt.c;
            wt.d  = d  * pt.d;
            wt.tx = tx * pt.a + ty * pt.c + pt.tx;
            wt.ty = tx * pt.b + ty * pt.d + pt.ty;
        }
    }
    this.worldAlpha = this.alpha * this.parent.worldAlpha;
};
DisplayObject.prototype.upAnimation = function(snippet){
    this.Animator.update(snippet);
};
DisplayObject.prototype.setTransform = function(ctx){
    var matrix = this.worldTransform;
    ctx.globalAlpha = this.worldAlpha;
    ctx.setTransform(matrix.a,matrix.b,matrix.c,matrix.d,matrix.tx,matrix.ty);
};
/**
 * 获取物体相对于canvas世界坐标系的坐标位置
 *
 * @return {object}
 */
DisplayObject.prototype.getGlobalPos = function(){
    return {x: this.worldTransform.tx,y: this.worldTransform.ty};
};
/**
 * 显示对象的事件绑定函数
 *
 * @param type {String} 事件类型
 * @param fn {Function} 回调函数
 */
DisplayObject.prototype.on = function(type,fn){
    this.event.on(type,fn);
};
/**
 * 显示对象的事件解绑函数
 *
 * @param type {String} 事件类型
 * @param fn {Function} 注册时回调函数的引用
 */
DisplayObject.prototype.off = function(type,fn){
    this.event.off(type,fn);
};
/**
 * 显示对象的一次性事件绑定函数
 *
 * @param type {String} 事件类型
 * @param fn {Function} 回调函数
 */
DisplayObject.prototype.once = function(type,fn){
    this.event.once(type,fn);
};
/**
 * 获取当前坐标系下的监测区域
 *
 * @method getBound
 * @private
 */
DisplayObject.prototype.getBound = function (){
    var bound = [],
        l = this.bound.length>>1;

    for (var i = 0; i < l; i++) {
        var p = this.worldTransform.apply({x: this.bound[i*2],y: this.bound[i*2+1]});
        bound[i*2  ] = p.x;
        bound[i*2+1] = p.y;
    }
    return bound;
};
/**
 * 设置显示对象的监测区域
 *
 * @param points {Array} 区域的坐标点 [x0,y0 ..... xn,yn]
 * @param needless {boolean} 当该值为true，当且仅当this.bound为空时才会更新点击区域。默认为false，总是更新点击区域。
 * @return {Array}
 */
DisplayObject.prototype.setBound = function (points,needless){
    var l = this.bound.length;
    if(l>4&&needless)return;
    points = points||[
        -this.regX,this.regY,
        -this.regX,this.regY-this.height,
        -this.regX+this.width,this.regY-this.height,
        -this.regX+this.width,this.regY
    ];
    this.bound = points;
};
DisplayObject.prototype.ContainsPoint = function (p,px,py){
    var n = p.length>>1;
    var ax, ay = p[2*n-3]-py, bx = p[2*n-2]-px, by = p[2*n-1]-py;

    /* eslint no-undef: "off" */
    //var lup = by > ay;
    for(var i=0; i<n; i++){
        ax = bx;  ay = by;
        bx = p[2*i  ] - px;
        by = p[2*i+1] - py;
        if(ay==by) continue;
        lup = by>ay;
    }

    var depth = 0;
    for(i=0; i<n; i++){
        ax = bx;  ay = by;
        bx = p[2*i  ] - px;
        by = p[2*i+1] - py;
        if(ay< 0 && by< 0) continue;
        if(ay> 0 && by> 0) continue;
        if(ax< 0 && bx< 0) continue;

        if(ay==by && Math.min(ax,bx)<=0) return true;
        if(ay==by) continue;

        var lx = ax + (bx-ax)*(-ay)/(by-ay);
        if(lx===0) return true;
        if(lx> 0) depth++;
        if(ay===0 &&  lup && by>ay) depth--;
        if(ay===0 && !lup && by<ay) depth--;
        lup = by>ay;
    }
    return (depth & 1) == 1;
};

export { DisplayObject };
