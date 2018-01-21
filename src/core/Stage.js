
import {Container} from './Container';
import InteractionManager from '../eventer/InteractionManager';
import {Utils} from '../util/Utils';

/* global RAF CAF */
/* eslint new-cap: 0 */

/**
 * 舞台对象，继承至Eventer
 *
 *
 * ```js
 * var stage = new JC.Stage({
 *   dom: 'canvas-dom', // 格式可以是 .canvas-dom 或者 ＃canvas-dom 或者 canvas-dom
 *   resolution: 1, // 分辨率
 *   interactive: true, // 是否可交互
 *   enableFPS: true, // 是否记录帧率
 *   bgColor: ‘rgba(0,0,0,0.4)’, // 背景色
 * });
 * ```
 *
 * @class
 * @extends JC.Container
 * @memberof JC
 * @param {object} options 舞台的配置项
 * @param {string} options.dom 舞台要附着的`canvas`元素
 * @param {number} [options.resolution] 设置舞台的分辨率，`默认为` 1
 * @param {boolean} [options.interactive] 设置舞台是否可交互，`默认为` true
 * @param {boolean} [options.enableFPS] 设置舞台是否记录帧率，`默认为` true
 * @param {string} [options.bgColor] 设置舞台的背景颜色，`默认为` ‘transparent’
 * @param {number} [options.width] 设置舞台的宽, `默认为` 附着的canvas.width
 * @param {number} [options.height] 设置舞台的高, `默认为` 附着的canvas.height
 * @param {number} [options.fixedFPS] 设置舞台的固定更新帧率，非特殊情况不要使用，`默认为` 60
 */
function Stage(options) {
  options = options || {};
  Container.call(this);

  /**
   * 场景的canvas的dom
   *
   * @member {CANVAS}
   */
  this.canvas = Utils.isString(options.dom) ?
    document.getElementById(options.dom) ||
    document.querySelector(options.dom) :
    options.dom;

  this.realWidth = options.width || this.canvas.width;
  this.realHeight = options.height || this.canvas.height;

  /**
   * 场景的canvas的绘图环境
   *
   * @member {context2d}
   */
  this.ctx = this.canvas.getContext('2d');
  this.canvas.style.backgroundColor = options.bgColor || 'transparent';

  /**
   * 场景是否自动清除上一帧的像素内容
   *
   * @member {Boolean}
   */
  this.autoClear = true;

  /**
   * 是否在每一帧绘制之前自动更新场景内所有物体的状态
   *
   * @member {Boolean}
   */
  this.autoUpdate = true;

  /**
   * 场景是否应用style控制宽高
   *
   * @member {Boolean}
   */
  this.autoStyle = false;

  /**
   * 场景分辨率
   *
   * @member {Number}
   * @private
   */
  this._resolution = 0;

  /**
   * 场景分辨率
   *
   * @member {Number}
   */
  this.resolution = options.resolution || 1;

  /**
   * canvas的宽度
   *
   * @member {Number}
   */
  this.width = this.canvas.width = this.realWidth * this.resolution;

  /**
   * canvas的高度
   *
   * @member {Number}
   */
  this.height = this.canvas.height = this.realHeight * this.resolution;

  /**
   * 固定更新帧率，默认为 60fps
   *
   * @member {Number}
   */
  this.fixedFPS = options.fixedFPS || 60;

  /**
   * 上一次绘制的时间点
   *
   * @member {Number}
   * @private
   */
  this.pt = null;

  /**
   * 本次渲染经历的时间片段长度
   *
   * @member {Number}
   * @private
   */
  this.snippet = 0;


  /**
   * 平均渲染经历的时间片段长度
   *
   * @member {Number}
   * @private
   */
  this.averageSnippet = 0;

  /**
   * 渲染的瞬时帧率，仅在enableFPS为true时才可用
   *
   * @member {Number}
   */
  this.fps = 0;

  /**
   * 渲染到目前为止的平均帧率，仅在enableFPS为true时才可用
   *
   * @member {Number}
   */
  this.averageFps = 0;

  /**
   * 渲染总花费时间，除去被中断、被暂停等时间
   *
   * @member {Number}
   * @private
   */
  this._takeTime = 0;

  /**
   * 渲染总次数
   *
   * @member {Number}
   * @private
   */
  this._renderTimes = 0;

  /**
   * 是否记录渲染性能
   *
   * @member {Boolean}
   */
  this.enableFPS = Utils.isBoolean(options.enableFPS) ?
    options.enableFPS :
    true;

  this.interactionManager = new InteractionManager(this);

  /**
   * 舞台是否可交互
   *
   * @member {Boolean}
   * @private
   */
  this._enableinteractive = null;

  // update interaction in every tick
  const interactionUpdate = (snippet) => {
    this.interactionManager.update(snippet);
  };

  this.interactiveOnChange = function() {
    if (this.enableinteractive) {
      this.on('prerender', interactionUpdate);
      this.interactionManager.addEvents();
    } else {
      this.off('prerender', interactionUpdate);
      this.interactionManager.removeEvents();
    }
  };

  this.enableinteractive = Utils.isBoolean(options.interactive) ?
    options.interactive :
    true;

  this.proxyOn();
}
Stage.prototype = Object.create(Container.prototype);

