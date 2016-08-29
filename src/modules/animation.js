JC.copyJSON = function(json){
    return JSON.parse(JSON.stringify(json));
};
function Transition(opts){
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

    // this.keyframes = [];
    this.timeScale = opts.timeScale||1;

    this.ATRS = opts.from;
    this.ATRE = opts.to;

    this.paused = false;
}
JC.Transition = Transition;
Transition.prototype.nextPose = function(){
    var cache = {};
    for(var i in this.ATRE){
        cache[i] = JC.TWEEN[this.ease]( this.progress , this.ATRS[i] , this.ATRE[i] - this.ATRS[i] , this.duration );
        if(this.element[i]!==undefined)this.element[i] = cache[i];
    }
    return cache;//this.onUpdate
};
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
Transition.prototype.pause = function(){
    this.paused = true;
};
Transition.prototype.start = function(){
    this.paused = false;
};
Transition.prototype.stop = function(){
    this.progress = this.duration;
};
Transition.prototype.cancle = function(){
    this.living = false;
};


function Animation(opts){
    opts.from = JC.copyJSON(opts.keys[0]);
    opts.to = JC.copyJSON(opts.keys[1]);

    JC.Transition.call(this,opts);

    this.keyframes = [];
    this.keyIndex = 1;
    this.direction = 1;
    this.keyConfig = [];
    this.keyFrames(opts);
    this.element.setVal(this.ATRS);
}
JC.Animation = Animation;
Animation.prototype = Object.create( JC.Transition.prototype );
Animation.prototype.constructor = JC.Animation;
Animation.prototype.update = function(snippet){
    if(this.paused||!this.living)return;
    this.progress += this.timeScale*snippet;

    if(this.progress < this.duration){
        if(this.progress<0)return;
        var pose = this.nextPose();
        this.onUpdate&&this.onUpdate(pose,this.progress/this.duration,this.keyIndex);
    }else{
        this.element.setVal(this.ATRE);
        this.onUpdate&&this.onUpdate(this.ATRE,1,this.keyIndex);
        if(this.keyIndex<this.keyframes.length-1&&this.keyIndex>0){
            this.keyIndex += this.direction;
            this.ATRS = this.keyframes[this.keyIndex].to;
            this.duration = this.keyframes[this.keyIndex].duration||this.duration;
            this.ease = this.keyframes[this.keyIndex].ease||this.ease;
        }else{
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
    }
};
Animation.prototype.keyFrames = function(opts){
    for (var i = 0; i < opts.keys.length; i++) {
        this.keyframes.push(this.peel(opts.keys[i]));
    }
};
Animation.prototype.peel = function(opts){
    var prue = {};
    prue.to = JC.copyJSON(opts.to);
    prue.ease = opts.ease;
    prue.duration = opts.duration||300;
    return prue;
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



