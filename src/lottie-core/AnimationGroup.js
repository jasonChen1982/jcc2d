import Eventer from './utils/Eventer';
import Tools from './utils/tools';
// import Loader from '../utils/Loader';
import LayerRegister from './register/LayerRegister';
import LoaderRegister from './register/LoaderRegister';
import DataManager from './utils/DataManager';
import CompElement from './elements/CompElement';
import SolidElement from './elements/SolidElement';
import SpriteElement from './elements/SpriteElement';
import ShapeElement from './elements/ShapeElement';
import NullElement from './elements/NullElement';

/**
 * an animation group, store and compute frame information
 * @class
 */
class AnimationGroup extends Eventer {
  /**
   * parser a bodymovin data, and post some config for this animation group
   * @param {object} options animation config
   * @param {Object} options.keyframes bodymovin data, which export from AE by bodymovin
   * @param {Number} [options.repeats=0] need repeat some times?
   * @param {Boolean} [options.infinite=false] play this animation round and round forever
   * @param {Boolean} [options.alternate=false] alternate play direction every round
   * @param {Number} [options.wait=0] need wait how much millisecond to start
   * @param {Number} [options.delay=0] need delay how much millisecond to begin, effect every loop round
   * @param {Number} [options.timeScale=1] animation speed, time scale factor
   * @param {Boolean} [options.autoLoad=true] auto load assets, if this animation have
   * @param {Boolean} [options.autoStart=true] auto start animation after assets loaded
   * @param {Boolean} [options.overlapMode=false] enable overlap mode, it is useful when you have a overlap expression
   * @param {Object} [options.segments={}] animation segments, splite by start and end keyframe number
   * @param {Boolean} [options.initSegment=''] animation segments, init finite state machine
   * @param {Boolean} [options.maskComp=false] auto start animation after assets loaded
   * @param {String} [options.prefix=''] assets url prefix, look like link path
   * @param {class} LoaderClass loader class
   */
  constructor(options, LoaderClass) {
    super();
    /**
     * 动画是否是激活状态
     * @member {boolean}
     */
    this.living = true;

    /**
     * 动画无限循环播放
     * @member {boolean}
     */
    this.infinite = options.infinite || false;

    /**
     * 动画循环多少次
     * @member {number}
     */
    this.repeats = options.repeats || 0;

    /**
     * 动画交替播放
     * @member {boolean}
     */
    this.alternate = options.alternate || false;

    /**
     * 动画延迟多长时间启动
     * @member {number}
     */
    this.wait = options.wait || 0;

    /**
     * 动画延迟多长时间开始
     * @member {number}
     */
    this.delay = options.delay || 0;

    /**
     * 动画是否启动 overlap 模式
     * @member {number}
     */
    this.overlapMode = options.overlapMode || false;

    /**
     * 动画速度
     * @member {number}
     */
    this.timeScale = Tools.isNumber(options.timeScale) ?
      options.timeScale :
      1;

    /**
     * 总帧数
     * @member {number}
     */
    this.frameNum = 0;

    /**
     * 记录帧位，初始值随意设置为负无穷大
     * @member {number}
     * @private
     */
    this._pf = -Infinity;

    /**
     * 动画方向，1 or -1
     * @member {number}
     * @private
     */
    this.direction = 1;

    /**
     * 缓存重复多少次
     * @member {number}
     * @private
     */
    this._repeatsCut = this.repeats;

    /**
     * 缓存延迟多少时间
     * @member {number}
     * @private
     */
    this._delayCut = this.delay;

    /**
     * 缓存等待多少时间
     * @member {number}
     * @private
     */
    this._waitCut = this.wait;

    /**
     * 是否暂停状态，可以使用
     * @member {number}
     * @private
     */
    this._paused = true;

    const keyframes = Tools.copyJSON(options.keyframes);
    DataManager.completeData(keyframes);

    /**
     * 提取全局信息
     */
    const {fr, ip, op, assets, prefix} = keyframes;

    /**
     * 帧率
     * @member {number}
     * @private
     */
    this.frameRate = fr;

    /**
     * 帧素
     * @member {number}
     * @private
     */
    this.frameMult = fr / 1000;

    /**
     * 动画数据
     * @private
     */
    this.keyframes = keyframes;

    /**
     * 默认动画配置
     * @private
     */
    this.defaultSegment = [ip, op];

    /**
     * 分段动画配置，和 segmentName 参数配合使用
     * @private
     */
    this.segments = options.segments || {};

    /**
     * 有限状态机，当前状态机，和 segments 参数配合使用
     * @private
     */
    const segmentName = options.initSegment || '';

    // 获取初始化分段
    const segment = (segmentName && this.segments[segmentName]) || this.defaultSegment;

    /**
     * 当前segment播放的开始帧
     * @private
     */
    this.beginFrame = segment[0];

    /**
     * 当前segment播放的结束帧
     * @private
     */
    this.endFrame = segment[1];

    /**
     * 资源相对地址前缀
     * @private
     */
    this.prefix = options.prefix || prefix || '';

    /**
     * 每帧时间
     * @member {number}
     * @private
     */
    this._tpf = 1000 / fr;

    /**
     * 总帧数
     * @member {number}
     */
    this.duration = Math.floor(this.endFrame - this.beginFrame);

    const autoLoad = Tools.isBoolean(options.autoLoad) ? options.autoLoad : true;
    const autoStart = Tools.isBoolean(options.autoStart) ? options.autoStart : true;

    let loader = null;
    const images = assets.filter((it) => {
      return it.u || it.p;
    });
    if (images.length > 0) {
      const LoaderClass = LoaderRegister.getLoader();
      this.loader = loader = new LoaderClass(images, {prefix: this.prefix, autoLoad});
      this._imageLoadHandle = () => {
        this._paused = !autoStart;
      };
      this._cancelImageLoadHandle = () => {
        loader.off('complete', this._imageLoadHandle);
        this._cancelImageLoadHandle = null;
      };
      loader.once('complete', this._imageLoadHandle);
    } else {
      this._cancelImageLoadHandle = null;
      this._paused = !autoStart;
    }

    // 注册图层
    const register = new LayerRegister();

    /**
     * 该动画组注册的信息
     * @member {LayerRegister}
     * @private
     */
    this.register = register;

    const maskComp = Tools.isBoolean(options.maskComp) ? options.maskComp : true;
    const session = {
      global: {
        assets,
        loader,
        register,
        maskComp,
        frameRate: fr,
        overlapMode: this.overlapMode,
      },
      local: {
        parentName: '',
      },
    };

    /**
     * 该动画组的根对象
     * @member {CompElement}
     */
    this.root = this.extraCompositions(this.keyframes, session);
    this.root._isRoot = true;
    this.group = this.rootDisplay = this.root.display;

    this.update(0, true);
  }

