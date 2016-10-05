/**
 * 动画对象的基本类型
 *
 * @class
 * @memberof JC
 * @param [opts] {object} 动画配置信息
 */

function Animate(opts) {
    this.element = opts.element || {};
    this.duration = opts.duration || 300;
    this.living = true;

    this.onCompelete = opts.onCompelete || null;
    this.onUpdate = opts.onUpdate || null;

    this.infinity = opts.infinity || false;
    this.alternate = opts.alternate || false;
    this.ease = opts.ease || 'easeBoth';
    this.repeats = opts.repeats || 0;
    this.delay = opts.delay || 0;
    this.delayCut = this.delay;
    this.progress = 0;
    this.direction = 1;

    this.timeScale = opts.timeScale || 1;

    this.paused = false;
}
JC.Animate = Animate;
Animate.prototype._swapEase = function() {
    var ease = this.ease;
    if (ease.indexOf('In') > 0) {
        ease = ease.replace('In', 'Out');
    } else if (ease.indexOf('Out') > 0) {
        ease = ease.replace('Out', 'In');
    }
    this.ease = ease;
};
Animate.prototype.nextPose = function() {
    var cache = {};
    for (var i in this.ATRE) {
        cache[i] = JC.TWEEN[this.ease](this.progress, this.ATRS[i], this.ATRE[i] - this.ATRS[i], this.duration);
        if (this.element[i] !== undefined) this.element[i] = cache[i];
    }
    return cache; //this.onUpdate
};
Animate.prototype.pause = function() {
    this.paused = true;
};
Animate.prototype.start = function() {
    this.paused = false;
};
Animate.prototype.stop = function() {
    this.progress = this.duration;
};
Animate.prototype.cancle = function() {
    this.living = false;
};


/**
 * Transition类型动画对象
 *
 * @class
 * @memberof JC
 * @param [opts] {object} 动画所具备的特性
 */

function Transition(opts) {
    JC.Animate.call(this, opts);

    this.ATRS = opts.from;
    this.ATRE = opts.to;

}
JC.Transition = Transition;
Transition.prototype = Object.create(JC.Animate.prototype);
Transition.prototype.constructor = JC.Transition;
Transition.prototype.update = function(snippet) {
    if (this.paused || !this.living || this.delayCut>0){
        if (this.delayCut>0) this.delayCut -= Math.abs(snippet);
        return;
    }

    var progress = this.progress += this.direction * this.timeScale * snippet;
    this.progress = JC.clamp(progress,0,this.duration);

    var pose = this.nextPose();
    
    if (this.onUpdate) this.onUpdate(pose, this.progress / this.duration);

    if ((this.direction === -1 && progress <= 0) || (this.direction === 1 && progress >= this.duration)) {
        if (this.repeats > 0 || this.infinity) {
            if (this.repeats > 0) --this.repeats;
            this.delayCut = this.delay;
            if (this.alternate) {
                this.direction *= -1;
                this._swapEase();
            } else {
                this.progress = 0;
            }
        } else {
            this.living = false;
            if(this.onCompelete) this.onCompelete(pose);
        }
    }
};


/**
 * Animation类型动画对象
 *
 * @class
 * @memberof JC
 * @param [opts] {object} 动画配置信息
 */
function Animation(opts) {
    JC.Animate.call(this, opts);

    this._keyframes = opts.keys;
    this._keyIndex = 0;
    this._direction = 1;
    this._keyConfig = opts.keyConfig;

    this.configKey();
}
JC.Animation = Animation;
Animation.prototype = Object.create(JC.Animate.prototype);
Animation.prototype.constructor = JC.Animation;
Animation.prototype.configKey = function() {
    this.ATRS = this._keyframes[this._keyIndex];
    this._keyIndex += this._direction;
    this.ATRE = this._keyframes[this._keyIndex];
    var config = this._keyConfig[Math.min(this._keyIndex, this._keyIndex - this._direction)] || {};
    this.ease = config.ease || this.ease;
    this.duration = config.duration || this.duration;
    this.progress = 0;
};
Animation.prototype.update = function(snippet) {
    if (this.paused || !this.living) return;
    this.progress += this.timeScale * snippet;

    if (this.progress < this.duration) {
        if (this.progress < 0) return;
        var pose = this.nextPose();
        if (this.onUpdate) this.onUpdate(pose, this.progress / this.duration, this._keyIndex);
    } else {
        this.element.setVal(this.ATRE);
        if (this.onUpdate) this.onUpdate(this.ATRE, 1, this._keyIndex);
        if (this._keyIndex < this._keyframes.length - 1 && this._keyIndex > 0) {
            this.configKey();
        } else {
            if (this.repeats > 0 || this.infinity) {
                if (this.repeats > 0) --this.repeats;
                if (this.alternate) {
                    this._direction *= -1;
                } else {
                    this._keyIndex = 0;
                }
                this.configKey();
            } else {
                this.living = false;
                if (this.onCompelete) this.onCompelete();
            }
        }
    }
};


/**
 * PathMotion类型动画对象
 *
 * @class
 * @memberof JC
 * @param [opts] {object} 动画所具备的特性
 */

