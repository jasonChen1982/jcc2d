(function() {

	window.JC = window.JC||{};

	var lastTime = 0;
	var vendors = ['ms', 'moz', 'webkit', 'o'];
	for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
	    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
	    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||
	        window[vendors[x] + 'CancelRequestAnimationFrame'];
	}
	if (!window.requestAnimationFrame) {
	    window.requestAnimationFrame = function(callback) {
	        var currTime = new Date().getTime();
	        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
	        var id = window.setTimeout(function() { callback(currTime + timeToCall); },
	          timeToCall);
	        lastTime = currTime + timeToCall;
	        return id;
	    };
	}
	if (!window.cancelAnimationFrame) {
	    window.cancelAnimationFrame = function(id) {
	        clearTimeout(id);
	    };
	}
	window.RAF = window.requestAnimationFrame;

	/* 运动时间函数 */
	JC.TWEEN = {
		linear: function (t, b, c, d){  //匀速
			return c*t/d + b;
		},
		easeIn: function(t, b, c, d){  //加速曲线
			return c*(t/=d)*t + b;
		},
		easeOut: function(t, b, c, d){  //减速曲线
			return -c *(t/=d)*(t-2) + b;
		},
		easeBoth: function(t, b, c, d){  //加速减速曲线
			if ((t/=d/2) < 1) {
				return c/2*t*t + b;
			}
			return -c/2 * ((--t)*(t-2) - 1) + b;
		},
		easeInStrong: function(t, b, c, d){  //加加速曲线
			return c*(t/=d)*t*t*t + b;
		},
		easeOutStrong: function(t, b, c, d){  //减减速曲线
			return -c * ((t=t/d-1)*t*t*t - 1) + b;
		},
		easeBothStrong: function(t, b, c, d){  //加加速减减速曲线
			if ((t/=d/2) < 1) {
				return c/2*t*t*t*t + b;
			}
			return -c/2 * ((t-=2)*t*t*t - 2) + b;
		},
		elasticIn: function(t, b, c, d, a, p){  //正弦衰减曲线（弹动渐入）
			if (t === 0) { 
				return b; 
			}
			if ( (t /= d) == 1 ) {
				return b+c; 
			}
			if (!p) {
				p=d*0.3; 
			}
			if (!a || a < Math.abs(c)) {
				a = c; 
				var s = p/4;
			} else {
				var s = p/(2*Math.PI) * Math.asin (c/a);
			}
			return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		},
		elasticOut: function(t, b, c, d, a, p){    //正弦增强曲线（弹动渐出）
			if (t === 0) {
				return b;
			}
			if ( (t /= d) == 1 ) {
				return b+c;
			}
			if (!p) {
				p=d*0.3;
			}
			if (!a || a < Math.abs(c)) {
				a = c;
				var s = p / 4;
			} else {
				var s = p/(2*Math.PI) * Math.asin (c/a);
			}
			return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
		},    
		elasticBoth: function(t, b, c, d, a, p){
			if (t === 0) {
				return b;
			}
			if ( (t /= d/2) == 2 ) {
				return b+c;
			}
			if (!p) {
				p = d*(0.3*1.5);
			}
			if ( !a || a < Math.abs(c) ) {
				a = c; 
				var s = p/4;
			}
			else {
				var s = p/(2*Math.PI) * Math.asin (c/a);
			}
			if (t < 1) {
				return - 0.5*(a*Math.pow(2,10*(t-=1)) * 
						Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
			}
			return a*Math.pow(2,-10*(t-=1)) * 
					Math.sin( (t*d-s)*(2*Math.PI)/p )*0.5 + c + b;
		},
		backIn: function(t, b, c, d, s){     //回退加速（回退渐入）
			if (typeof s == 'undefined') {
			   s = 3.70158;
			}
			return c*(t/=d)*t*((s+1)*t - s) + b;
		},
		backOut: function(t, b, c, d, s){
			if (typeof s == 'undefined') {
				s = 3.70158;  //回缩的距离
			}
			return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
		}, 
		backBoth: function(t, b, c, d, s){
			if (typeof s == 'undefined') {
				s = 1.70158; 
			}
			if ((t /= d/2 ) < 1) {
				return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
			}
			return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
		},
		bounceIn: function(t, b, c, d){    //弹球减振（弹球渐出）
			return c - this['bounceOut'](d-t, 0, c, d) + b;
		},       
		bounceOut: function(t, b, c, d){
			if ((t/=d) < (1/2.75)) {
				return c*(7.5625*t*t) + b;
			} else if (t < (2/2.75)) {
				return c*(7.5625*(t-=(1.5/2.75))*t + 0.75) + b;
			} else if (t < (2.5/2.75)) {
				return c*(7.5625*(t-=(2.25/2.75))*t + 0.9375) + b;
			}
			return c*(7.5625*(t-=(2.625/2.75))*t + 0.984375) + b;
		},      
		bounceBoth: function(t, b, c, d){
			if (t < d/2) {
				return this['bounceIn'](t*2, 0, c, d) * 0.5 + b;
			}
			return this['bounceOut'](t*2-d, 0, c, d) * 0.5 + c*0.5 + b;
		}
	}
	/* 结束 运动时间函数 */


	JC.toRad = Math.PI/180;


	function DisplayObject(){
		this.visible = true;
		this.globalAlpha = 1;
		this.alpha = 1;

		this.scaleX = 1;
		this.scaleY = 1;
		this.RLSXY = false;
		this.scaleXY = 1;

		this.skewX = 0;
		this.skewY = 0;

		this.rotation = 0;
		
		this.x = 0;
		this.y = 0;
		
		this.regX = 0;
		this.regY = 0;

		this._m_st = 0;
		this._m_at = 0;
		this.complete = null;
		this.isMove = false;

		this.snapToPixel = false;
	}
	DisplayObject.prototype.isVisible = function() {
		return !!(this.visible && this.alpha>0 && this.scaleX*this.scaleY>0 || this.isMove);
	}
	DisplayObject.prototype.setPos = function(json){
		this.x = json.x||0;
		this.y = json.y||0;
	}
	DisplayObject.prototype.scale = function(num){
		this.RLSXY = true;
		this.scaleXY = this.scaleX = this.scaleY = num||1;
	}
	DisplayObject.prototype.updateState = function (){
		var ok = this._m_st+this._m_at > new Date().getTime();

		if(ok){
			this._updateState();
		}else if(typeof this.complete === 'function'){
			for(var i in this.MATR){
				this[i] = this.MATR[i];
			}
			this.MATR = {};
			this.isMove = false;
			var t = new Date().getTime();
			this.complete();
			if(t>this._m_st)this.complete = null;
		}
	}
	DisplayObject.prototype.moveTween = function (json){
		this.MATR = json.attr;
		this._m_st = new Date().getTime();
		this._m_at = json.time||300;
		this.fx = json.fx||'easeIn';
		this.complete = json.complete;
		this.isMove = true;
		this.ATC = {};
		for(var i in this.MATR){
			this.ATC[i] = this[i];
		}
	}
	DisplayObject.prototype._updateState = function (){
		var nowTime = new Date().getTime(),
			p = nowTime - this._m_st,
			t = this._m_at,
			f = this.ATC,
			to = this.MATR;
		for(var i in this.MATR){
			this[i] = JC.TWEEN[this.fx]( p , f[i] , to[i] - f[i] , t );
		}
	}
	DisplayObject.prototype.identity = function() {
		this.a = this.d = 1;
		this.b = this.c = this.tx = this.ty = 0;
		return this;
	};
	DisplayObject.prototype.updateTransform = function (ctx){
		if (this.rotation%360) {
			var r = this.rotation*JC.toRad;
			var cos = Math.cos(r);
			var sin = Math.sin(r);
		}else{
			cos = 1;
			sin = 0;
		}
		ctx.transform(cos,sin,-sin,cos,this.x,this.y);
		
		if(this.skewX%90||this.skewY%90){
			var sRX = this.skewX*JC.toRad;
			var sRY = this.skewY*JC.toRad;
			var tanX = Math.tan(sRX);
			var tanY = Math.tan(sRY);
			ctx.transform(1,tanY,tanX,1,0,0);
		}

		if(this.RLSXY)this.scaleX = this.scaleY = this.scaleXY;
		ctx.transform(this.scaleX,0,0,this.scaleY,0,0);
	}

	function Command(cmd,param){
		this.cmd = cmd;
		this.param = param;
	}
	Command.prototype.exec = function (ctx){
		ctx[this.cmd].apply(ctx,this.param);
	}

// matrix((1-k^2)/(1+k^2),2k / (1 + k^2),2k/(1+k^2),(k^2-1)/(1+k^2),0,0)  水平反转矩阵


	function Graphics(){
		this.pathCache = [];
		this.nbp = true;
		this._fS = '#000000';
		this._sS = '#000000';
		this._lC = 'butt';
		this._lJ = 'miter';
		this._lW = 0;
		this._mL = 10;


		this._cC = null;
		this._cM = false;
	}
	JC.Graphics = Graphics;
	Graphics.prototype = new DisplayObject();
	Graphics.prototype.constructor = JC.Graphics;
	Graphics.prototype.cache = function(x, y, width, height) {
		this._cC = this._cC||document.createElement('canvas');
		this._cW = width;
		this._cH = height;
		this._cOX = x;
		this._cFY = y;
		this.updateCache();
	}
	Graphics.prototype.updateCache = function(cO) {
		var cC = this._cC;
		if (!cC) { throw "cache() must be called before updateCache()"; }
		var offX = this._cOX, offY = this._cFY;
		var w = this._cW, h = this._cH, ctx = cC.getContext("2d");
		
		if (w != cC.width || h != cC.height) {
			cC.width = w;
			cC.height = h;
		} else if (!cO) {
			ctx.clearRect(0, 0, w+1, h+1);
		}
		
		ctx.save();
		ctx.globalCompositeOperation = cO;
		ctx.setTransform(1, 0, 0, 1, -offX, -offY);
		this.draw(ctx,true);
		ctx.restore();
	};
	// Graphics.prototype.getRGB = function(r, g, b, alpha) {
	// 	if (r != null && b == null) {
	// 		alpha = g;
	// 		b = r&0xFF;
	// 		g = r>>8&0xFF;
	// 		r = r>>16&0xFF;
	// 	}
	// 	if (alpha == null) {
	// 		return "rgb("+r+","+g+","+b+")";
	// 	} else {
	// 		return "rgba("+r+","+g+","+b+","+alpha+")";
	// 	}
	// };
	// Graphics.prototype.getHSL = function(hue, saturation, lightness, alpha) {
	// 	if (alpha == null) {
	// 		return "hsl("+(hue%360)+","+saturation+"%,"+lightness+"%)";
	// 	} else {
	// 		return "hsla("+(hue%360)+","+saturation+"%,"+lightness+"%,"+alpha+")";
	// 	}
	// }
	// Graphics.prototype.BASE_64 = {"A":0,"B":1,"C":2,"D":3,"E":4,"F":5,"G":6,"H":7,"I":8,"J":9,"K":10,"L":11,"M":12,"N":13,"O":14,"P":15,"Q":16,"R":17,"S":18,"T":19,"U":20,"V":21,"W":22,"X":23,"Y":24,"Z":25,"a":26,"b":27,"c":28,"d":29,"e":30,"f":31,"g":32,"h":33,"i":34,"j":35,"k":36,"l":37,"m":38,"n":39,"o":40,"p":41,"q":42,"r":43,"s":44,"t":45,"u":46,"v":47,"w":48,"x":49,"y":50,"z":51,"0":52,"1":53,"2":54,"3":55,"4":56,"5":57,"6":58,"7":59,"8":60,"9":61,"+":62,"/":63};
	// Graphics.prototype.STROKE_CAPS_MAP = ["butt", "round", "square"];
	// Graphics.prototype.STROKE_JOINTS_MAP = ["miter", "round", "bevel"];

	Graphics.prototype.beginFill = function(shader) {
		this._fS = shader;
		return this;
	}
	Graphics.prototype.beginStroke = function(shader) {
		this._sS = shader;
		return this;
	}
	Graphics.prototype.setStrokeStyle = function(thickness, caps, joints, miterLimit) {
		this._lW = thickness||0;
		this._lC = caps;
		this._lJ = joints;
		this._mL = miterLimit;
		return this;
	};
	Graphics.prototype.cLGradient = function(colors, ratios, x0, y0, x1, y1) {
		var shader = {};
		shader.cmd = 'createRadialGradient';
		shader.param = [ x0, y0, x1, y1];
		shader.colorStop = [];
		for(var i=0;i<colors.length;i++){
			shader.colorStop[i] = {
				color: colors[i],
				ratio: ratios[i]
			}
		}
		return shader;
	}
	Graphics.prototype.cRGradient = function(colors, ratios, x0, y0, r0, x1, y1, r1) {
		var shader = {};
		shader.cmd = 'createRadialGradient';
		shader.param = [ x0, y0, r0, x1, y1, r1];
		shader.colorStop = [];
		for(var i=0;i<colors.length;i++){
			shader.colorStop[i] = {
				color: colors[i],
				ratio: ratios[i]
			}
		}
		return shader;
	}
	Graphics.prototype.beginPath = function() {
		this.nbp = false;
		this.pathCache.push(new Command('beginPath', []));
		return this;
	}
	Graphics.prototype.moveTo = function(x, y) {
		this.pathCache.push(new Command('moveTo', arguments));
		return this;
	}
	Graphics.prototype.lineTo = function(x, y) {
		this.pathCache.push(new Command('lineTo', arguments));
		return this;
	}
	Graphics.prototype.arcTo = function(x1, y1, x2, y2, radius) {
		this.pathCache.push(new Command('arcTo', arguments));
		return this;
	}
	Graphics.prototype.arc = function(x, y, radius, startAngle, endAngle, anticlockwise) {
		this.pathCache.push(new Command('arc', arguments));
		return this;
	}
	Graphics.prototype.quadraticCurveTo = function(cpx, cpy, x, y) {
		this.pathCache.push(new Command('quadraticCurveTo', arguments));
		return this;
	}
	Graphics.prototype.bezierCurveTo = function(cp1x, cp1y, cp2x, cp2y, x, y) {
		this.pathCache.push(new Command('bezierCurveTo', arguments));
		return this;
	}
	Graphics.prototype.rect = function(x, y, w, h) {
		this.pathCache.push(new Command('rect', arguments));
		return this;
	}
	Graphics.prototype.closePath = function() {
		this.pathCache.push(new Command('closePath', []));
		return this;
	}
	Graphics.prototype.draw = function(ctx,cacheMark) {
		this.updateState();
		var length = this.pathCache.length;
		ctx.save();
		ctx.globalAlpha = this.alpha*this.globalAlpha;
		this.updateTransform(ctx);
		if(this._cM){
			ctx.drawImage(this._cC, 0, 0, this._cC.width, this._cC.height, -this.regX, -this.regY, this._cC.width, this._cC.height);
		}else{
			if(this.nbp)ctx.beginPath();
			for(var i=0;i<length;i++){
				this.pathCache[i].exec(ctx);
			}
			this.updateContent(ctx);
			if(cacheMark)this._cM = true;
		}
		ctx.restore();
	}
	Graphics.prototype.updateContent = function(ctx) {
		var shader=null;
		if(typeof this._fS === 'string'){
			shader = this._fS;
		}else{
			shader = ctx[this._fS.cmd].apply(ctx,this._fS.param);
			var length = shader.colorStop.length,
				cs = shader.colorStop;
			for(var i=0;i<length;i++){
				shader.addColorStop(cs[i].ratio,cs[i].color);
			}
		}
		ctx.fillStyle = shader;


		var stroke=null;
		if(typeof this._sS === 'string'){
			stroke = this._sS;
		}else{
			stroke = ctx[this._sS.cmd].apply(ctx,this._sS.param);
			var length = stroke.colorStop.length,
				cs = stroke.colorStop;
			for(var i=0;i<length;i++){
				stroke.addColorStop(cs[i].ratio,cs[i].color);
			}
		}
		ctx.strokeStyle = stroke;
		ctx.lineCap = this._lC;
		ctx.lineJoin = this._lJ;
		ctx.lineWidth = this._lW;
		ctx.miterLimit = this._mL;

		ctx.fill();
		ctx.stroke();
	}



	function Text(text,font,color){
		this.text = text;
		this.font = font;
		this.color = color;
	}
	JC.Text = Text;
	Text.prototype = new DisplayObject();
	Text.prototype.constructor = JC.Text;
	Text.prototype.draw = function(ctx) {
		this.updateState();
		ctx.save();
		ctx.globalAlpha = this.alpha*this.globalAlpha;
		this.updateTransform(ctx);
		ctx.fillStyle = this.color;
		ctx.font=this.font;
		ctx.fillText(this.text,-this.regX,-this.regY);
		ctx.restore();
	}


	function Sprite(json){
		this.image = json.image;
		this._imageW = this.image.width;
		this._imageH = this.image.height;
		this.width = json.width;
		this.height = json.height;
		this.regX = .5*this.width;
		this.regY = .5*this.height;
		this._cF = 0;
		this._cFS = json.count||0;
		this._row = Math.floor(this._imageW/this.width);
		this._col = 0;
		this._cCol = Math.floor(this._cFS/this._row);
		this.sH = json.sH||0;
		this.sW = json.sW||0;
		this.loop = true;
		this.timeStamp = new Date().getTime();
		this.interval = 30;
	}
	JC.Sprite = Sprite;
	Sprite.prototype = new DisplayObject();
	Sprite.prototype.constructor = JC.Sprite;
	Sprite.prototype.getFrameInfor = function(count){
		var obj = {
				x: this.sW,
				y: this.sH
			};
		if(this._cFS>0){
			var countIndex = count,
				row = Math.floor(countIndex%this._row);
				obj.x += row*this.width;
		}
		this._col = Math.floor(this._cF/this._row);
		obj.y += this._col*this.height;
		return obj;
	}
	Sprite.prototype.draw = function (ctx){
		this.updateState();
		var obj = this.getFrameInfor(this._cF);
		ctx.save();
		ctx.globalAlpha=this.alpha*this.globalAlpha;
		this.updateTransform(ctx);
		ctx.drawImage(this.image, obj.x, obj.y, this.width, this.height, -this.regX, -this.regY, this.width, this.height);
		ctx.restore();
		this.updateCF();
	}
	Sprite.prototype.updateCF = function (){
		var time = new Date().getTime(),
			ok = time-this.timeStamp>this.interval;
		if(this._cFS>0&&this.canFrames&&ok){
			this._cF++;
			this.timeStamp = time;
		}
		if(this._cF>this._cFS){
			if(!this.loop){
				this.canFrames = false;
			}
			this._cF = 0;
		}
	}
	Sprite.prototype.goFrames = function (col){
		this.sH = col||0;
		this.canFrames = true;
		this._cF = 0;
	}
	Sprite.prototype.hitTest = function (x,y){
		return (this.x<x&&(this.x+this.width)>x&&this.y<y&&(this.y+this.height)>y);
	}


	function Container(){
		this.cds = [];
	}
	JC.Container = Container;
	Container.prototype = new DisplayObject();
	Container.prototype.constructor = JC.Container;
	Container.prototype.addChild = function (c){
		if (c == null) { return c; }
		var l = arguments.length;
		if (l > 1) {
			for (var i=0; i<l; i++) { this.addChild(arguments[i]); }
			return arguments[l-1];
		}
		this.cds.push(c);
		return c;
	}
	Container.prototype.draw = function (ctx){
		this.updateState();
		ctx.save();
		this.updateTransform(ctx);
		var totle = this.cds.length,
			i = 0;
		while(i<totle){
			var cd = this.cds[i];
			if(cd.isVisible()){
				cd.globalAlpha = this.alpha*this.globalAlpha;
				cd.draw(ctx);
			}
			i++;
		}
		ctx.restore();
	}


	/* UI 渲染类 */
	function Stage(id,bgColor){
		this.canvas = document.getElementById(id);
		this.ctx = this.canvas.getContext('2d');
		this.cds = [];
		this.canvas.style.backgroundColor = bgColor || "transparent";
		this.autoClear = true;
	}
	JC.Stage = Stage;
	Stage.prototype = new DisplayObject();
	Stage.prototype.constructor = JC.Stage;
	Stage.prototype.addChild = function (c){
		if (c == null) { return c; }
		var l = arguments.length;
		if (l > 1) {
			for (var i=0; i<l; i++) { this.addChild(arguments[i]); }
			return arguments[l-1];
		}
		this.cds.push(c);
		return c;
	}
	Stage.prototype.resize = function (w,h){
	    // this.width = this.canvas.width = w;
	    // this.height = this.canvas.height = h;
	    this.canvas.style.width = w+'px'; // /2
	    this.canvas.style.height = h+'px'; // /2
	}
	Stage.prototype.render = function (){
		if(this.autoClear)this.ctx.clearRect(0,0,this.width,this.height);
		var totle = this.cds.length,
			i = 0;
		while(i<totle){
			var children = this.cds[i];
			if(children.isVisible()){
				children.globalAlpha = this.alpha*this.globalAlpha;
				children.draw(this.ctx);
			}
			i++;
		}
	}
	/* 结束 UI 渲染类 */

	/* 纹理预加载器 */
	function ImagesLoad(json){
		this.sprite = {};
		this.OKNum = 0;
		this.errNum = 0;
		this.totalNum = 0;
		this.imagesLoad(json);
	}
	ImagesLoad.prototype.imagesLoad = function (json){
		var This = this;
		for(var img in json){
			this.sprite[img] = new Image();
			this.totalNum++;
			this.sprite[img].onload = function (){
				This.OKNum++;
				if(This.OKNum>=This.totalNum){
					This.imagesLoaded();
				}
			};
			this.sprite[img].onerror = function (){
				This.errNum++;
			};
			this.sprite[img].src = json[img];
		}
	}
	ImagesLoad.prototype.imagesLoaded = function (){}
	ImagesLoad.prototype.getResult = function (id){
		return this.sprite[id];
	}
	JC.ImagesLoad = ImagesLoad;
	/* 结束 纹理预加载 */

}());