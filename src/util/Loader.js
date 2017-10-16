
/* eslint guard-for-in: "off" */

import {Eventer} from '../eventer/Eventer';
import {Utils} from './Utils';

const URL = 'url';
const IMG = 'img';

/**
 * 图片纹理类
 *
 * @class
 * @memberof JC
 * @param {string | Image} img 图片url或者图片对象.
 * @param {object} options 图片配置
 * @param {boolean} [options.lazy] 图片是否需要懒加载
 * @param {string} [options.crossOrigin] 图片是否配置跨域
 * @extends JC.Eventer
 */
function Texture(img, options) {
  Eventer.call(this);
  options = options || {};

  const isImg = img instanceof Image || img.nodeName === 'IMG';
  this.type = Utils.isString(img) ? URL :
    isImg ? IMG : console.warn('not support asset');

  this.crossOrigin = options.crossOrigin;
  this.texture = null;
  this.width = 0;
  this.height = 0;
  this.naturalWidth = 0;
  this.naturalHeight = 0;
  this.loaded = false;
  this.hadload = false;
  this.src = img;

  this.resole(img);

  if (!options.lazy || this.type === IMG) this.load(img);
}
Texture.prototype = Object.create(Eventer.prototype);

/**
 * 预先处理一些数据
 *
 * @static
 * @param {string | Image} img 先生成对应的对象
 * @private
 */
Texture.prototype.resole = function(img) {
  const This = this;
  if (this.type === URL) {
    this.texture = new Image();
  } else if (this.type === IMG) {
    this.texture = img;
  }
  this.on('load', function() {
    This.update();
  });
};

/**
 * 尝试加载图片
 *
 * @static
 * @param {string | Image} img 图片url或者图片对象.
 * @private
 */
Texture.prototype.load = function(img) {
  if (this.hadload) return;
  this.hadload = true;
  img = img || this.src;
  if (this.type === URL) {
    this.fromURL(img);
  } else if (this.type === IMG) {
    if (this.texture.naturalWidth > 0 && this.texture.naturalHeight > 0) {
      this.loaded = true;
      this.update();
    } else {
      this.fromIMG(img);
    }
  }
};

Texture.prototype.fromURL = function(url) {
  if (!Utils.isUndefined(this.crossOrigin)) {
    this.texture.crossOrigin = this.crossOrigin;
  }
  this.listen(this.texture);
  this.texture.src = url;
};

Texture.prototype.fromIMG = function(img) {
  this.listen(img);
};

Texture.prototype.listen = function(img) {
  const This = this;
  img.addEventListener('load', function() {
    This.loaded = true;
    This.emit('load');
  });
  img.addEventListener('error', function() {
    This.emit('error');
  });
};

Texture.prototype.update = function() {
  this.width = this.texture.width;
  this.height = this.texture.height;
  this.naturalWidth = this.texture.naturalWidth;
  this.naturalHeight = this.texture.naturalHeight;
};


/**
 * 图片资源加载器
 *
 * @class
 * @namespace JC.Loader
 * @extends JC.Eventer
 */
function Loader() {
  Eventer.call(this);
  this.textures = {};
  this._total = 0;
  this._failed = 0;
  this._received = 0;
}
Loader.prototype = Object.create(Eventer.prototype);

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
 * @param {object} srcMap 配置了key－value的json格式数据
 * @return {JC.Loader} 返回本实例对象
 */
Loader.prototype.load = function(srcMap) {
  let This = this;
  this._total = 0;
  this._failed = 0;
  this._received = 0;

  for (let src in srcMap) {
    this._total++;
    this.textures[src] = new Texture(srcMap[src]);
    bind(this.textures[src]);
  }

  /**
   * @param {Texture} texture
   */
  function bind(texture) {
    texture.on('load', function() {
      This._received++;
      This.emit('update');
      if (This._received + This._failed >= This._total) This.emit('complete');
    });
    texture.on('error', function() {
      This._failed++;
      This.emit('update');
      if (This._received + This._failed >= This._total) This.emit('complete');
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
 * @param {string} id 之前加载时配置的key值
 * @return {JC.Texture} 包装出来的JC.Texture对象
 */
Loader.prototype.getById = function(id) {
  return this.textures[id];
};

/**
 * 获取资源加载的进度
 *
 * @member progress
 * @property progress {number} 0至1之间的值
 * @memberof JC.Loader
 */
Object.defineProperty(Loader.prototype, 'progress', {
  get: function() {
    return this._total === 0 ? 1 :
      (this._received + this._failed) / this._total;
  },
});


/**
 * 资源加载工具
 *
 * @function
 * @memberof JC
 * @param {object} srcMap key-src map
 * @return {JC.Loader}
 */
let loaderUtil = function(srcMap) {
  return new Loader().load(srcMap);
};

export {Texture, Loader, loaderUtil};
