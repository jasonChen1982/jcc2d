import {Utils} from '../util/Utils';

// TODO 继承事件对象
/**
 * MovieClip类型动画对象
 *
 * @class
 * @memberof JC
 * @param {object} [element] 动画对象 内部传入
 * @param {object} [options] 动画配置信息 内部传入
 */
function MovieClip(element, options) {
  this.element = element;
  this.living = false;

  this.onCompelete = null;
  // this.onUpdate = null;

  this.infinity = false;
  this.alternate = false;
  this.repeats = 0;

  this.animations = options.animations || {};

  this.index = 0;
  this.preIndex = -1;
  this.direction = 1;
  this.frames = [];
  this.preFrame = null;
  // this.sy = options.sy || 0;
  // this.sx = options.sx || 0;
  this.fillMode = 0;
  this.fps = 16;

  this.paused = false;

  this.pt = 0;
  this.nt = 0;
}
MovieClip.prototype.update = function(snippet) {
  if (this.paused || !this.living) return;
  this.nt += snippet;
  if (this.nt - this.pt < this.interval) return;
  this.pt = this.nt;
  let i = this.index + this.direction;
  if (i < this.frames.length && i >= 0) {
    this.index = i;
    // Do you need this handler???
    // this.onUpdate&&this.onUpdate(this.index);
  } else {
    if (this.repeats > 0 || this.infinity) {
      if (this.repeats > 0) --this.repeats;
      if (this.alternate) {
        this.direction *= -1;
        this.index += this.direction;
      } else {
        this.direction = 1;
        this.index = 0;
      }
      // Do you need this handler???
      // this.onUpdate&&this.onUpdate(this.index);
    } else {
      this.living = false;
      this.index = this.fillMode;
      if (this.onCompelete) this.onCompelete();
      if (this.next) this.next();
    }
  }
};
MovieClip.prototype.getFrame = function() {
  if (
    this.index === this.preIndex
    &&
    this.preFrame !== null
  ) return this.preFrame;
  let frame = this.element.frame.clone();
  let cf = this.frames[this.index];
  if (cf > 0) {
    let row = this.element.naturalWidth / this.element.frame.width >> 0;
    let lintRow = this.element.frame.x / this.element.frame.width >> 0;
    // var lintCol = this.element.frame.y / this.element.frame.height >> 0;
    let mCol = (lintRow + cf) / row >> 0;
    let mRow = (lintRow + cf) % row;
    frame.x = mRow * this.element.frame.width;
    frame.y += mCol * this.element.frame.height;
  }
  this.preIndex = this.index;
  this.preFrame = frame;
  return frame;
};
MovieClip.prototype.playMovie = function(options) {
  this.next = null;
  let movie = this.format(options.movie);
  if (!Utils.isArray(movie)) return;
  this.frames = movie;
  this.index = 0;
  this.direction = 1;
  this.fillMode = options.fillMode || 0;
  this.fps = options.fps || this.fps;
  this.infinity = options.infinity || false;
  this.alternate = options.alternate || false;
  this.repeats = options.repeats || 0;
  this.living = true;
  this.onCompelete = options.onCompelete || null;
};
MovieClip.prototype.format = function(movie) {
  if (Utils.isString(movie)) {
    let config = this.animations[movie];
    if (config) {
      return this.format(config);
    } else {
      /* eslint max-len: "off" */
      console.warn(
          '%c JC.MovieClip warn %c: you didn\`t config %c' + movie + '%c in animations ',
          'color: #f98165; background: #80a89e',
          'color: #80a89e; background: #cad9d5;',
          'color: #f98165; background: #cad9d5',
          'color: #80a89e; background: #cad9d5'
      );
      return false;
    }
  } else if (Utils.isArray(movie)) {
    return movie;
  } else if (Utils.isObject(movie)) {
    let arr = [];
    for (let i = movie.start; i <= movie.end; i++) {
      arr.push(i);
    }
    if (movie.next && this.animations[movie.next]) {
      let This = this;
      let conf = {};
      if(Utils.isString(movie.next) && this.animations[movie.next]) {
        conf.movie = movie.next;
        conf.infinity = true;
      } else if(Utils.isObject(movie.next)) {
        conf = movie.next;
      }
      if (Utils.isString(conf.movie)) {
        this.next = function() {
          This.playMovie(conf);
        };
      }
    }
    return arr;
  }
};
MovieClip.prototype.pause = function() {
  this.paused = true;
};
MovieClip.prototype.start = function() {
  this.paused = false;
};
MovieClip.prototype.cancle = function() {
  this.living = false;
};
Object.defineProperty(MovieClip.prototype, 'interval', {
  get: function() {
    return this.fps > 0 ? 1000 / this.fps >> 0 : 16;
  },
});

export {MovieClip};
