!function(t,i){"object"==typeof exports?module.exports=i():"function"==typeof define&&define.amd?define(function(){return t.JC=i()}):t.JC=i()}(this,function(){function t(){this.global={x:-1e5,y:-1e5},this.target=null,this.originalEvent=null,this.cancleBubble=!1,this.ratio=1,this.type=""}function i(){this.touchstarted=!1,this.mouseDowned=!1,this.listeners={}}function e(t){d.Eventer.call(this),this.texture=null,this.width=0,this.height=0,this.loaded=!1,this.dispose(t);var i=this;this.on("load",function(){i.width=i.texture.width,i.height=i.texture.height})}function s(){d.Eventer.call(this),this.textures={},this._total=0,this._failed=0,this._received=0}function h(t){this.element=t.element||{},this.duration=t.duration||300,this.living=!0,this.onCompelete=t.onCompelete||null,this.onUpdate=t.onUpdate||null,this.infinity=t.infinity||!1,this.alternate=t.alternate||!1,this.ease=t.ease||"easeBoth",this.repeats=t.repeats||0,this.delay=t.delay||0,this.progress=0-this.delay,this.timeScale=t.timeScale||1,this.ATRS=t.from,this.ATRE=t.to,this.paused=!1}function o(){this.start=!1,this.animates=[]}function n(){this.a=1,this.b=0,this.c=0,this.d=1,this.tx=0,this.ty=0}function r(){this._ready=!0,this.visible=!0,this.worldAlpha=1,this.alpha=1,this.scaleX=1,this.scaleY=1,this.skewX=0,this.skewY=0,this.rotation=0,this.rotationCache=0,this._sr=0,this._cr=1,this.x=0,this.y=0,this.pivotX=0,this.pivotY=0,this.mask=null,this.parent=null,this.worldTransform=new n,this.event=new d.Eventer,this.passEvent=!1,this.bound=[],this.Animator=new d.Animator}function a(){d.DisplayObject.call(this),this.cds=[]}function c(t){if(d.Container.call(this),this._cF=0,this.count=t.count||1,this.sH=t.sH||0,this.sW=t.sW||0,this.loop=!1,this.repeats=0,this.preTime=Date.now(),this.fps=20,this.texture=t.texture,this.texture.loaded)this.upTexture(t);else{var i=this;this._ready=!1,this.texture.on("load",function(){i.upTexture(t),i._ready=!0,this.moving&&(this.MST=Date.now())})}}function p(){d.Container.call(this),this.cacheCanvas=null}function u(t,i,e){d.Container.call(this),this.text=t,this.font=i,this.color=e,this.textAlign="center",this.textBaseline="middle",this.outline=0,this.lineWidth=1,this.US=!1,this.UF=!0}function l(t,i){d.Container.call(this),this.type="stage",this.canvas=document.getElementById(t),this.ctx=this.canvas.getContext("2d"),this.cds=[],this.canvas.style.backgroundColor=i||"transparent",this.autoClear=!0,this.setStyle=!1,this.width=this.canvas.width,this.height=this.canvas.height,"imageSmoothingEnabled"in this.ctx?this.ctx.imageSmoothingEnabled=!0:"webkitImageSmoothingEnabled"in this.ctx?this.ctx.webkitImageSmoothingEnabled=!0:"mozImageSmoothingEnabled"in this.ctx?this.ctx.mozImageSmoothingEnabled=!0:"oImageSmoothingEnabled"in this.ctx&&(this.ctx.oImageSmoothingEnabled=!0),this.initEvent(),this.pt=-1}var d=window.JC||{};return function(){for(var t=0,i=["ms","moz","webkit","o"],e=0;e<i.length&&!window.requestAnimationFrame;++e)window.requestAnimationFrame=window[i[e]+"RequestAnimationFrame"],window.cancelAnimationFrame=window[i[e]+"CancelAnimationFrame"]||window[i[e]+"CancelRequestAnimationFrame"];window.requestAnimationFrame||(window.requestAnimationFrame=function(i){var e=(new Date).getTime(),s=Math.max(0,16-(e-t)),h=window.setTimeout(function(){i(e+s)},s);return t=e+s,h}),window.cancelAnimationFrame||(window.cancelAnimationFrame=function(t){clearTimeout(t)}),window.RAF=window.requestAnimFrame=window.requestAnimationFrame,window.CAF=window.cancelAnimationFrame}(),d.TWEEN={easeBoth:function(t,i,e,s){return(t/=s/2)<1?e/2*t*t+i:-e/2*(--t*(t-2)-1)+i},extend:function(t){if(t)for(var i in t)"extend"!==i&&t[i]&&(this[i]=t[i])}},d.InteractionData=t,i.prototype.on=function(t,i){this.listeners[t]=this.listeners[t]||[],this.listeners[t].push(i)},i.prototype.off=function(t,i){if(this.listeners[t]){var e=this.listeners[t].length;if(i)for(;e--;)cbs[t][e]===i&&cbs[t].splice(e,1);else cbs[t].length=0}},i.prototype.emit=function(t){if(void 0!==this.listeners){var i=this.listeners,e=i[t.type];if(void 0!==e){var s,h=e.length;for(s=0;s<h;s++)e[s].call(this,t)}}},d.Eventer=i,d.Texture=e,e.prototype=Object.create(d.Eventer.prototype),e.prototype.dispose=function(t){var i=this;"string"==typeof t&&(this.texture=new Image,this.texture.crossOrigin="",this.texture.src=t,this.texture.onload=function(){i.loaded=!0,i.emit({type:"load"})},this.texture.onerror=function(){i.emit({type:"error"})}),t instanceof Image&&t.width*t.height>0&&(this.texture=t,this.width=t.width,this.height=t.height)},d.Loader=s,s.prototype=Object.create(d.Eventer.prototype),s.prototype.load=function(t){function i(t){t.on("load",function(){s._received++,s.emit({type:"update"}),s._received+s._failed>=s._total&&s.emit({type:"compelete"})}),t.on("error",function(){s._failed++,s.emit({type:"update"}),s._received+s._failed>=s._total&&s.emit({type:"compelete"})})}var s=this;this._total=0,this._failed=0,this._received=0;for(var h in t)this._total++,this.textures[h]=new e(t[h]),i(this.textures[h]);return this},s.prototype.getById=function(t){return this.textures[t]},Object.defineProperty(e.prototype,"progress",{get:function(){return 0===this._total?1:(this._received+this._failed)/this._total}}),d.loaderUtil=function(t){return(new d.Loader).load(t)},d.copyJSON=function(t){return JSON.parse(JSON.stringify(t))},d.Transition=h,h.prototype.nextPose=function(){var t={};for(var i in this.ATRE)t[i]=d.TWEEN[this.ease](this.progress,this.ATRS[i],this.ATRE[i]-this.ATRS[i],this.duration),void 0!==this.element[i]&&(this.element[i]=t[i]);return t},h.prototype.update=function(t){if(!this.paused&&this.living)if(this.progress+=this.timeScale*t,this.progress<this.duration){if(this.progress<0)return;var i=this.nextPose();this.onUpdate&&this.onUpdate(i,this.progress/this.duration)}else if(this.element.setVal(this.ATRE),this.onUpdate&&this.onUpdate(this.ATRE,1),this.repeats>0||this.infinity)if(this.repeats>0&&--this.repeats,this.progress=0,this.alternate){var e=d.copyJSON(this.ATRS);this.ATRS=d.copyJSON(this.ATRE),this.ATRE=e}else this.element.setVal(this.ATRS);else this.living=!1,this.onCompelete&&this.onCompelete()},h.prototype.pause=function(){this.paused=!0},h.prototype.start=function(){this.paused=!1},h.prototype.stop=function(){this.progress=this.duration},h.prototype.cancle=function(){this.living=!1},d.Animator=o,o.prototype.update=function(t){for(var i=0;i<this.animates.length;i++)this.animates[i].living||this.animates.splice(i,1),this.animates[i]&&this.animates[i].update(t)},o.prototype.fromTo=function(t){var i=new d.Transition(t);return this.animates.push(i),i},o.prototype.keyFrames=function(t){},d.DTR=Math.PI/180,d.Matrix=n,n.prototype.fromArray=function(t){this.a=t[0],this.b=t[1],this.c=t[3],this.d=t[4],this.tx=t[2],this.ty=t[5]},n.prototype.toArray=function(t){this.array||(this.array=new d.Float32Array(9));var i=this.array;return t?(i[0]=this.a,i[1]=this.b,i[2]=0,i[3]=this.c,i[4]=this.d,i[5]=0,i[6]=this.tx,i[7]=this.ty,i[8]=1):(i[0]=this.a,i[1]=this.c,i[2]=this.tx,i[3]=this.b,i[4]=this.d,i[5]=this.ty,i[6]=0,i[7]=0,i[8]=1),i},n.prototype.apply=function(t,i){return i=i||{},i.x=this.a*t.x+this.c*t.y+this.tx,i.y=this.b*t.x+this.d*t.y+this.ty,i},n.prototype.applyInverse=function(t,i){var e=1/(this.a*this.d+this.c*-this.b);return i.x=this.d*e*t.x+-this.c*e*t.y+(this.ty*this.c-this.tx*this.d)*e,i.y=this.a*e*t.y+-this.b*e*t.x+(-this.ty*this.a+this.tx*this.b)*e,i},n.prototype.translate=function(t,i){return this.tx+=t,this.ty+=i,this},n.prototype.scale=function(t,i){return this.a*=t,this.d*=i,this.c*=t,this.b*=i,this.tx*=t,this.ty*=i,this},n.prototype.rotate=function(t){var i=Math.cos(t),e=Math.sin(t),s=this.a,h=this.c,o=this.tx;return this.a=s*i-this.b*e,this.b=s*e+this.b*i,this.c=h*i-this.d*e,this.d=h*e+this.d*i,this.tx=o*i-this.ty*e,this.ty=o*e+this.ty*i,this},n.prototype.append=function(t){var i=this.a,e=this.b,s=this.c,h=this.d;return this.a=t.a*i+t.b*s,this.b=t.a*e+t.b*h,this.c=t.c*i+t.d*s,this.d=t.c*e+t.d*h,this.tx=t.tx*i+t.ty*s+this.tx,this.ty=t.tx*e+t.ty*h+this.ty,this},n.prototype.identity=function(){return this.a=1,this.b=0,this.c=0,this.d=1,this.tx=0,this.ty=0,this},d.identityMatrix=new n,d.DisplayObject=r,r.prototype.constructor=d.DisplayObject,r.prototype.fromTo=function(t,i){return t.element=this,this.setVal(t.from),i&&(this.Animator.animates.length=0),this.Animator.fromTo(t)},r.prototype.to=function(t,i){t.element=this,t.from={};for(var e in t.to)t.from[e]=this[e];return i&&(this.Animator.animates.length=0),this.Animator.fromTo(t)},r.prototype.isVisible=function(){return!!(this.visible&&this.alpha>0&&this.scaleX*this.scaleY>0)},r.prototype.removeMask=function(){this.mask=null},r.prototype.setVal=function(t){if(void 0!==t)for(var i in t)void 0!==this[i]&&(this[i]=t[i])},r.prototype.updateMe=function(){var t,i,e,s,h,o,n=this.parent.worldTransform,r=this.worldTransform;this.rotation%360?(this.rotation!==this.rotationCache&&(this.rotationCache=this.rotation,this._sr=Math.sin(this.rotation*d.DTR),this._cr=Math.cos(this.rotation*d.DTR)),t=this._cr*this.scaleX,i=this._sr*this.scaleX,e=-this._sr*this.scaleY,s=this._cr*this.scaleY,h=this.x,o=this.y,(this.pivotX||this.pivotY)&&(h-=this.pivotX*t+this.pivotY*e,o-=this.pivotX*i+this.pivotY*s),r.a=t*n.a+i*n.c,r.b=t*n.b+i*n.d,r.c=e*n.a+s*n.c,r.d=e*n.b+s*n.d,r.tx=h*n.a+o*n.c+n.tx,r.ty=h*n.b+o*n.d+n.ty):(t=this.scaleX,s=this.scaleY,h=this.x-this.pivotX*t,o=this.y-this.pivotY*s,r.a=t*n.a,r.b=t*n.b,r.c=s*n.c,r.d=s*n.d,r.tx=h*n.a+o*n.c+n.tx,r.ty=h*n.b+o*n.d+n.ty),this.worldAlpha=this.alpha*this.parent.worldAlpha},r.prototype.updateTransform=function(t){this._ready&&(this.upAnimation(t),this.updateMe())},r.prototype.upAnimation=function(t){this.Animator.update(t)},r.prototype.setTransform=function(t){var i=this.worldTransform;t.globalAlpha=this.worldAlpha,t.setTransform(i.a,i.b,i.c,i.d,i.tx,i.ty)},r.prototype.getGlobalPos=function(){return{x:this.worldTransform.x,y:this.worldTransform.y}},r.prototype.on=function(t,i){this.event.on(t,i)},r.prototype.off=function(t,i){this.event.off(t,i)},r.prototype.once=function(t,i){var e=this,s=function(h){i&&i(h),e.event.off(t,s)};this.event.on(t,s)},r.prototype.getBound=function(){for(var t=[],i=this.bound.length>>1,e=0;e<i;e++){var s=this.worldTransform.apply({x:this.bound[2*e],y:this.bound[2*e+1]});t[2*e]=s.x,t[2*e+1]=s.y}return t},r.prototype.setBound=function(t,i){var e=this.bound.length;e>4&&i||(t=t||[-this.regX,this.regY,-this.regX,this.regY-this.height,-this.regX+this.width,this.regY-this.height,-this.regX+this.width,this.regY],this.bound=t)},r.prototype.ContainsPoint=function(t,i,e){for(var s,h=t.length>>1,o=t[2*h-3]-e,n=t[2*h-2]-i,r=t[2*h-1]-e,a=0;a<h;a++)s=n,o=r,n=t[2*a]-i,r=t[2*a+1]-e,o!=r&&(lup=r>o);var c=0;for(a=0;a<h;a++)if(s=n,o=r,n=t[2*a]-i,r=t[2*a+1]-e,!(o<0&&r<0||o>0&&r>0||s<0&&n<0)){if(o==r&&Math.min(s,n)<=0)return!0;if(o!=r){var p=s+(n-s)*-o/(r-o);if(0===p)return!0;p>0&&c++,0===o&&lup&&r>o&&c--,0===o&&!lup&&r<o&&c--,lup=r>o}}return 1==(1&c)},d.Container=a,a.prototype=Object.create(d.DisplayObject.prototype),a.prototype.constructor=d.Container,a.prototype.addChilds=function(t){if(void 0===t)return t;var i=arguments.length;if(i>1){for(var e=0;e<i;e++)this.addChilds(arguments[e]);return arguments[i-1]}return t.parent&&t.parent.removeChilds(t),t.parent=this,this.cds.push(t),t},a.prototype.removeChilds=function(){var t=arguments.length;if(t>1)for(var i=0;i<t;i++)this.removeChilds(arguments[i]);else if(1===t)for(var e=0;e<this.cds.length;e++)this.cds[e]===arguments[0]&&(this.cds.splice(e,1),this.cds[e].parent=null,e--)},a.prototype.updateTransform=function(t){this._ready&&(this.upAnimation(t),this.updateMe(),this.cds.length>0&&this.updateChilds(t))},a.prototype.updateChilds=function(t){for(var i=0,e=this.cds.length;i<e;i++){var s=this.cds[i];s.updateTransform(t)}},a.prototype.render=function(t){t.save(),this.setTransform(t),this.mask&&this.mask.render(t),this.renderMe(t),this.cds.length>0&&this.renderChilds(t),t.restore()},a.prototype.renderMe=function(){return!0},a.prototype.renderChilds=function(t){for(var i=0,e=this.cds.length;i<e;i++){var s=this.cds[i];s.isVisible()&&s.render(t)}},a.prototype.noticeEvent=function(t){for(var i=this.cds.length-1;i>=0;){var e=this.cds[i];if(e.visible&&(e.noticeEvent(t),t.target))break;i--}this.upEvent(t)},a.prototype.upEvent=function(t){if(this._ready&&!this.passEvent&&this.hitTest(t)&&(!t.cancleBubble||t.target===this)){if(!(this.event.listeners[t.type]&&this.event.listeners[t.type].length>0))return;this.event.emit(t)}},a.prototype.hitTest=function(t){if("touchmove"===t.type||"touchend"===t.type||"mousemove"===t.type||"mouseup"===t.type){var i=this.event.touchstarted;return"touchend"!==t.type&&"mousedown"!==t.type||(this.event.touchstarted=!1),i}for(var e=0,s=this.cds.length;e<s;e++)if(this.cds[e].hitTest(t))return"touchstart"!==t.type&&"mousedown"!==t.type||(this.event.touchstarted=!0),!0;return!!this.hitTestMe(t)&&(t.target=this,"touchstart"===t.type&&(this.event.touchstarted=!0),!0)},a.prototype.hitTestMe=function(t){return this.ContainsPoint(this.getBound(),t.global.x,t.global.y)},d.Sprite=c,c.prototype=Object.create(d.Container.prototype),c.prototype.constructor=d.Sprite,c.prototype.upTexture=function(t){this._textureW=t.texture.width,this._textureH=t.texture.height,this.width=t.width||this._textureW,this.height=t.height||this._textureH,this.regX=this.width>>1,this.regY=this.height>>1,this.setBound(null,!0)},c.prototype.getFramePos=function(){var t={x:this.sW,y:this.sH};if(this._cF>0){var i=this._textureW/this.width>>0,e=this.sW/this.width>>0,s=this.sH/this.height>>0,h=s+(e+this._cF)/i>>0,o=(e+this._cF)%i;t.x=o*this.width,t.y=h*this.height}return t},c.prototype.renderMe=function(t){if(this._ready){var i=this.getFramePos();t.drawImage(this.texture.texture,i.x,i.y,this.width,this.height,-this.regX,-this.regY,this.width,this.height),this.upFS()}},c.prototype.upFS=function(){if(this.canFrames){var t=Date.now(),i=t-this.preTime>this.interval;i&&(this._cF++,this.preTime=t),this._cF>=this.count&&(this._cF=0,this.repeats<=0&&!this.loop&&(this.canFrames=!1,"backwards"===this.fillMode&&(this._cF=this.count-1),this.onCompelete&&this.onCompelete()),this.loop||this.repeats--)}},Object.defineProperty(c.prototype,"interval",{get:function(){return this.fps>0?1e3/this.fps>>0:20}}),c.prototype.goFrames=function(t){this.count<=1||(t=t||{},this.canFrames=!0,this.loop=t.loop||!1,this.repeats=t.repeats||0,this.onCompelete=t.onCompelete||null,this.fillMode=t.fillMode||"forwards",this.fps=t.fps||this.fps,this.preTime=Date.now(),this._cF=0)},d.Graphics=p,p.prototype=Object.create(d.Container.prototype),p.prototype.constructor=d.Graphics,p.prototype.renderMe=function(t){this.draw&&(this.cached||this.cache?(this.cache&&(this.cacheCanvas=this.cacheCanvas||document.createElement("canvas"),this.width=this.cacheCanvas.width=this.session.width,this.height=this.cacheCanvas.height=this.session.height,this._ctx=this.cacheCanvas.getContext("2d"),this._ctx.clearRect(0,0,this.width,this.height),this._ctx.save(),this._ctx.setTransform(1,0,0,1,this.session.center.x,this.session.center.y),this.draw(this._ctx),this._ctx.restore(),this.cached=!0,this.cache=!1),this.cacheCanvas&&t.drawImage(this.cacheCanvas,0,0,this.width,this.height,-this.session.center.x,-this.session.center.x,this.width,this.height)):this.draw(t))},p.prototype.drawCall=function(t,i){"function"==typeof t&&(i=i||{},this.cache=i.cache||!1,this.cached=!1,this.session=i.session||{center:{x:0,y:0},width:100,height:100},this.draw=t||null)},d.Text=u,u.prototype=Object.create(d.Container.prototype),u.prototype.constructor=d.Text,u.prototype.renderMe=function(t){t.font=this.font,t.textAlign=this.textAlign,t.textBaseline=this.textBaseline,this.UF&&(t.fillStyle=this.color,t.fillText(this.text,0,0)),this.US&&(t.lineWidth=this.lineWidth,t.strokeStyle=this.color,t.strokeText(this.text,0,0))},d.Stage=l,l.prototype=Object.create(d.Container.prototype),l.prototype.constructor=d.Stage,l.prototype.resize=function(t,i,e,s){this.width=this.canvas.width=t,this.height=this.canvas.height=i,this.setStyle&&e&&s&&(this.canvas.style.width=e+"px",this.canvas.style.height=s+"px")},l.prototype.render=function(){(this.pt<=0||Date.now()-this.pt>200)&&(this.pt=Date.now());var t=Date.now()-this.pt;this.pt+=t,this.updateChilds(t),this.renderChilds()},l.prototype.renderChilds=function(){this.ctx.setTransform(1,0,0,1,0,0),this.autoClear&&this.ctx.clearRect(0,0,this.width,this.height);for(var t=0,i=this.cds.length;t<i;t++){var e=this.cds[t];e.isVisible()&&e.render(this.ctx)}},l.prototype.initEvent=function(){var t=this;this.canvas.addEventListener("click",function(i){t.eventProxy(i)},!1),this.canvas.addEventListener("touchstart",function(i){t.eventProxy(i)},!1),this.canvas.addEventListener("touchmove",function(i){i.preventDefault(),t.eventProxy(i)},!1),this.canvas.addEventListener("touchend",function(i){t.eventProxy(i)},!1),this.canvas.addEventListener("mousedown",function(i){t.eventProxy(i)},!1),this.canvas.addEventListener("mousemove",function(i){i.preventDefault(),t.eventProxy(i)},!1),this.canvas.addEventListener("mouseup",function(i){t.eventProxy(i)},!1)},l.prototype.eventProxy=function(t){for(var i=this.fixCoord(t),e=this.cds.length-1;e>=0;){var s=this.cds[e];if(s.visible&&(s.noticeEvent(i),i.target))break;e--}},l.prototype.fixCoord=function(t){var i=new d.InteractionData,e=this.getPos(this.canvas);if(i.originalEvent=t,i.type=t.type,i.ratio=this.width/this.canvas.offsetWidth,t.touches){if(i.touches=[],t.touches.length>0){for(var s=0;s<t.touches.length;s++)i.touches[s]={},i.touches[s].global={},i.touches[s].global.x=(t.touches[s].pageX-e.x)*i.ratio,i.touches[s].global.y=(t.touches[s].pageY-e.y)*i.ratio;i.global=i.touches[0].global}}else i.global.x=(t.pageX-e.x)*i.ratio,i.global.y=(t.pageY-e.y)*i.ratio;return i},l.prototype.getPos=function(t){var i={};if(t.offsetParent){var e=this.getPos(t.offsetParent);i.x=t.offsetLeft+e.x,i.y=t.offsetTop+e.y}else i.x=t.offsetLeft,i.y=t.offsetTop;return i},d});
//# sourceMappingURL=../maps/jcc2d.js.map