function PathMotion(opts) {
    JC.Animate.call(this, opts);

    this.points = opts.points;
    this.attachNormal = opts.attachNormal || false;
    this._cacheRotate = this.element.rotation;
    var radian = this._cacheRotate * JC.DTR;
    this._cacheVector = { x: 10 * Math.cos(radian), y: 10 * Math.sin(radian) };
}
JC.PathMotion = PathMotion;
PathMotion.prototype = Object.create(JC.Animate.prototype);
PathMotion.prototype.constructor = JC.PathMotion;
PathMotion.prototype.update = function(snippet) {
    if (this.paused || !this.living || this.delayCut>0){
        if (this.delayCut>0) this.delayCut -= Math.abs(snippet);
        return;
    }

    this.progress += this.direction * this.timeScale * snippet;

    var pose = this.nextPose();
    if (this.onUpdate) this.onUpdate(pose, this.progress / this.duration);

    if ((this.direction === -1 && this.progress <= 0) || (this.direction === 1 && this.progress >= this.duration)) {
        if (this.repeats > 0 || this.infinity) {
            if (this.repeats > 0) --this.repeats;
            this.delayCut = this.delay;
            if (this.alternate) {
                this.direction *= -1;
                this._swapEase();
            } else {
                this.progress = 0;
            }
        } else {
            this.living = false;
            if (this.onCompelete) this.onCompelete();
        }
    }
};
PathMotion.prototype.nextPose = function() {
    var cache = {},
        _rotate = 0,
        t = JC.TWEEN[this.ease](this.progress, 0, 1, this.duration),
        pos = this.getPoint(t, this.points);

    cache.x = pos.x;
    cache.y = pos.y;
    if (this.attachNormal) {
        _rotate = this.decomposeRotate(t, pos);
        cache.rotation = _rotate === false ? this.preDegree : _rotate;
        cache.rotation += this._cacheRotate;
        if (_rotate !== false) this.preDegree = _rotate;
    }
    this.element.setVal(cache);
    return cache;
};
PathMotion.prototype.getPoint = function(t, points) {
    var a = points,
        len = a.length,
        rT = 1 - t,
        l = a.slice(0, len - 1),
        r = a.slice(1),
        oP = {};
    if (len > 3) {
        var oL = this.getPoint(t, l),
            oR = this.getPoint(t, r);
        oP.x = rT * oL.x + t * oR.x;
        oP.y = rT * oL.y + t * oR.y;
        return oP;
    } else {
        oP.x = rT * rT * points[0].x + 2 * t * rT * points[1].x + t * t * points[2].x;
        oP.y = rT * rT * points[0].y + 2 * t * rT * points[1].y + t * t * points[2].y;
        return oP;
    }
};
PathMotion.prototype.decomposeRotate = function(t, pos) {
    var p1 = pos || this.getPoint(t, this.points);
    var p2 = this.getPoint(t + 0.01, this.points);
    var vector = { x: p2.x - p1.x, y: p2.y - p1.y };

    var nor = this._cacheVector.x * vector.y - vector.x * this._cacheVector.y;
    var pi = nor > 0 ? 1 : -1;
    var cos = (vector.x * this._cacheVector.x + vector.y * this._cacheVector.y) / (Math.sqrt(vector.x * vector.x + vector.y * vector.y) * Math.sqrt(this._cacheVector.x * this._cacheVector.x + this._cacheVector.y * this._cacheVector.y));
    if (isNaN(cos)) return false;
    return pi * Math.acos(cos) * JC.RTD;
};





/**
 * Animator类型动画对象
 *
 * @class
 * @memberof JC
 */
function Animator(element) {
    this.element = element;
    // this.start = false;
    this.animates = [];
}
JC.Animator = Animator;
Animator.prototype.update = function(snippet) {
    for (var i = 0; i < this.animates.length; i++) {
        if (!this.animates[i].living) this.animates.splice(i, 1);
        if (this.animates[i]) this.animates[i].update(snippet);
    }
};
Animator.prototype.fromTo = function(opts, clear) {
    this.element.setVal(opts.from);
    opts.element = this.element;
    return this._addMove(new JC.Transition(opts), clear);
};
Animator.prototype.to = function(opts, clear) {
    opts.from = {};
    for (var i in opts.to) {
        opts.from[i] = this.element[i];
    }
    opts.element = this.element;
    return this._addMove(new JC.Transition(opts), clear);
};
Animator.prototype.motion = function(opts, clear) {
    opts.element = this.element;
    return this._addMove(new JC.PathMotion(opts), clear);
};
Animator.prototype.keyFrames = function(opts, clear) {
    opts.element = this.element;
    return this._addMove(new JC.Animation(opts), clear);
};
Animator.prototype._addMove = function(animate, clear) {
    if (clear) this.clear();
    this.animates.push(animate);
    return animate;
};
Animator.prototype.clear = function() {
    this.animates.length = 0;
};





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
JC.MovieClip = MovieClip;
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
    if (!JC.isArray(movie)) return;
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
    if (JC.isString(movie)) {
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
    } else if (JC.isArray(movie)) {
        return movie;
    } else if (JC.isObject(movie)) {
        var arr = [];
        for (var i = movie.start; i <= movie.end; i++) {
            arr.push(i);
        }
        if (movie.next && this.animations[movie.next]) {
            var This = this;
            this.next = function() {
                This.playMovie({
                    movie: this.animations[movie.next],
                    infinity: true
                });
            };
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
