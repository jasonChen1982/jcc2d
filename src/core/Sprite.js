import {Container} from './Container';
import {MovieClip} from '../animation/MovieClip';
import {Rectangle} from '../math/Rectangle';

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
 *      animations: {
 *          fall: {start: 0,end: 4,next: 'stand'},
 *          fly: {start: 5,end: 9,next: {movie: 'stand', repeats: 2}},
 *          stand: {start: 10,end: 39},
 *          walk: {start: 40,end: 59,next: 'stand'},
 *          other: [ 0, 1, 2, 1, 3, 4 ], // 同样接受数组形势
 *      }
 * });
 * ```
 *
 * @class
 * @memberof JC
 * @extends JC.Container
 * @param {Object} options
 * @param {JC.Texture} options.texture 图片纹理
 * @param {JC.Rectangle} [options.frame] 当是逐帧或者是裁切显示时需要配置，显示的矩形区域
 * @param {Number} [options.width] 实际显示的宽，可能会缩放图像
 * @param {Number} [options.height] 实际显示的高，可能会缩放图像
 * @param {Object} [options.animations] 逐帧的预置帧动画配置
 */
function Sprite(options) {
  Container.call(this);

  this._width = 0;

  this._height = 0;

  this.ready = true;

  const texture = options.texture;
  if (texture.loaded) {
    this.upTexture(options);
  } else {
    const This = this;
    this.ready = false;
    texture.on('load', function() {
      This.upTexture(options);
      This.ready = true;
    });
  }

  this.movieClip = new MovieClip(this, options);
}
Sprite.prototype = Object.create(Container.prototype);

/**
 * 更新纹理对象
 *
 * @private
 * @param {json} options
 */
Sprite.prototype.upTexture = function(options) {
  this.texture = options.texture;
  this.naturalWidth = options.texture.naturalWidth;
  this.naturalHeight = options.texture.naturalHeight;
  this.frame = options.frame ||
  new Rectangle(
    0,
    0,
    this.naturalWidth,
    this.naturalHeight
  );

  this.width = options.width || this.frame.width;
  this.height = options.height || this.frame.height;
};

/**
 * 当前图片对象的width
 *
 * @name width
 * @member {Number}
 * @memberof JC.Sprite#
 */
Object.defineProperty(Sprite.prototype, 'width', {
  get: function() {
    return this._width;
  },
  set: function(width) {
    if (this._width !== width) {
      this._width = width;
      this.updateGeometry();
    }
  },
});

/**
 * 当前图片对象的height
 *
 * @name height
 * @member {Number}
 * @memberof JC.Sprite#
 */
Object.defineProperty(Sprite.prototype, 'height', {
  get: function() {
    return this._height;
  },
  set: function(height) {
    if (this._height !== height) {
      this._height = height;
      this.updateGeometry();
    }
  },
});

/**
 * 更新对象的事件几何形态
 * note: 此处的setArea是懒更新，如果需要
 *
 * @private
 */
Sprite.prototype.updateGeometry = function() {
  const rect = new Rectangle(0, 0, this.width, this.height);
  this._bounds.clear().addRect(rect);
  this.setArea(rect);
};

/**
 * 更新对象的动画姿态
 *
 * @private
 * @param {number} snippet
 */
Sprite.prototype.updateAnimation = function(snippet) {
  this.animation.update(snippet);
  this.movieClip.update(snippet);
};

/**
 * 播放逐帧动画
 * @param {Object} options 可以是播放配置对象
 * @param {String|Array} options.movie 预置的动画名，或者是帧索引数组
 * @param {Number} [options.fillMode] 结束时停留在哪一帧
 * @param {Boolean} [options.repeats] 重复播放次数
 * @param {Boolean} [options.infinite] 无限循环，优先级比 repeats 高
 * @param {Boolean} [options.alternate] 循环时交替播放
 * @param {Number} [options.fps] 当前动画将使用的帧率
 * @return {MovieClip}
 */
Sprite.prototype.playMovie = function(options) {
  return this.movieClip.playMovie(options);
};

/**
 * 更新对象本身的矩阵姿态以及透明度
 *
 * @private
 * @param {context} ctx
 */
Sprite.prototype.renderMe = function(ctx) {
  if (!this.ready) return;
  const frame = this.movieClip.getFrame();
  ctx.drawImage(
    this.texture.texture,
    frame.x,
    frame.y,
    frame.width,
    frame.height,
    0,
    0,
    this.width,
    this.height
  );
};

export {Sprite};
