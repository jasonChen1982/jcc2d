import { Container } from './Container';

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
    Container.call( this );
    this.cacheCanvas = null;
}
Graphics.prototype = Object.create( Container.prototype );
Graphics.prototype.renderMe = function (ctx){
    if(!this.draw)return;
    if(this.cached||this.cache){
        if(this.cache){
            this.cacheCanvas = this.cacheCanvas||document.createElement('canvas');
            this.width = this.cacheCanvas.width = this.session.width;
            this.height = this.cacheCanvas.height = this.session.height;
            this._ctx = this.cacheCanvas.getContext('2d');
            this._ctx.clearRect(0,0,this.width,this.height);
            this._ctx.save();
            this._ctx.setTransform(1,0,0,1,this.session.center.x,this.session.center.y);
            this._drawBack(this._ctx);
            this._ctx.restore();
            this.cached = true;
            this.cache = false;
        }
        this.cacheCanvas&&ctx.drawImage(this.cacheCanvas, 0, 0, this.width, this.height, -this.session.center.x, -this.session.center.x, this.width, this.height);
    }else{
        this._drawBack(ctx);
    }
};
Graphics.prototype._drawBack = function (ctx){
    if(typeof this.draw === 'function'){
        this.draw(ctx);
    }else if(typeof this.draw === 'object' && typeof this.draw.render === 'function'){
        this.draw.render(ctx);
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
    if(fn===undefined)return;
    opts = opts||{};
    this.cache = opts.cache||false;
    this.cached = false;
    this.session = opts.session||{center: {x: 0,y: 0},width:100,height:100};
    this.draw = fn||null;
};

export { Graphics };
