import { Eventer } from '../eventer/Eventer';

/**
 * 图片纹理类
 *
 * @class
 * @memberof JC
 * @param {string | Image} img 图片url或者图片对象.
 * @extends JC.Eventer
 */
function Texture(img){
    Eventer.call( this );
    this.texture = null;
    this.width = 0;
    this.height = 0;
    this.loaded = false;

    this.load(img);

}
Texture.prototype = Object.create( Eventer.prototype );

/**
 * 尝试加载图片
 *
 * @static
 * @param {string | Image} img 图片url或者图片对象.
 * @private
 */
Texture.prototype.load = function(img){
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
        this.on('load',function(){
            This.width = This.texture.width;
            This.height = This.texture.height;
        });
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
 * @namespace JC.Loader
 * @extends JC.Eventer
 */
function Loader(){
    Eventer.call( this );
    this.textures = {};
    this._total = 0;
    this._failed = 0;
    this._received = 0;
}
Loader.prototype = Object.create( Eventer.prototype );

/**
 * 开始加载资源
 *
 * ```js
 * var loadBox = new JC.Loader();
 * loadBox.load({
 *     aaa: 'img/xxx.png',
 *     bbb: 'img/yyy.png',
 *     ccc: 'img/zzz.png'
 * });
 * ```
 *
 * @memberof JC.Loader
 * @param {object} srcMap 配置了key－value的json格式数据
 * @return {JC.Loader} 返回本实例对象
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
 * @memberof JC.Loader
 * @param {string} id 之前加载时配置的key值
 * @return {JC.Texture} 包装出来的JC.Texture对象
 */
Loader.prototype.getById = function (id){
    return this.textures[id];
};

/**
 * 获取资源加载的进度
 *
 * @member progress
 * @property progress {number} 0至1之间的值
 * @memberof JC.Loader
 */
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
var loaderUtil = function(srcMap){
    return new Loader().load(srcMap);
};

export { Texture, Loader, loaderUtil };
