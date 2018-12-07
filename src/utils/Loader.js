
/* eslint guard-for-in: "off" */

import {Eventer} from '../eventer/Eventer';
import {Utils} from './Utils';

// const TextureCache = {};

const URL = 'url';
const IMG = 'img';

/**
 *
 * @param {Object} frame object
 * @return {Boolean}
 */
function isFrame(frame) {
  return frame.tagName === 'VIDEO' || frame.tagName === 'CANVAS' || frame.tagName === 'IMG';
}

/**
 * 图片纹理类
 *
 * @class
 * @memberof JC
 * @param {string | Image} texture 图片url或者图片对象.
 * @param {object} options 图片配置
 * @param {boolean} [options.lazy=false] 图片是否需要懒加载
 * @param {string} [options.crossOrigin] 图片是否配置跨域
 * @extends JC.Eventer
 */
function Texture(texture, options) {
  Eventer.call(this);
  options = options || {};

  this.type = '';
  this.url = '';
  this.texture = null;
  this.crossOrigin = options.crossOrigin;
  this.loaded = false;
  this.hadload = false;
  this.lazy = options.lazy || false;

  if (Utils.isString(texture)) {
    this.type = URL;
    this.url = texture;
    this.texture = this.resole();
    this.texture.crossOrigin = this.crossOrigin;
    if (!this.lazy) this.load();
  } else if (isFrame(texture)) {
    this.type = IMG;
    this.loaded = true;
    this.hadload = true;
    this.texture = texture;
  } else {
    console.warn('texture not support this texture');
    return;
  }

  this.listen();
}
Texture.prototype = Object.create(Eventer.prototype);

/**
 * 创建一个图片
 *
 * @private
 * @return {Image}
 */
Texture.prototype.resole = function() {
  return new Image();
};

/**
 * 尝试加载图片
 *
 * @param {String} url 图片url或者图片对象.
 */
Texture.prototype.load = function(url) {
  if (this.hadload || this.type !== URL) return;
  url = url || this.url;
  this.hadload = true;
  this.texture.src = url;
};

/**
 * 监听加载事件
 */
Texture.prototype.listen = function() {
  this.texture.addEventListener('load', () => {
    this.loaded = true;
    this.emit('load');
  });
  this.texture.addEventListener('error', () => {
    this.emit('error');
  });
};

/**
 * 获取纹理的宽
 *
 * @member width
 * @property {Number} width 纹理的宽
 * @memberof JC.Texture
 */
Object.defineProperty(Texture.prototype, 'width', {
  get: function() {
    return this.texture ? this.texture.width : 0;
  },
});

/**
 * 获取纹理的高
 *
 * @member height
 * @property {Number} height 纹理的高
 * @memberof JC.Texture
 */
Object.defineProperty(Texture.prototype, 'height', {
  get: function() {
    return this.texture ? this.texture.height : 0;
  },
});

/**
 * 获取纹理的原始宽
 *
 * @member naturalWidth
 * @property {Number} naturalWidth 纹理的原始宽
 * @memberof JC.Texture
 */
Object.defineProperty(Texture.prototype, 'naturalWidth', {
  get: function() {
    return this.texture ? this.texture.naturalWidth : 0;
  },
});

/**
 * 获取纹理的原始高
 *
 * @member naturalHeight
 * @property {Number} naturalHeight 纹理的原始高
 * @memberof JC.Texture
 */
Object.defineProperty(Texture.prototype, 'naturalHeight', {
  get: function() {
    return this.texture ? this.texture.naturalHeight : 0;
  },
});


/**
 * 图片资源加载器
 *
 * @class
 * @param {String} crossOrigin cross-origin config
 * @namespace JC.Loader
 * @extends JC.Eventer
 */
function Loader(crossOrigin) {
  Eventer.call(this);
  this.crossOrigin = crossOrigin;
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
    this.textures[src] = new Texture(srcMap[src], {crossOrigin: this.crossOrigin});
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
 * @param {String} crossOrigin cross-origin config
 * @return {JC.Loader}
 */
let loaderUtil = function(srcMap, crossOrigin) {
  return new Loader(crossOrigin).load(srcMap);
};

export {Texture, Loader, loaderUtil};
