
var w = window.innerWidth,
  h = window.innerHeight,
  COLORS = ['#6c1ee6', '#eca31c', '#53d497', '#832273', '#3ab6de', '#a8028c'];

function ParticleEngine(w,h) {
  this.emitters = [];
  this.numEmitters = 0;
  this.w = w;
  this.h = h;
}
ParticleEngine.prototype.addEmitter = function(emitter) {
  this.emitters.push(emitter);
  this.numEmitters = this.emitters.length;
};
ParticleEngine.prototype.addEmitters = function(emitters, replace) {
  if (replace === true) {
    this.clearEmitters();
    this.emitters = emitters;
  }
  else this.emitters = this.emitters.concat(emitters);

  this.numEmitters = this.emitters.length;
};
ParticleEngine.prototype.clearEmitters = function() {
  this.emitters.length = 0;
};
ParticleEngine.prototype.removeEmitter = function (emitter) {
  var i = this.emitters.indexOf(emitter);

  if (i >= 0) {
    this.emitters.splice(i, 1);
    this.numEmitters = this.emitters.length;
   }
};
ParticleEngine.prototype.removeEmitters = function (emitters) {
  var i = 0, len = emitters.length;
  while ( i < len) {
    this.removeEmitter(emitters[i++]);
  }
};
ParticleEngine.prototype.update = function() {
  var i = 0; while ( i < this.numEmitters) this.emitters[i++].update();
};


function Emitter(options) {
  this.doc = new JC.Container();
  this.pool = [];
  this.init(options);
}
Emitter.prototype.init = function(options){
  for (var i = 0; i < options.count; i++) {
    var cd = new options.type();
    this.pool.push(cd);
    this.doc.adds(cd.doc);
  }
};
Emitter.prototype.update = function(){
  var i = 0;
  var child,doc,now = Date.now();

  while ( i < this.pool.length) {
    child = this.pool[i];
    doc = child.doc;

    if(child.fadeIn){
        child.age = now-child.birthday;
        doc.alpha = child.alphaEnd*child.age/400;
        // console.log(doc.alpha);
        if(doc.alpha>=child.alphaEnd){
            doc.alpha = child.alphaEnd;
            child.fadeIn = false;
        }
    }
    doc.rotation  += child.spin;
    doc.x     += child.speed * child.directionX;
    doc.y     += child.speed * child.directionY;
    if(child.checkBound())child.reset();

    i++;
  }
};

function ParticleCricle(){
  this.doc = new JC.Graphics();
  this.speed = JC.Utils.random(1,2);
  this.alphaEnd = JC.Utils.random(0.5,1);

  var degree = JC.Utils.random(0,360);
  this.directionX = Math.sin(degree * JC.Utils.DTR);
  this.directionY = Math.cos(degree * JC.Utils.DTR);

  this.init();
  this.reset();
}
ParticleCricle.prototype.init = function(){
  var This = this;
  this.spin = 0;
  this.color = JC.Utils.random(COLORS);
  this.radius = JC.Utils.random(0,10)>>0;
  this.doc.drawCall(function(ctx){
    ctx.beginPath();
    ctx.fillStyle = This.color;
    ctx.strokeStyle = This.color;
    ctx.arc(0,0,This.radius,0,Math.PI*2);
    ctx.stroke();
  });
};
ParticleCricle.prototype.reset = function(){
  var halfW = w>>1;
  var halfH = h>>1;
  this.doc.x = JC.Utils.random(-halfW, halfW);
  this.doc.y = JC.Utils.random(-halfH, halfH);
  this.doc.alpha = 0;

  this.birthday = Date.now();
  this.age = 0;

  this.fadeIn = true;
};
ParticleCricle.prototype.checkBound = function(){
  return (this.doc.x-this.radius>w/2 || this.doc.x+this.radius<-w/2 || this.doc.y-this.radius>h/2 || this.doc.y+this.radius<-h/2);
};