  /**
   * a
   * @param {object} data layers
   * @param {object} assets object
   * @return {container}
   */
  extraCompositions(data, {global, local}) {
    const {w, h, ip, op, st = 0, nm = 'null'} = data;
    const parentName = local.parentName ? local.parentName + '.' + nm : nm;
    const container = new CompElement(data, {global, local});
    const layers = data.layers || Tools.getAssets(data.refId, global.assets).layers;

    const session = {
      global,
      local: {
        w, h, ip, op, st,
        parentName,
      },
    };

    const elementsMap = this.createElements(layers, session);
    for (let i = layers.length - 1; i >= 0; i--) {
      const layer = layers[i];
      const item = elementsMap[layer.ind];
      if (!item) continue;
      if (!Tools.isUndefined(layer.parent)) {
        const parent = elementsMap[layer.parent];
        parent._isParent = true;
        item.setHierarchy(parent);
      }
      const nameHierarchy = parentName + '.' + item.name;
      global.register.setLayer(nameHierarchy, item);
      container.addChild(item);
    }
    return container;
  }

  /**
   * createElements
   * @param {arrya} layers layers
   * @param {object} session object
   * @return {object}
   */
  createElements(layers, session) {
    const elementsMap = {};
    for (let i = layers.length - 1; i >= 0; i--) {
      const layer = layers[i];
      let element = null;

      if (layer.td !== undefined) continue;

      switch (layer.ty) {
      case 0:
        element = this.extraCompositions(layer, session);
        break;
      case 1:
        element = new SolidElement(layer, session);
        break;
      case 2:
        element = new SpriteElement(layer, session);
        break;
      case 3:
        element = new NullElement(layer, session);
        break;
      case 4:
        element = new ShapeElement(layer, session);
        break;
      default:
        continue;
      }

      if (element) {
        if (layer.ind === undefined) layer.ind = i;
        elementsMap[layer.ind] = element;
        element.name = layer.nm || 'null';
      }
    }
    return elementsMap;
  }

  /**
   * get layer by name path
   * @param {string} name layer name path, example: root.gift.star1
   * @return {object}
   */
  getDisplayByName(name) {
    const layer = this.register.getLayer(name);
    if (layer.display) return layer.display;
    console.warn('can not find display name as ', name);
    return null;
  }

  /**
   * bind other animation-group or display-object to this animation-group with name path
   * @param {*} name
   * @param {*} child
   * @return {this}
   */
  bindSlot(name, child) {
    const slotDisplay = this.getDisplayByName(name);
    slotDisplay.addChild(child);
    return this;
  }

  /**
   * unbind other animation-group or display-object to this animation-group with name path
   * @param {*} name
   * @param {*} child
   * @return {this}
   */
  unbindSlot(name, child) {
    const slotDisplay = this.getDisplayByName(name);
    slotDisplay.removeChild(child);
    return this;
  }

  /**
   * emit frame
   * @private
   * @param {*} np now frame
   */
  emitFrame(np) {
    this.emit(`@${np}`);
  }

