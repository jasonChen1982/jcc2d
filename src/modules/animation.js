function Animate(opts){
    this.element = opts.element||{};
    this.duration = opts.duration||300;
    this.living = true;

    this.onCompelete = opts.onCompelete||null;
    this.onUpdate = opts.onUpdate||null;

    this.infinity = opts.infinity||false;
    this.alternate = opts.alternate||false;
    this.ease = opts.ease||'easeBoth';
    this.repeats = opts.repeats||0;
    this.delay = opts.delay||0;
    this.progress = 0-this.delay;

    this.timeScale = opts.timeScale||1;

    this.paused = false;
}
JC.Animate = Animate;
Animate.prototype.nextPose = function(){
    var cache = {};
    for(var i in this.ATRE){
        cache[i] = JC.TWEEN[this.ease]( this.progress , this.ATRS[i] , this.ATRE[i] - this.ATRS[i] , this.duration );
        if(this.element[i]!==undefined)this.element[i] = cache[i];
    }
    return cache;//this.onUpdate
};
Animate.prototype.pause = function(){
    this.paused = true;
};
Animate.prototype.start = function(){
    this.paused = false;
};
Animate.prototype.stop = function(){
    this.progress = this.duration;
};
Animate.prototype.cancle = function(){
    this.living = false;
};



function Transition(opts){
    JC.Animate.call(this,opts);

    this.ATRS = opts.from;
    this.ATRE = opts.to;
}
JC.Transition = Transition;
Transition.prototype = Object.create( JC.Animate.prototype );
Transition.prototype.constructor = JC.Transition;
Transition.prototype.update = function(snippet){
    if(this.paused||!this.living)return;
    this.progress += this.timeScale*snippet;

    if(this.progress < this.duration){
        if(this.progress<0)return;
        var pose = this.nextPose();
        this.onUpdate&&this.onUpdate(pose,this.progress/this.duration);
    }else{
        this.element.setVal(this.ATRE);
        this.onUpdate&&this.onUpdate(this.ATRE,1);
        if(this.repeats>0||this.infinity){
            this.repeats>0&&--this.repeats;
            this.progress = 0;
            if(this.alternate){
                var sc = JC.copyJSON(this.ATRS);
                this.ATRS = JC.copyJSON(this.ATRE);
                this.ATRE = sc;
            }else{
                this.element.setVal(this.ATRS);
            }
        }else{
            this.living = false;
            this.onCompelete&&this.onCompelete();
        }
    }
};


function Animation(opts){
    JC.Animate.call(this,opts);

    this._keyframes = opts.keys;
    this._keyIndex = 0;
    this._direction = 1;
    this._keyConfig = opts.keyConfig;

    this.configKey();
}
JC.Animation = Animation;
Animation.prototype = Object.create( JC.Animate.prototype );
Animation.prototype.constructor = JC.Animation;
Animation.prototype.configKey = function(){
    this.ATRS = this._keyframes[this._keyIndex];
    this._keyIndex += this._direction;
    this.ATRE = this._keyframes[this._keyIndex];
    var config = this._keyConfig[Math.min(this._keyIndex,this._keyIndex-this._direction)]||{};
    this.ease = config.ease||this.ease;
    this.duration = config.duration||this.duration;
    this.progress = 0;
};
Animation.prototype.update = function(snippet){
    if(this.paused||!this.living)return;
    this.progress += this.timeScale*snippet;

    if(this.progress < this.duration){
        if(this.progress<0)return;
        var pose = this.nextPose();
        this.onUpdate&&this.onUpdate(pose,this.progress/this.duration,this._keyIndex);
    }else{
        this.element.setVal(this.ATRE);
        this.onUpdate&&this.onUpdate(this.ATRE,1,this._keyIndex);
        if(this._keyIndex<this._keyframes.length-1&&this._keyIndex>0){
            this.configKey();
        }else{
            if(this.repeats>0||this.infinity){
                this.repeats>0&&--this.repeats;
                if(this.alternate){
                    this._direction *= -1;
                }else{
                    this._keyIndex = 0;
                }
                this.configKey();
            }else{
                this.living = false;
                this.onCompelete&&this.onCompelete();
            }
        }
    }
};

/**
 * {
 *   run: [0,1,2,3],
 *   stand: {start: 4,end: 7,next: 'run'},
 *   jump: [8,10,2]
 * }
 */
