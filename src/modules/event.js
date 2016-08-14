
/**
 * jcc2d的事件消息对象的类
 *
 * @class JC.InteractionData
 * @constructor
 */
function InteractionData(){
    /**
     * 转换到canvas坐标系统的事件触发点
     *
     * @property global
     * @type Object
     */
    this.global = {x:-100000,y:-100000};

    /**
     * 事件源
     *
     * @property target
     * @type JC.Container
     */
    this.target = null;

    /**
     * 浏览器的原始事件对象
     *
     * @property originalEvent
     * @type Event
     */
    this.originalEvent = null;

    /**
     * 在canvas内阻止事件冒泡
     *
     * @property cancleBubble
     * @type Boolean
     */
    this.cancleBubble = false;

    /**
     * canvas视窗和页面坐标的兑换比例
     *
     * @property ratio
     * @type Number
     */
    this.ratio = 1;

    /**
     * 事件类型
     *
     * @property type
     * @type String
     */
    this.type = '';
}
JC.InteractionData = InteractionData;



/**
 * jcc2d的事件对象的类
 *
 * @class JC.Eventer
 * @constructor Eventer
 * @memberof JC
 */
function Eventer(){
    this.touchstarted = false;
    this.mouseDowned = false;
    this.listeners = {};
}
/**
 * 事件对象的事件绑定函数
 *
 * @param type {String} 事件类型
 * @param fn {Function} 回调函数
 * @private
 */
Eventer.prototype.on = function(type,fn){
    this.listeners[type] = this.listeners[type]||[];
    this.listeners[type].push(fn);
};
/**
 * 事件对象的事件解绑函数
 *
 * @param type {String} 事件类型
 * @param fn {Function} 注册时回调函数的引用
 * @private
 */
Eventer.prototype.off = function(type,fn){
    if (this.listeners[type]) {
        var i = this.listeners[type].length;
        if(fn){
            while (i--) {
                if (cbs[type][i] === fn) {
                    cbs[type].splice(i, 1);
                }
            }
        }else{
            cbs[type].length = 0;
        }
    }
};
/**
 * 事件对象的触发事件函数
 *
 * @param ev {JC.InteractionData} 事件类型
 * @private
 */
Eventer.prototype.emit = function(ev){
    if ( this.listeners === undefined ) return;
    var ears = this.listeners;
    var cbs = ears[ ev.type ];
    if ( cbs !== undefined ) {
        var length = cbs.length;
        var i;
        for ( i = 0; i < length; i ++ ) {
            cbs[ i ].call( this, ev );
        }
    }
};
JC.Eventer = Eventer;