  /**
   * update with time snippet
   * @private
   * @param {number} snippetCache snippet
   * @param {number} firstFrame snippet
   */
  update(snippetCache, firstFrame = false) {
    if (!this.living || (this._paused && !firstFrame)) return;

    const isEnd = this.updateTime(snippetCache);

    const correctedFrameNum = this.beginFrame + this.frameNum;
    this.root.updateFrame(correctedFrameNum);

    const np = correctedFrameNum >> 0;
    if (this._pf !== np) {
      this.emitFrame(this.direction > 0 ? np : this._pf);
      this._pf = np;
    }
    if (isEnd === false) {
      this.emit('update', this.frameNum / this.duration);
    } else if (this.hadEnded !== isEnd && isEnd === true) {
      this.emit('complete');
    }
    this.hadEnded = isEnd;
  }

  /**
   * update timeline with time snippet
   * @private
   * @param {number} snippet snippet
   * @return {boolean} frameNum status
   */
  updateTime(snippet) {
    const snippetCache = this.direction * this.timeScale * snippet;
    if (this._waitCut > 0) {
      this._waitCut -= Math.abs(snippetCache);
      return null;
    }
    if (this._paused || this._delayCut > 0) {
      if (this._delayCut > 0) this._delayCut -= Math.abs(snippetCache);
      return null;
    }

    this.frameNum += snippetCache / this._tpf;
    let isEnd = false;

    if (this.spill()) {
      if (this._repeatsCut > 0 || this.infinite) {
        if (this._repeatsCut > 0) --this._repeatsCut;
        this._delayCut = this.delay;
        if (this.alternate) {
          this.direction *= -1;
          this.frameNum = Tools.codomainBounce(this.frameNum, 0, this.duration);
        } else {
          this.direction = 1;
          this.frameNum = Tools.euclideanModulo(this.frameNum, this.duration);
        }
      } else {
        if (!this.overlapMode) {
          this.frameNum = Tools.clamp(this.frameNum, 0, this.duration);
          this.living = false;
        }
        isEnd = true;
      }
    }

    return isEnd;
  }

  /**
   * is this time frameNum spill the range
   * @private
   * @return {boolean}
   */
  spill() {
    const bottomSpill = this.frameNum <= 0 && this.direction === -1;
    const topSpill = this.frameNum >= this.duration && this.direction === 1;
    return bottomSpill || topSpill;
  }

  /**
   * get time
   * @param {number} frame frame index
   * @return {number}
   */
  frameToTime(frame) {
    return frame * this._tpf;
  }

  /**
   * set animation speed, time scale
   * @param {number} speed
   */
  setSpeed(speed) {
    this.timeScale = speed;
  }

  /**
   * set finite state machine
   * @param {String|Array} name segment name which define in segments props, you can also pass an array like [10, 30]
   * @param {Object} options animation config
   * @param {Number} [options.delay=0] need delay how much time to begin, effect every round
   * @param {Number} [options.repeats=0] need repeat somt times?
   * @param {Boolean} [options.infinite=false] play this animation round and round forever
   * @param {Boolean} [options.alternate=false] alternate direction every round
   * @param {Number} [options.wait=0] need wait how much millisecond to start
   * @param {Number} [options.delay=0] need delay how much millisecond to begin, effect every loop round
   */
  playSegment(name, options = {}) {
    if (!name) return;

    if (this._cancelImageLoadHandle) this._cancelImageLoadHandle();

    let segment = null;
    if (Tools.isArray(name)) {
      segment = name;
    } else if (Tools.isString(name)) {
      segment = this.segments[name];
    }

    if (!segment) return;

    this.beginFrame = segment[0];
    this.endFrame = segment[1];

    if (Tools.isNumber(options.delay)) this.delay = options.delay;
    if (Tools.isNumber(options.repeats)) this.repeats = options.repeats;
    if (Tools.isBoolean(options.infinite)) this.infinite = options.infinite;
    if (Tools.isBoolean(options.alternate)) this.alternate = options.alternate;
    if (Tools.isNumber(options.wait)) this.wait = options.wait;
    if (Tools.isNumber(options.delay)) this.delay = options.delay;

    this.replay();
  }

  /**
   * pause this animation group
   * @return {this}
   */
  pause() {
    if (this._cancelImageLoadHandle) this._cancelImageLoadHandle();
    this._paused = true;
    return this;
  }

  /**
   * resume or play this animation group
   * @return {this}
   */
  resume() {
    if (this._cancelImageLoadHandle) this._cancelImageLoadHandle();
    this._paused = false;
    return this;
  }

  /**
   * replay this animation group from begin frame
   * @return {this}
   */
  replay() {
    if (this._cancelImageLoadHandle) this._cancelImageLoadHandle();
    this._paused = false;
    this._repeatsCut = this.repeats;
    this._delayCut = this.delay;
    this.living = true;
    this.frameNum = 0;
    this.duration = Math.floor(this.endFrame - this.beginFrame);
    this.direction = 1;
    return this;
  }
}

export default AnimationGroup;