function MovieClip(element, opts){
    this.element = element;
    this.living = false;

    this.onCompelete = null;
    // this.onUpdate = null;

    this.infinity = false;
    this.alternate = false;
    this.repeats = 0;

    this.animations = opts.animations||{};

    this.index = 0;
    this.direction = 1;
    this.frames = [];
    this.sy = opts.sy||0;
    this.sx = opts.sx||0;
    this.fillMode = 0;
    this.fps = 16;

    this.paused = false;

    this.pt = 0;
    this.nt = 0;
}
JC.MovieClip = MovieClip;
MovieClip.prototype.update = function(snippet){
    if(this.paused||!this.living)return;
    this.nt += snippet;
    if(this.nt-this.pt<this.interval)return;
    this.pt = this.nt;
    var i = this.index + this.direction;
    if(i<this.frames.length&&i>=0){
        this.index = i;
        // Do you need this handler???
        // this.onUpdate&&this.onUpdate(this.index);
    }else{
        if(this.repeats>0||this.infinity){
            this.repeats>0&&--this.repeats;
            if(this.alternate){
                this.direction *= -1;
                this.index += this.direction;
            }else{
                this.direction = 1;
                this.index = 0;
            }
            // Do you need this handler???
            // this.onUpdate&&this.onUpdate(this.index);
        }else{
            this.living = false;
            this.index = this.fillMode;
            this.onCompelete&&this.onCompelete();
            this.next&&this.next();
        }
    }
};
MovieClip.prototype.getFramePos = function(){
    var pos = {
            x: this.sx,
            y: this.sy
        };
    var cf = this.frames[this.index];
    if(cf>0){
        var row = this.element._textureW/this.element.width >> 0;
        var lintRow = this.sx/this.element.width >> 0;
        var lintCol = this.sy/this.element.height >> 0;
        var mCol = lintCol+(lintRow+cf)/row >> 0;
        var mRow = (lintRow+cf)%row;
        pos.x = mRow*this.element.width;
        pos.y = mCol*this.element.height;
    }
    return pos;
};
MovieClip.prototype.playMovie = function(opts){
    this.next = null;
    var movie = this.format(opts.movie);
    if(!JC.isArray(movie))return;
    this.frames = movie;
    this.index = 0;
    this.direction = 1;
    this.fillMode = opts.fillMode||0;
    this.fps = opts.fps||this.fps;
    this.infinity = opts.infinity||false;
    this.alternate = opts.alternate||false;
    this.repeats = opts.repeats||0;
    this.living = true;
    this.onCompelete = opts.onCompelete||null;
};
MovieClip.prototype.format = function(movie){
    if(JC.isString(movie)){
        var config = this.animations[movie];
        if(config){
            return this.format(config);
        }else{
            console.warn(
            '%c JC.MovieClip warn %c: you didn\`t config %c'+movie+'%c in animations ',
            'color: #f98165; background: #80a89e',
            'color: #80a89e; background: #cad9d5;',
            'color: #f98165; background: #cad9d5',
            'color: #80a89e; background: #cad9d5'
            );
            return false;
        }
    }else if(JC.isArray(movie)){
        return movie;
    }else if(JC.isObject(movie)){
        var arr = [];
        for(var i=movie.start;i<=movie.end;i++){
            arr.push(i);
        }
        if(movie.next&&this.animations[movie.next]){
            var This = this;
            this.next = function(){
                This.playMovie({
                    movie: this.animations[movie.next],
                    infinity: true
                });
            };
        }
        return arr;
    }
};
MovieClip.prototype.pause = function(){
    this.paused = true;
};
MovieClip.prototype.start = function(){
    this.paused = false;
};
MovieClip.prototype.cancle = function(){
    this.living = false;
};
Object.defineProperty(MovieClip.prototype, 'interval', {
    get: function() {
        return this.fps>0?1000/this.fps>>0:16;
    }
});


function Animator(){
    this.start = false;
    this.animates = [];
}
JC.Animator = Animator;
Animator.prototype.update = function(snippet){
    for(var i=0;i<this.animates.length;i++){
        if(!this.animates[i].living)this.animates.splice(i,1);
        this.animates[i]&&this.animates[i].update(snippet);
    }
};
Animator.prototype.fromTo = function(opts){
    var animate = new JC.Transition(opts);
    this.animates.push(animate);
    return animate;
};
Animator.prototype.keyFrames = function(opts){
    var animate = new JC.Animation(opts);
    this.animates.push(animate);
    return animate;
};