Stage.prototype.proxyOn = function() {
  const This = this;
  const EventList = [
    'click',
    'mousemove',
    'mousedown',
    'mouseout',
    'mouseover',
    'touchstart',
    'touchend',
    'touchmove',
    'mouseup',
  ];
  EventList.forEach(function(it) {
    This.interactionManager.on(it, (function(it) {
      return function(ev) {
        This.emit(it, ev);
      };
    })(it));
  });
};


/**
 * 舞台尺寸设置
 *
 * @param {number} w canvas的width值
 * @param {number} h canvas的height值
 * @param {number} sw canvas的style.width值，需将舞台属性autoStyle设置为true
 * @param {number} sh canvas的style.height值，需将舞台属性autoStyle设置为true
 */
Stage.prototype.resize = function(w, h, sw, sh) {
  if (Utils.isNumber(w) && Utils.isNumber(h)) {
    this.realWidth = w;
    this.realHeight = h;
  } else {
    w = this.realWidth;
    h = this.realHeight;
  }
  this.width = this.canvas.width = w * this.resolution;
  this.height = this.canvas.height = h * this.resolution;
  if (this.autoStyle && sw && sh) {
    this.canvas.style.width = Utils.isString(sw) ? sw : sw + 'px';
    this.canvas.style.height = Utils.isString(sh) ? sh : sh + 'px';
  }
};

/**
 * 渲染舞台内的所有可见渲染对象
 */
Stage.prototype.render = function() {
  this.timeline();

  this.emit('prerender', this.snippet);

  if (this.autoClear) {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
  this.updateTimeline(this.snippet);
  this.updatePosture();

  let i = 0;
  const l = this.childs.length;
  while (i < l) {
    const child = this.childs[i];
    i++;
    if (!child.isVisible()) continue;
    child.render(this.ctx);
  }

  this.emit('postrender');
};

/**
 * 引擎的时间轴
 *
 * @method timeline
 * @private
 */
Stage.prototype.timeline = function() {
  this.snippet = Date.now() - this.pt;
  if (this.pt === null || this.snippet > 200) {
    this.pt = Date.now();
    this.snippet = Date.now() - this.pt;
  }

  if (this.enableFPS) {
    this._renderTimes++;
    this._takeTime += Math.max(15, this.snippet);
    this.fps = 1000 / Math.max(15, this.snippet) >> 0;
    this.averageFps = 1000 / (this._takeTime / this._renderTimes) >> 0;
  }

  this.pt += this.snippet;
};

/**
 * 启动渲染引擎的渲染循环
 */
Stage.prototype.startEngine = function() {
  if (this.inRender) return;
  this.inRender = true;
  if (this.fixedFPS === 60) {
    this.renderer();
  } else {
    this.rendererFixedFPS();
  }
};

/**
 * 关闭渲染引擎的渲染循环
 */
Stage.prototype.stopEngine = function() {
  CAF(this.loop);
  clearInterval(this.loop);
  this.inRender = false;
};

/**
 * 渲染循环
 *
 * @method renderer
 * @private
 */
Stage.prototype.renderer = function() {
  const This = this;
  /**
   * render loop
   */
  function render() {
    This.render();
    This.loop = RAF(render);
  }
  render();
};

/**
 * 固定帧率的渲染循环，不合理使用改方法将会导致性能问题
 *
 * @method rendererFixedFPS
 * @private
 */
Stage.prototype.rendererFixedFPS = function() {
  const This = this;
  this.loop = setInterval(function() {
    This.render();
  }, 1000 / this.fixedFPS);
  this.render();
};

/**
 * 标记场景是否可交互，涉及到是否进行事件检测
 *
 * @member {Boolean}
 * @name interactive
 * @memberof JC.Stage#
 */
Object.defineProperty(Stage.prototype, 'enableinteractive', {
  get: function() {
    return this._enableinteractive;
  },
  set: function(value) {
    if (this._enableinteractive !== value) {
      this._enableinteractive = value;
      this.interactiveOnChange();
    }
  },
});

/**
 * 场景设置分辨率
 *
 * @member {Number}
 * @name resolution
 * @memberof JC.Stage#
 */
Object.defineProperty(Stage.prototype, 'resolution', {
  get: function() {
    return this._resolution;
  },
  set: function(value) {
    if (this._resolution !== value) {
      this._resolution = value;
      this.scale = value;
      this.resize();
    }
  },
});

export {Stage};
