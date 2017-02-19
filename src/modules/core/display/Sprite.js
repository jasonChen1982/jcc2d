import { Container } from './Container';
import { MovieClip } from '../../animation/MovieClip';
import { Rectangle } from '../math/Rectangle';

/**
 * 位图精灵图，继承至Container
 *
 * ```js
 * var loadBox = JC.loaderUtil({
 *    frames: './images/frames.png'
 * });
 * var sprite = new JC.Sprite({
 *      texture: loadBox.getById('frames'),
 *      frame: new JC.Rectangle(0, 0, w, h),
 *      width: 100,
 *      height: 100,
 *      count: 38,
 *      animations: {
 *          fall: {start: 0,end: 4,next: 'stand'},
 *          fly: {start: 5,end: 9,next: {movie: 'stand', repeats: 2}},
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
function Sprite(opts) {
    Container.call(this);

    this.texture = opts.texture;
    if (this.texture.loaded) {
        this.upTexture(opts);
    } else {
        var This = this;
        this._ready = false;
        this.texture.on('load', function() {
            This.upTexture(opts);
            This._ready = true;
        });
    }

    this.MovieClip = new MovieClip(this, opts);

}
Sprite.prototype = Object.create(Container.prototype);

/**
 * 更新纹理对象
 *
 * @method upTexture
 * @private
 */
Sprite.prototype.upTexture = function(opts) {
    this.naturalWidth = opts.texture.naturalWidth;
    this.naturalHeight = opts.texture.naturalHeight;
    this.width = opts.width || this.naturalWidth;
    this.height = opts.height || this.naturalHeight;
    this.regX = this.width >> 1;
    this.regY = this.height >> 1;
    var rect = new Rectangle(-this.regX, -this.regY, this.width, this.height);
    this._bounds.addRect(rect);
    this.setArea(rect, true);
};

/**
 * 更新对象的动画姿态
 *
 * @method updateAnimation
 * @private
 */
Sprite.prototype.updateAnimation = function(snippet) {
    this.Animation.update(snippet);
    this.MovieClip.update(snippet);
};

/**
 * 播放逐帧动画
 *
 */
Sprite.prototype.playMovie = function(opts) {
    this.MovieClip.playMovie(opts);
};

/**
 * 更新对象本身的矩阵姿态以及透明度
 *
 * @method updateMe
 * @private
 */
Sprite.prototype.renderMe = function(ctx) {
    if (!this._ready) return;
    var frame = this.MovieClip.getFrame();
    ctx.drawImage(this.texture.texture, frame.x, frame.y, frame.width, frame.height, -this.regX, -this.regY, this.width, this.height);
};

export { Sprite };
