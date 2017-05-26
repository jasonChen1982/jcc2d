import {Sprite} from '../core/Sprite';
import {Container} from '../core/Container';
import {loaderUtil} from './Loader';

/**
 * 解析bodymovin从ae导出的数据
 * @class
 * @memberof JC
 * @param {object} options 动画配置
 * @param {object} [options.keyframes] bodymovin从ae导出的动画数据
 * @param {number} [options.fr] 动画的帧率，默认会读取导出数据配置的帧率
 * @param {number} [options.repeats] 动画是否无限循环
 * @param {boolean} [options.infinite] 动画是否无限循环
 * @param {boolean} [options.alternate] 动画是否交替播放
 * @param {string} [options.prefix] 导出资源的前缀
 */
function ParserAnimation(options) {
  this.prefix = options.prefix || '';
  this.doc = new Container();
  this.fr = options.fr || options.keyframes.fr;
  this.keyframes = options.keyframes;
  this.ip = this.keyframes.ip;
  this.op = this.keyframes.op;
  this.repeats = options.repeats || 0;
  this.infinite = options.infinite || false;
  this.alternate = options.alternate || false;
  this.assetBox = null;
  this.timeline = [];
  this.preParser(this.keyframes.assets, this.keyframes.layers);
  this.parser(this.doc, this.keyframes.layers);
}

/**
 * @private
 * @param {array} assets 资源数组
 * @param {array} layers 图层数组
 */
ParserAnimation.prototype.preParser = function(assets, layers) {
  const sourceMap = {};
  let i = 0;
  const l = layers.length;
  for (i = 0; i < assets.length; i++) {
    const id = assets[i].id;
    const up = assets[i].up;
    const u = assets[i].u;
    const p = assets[i].p;
    if (up) {
      sourceMap[id] = up;
    } else if (u && p) {
      sourceMap[id] = u + p;
    } else if (!assets[i].layers) {
      console.error('can not get asset url');
    }
  }
  for (i = l - 1; i >= 0; i--) {
    const layer = layers[i];
    this.ip = Math.min(this.ip, layer.ip);
    this.op = Math.max(this.op, layer.op);
  }
  this.assetBox = loaderUtil(sourceMap);
};

/**
 * @private
 * @param {JC.Container} doc 动画元素的渲染组
 * @param {array} layers 图层数组
 */
ParserAnimation.prototype.parser = function(doc, layers) {
  const l = layers.length;
  const repeats = this.repeats;
  const infinite = this.infinite;
  const alternate = this.alternate;
  const ip = this.ip;
  const op = this.op;
  for (let i = l - 1; i >= 0; i--) {
    const layer = layers[i];
    if (layer.ty === 2) {
      const id = this.getAssets(layer.refId).id;
      const ani = new Sprite({
        texture: this.assetBox.getById(id),
      });
      this.timeline.push(ani.keyFrames({
        ks: layer,
        fr: this.fr,
        ip,
        op,
        repeats,
        infinite,
        alternate,
      }));
      ani.name = layer.nm;
      doc.adds(ani);
    }
    if (layer.ty === 0) {
      const ddoc = new Container();
      const llayers = this.getAssets(layer.refId).layers;
      this.timeline.push(ddoc.keyFrames({
        ks: layer,
        fr: this.fr,
        ip,
        op,
        repeats,
        infinite,
        alternate,
      }));
      ddoc.name = layer.nm;
      doc.adds(ddoc);
      this.parser(ddoc, llayers);
    }
  }
};

/**
 * @private
 * @param {string} id 资源的refid
 * @return {object} 资源配置
 */
ParserAnimation.prototype.getAssets = function(id) {
  const assets = this.keyframes.assets;
  for (let i = 0; i < assets.length; i++) {
    if (id === assets[i].id) return assets[i];
  }
};

/**
 * 设置动画播放速度
 * @param {number} speed
 */
ParserAnimation.prototype.setSpeed = function(speed) {
  this.doc.timeScale = speed;
};

/**
 * 暂停播放动画
 */
ParserAnimation.prototype.pause = function() {
  this.timeline.forEach(function(it) {
    it.pause();
  });
};

/**
 * 恢复播放动画
 */
ParserAnimation.prototype.restart = function() {
  this.timeline.forEach(function(it) {
    it.restart();
  });
};

/**
 * 停止播放动画
 */
ParserAnimation.prototype.stop = function() {
  this.timeline.forEach(function(it) {
    it.stop();
  });
};

/**
 * 取消播放动画
 */
ParserAnimation.prototype.cancle = function() {
  this.timeline.forEach(function(it) {
    it.cancle();
  });
};

export {ParserAnimation};
