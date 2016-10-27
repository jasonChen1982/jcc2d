import { DisplayObject } from './DisplayObject';
// import { Point } from '../math/Point';

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
 * 比较当前渲染对象的zIndex是否超出其前后两个兄弟节点的zIndex
 *
 * @method _cpi
 * @private
 */
// Container.prototype._cpi = function(idx) {
//     var rr = this.parent.childs.length - 1;
//     var i = this.parent.childs.indexOf(this);
//     if (i <= 0 || i >= rr) {
//         return false;
//     }
//     var p = this.parent.childs[i-1];
//     var n = this.parent.childs[i+1];
//     return idx > n.zIndex || idx < p.zIndex;
// };

/**
 * 更新自身的透明度可矩阵姿态更新，并触发后代同步更新
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
 * 调用后代的姿态更新函数
 *
 * @method updateChilds
 * @private
 */
// Container.prototype.updateChilds = function(snippet) {
//     for (var i = 0, l = this.childs.length; i < l; i++) {
//         var cd = this.childs[i];
//         cd.updatePosture(snippet);
//     }
// };

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

/**
 * 调用后代的渲染
 *
 * @method renderChilds
 * @private
 */
// Container.prototype.renderChilds = function(ctx) {
//     for (var i = 0, l = this.childs.length; i < l; i++) {
//         var cd = this.childs[i];
//         if (!cd.isVisible() || !cd._ready) continue;
//         cd.render(ctx);
//     }
// };

/**
 * 通知分发事件到自身及后代
 *
 * @method noticeEvent
 * @private
 */
// Container.prototype.noticeEvent = function(ev) {
//     var i = this.childs.length - 1;
//     while (i >= 0) {
//         var child = this.childs[i];
//         if (child.visible) {
//             child.noticeEvent(ev);
//             if (ev.target) break;
//         }
//         i--;
//     }
//     this.upEvent(ev);
// };

/**
 * 分发事件到自身后对自身做事件检查
 *
 * @method upEvent
 * @private
 */
// Container.prototype.upEvent = function(ev) {
//     if (!this._ready) return;
//     if (ev.target || (!this.passEvent && this.hitTest(ev))) {
//         if (!ev.cancleBubble || ev.target === this) {
//             if (!(this.event.listeners[ev.type] && this.event.listeners[ev.type].length > 0)) return;
//             this.event.emit(ev);
//         }
//     }
// };

/**
 * 碰撞监测及事件处理
 *
 * @method hitTest
 * @private
 */
// Container.prototype.hitTest = function(ev) {
//     if (ev.type === 'touchmove' || ev.type === 'touchend' || ev.type === 'mousemove' || ev.type === 'mouseup') {
//         var re = this.event.touchstarted;
//         if (re) ev.target = this;
//         if (ev.type === 'touchend' || ev.type === 'mouseup') this.event.touchstarted = false;
//         return re;
//     }
//     if (this.hitTestMe(ev)) {
//         ev.target = this;
//         if (ev.type === 'touchstart' || ev.type === 'mousedown') this.event.touchstarted = true;
//         return true;
//     }
//     return false;
// };

/**
 * 对自身的事件监测区域做碰撞监测
 *
 * @method hitTest
 * @private
 */
// Container.prototype.hitTestMe = function(ev) {
//     if (this.bound === null) return false;
//     var point = new Point();
//     this.worldTransform.applyInverse(ev.global, point);
//     return this.bound.contains(point.x, point.y);
// };

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

export { Container };
