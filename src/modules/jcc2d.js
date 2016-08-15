
/**
 * 将角度转化成弧度
 *
 * @name DTR
 * @memberof JC
 * @property {JC.DTR}
 */

JC.DTR = Math.PI/180;

function noop(){}


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
JC.Matrix = Matrix;

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
    if(!this.array) this.array = new JC.Float32Array(9);
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
JC.identityMatrix = new Matrix();



/**
 * 动画引擎
 *
 * @class
 * @memberof JC
 */
function Animate(){
	this.MST = 0;
	this.MAT = 300;
	this.fx = 'easeBoth';
	this.complete = noop;
	this.moving = false;
	this.infinity = false;
	this.alternate = false;
	this.repeats = 0;
}
/**
 * 开启动画
 *
 *```js
 *
 * // 扩展缓动函数，缓动函数库详见目录下的util/tween.js
 *
 * JC.TWEEN.extend({    
 *    bounceOut: function(t, b, c, d){
 *        if ((t/=d) < (1/2.75)) {
 *            return c*(7.5625*t*t) + b;
 *        } else if (t < (2/2.75)) {
 *            return c*(7.5625*(t-=(1.5/2.75))*t + 0.75) + b;
 *        } else if (t < (2.5/2.75)) {
 *            return c*(7.5625*(t-=(2.25/2.75))*t + 0.9375) + b;
 *        }
 *        return c*(7.5625*(t-=(2.625/2.75))*t + 0.984375) + b;
 *    }
 * });
 * var dispayObj = new JC.Sprite();
 * dispayObj.moveTween({
 *   attr: {
 *      x: 200, // x轴移动到200的位置
 *      y: 100, // y轴移动到100的位置
 *      rotation: 360, // 旋转360
 *      scaleX: 2, // x轴缩放到2
 *      scaleY: .5, // y轴缩放到0.5
 *      alpha: 0, // 透明度变化到0
 *   },
 *   fx: 'bounceOut', // 执行动画使用的缓动函数 默认值为 easeBoth
 *   repeats: 10, // 动画运动完后再重复10次
 *   infinity: true, // 无限循环动画
 *   alternate: true, // 偶数次的时候动画回放
 *   time: 1000, // 动画时长 ms单位 默认 300ms
 *   complete: function(){ console.log('end'); } // 动画执行结束回调
 * });
 * ```
 *
 * @param opts {object} 配置
 */
Animate.prototype.moveTween = function(opts){
	this.MST = Date.now();
	this.MATR = opts.attr||this.MATR;
	this.MAT = opts.time||this.MAT;
	this.fx = opts.fx||this.fx;
	this.complete = opts.complete||this.complete;
	this.infinity = opts.infinity||this.infinity;
	this.alternate = opts.alternate||this.alternate;
	this.repeats = opts.repeats||this.repeats;
	this.moving = true;
	this.MATRC = {};
	for(var i in this.MATR){
		this.MATRC[i] = this[i];
	}
};
/**
 * 对外接口
 *
 * @method manager
 * @private
 */
Animate.prototype.manager = function(){
	if(!this.moving)return;
	var now = Date.now();
	if(now < this.MST+this.MAT){
		this.nextPose();
	}else{
		this.setVal(this.MATR);
		if(this.repeats>0||this.infinity){
			this.repeats>0&&--this.repeats;
			if(this.alternate){
				this.moveTween({attr: this.MATRC});
			}else{
				this.setVal(this.MATRC);
				this.moveTween({attr: this.MATR});
			}
		}else{
			this.moving = false;
			this.complete();
			if(now>this.MST)this.complete = noop;
		}
	}
};
/**
 * 动画下一个位置
 *
 * @method nextPose
 * @private
 */
Animate.prototype.nextPose = function(){
	var now=Date.now()-this.MST;
	for(var i in this.MATR){
		this[i] = JC.TWEEN[this.fx]( now , this.MATRC[i] , this.MATR[i] - this.MATRC[i] , this.MAT );
	}
};



/**
 * 显示对象的基类
 *
 * @class
 * @extends JC.Animate
 * @memberof JC
 */
