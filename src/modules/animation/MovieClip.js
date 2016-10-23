import { UTILS } from '../util/UTILS';

/**
 * MovieClip类型动画对象
 *
 * @class
 * @memberof JC
 * @param [element] {object} 动画对象 内部传入
 * @param [opts] {object} 动画配置信息 内部传入
 */
function MovieClip(element, opts) {
    this.element = element;
    this.living = false;

    this.onCompelete = null;
    // this.onUpdate = null;

    this.infinity = false;
    this.alternate = false;
    this.repeats = 0;

    this.animations = opts.animations || {};

    this.index = 0;
    this.direction = 1;
    this.frames = [];
    this.sy = opts.sy || 0;
    this.sx = opts.sx || 0;
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
    var i = this.index + this.direction;
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
MovieClip.prototype.getFramePos = function() {
    var pos = {
        x: this.sx,
        y: this.sy
    };
    var cf = this.frames[this.index];
    if (cf > 0) {
        var row = this.element._textureW / this.element.width >> 0;
        var lintRow = this.sx / this.element.width >> 0;
        var lintCol = this.sy / this.element.height >> 0;
        var mCol = lintCol + (lintRow + cf) / row >> 0;
        var mRow = (lintRow + cf) % row;
        pos.x = mRow * this.element.width;
        pos.y = mCol * this.element.height;
    }
    return pos;
};
MovieClip.prototype.playMovie = function(opts) {
    this.next = null;
    var movie = this.format(opts.movie);
    if (!UTILS.isArray(movie)) return;
    this.frames = movie;
    this.index = 0;
    this.direction = 1;
    this.fillMode = opts.fillMode || 0;
    this.fps = opts.fps || this.fps;
    this.infinity = opts.infinity || false;
    this.alternate = opts.alternate || false;
    this.repeats = opts.repeats || 0;
    this.living = true;
    this.onCompelete = opts.onCompelete || null;
};
MovieClip.prototype.format = function(movie) {
    if (UTILS.isString(movie)) {
        var config = this.animations[movie];
        if (config) {
            return this.format(config);
        } else {
            console.warn(
                '%c JC.MovieClip warn %c: you didn\`t config %c' + movie + '%c in animations ',
                'color: #f98165; background: #80a89e',
                'color: #80a89e; background: #cad9d5;',
                'color: #f98165; background: #cad9d5',
                'color: #80a89e; background: #cad9d5'
            );
            return false;
        }
    } else if (UTILS.isArray(movie)) {
        return movie;
    } else if (UTILS.isObject(movie)) {
        var arr = [];
        for (var i = movie.start; i <= movie.end; i++) {
            arr.push(i);
        }
        if (movie.next && this.animations[movie.next]) {
            var This = this;
            var conf = {};
            if(UTILS.isString(movie.next) && this.animations[movie.next]){
                conf.movie = movie.next;
                conf.infinity = true;
            } else if(UTILS.isObject(movie.next)) {
                conf = movie.next;
            }
            if (UTILS.isString(conf.movie)) {
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
    }
});

export { MovieClip };
