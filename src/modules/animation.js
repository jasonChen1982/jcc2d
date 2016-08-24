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
    this.fx = opts.fx||'easeBoth';
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
        cache[i] = JC.TWEEN[this.fx]( this.progress , this.ATRS[i] , this.ATRE[i] - this.ATRS[i] , this.duration );
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
        this.onUpdate&&this.onUpdate(pose,this.progress);
    }else{
        this.element.setVal(this.ATRE);
        this.onUpdate&&this.onUpdate(this.ATRE,this.duration);
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




function Animator(){
    this.start = false;
    // this.pt = Date.now();
    this.animates = [];
}
JC.Animator = Animator;
Animator.prototype.update = function(snippet){
    // var snippet = Date.now()-this.pt;
    for(var i=0;i<this.animates.length;i++){
        if(!this.animates[i].living){
            this.animates.splice(i,1);
        }else{
            this.animates[i].update(snippet);
        }
    }
    // this.pt += snippet;
};
Animator.prototype.fromTo = function(opts){
    var animate = new JC.Transition(opts);
    this.animates.push(animate);
    return animate;
};
Animator.prototype.keyFrames = function(opts){
};