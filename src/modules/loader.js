
/**
 * 图片纹理类
 *
 * @class
 * @extends JC.Eventer
 * @memberof JC
 */
function Texture(img){
	JC.Eventer.call( this );
	this.texture = null;
	this.width = 0;
	this.height = 0;
	this.loaded = false;

	this.dispose(img);

	var This = this;
	this.on('load',function(){
		This.width = This.texture.width;
		This.height = This.texture.height;
	});
}
JC.Texture = Texture;
Texture.prototype = Object.create( JC.Eventer.prototype );
Texture.prototype.dispose = function(img){
	var This = this;
    if(typeof img === 'string'){
    	this.texture = new Image();
    	this.texture.crossOrigin = '';
    	this.texture.src = img;
    	this.texture.onload = function(){
    		This.loaded = true;
    		This.emit({type: 'load'});
    	};
    	this.texture.onerror = function(){
    		This.emit({type: 'error'});
    	};
    }
    if(img instanceof Image && img.width*img.height>0){
    	this.texture = img;
		this.width = img.width;
		this.height = img.height;
    }
};




/**
 * 图片资源加载器
 *
 * @class
 * @extends JC.Eventer
 * @memberof JC
 */
function Loader(){
	JC.Eventer.call( this );
	this.textures = {};
	this._total = 0;
	this._failed = 0;
	this._received = 0;
}
JC.Loader = Loader;
Loader.prototype = Object.create( JC.Eventer.prototype );

/**
 * 开始加载资源
 * 
 * ```js
 * var loadBox = new JC.Loader();
 * loadBox.load({
 * 		id: 'img/xxx.png'
 * });
 * ```
 *
 * @param srcMap {object}
 * @return {JC.Loader}
 */
Loader.prototype.load = function (srcMap){
	var This = this;
	this._total = 0;
	this._failed = 0;
	this._received = 0;
	for (var src in srcMap) {
		this._total++;
		this.textures[src] = new Texture(srcMap[src]);
		bind(this.textures[src]);
	}

	function bind(texture){
		texture.on('load',function(){
			This._received++;
			This.emit({type: 'update'});
			if(This._received+This._failed>=This._total)This.emit({type: 'compelete'});
		});
		texture.on('error',function(){
			This._failed++;
			This.emit({type: 'update'});
			if(This._received+This._failed>=This._total)This.emit({type: 'compelete'});
		});
	}
	return this;
};

/**
 * 从纹理图片盒子里面通过id获取纹理图片
 * 
 * ```js
 * var texture = loadBox.getById('id');
 * ```
 *
 * @param id {string}
 * @return {JC.Texture}
 */
Loader.prototype.getById = function (id){
	return this.textures[id];
};
Object.defineProperty(Texture.prototype, 'progress', {
    get: function() {
        return this._total===0?1:(this._received+this._failed)/this._total;
    }
});



/**
 * 资源加载工具
 *
 * @function
 * @memberof JC
 * @param srcMap {object} key-src map
 * @return {JC.Loader}
 */
JC.loaderUtil = function(srcMap){
	return new JC.Loader().load(srcMap);
};
