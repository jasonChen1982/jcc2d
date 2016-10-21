
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
    this.global = {x:-100000,y:-100000};

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

export { InteractionData };
