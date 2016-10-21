import { Container } from './Container';
import { MovieClip } from '../../animation/MovieClip';

/**
 * 位图精灵图，继承至Container
 *
 * ```js
 * var loadBox = JC.loaderUtil({
 *    frames: './images/frames.png'
 * });
 * var sprite = new JC.Sprite({
 *      texture: loadBox.getById('frames'),
 *      width: 165,
 *      height: 292,
 *      count: 38,
 *      sx: 0,
 *      sy: 0,
 *      animations: {
 *          fall: {start: 0,end: 4,next: 'stand'},
 *          fly: {start: 5,end: 9,next: 'stand'},
 *          stand: {start: 10,end: 39},
 *          walk: {start: 40,end: 59,next: 'stand'}
 *      }
 * });
 * ```
 *
 * @class
 * @extends JC.Container
 * @memberof JC
 */
function Sprite(opts){
    Container.call( this );

    this.texture = opts.texture;
    if(this.texture.loaded){
        this.upTexture(opts);
    }else{
        var This = this;
        this._ready = false;
        this.texture.on('load',function(){
            This.upTexture(opts);
            This._ready = true;
        });
    }

    this.MovieClip = new MovieClip(this,opts);

}
Sprite.prototype = Object.create( Container.prototype );
Sprite.prototype.upTexture = function(opts){
    this._textureW = opts.texture.width;
    this._textureH = opts.texture.height;
    this.width = opts.width||this._textureW;
    this.height = opts.height||this._textureH;
    this.regX = this.width>>1;
    this.regY = this.height>>1;
    this.setBound(null,true);
};
Sprite.prototype.upAnimation = function(snippet){
    this.Animator.update(snippet);
    this.MovieClip.update(snippet);
};
Sprite.prototype.playMovie = function(opts){
    this.MovieClip.playMovie(opts);
};
Sprite.prototype.renderMe = function (ctx){
    if (!this._ready) return;
    var pos = this.MovieClip.getFramePos();
    ctx.drawImage(this.texture.texture, pos.x, pos.y, this.width, this.height, -this.regX, -this.regY, this.width, this.height);
};

export { Sprite };