function DisplayObject(){
	Animate.call( this );
	this.visible = true;
	this.worldAlpha = 1;
	this.alpha = 1;

	this.scaleX = 1;
	this.scaleY = 1;

	this.skewX = 0;
	this.skewY = 0;

	this.rotation = 0;
	this.rotationCache = 0;
    this._sr = 0;
    this._cr = 1;
	
	this.x = 0;
	this.y = 0;
	
	this.pivotX = 0;
	this.pivotY = 0;

	this.mask = null;

	this.parent = null;
	this.worldTransform = new Matrix();

    this.event = new JC.Eventer();
    // this.interactive = false;
    // this._interactive = false;
    this.passEvent = false;
    this.bound = [];
}
JC.DisplayObject = DisplayObject;
DisplayObject.prototype = Object.create( Animate.prototype );
DisplayObject.prototype.constructor = JC.DisplayObject;

/**
 * 检测是否可见
 *
 * @method isVisible
 * @private
 */
DisplayObject.prototype.isVisible = function(){
	return !!(this.visible && this.alpha>0 && this.scaleX*this.scaleY>0);
};

/**
 * 移除遮罩
 *
 */
DisplayObject.prototype.removeMask = function(){
	this.mask = null;
};
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
    this.worldAlpha = this.alpha * this.parent.worldAlpha;
};
DisplayObject.prototype.updateTransform = function(){
	this.manager();
	this.updateMe();
};
DisplayObject.prototype.setTransform = function(ctx){
	var matrix = this.worldTransform;
	ctx.globalAlpha = this.worldAlpha;
	ctx.setTransform(matrix.a,matrix.b,matrix.c,matrix.d,matrix.tx,matrix.ty);
};
/**
 * 显示对象的事件绑定函数
 *
 * @param type {String} 事件类型
 * @param fn {Function} 回调函数
 */
DisplayObject.prototype.on = function(type,fn){
    this.event.on(type,fn);
    // if(!this.interactive)this.interactive = true;
};
/**
 * 显示对象的事件解绑函数
 *
 * @param type {String} 事件类型
 * @param fn {Function} 注册时回调函数的引用
 */
DisplayObject.prototype.off = function(type,fn){
    this.event.off(type,fn);
    // var re = false;
    // for (var lis in this.event.listeners) {
    //     if(this.event.listeners[lis].length>0){
    //         re = true;
    //         break;
    //     }
    // }
    // if(!re)this.interactive = false;
};
/**
 * 显示对象的一次性事件绑定函数
 *
 * @param type {String} 事件类型
 * @param fn {Function} 回调函数
 */
