import { Container } from './display/Container';
import { InteractionData } from '../eventer/InteractionData';

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
    Container.call( this );
    this.type = 'stage';
    this.canvas = document.getElementById(id);
    this.ctx = this.canvas.getContext('2d');
    this.cds = [];
    this.canvas.style.backgroundColor = bgColor || 'transparent';
    this.autoClear = true;
    this.setStyle = false;
    this.width = this.canvas.width;
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

    this.pt = null;

}
Stage.prototype = Object.create( Container.prototype );
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
    if(this.pt===null||Date.now()-this.pt>200)this.pt = Date.now();
    var snippet = Date.now()-this.pt;
    snippet = snippet <= 0 ? 10: snippet;
    this.pt += snippet;
    this.updateChilds(this.timeScale*snippet);

    this.ctx.setTransform(1,0,0,1,0,0);
    if(this.autoClear)this.ctx.clearRect(0,0,this.width,this.height);
    this.renderChilds(this.ctx);
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