function ParticleTriangle(){
  this.doc = new JC.Graphics();
  this.speed = JC.Utils.random(0,1);
  this.alphaEnd = JC.Utils.random(0.5,1);

  var degree = JC.Utils.random(0,360);
  this.directionX = Math.sin(degree * JC.Utils.DTR);
  this.directionY = Math.cos(degree * JC.Utils.DTR);

  this.FOS = JC.Utils.random(['fill','stroke']);

  this.init();
  this.reset();
}
ParticleTriangle.prototype.init = function(){
  var This = this;
  this.spin = JC.Utils.random(-3,3);
  this.color = JC.Utils.random(COLORS);
  this.radius = JC.Utils.random(4,16)>>0;
  var points = [
      {x: this.radius*Math.cos(0                 ), y: this.radius*Math.sin(0                 )},
      {x: this.radius*Math.cos(120 * JC.Utils.DTR), y: this.radius*Math.sin(120 * JC.Utils.DTR)},
      {x: this.radius*Math.cos(240 * JC.Utils.DTR), y: this.radius*Math.sin(240 * JC.Utils.DTR)}
  ];
  this.doc.drawCall(function(ctx){
    ctx.beginPath();
    ctx.fillStyle = This.color;
    ctx.strokeStyle = This.color;
    ctx.moveTo(points[0].x,points[0].y);
    ctx.lineTo(points[1].x,points[1].y);
    ctx.lineTo(points[2].x,points[2].y);
    ctx.closePath();
    if(This.FOS === 'fill'){
        ctx.fill();
    }else if(This.FOS === 'stroke'){
        ctx.stroke();
    }
  });
};
ParticleTriangle.prototype.reset = function(){
  var halfW = w>>1;
  var halfH = h>>1;
  this.doc.x = JC.Utils.random(-halfW, halfW);
  this.doc.y = JC.Utils.random(-halfH, halfH);
  this.doc.alpha = 0;

  this.birthday = Date.now();
  this.age = 0;

  this.fadeIn = true;
};
ParticleTriangle.prototype.checkBound = function(){
  return (this.doc.x-this.radius>w/2 || this.doc.x+this.radius<-w/2 || this.doc.y-this.radius>h/2 || this.doc.y+this.radius<-h/2);
};




function ParticlePlus(){
  this.doc = new JC.Graphics();
  this.speed = JC.Utils.random(0,1);
  this.alphaEnd = JC.Utils.random(0.5,1);

  var degree = JC.Utils.random(0,360);
  this.directionX = Math.sin(degree * JC.Utils.DTR);
  this.directionY = Math.cos(degree * JC.Utils.DTR);

  this.init();
  this.reset();
}
ParticlePlus.prototype.init = function(){
  var This = this,
    scale = JC.Utils.random(0.5,1),
    ww = 6*scale,hh = 30*scale;
  this.spin = JC.Utils.random(-3,3)>0?JC.Utils.random(2,3):JC.Utils.random(-3,-2);
  this.color = JC.Utils.random(COLORS);
  this.radius = JC.Utils.random(4,16)>>0;
  this.doc.drawCall(function(ctx){
    ctx.beginPath();
    ctx.fillStyle = This.color;
    ctx.fillRect(-ww/2,-hh/2,ww,hh);
    ctx.fillRect(-hh/2,-ww/2,hh,ww);
    ctx.fill();
  });
};
ParticlePlus.prototype.reset = function(){
  var halfW = w>>1;
  var halfH = h>>1;
  this.doc.x = JC.Utils.random(-halfW, halfW);
  this.doc.y = JC.Utils.random(-halfH, halfH);
  this.doc.alpha = 0;

  this.birthday = Date.now();
  this.age = 0;

  this.fadeIn = true;
};
ParticlePlus.prototype.checkBound = function(){
  return (this.doc.x-this.radius>w/2 || this.doc.x+this.radius<-w/2 || this.doc.y-this.radius>h/2 || this.doc.y+this.radius<-h/2);
};
