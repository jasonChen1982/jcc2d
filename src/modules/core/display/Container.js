import { DisplayObject } from './DisplayObject';
import { Point } from '../math/Point';

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
function Container(){
    DisplayObject.call( this );

    /**
     * 渲染对象的列表
     *
     * @member {Array}
     */
    this.cds = [];

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
}
Container.prototype = Object.create( DisplayObject.prototype );

/**
 * 向容器添加一个物体
 *
 * ```js
 * container.addChilds(sprite,sprite2,text3,graphice);
 * ```
 *
 * @param child {JC.Container}
 * @return {JC.Container}
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
    return cd;
};
/**
 * 从容器移除一个物体
 *
 * ```js
 * container.removeChilds(sprite,sprite2,text3,graphice);
 * ```
 *
 * @param child {JC.Container}
 * @return {JC.Container}
 */
Container.prototype.removeChilds = function (){
    var l = arguments.length;
    if(l > 1){
        for (var i=0; i<l; i++) { this.removeChilds(arguments[i]); }
    }else if(l===1){
        for(var a=0;a<this.cds.length;a++){
            if(this.cds[a]===arguments[0]){
                this.cds.splice(a,1);
                this.cds[a].parent = null;
                a--;
            }
        }
    }
};

/**
 * 更新自身的透明度可矩阵姿态更新，并触发后代同步更新
 *
 * @method updateTransform
 * @private
 */
Container.prototype.updateTransform = function (snippet){
    if (!this._ready) return;
    snippet = this.timeScale * snippet;
    if (!this.paused) this.upAnimation(snippet);
    this.updateMe();
    if (this.cds.length > 0) this.updateChilds(snippet);
};

/**
 * 调用后代的姿态更新函数
 *
 * @method updateChilds
 * @private
 */
Container.prototype.updateChilds = function (snippet){
    for (var i = 0,l = this.cds.length; i < l; i++) {
        var cd = this.cds[i];
        cd.updateTransform(snippet);
    }
};

/**
 * 渲染自己并触发后代渲染
 *
 * @method render
 * @private
 */
Container.prototype.render = function (ctx){
    ctx.save();
    this.setTransform(ctx);
    if (this.mask) this.mask.render(ctx);
    this.renderMe(ctx);
    if (this.cds.length > 0) this.renderChilds(ctx);
    ctx.restore();
};

/**
 * 渲染自己
 *
 * @method renderMe
 * @private
 */
Container.prototype.renderMe = function (){
    return true;
};

/**
 * 调用后代的渲染
 *
 * @method renderChilds
 * @private
 */
Container.prototype.renderChilds = function (ctx){
    for (var i = 0,l = this.cds.length; i < l; i++) {
        var cd = this.cds[i];
        if (!cd.isVisible() || !cd._ready)continue;
        cd.render(ctx);
    }
};

/**
 * 通知分发事件到自身及后代
 *
 * @method noticeEvent
 * @private
 */
Container.prototype.noticeEvent = function (ev){
    var i = this.cds.length-1;
    while(i>=0){
        var child = this.cds[i];
        if(child.visible){
            child.noticeEvent(ev);
            if(ev.target)break;
        }
        i--;
    }
    this.upEvent(ev);
};

/**
 * 分发事件到自身后对自身做事件检查
 *
 * @method upEvent
 * @private
 */
Container.prototype.upEvent = function(ev){
    if(!this._ready)return;
    if(ev.target||(!this.passEvent&&this.hitTest(ev))){
        if(!ev.cancleBubble||ev.target===this){
            if(!(this.event.listeners[ev.type]&&this.event.listeners[ev.type].length>0))return;
            this.event.emit(ev);
        }
    }
};

/**
 * 碰撞监测及事件处理
 *
 * @method hitTest
 * @private
 */
Container.prototype.hitTest = function(ev){
    if (ev.type==='touchmove'||ev.type==='touchend'||ev.type==='mousemove'||ev.type==='mouseup'){
        var re = this.event.touchstarted;
        if(re)ev.target = this;
        if(ev.type==='touchend'||ev.type==='mouseup')this.event.touchstarted = false;
        return re;
    }
    if(this.hitTestMe(ev)){
        ev.target = this;
        if(ev.type==='touchstart'||ev.type==='mousedown')this.event.touchstarted = true;
        return true;
    }
    return false;
};

/**
 * 对自身的事件监测区域做碰撞监测
 *
 * @method hitTest
 * @private
 */
Container.prototype.hitTestMe = function(ev){
    if (this.bound === null) return false;
    var point = new Point();
    this.worldTransform.applyInverse(ev.global, point);
    return this.bound.contains(point.x, point.y);
};

/**
 * 暂停自身的动画进度
 *
 *
 */
Container.prototype.pause = function(){
    this.paused = true;
};

/**
 * 恢复自身的动画进度
 *
 *
 */
Container.prototype.start = function(){
    this.paused = false;
};

/**
 * 取消自身的所有动画
 *
 *
 */
Container.prototype.cancle = function(){
    this.Animator.clear();
};

export { Container };