DisplayObject.prototype.once = function(type,fn){
    var This = this,
        cb = function(ev){
            fn&&fn(ev);
            This.event.off(type,cb);
        };
    this.event.on(type,cb);
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
 * @return {Array}
 */
DisplayObject.prototype.setBound = function (points){
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
/**
 * 被观察到数据，会根据是否有绑定事件而更新
 *
 * @property interactive
 * @type Boolean
 * @default false
 */
// Object.defineProperty(JC.DisplayObject.prototype, 'interactive', {
//     get: function() {
//         return this._interactive;
//     },
//     set: function(value) {
//         this._interactive = !!value;

//         if(this.parent&&this.parent.type!=='stage'){
//             var paI = this.parent._checkInteractive();
//             if(this.parent.interactive!==paI)this.parent.interactive = paI;
//         }
//     }
// });




/**
 * 显示对象容器，继承至DisplayObject
 *
 *```js
 * var container = new JC.Container();
 * container.addChilds(sprite);
 * ```
 *
 * @class
 * @extends JC.DisplayObject
 * @memberof JC
 */
function Container(){
	JC.DisplayObject.call( this );
    this.cds = [];
}
JC.Container = Container;
Container.prototype = Object.create( JC.DisplayObject.prototype );
Container.prototype.constructor = JC.Container;


// Container.prototype._checkInteractive = function(){
//     for (var i = 0,l=this.cds.length; i<l; i++) {
//         if(this.cds[i].interactive)return true;
//     }
//     return false;
// };

/**
 * 向容器添加一个物体
 * 
 *```js
 * container.addChilds(sprite,sprite2,text3,graphice);
 * ```
 *
 * @param child {JC.DisplayObject}
 * @return {JC.DisplayObject}
 */
Container.prototype.addChilds = function (cd){
    if(cd === undefined)return cd;
    var l = arguments.length;
    if(l > 1){
        for (var i=0; i<l; i++) { this.addChilds(arguments[i]); }
        return arguments[l-1];
    }
    if(cd.parent){ cd.parent.removeChilds(cd); }
    cd.parent = this;
    this.cds.push(cd);
    // cd.interactive = cd.interactive;
    return cd;
};
/**
 * 从容器移除一个物体
 * 
 *```js
 * container.removeChilds(sprite,sprite2,text3,graphice);
 * ```
 *
 * @param child {JC.DisplayObject}
 * @return {JC.DisplayObject}
 */
Container.prototype.removeChilds = function (){
    var l = arguments.length;
    if(l > 1){
        for (var i=0; i<l; i++) { this.removeChilds(arguments[i]); }
    }else if(l===1){
        for(var a=0;a<this.cds.length;a++){
            if(this.cds[a]===arguments[0]){
                this.cds.splice(a,1);
                // this.cds[a].interactive = this.cds[a].interactive;
                this.cds[a].parent = null;
                a--;
            }
        }
    }
};
Container.prototype.updateTransform = function (){
	this.manager();
	this.updateMe();
	this.cds.length>0&&this.updateChilds();
};
Container.prototype.updateChilds = function (){
    for (var i=0,l=this.cds.length; i<l; i++) {
        var cd = this.cds[i];
        cd.updateTransform();
    }
};
Container.prototype.render = function (ctx){
	ctx.save();
	this.setTransform(ctx);
	this.mask&&this.mask.render(ctx);
	this.renderMe(ctx);
	this.cds.length>0&&this.renderChilds(ctx);
	ctx.restore();
};
Container.prototype.renderMe = function (){
    return true;
};
Container.prototype.renderChilds = function (ctx){
    for (var i=0,l=this.cds.length; i<l; i++) {
        var cd = this.cds[i];
        if (!cd.isVisible())continue;
        cd.render(ctx);
    }
};
Container.prototype.noticeEvent = function (ev){
    var i = this.cds.length-1;
    while(i>=0){
        var child = this.cds[i];
        // console.log(child);
        if(child.visible){
            child.noticeEvent(ev);
            // console.log(ev);
            if(ev.target)break;
        }
        i--;
    }
    this.upEvent(ev);
};
Container.prototype.upEvent = function(ev){
    // this.interactive
    // console.log(ev);
    if(!this.passEvent&&this.hitTest(ev)){
        if(!ev.cancleBubble||ev.target===this){
            // console.log(this.name);
            // console.log(ev);
            if(!(this.event.listeners[ev.type]&&this.event.listeners[ev.type].length>0))return;
            this.event.emit(ev);
        }
    }
};
Container.prototype.hitTest = function(ev){
    // 
    if (ev.type==='touchmove'||ev.type==='touchend'){
        var re = this.event.touchstarted;
        if(ev.type==='touchend')this.event.touchstarted = false;
        return re;
    }
    for (var i = 0,l=this.cds.length; i<l; i++) {
        if(this.cds[i].hitTest(ev)){
            if(ev.type==='touchstart')this.event.touchstarted = true;
            return true;
        }
    }
    if(this.hitTestMe(ev)){
        ev.target = this;
        if(ev.type==='touchstart')this.event.touchstarted = true;
        return true;
    }
    return false;
};
Container.prototype.hitTestMe = function(ev){
    return this.ContainsPoint(this.getBound(),ev.global.x,ev.global.y);
};


/**
 * 位图精灵图，继承至Container
 *
 * ```js
 * var sprite = new JC.Sprite({
 *      image: images.getResult('frames'),
 *      width: 165,
 *      height: 292,
 *      count: 38,
 *      sH: 292*2,
 *      sW: 165*2
 * });
 * ```
 *
 * @class
 * @extends JC.Container
 * @memberof JC
 */
function Sprite(opts){
	JC.Container.call( this );
    this.image = opts.image;
    this._imageW = this.image.width;
    this._imageH = this.image.height;
    this.width = opts.width||this._imageW;
    this.height = opts.height||this._imageH;
    this.regX = this.width>>1;
    this.regY = this.height>>1;
    this._cF = 0;
    this.count = opts.count||1;
    this.sH = opts.sH||0;
    this.sW = opts.sW||0;
    this.loop = false;
    this.repeatF = 0;
    this.preTime = Date.now();
    this.interval = 60;
    this.setBound();
}
JC.Sprite = Sprite;
Sprite.prototype = Object.create( JC.Container.prototype );
Sprite.prototype.constructor = JC.Sprite;
Sprite.prototype.getFramePos = function(){
    var obj = {
            x: this.sW,
            y: this.sH
        };
    if(this._cF>0){
        var row = this._imageW/this.width >> 0;
        var lintRow = this.sW/this.width >> 0;
        var lintCol = this.sH/this.height >> 0;
        var mCol = lintCol+(lintRow+this._cF)/row >> 0;
        var mRow = (lintRow+this._cF)%row;
        obj.x = mRow*this.width;
        obj.y = mCol*this.height;
    }
    return obj;
};
Sprite.prototype.renderMe = function (ctx){
    var obj = this.getFramePos();
    ctx.drawImage(this.image, obj.x, obj.y, this.width, this.height, -this.regX, -this.regY, this.width, this.height);
    this.upFS();
};
Sprite.prototype.upFS = function (){
    if(!this.canFrames)return;
    var time = Date.now(),
        ok = time-this.preTime>this.interval;
    if(ok){
        this._cF++;
        this.preTime = time;
    }
    if(this._cF>=this.count){
        this._cF = 0;
        if(this.repeatF<=0&&!this.loop){
            this.canFrames = false;
            if(this.fillMode==='backwards')this._cF = this.count-1;
            this.onEnd();
        }
        if(!this.loop)this.repeatF--;
    }
};
/**
 * 播放逐祯动画
 *
 *```js
 * sprite.goFrames({
 *      repeatF: 1,
 *      loop: true,
 *      fillMode: 'forwards',  // backwards  forwards
 *      end: function(){console.log('over');}
 * });
 * ```
 *
 * @param opts {object}
 */
Sprite.prototype.goFrames = function (opts){
    if(this.count<=1)return;
    opts = opts||{};
    this.canFrames = true;
    this.loop = opts.loop||false;
    this.repeatF = opts.repeatF||0;
    this.onEnd = opts.end||noop;
    this.fillMode = opts.fillMode||'forwards';
    this.preTime = Date.now();
    this._cF = 0;
};

/*  TODO: drawTriangles a mesh frame 
 *  can have perspective effect
 *
 *
 */
function Strip(){}



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
function Graphics(){
	JC.Container.call( this );
	this.cacheCanvas = null;
}
JC.Graphics = Graphics;
Graphics.prototype = Object.create( JC.Container.prototype );
Graphics.prototype.constructor = JC.Graphics;
Graphics.prototype.renderMe = function (ctx){
	if(this.cached||this.cache){
		if(this.cache){
			this.cacheCanvas = this.cacheCanvas||document.createElement('canvas');
			this.width = this.cacheCanvas.width = this.session.width;
			this.height = this.cacheCanvas.height = this.session.height;
			this._ctx = this.cacheCanvas.getContext("2d");
            this._ctx.clearRect(0,0,this.width,this.height);
            this._ctx.save();
            this._ctx.setTransform(1,0,0,1,this.session.center.x,this.session.center.y);
        	this.draw(this._ctx);
            this._ctx.restore();
        	this.cached = true;
        	this.cache = false;
		}
		this.cacheCanvas&&ctx.drawImage(this.cacheCanvas, 0, 0, this.width, this.height, -this.session.center.x, -this.session.center.x, this.width, this.height);
	}else{
        this.draw(ctx);
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
 *      session: {center: {x: 50,y: 50},width:100,height:100}
 *  });
 * ```
 *
 * @param fn {function}
 * @param opts {object}
 */
Graphics.prototype.drawCall = function(fn,opts){
	if(typeof fn !=='function')return;
    opts = opts||{};
	this.cache = opts.cache||false;
	this.cached = false;
	this.session = opts.session||{center: {x: 0,y: 0},width:100,height:100};
	this.draw = fn||noop;
};



/**
 * 文本，继承至Container
 * 
 * 
 * ```js
 * var text = new JC.Text('JC jcc2d canvas renderer','bold 36px Arial','#f00');
 * ```
 *
 * @class
 * @extends JC.Container
 * @memberof JC
 */
function Text(text,font,color){
	JC.Container.call( this );
	this.text = text;
	this.font = font;
	this.color = color;

    this.textAlign = "center"; // start left center end right
    this.textBaseline = "middle"; // top bottom middle alphabetic hanging


    this.outline = 0;
    this.lineWidth = 1;

    this.US = false; // use stroke
    this.UF = true; // use fill

    // ctx.measureText(str) 返回指定文本的宽度
}
JC.Text = Text;
Text.prototype = Object.create( JC.Container.prototype );
Text.prototype.constructor = JC.Text;
Text.prototype.renderMe = function(ctx){
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
function Stage(id,bgColor){
	JC.Container.call( this );
    this.type = 'stage';
    this.canvas = document.getElementById(id);
    this.ctx = this.canvas.getContext('2d');
    this.cds = [];
    this.canvas.style.backgroundColor = bgColor || "transparent";
    this.autoClear = true;
    this.setStyle = false;
    this.width = this.canvas.width;
    this.height = this.canvas.height;

    if("imageSmoothingEnabled" in this.ctx)
        this.ctx.imageSmoothingEnabled = true;
    else if("webkitImageSmoothingEnabled" in this.ctx)
        this.ctx.webkitImageSmoothingEnabled = true;
    else if("mozImageSmoothingEnabled" in this.ctx)
        this.ctx.mozImageSmoothingEnabled = true;
    else if("oImageSmoothingEnabled" in this.ctx)
        this.ctx.oImageSmoothingEnabled = true;

    // this._interactive = true;
    this.initEvent();

}
JC.Stage = Stage;
Stage.prototype = Object.create( JC.Container.prototype );
Stage.prototype.constructor = JC.Stage;
/**
 * 舞台尺寸设置
 *
 *
 * @param w {number} 可以是屏幕的宽度
 * @param h {number} 可以是屏幕的高度
 */
Stage.prototype.resize = function (w,h,sw,sh){
    this.width = this.canvas.width = w;
    this.height = this.canvas.height = h;
    if(this.setStyle&&sw&&sh){
        this.canvas.style.width = sw+'px';
        this.canvas.style.height = sh+'px';
    }
};
Stage.prototype.render = function (){
    this.updateChilds();
    this.renderChilds();
};
Stage.prototype.renderChilds = function (){
	this.ctx.setTransform(1,0,0,1,0,0);
    if(this.autoClear)this.ctx.clearRect(0,0,this.width,this.height);
    
    for (var i=0,l=this.cds.length; i<l; i++) {
        var cd = this.cds[i];
        if (!cd.isVisible())continue;
        cd.render(this.ctx);
    }
};
Stage.prototype.initEvent = function (){
    var This = this;
    this.canvas.addEventListener('click',function(ev){
        This.eventProxy(ev);
    },false);
    this.canvas.addEventListener('touchstart',function(ev){
        // ev.preventDefault();
        This.eventProxy(ev);
    },false);
    this.canvas.addEventListener('touchmove',function(ev){
        ev.preventDefault();
        This.eventProxy(ev);
    },false);
    this.canvas.addEventListener('touchend',function(ev){
        // ev.preventDefault();
        This.eventProxy(ev);
    },false);
};
Stage.prototype.eventProxy = function (ev){
    // ev = ev;

    var evd = this.fixCoord(ev);
    var i = this.cds.length-1;
    while(i>=0){
        var child = this.cds[i];
        // console.log(child);
        if(child.visible){
            child.noticeEvent(evd);
            if(evd.target)break;
        }
        i--;
    }
};
Stage.prototype.fixCoord = function (ev){
    var evd = new JC.InteractionData(),
        offset = this.getPos(this.canvas);
    evd.originalEvent = ev;
    evd.type = ev.type;

    evd.ratio = this.width/this.canvas.offsetWidth;
    if(ev.touches){
        evd.touches = [];
        if(ev.touches.length>0){
            for(var i=0;i<ev.touches.length;i++){
                evd.touches[i] = {};
                evd.touches[i].global = {};
                evd.touches[i].global.x = (ev.touches[i].pageX-offset.x)*evd.ratio;
                evd.touches[i].global.y = (ev.touches[i].pageY-offset.y)*evd.ratio;
            }
            evd.global = evd.touches[0].global;
        }
    }else{
        evd.global.x = (ev.pageX-offset.x)*evd.ratio;
        evd.global.y = (ev.pageY-offset.y)*evd.ratio;
    }
    return evd;
};
Stage.prototype.getPos = function (obj){
    var pos={};
    if(obj.offsetParent){
        var p = this.getPos(obj.offsetParent);
        pos.x = obj.offsetLeft+p.x;
        pos.y = obj.offsetTop+p.y;
    }else{
        pos.x = obj.offsetLeft;
        pos.y = obj.offsetTop;
    }
    return pos;
};
