import { Container } from './display/Container';
import { InteractionData } from '../eventer/InteractionData';
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
function Stage(canvas,bgColor){
    Container.call( this );
    this.type = 'stage';

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
     * 场景是否自动清除上一帧的像素内容
     *
     * @member {Boolean}
     */
    this.autoClear = true;

    /**
     * 场景是否应用style控制宽高
     *
     * @member {Boolean}
     */
    this.setStyle = false;

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

    if('imageSmoothingEnabled' in this.ctx)
        this.ctx.imageSmoothingEnabled = true;
    else if('webkitImageSmoothingEnabled' in this.ctx)
        this.ctx.webkitImageSmoothingEnabled = true;
    else if('mozImageSmoothingEnabled' in this.ctx)
        this.ctx.mozImageSmoothingEnabled = true;
    else if('oImageSmoothingEnabled' in this.ctx)
        this.ctx.oImageSmoothingEnabled = true;

    this.initEvent();

    /**
     * 上一次绘制的时间点
     *
     * @member {Number}
     * @private
     */
    this.pt = null;

}
Stage.prototype = Object.create( Container.prototype );

/**
 * 舞台尺寸设置
 *
 *
 * @param w {number} canvas的width值
 * @param h {number} canvas的height值
 * @param sw {number} canvas的style.width值，需将舞台属性setStyle设置为true
 * @param sh {number} canvas的style.height值，需将舞台属性setStyle设置为true
 */
Stage.prototype.resize = function (w,h,sw,sh){
    this.width = this.canvas.width = w;
    this.height = this.canvas.height = h;
    if(this.setStyle&&sw&&sh){
        this.canvas.style.width = sw+'px';
        this.canvas.style.height = sh+'px';
    }
};

/**
 * 渲染舞台内的所有可见渲染对象
 *
 *
 */
Stage.prototype.render = function (){
    if(this.pt===null||Date.now()-this.pt>200)this.pt = Date.now();
    var snippet = Date.now()-this.pt;
    snippet = snippet <= 0 ? 10: snippet;
    this.pt += snippet;
    this.updateChilds(this.timeScale*snippet);

    this.ctx.setTransform(1,0,0,1,0,0);
    if(this.autoClear)this.ctx.clearRect(0,0,this.width,this.height);
    this.renderChilds(this.ctx);
};

/**
 * 初始化事件接管
 *
 *
 * @method initEvent
 * @private
 */
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
    this.canvas.addEventListener('mousedown',function(ev){
        // ev.preventDefault();
        This.eventProxy(ev);
    },false);
    this.canvas.addEventListener('mousemove',function(ev){
        ev.preventDefault();
        This.eventProxy(ev);
    },false);
    this.canvas.addEventListener('mouseup',function(ev){
        // ev.preventDefault();
        This.eventProxy(ev);
    },false);
};

/**
 * 代理事件，并对事件做分发
 *
 *
 * @method eventProxy
 * @private
 */
Stage.prototype.eventProxy = function (ev){
    var evd = this.fixCoord(ev);
    var i = this.cds.length-1;
    while(i>=0){
        var child = this.cds[i];
        if(child.visible){
            child.noticeEvent(evd);
            if(evd.target)break;
        }
        i--;
    }
};

/**
 * 将全局的事件坐标点转换到canvas的坐标系
 *
 *
 * @method fixCoord
 * @private
 */
Stage.prototype.fixCoord = function (ev){
    var evd = new InteractionData(),
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

/**
 * 获取canvas相对于页面的偏移量
 *
 *
 * @method getPos
 * @private
 */
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

export { Stage };
