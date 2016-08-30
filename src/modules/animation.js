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
                    this._direction = -1*this._direction;
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







