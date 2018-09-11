import {Sprite} from '../core/Sprite';
import {Container} from '../core/Container';
import {loaderUtil} from './Loader';

/**
 * 解析bodymovin从ae导出的数据
 * @class
 * @memberof JC
 * @param {object} options 动画配置
 * @param {object} options.keyframes bodymovin从ae导出的动画数据
 * @param {number} [options.fr] 动画的帧率，默认会读取导出数据配置的帧率
 * @param {number} [options.repeats] 动画是否无限循环
 * @param {boolean} [options.infinite] 动画是否无限循环
 * @param {boolean} [options.alternate] 动画是否交替播放
 * @param {string} [options.prefix] 导出资源的前缀
 * @param {function} [options.onComplete] 结束回调
 * @param {function} [options.onUpdate] 更新回调
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
  this.parserAssets(this.keyframes.assets);
  this.parserComposition(this.doc, this.keyframes.layers);

  if (options.onComplete) {
    this.timeline[0].on('complete', options.onComplete.bind(this));
  }
  if (options.onUpdate) {
    this.timeline[0].on('update', options.onUpdate.bind(this));
  }
}

/**
 * @private
 * @param {array} assets 资源数组
 */
ParserAnimation.prototype.parserAssets = function(assets) {
  const sourceMap = {};
  let i = 0;
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
  this.assetBox = loaderUtil(sourceMap);
};

/**
 * 创建 Sprite
 * @private
 * @param {object} layer 图层信息
 * @return {Sprite}
 */
ParserAnimation.prototype.spriteItem = function(layer) {
  const id = this.getAssets(layer.refId).id;
  return new Sprite({
    texture: this.assetBox.getById(id),
  });
};

/**
 * 创建 Container
 * @private
 * @return {Container}
 */
ParserAnimation.prototype.docItem = function() {
  return new Container();
};

/**
 * 初始化合成组内的图层
 * @private
 * @param {array} layers 图层数组
 * @return {object} 该图层的所有渲染对象
 */
ParserAnimation.prototype.initLayers = function(layers) {
  const layersMap = {};
  const fr = this.fr;
  const ip = this.ip;
  const op = this.op;
  const repeats = this.repeats;
  const infinite = this.infinite;
  const alternate = this.alternate;

  for (let i = layers.length - 1; i >= 0; i--) {
    const layer = layers[i];
    let element = null;
    if (layer.ty === 2) {
      element = this.spriteItem(layer);
    } else if (layer.ty === 0) {
      element = this.docItem();
    } else {
      continue;
    }

    element.name = layer.nm;
    layersMap[layer.ind] = element;
    this.timeline.push(element.keyFrames({
      layer,
      fr,
      ip,
      op,
      repeats,
      infinite,
      alternate,
    }));
  }
  return layersMap;
};

/**
 * 解析合成组
 * @private
 * @param {JC.Container} doc 动画元素的渲染组
 * @param {array} layers 预合成数组
 */
ParserAnimation.prototype.parserComposition = function(doc, layers) {
  const layersMap = this.initLayers(layers);
  for (let i = layers.length - 1; i >= 0; i--) {
    const layer = layers[i];
    const item = layersMap[layer.ind];
    if (!item) continue;
    if (layer.parent) {
      const parent = layersMap[layer.parent];
      parent.adds(item);
    } else {
      doc.adds(item);
    }
    if (layer.ty === 0) {
      const childLayers = this.getAssets(layer.refId).layers;
      this.parserComposition(item, childLayers);
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
  this.doc.setSpeed(speed);
};

/**
 * 暂停播放动画
 */
ParserAnimation.prototype.pause = function() {
  this.doc.pause();
};

/**
 * 恢复播放动画
 */
ParserAnimation.prototype.restart = function() {
  this.doc.restart();
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
