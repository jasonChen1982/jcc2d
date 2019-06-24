import {Utils} from '../utils/Utils';
import {Matrix} from '../math/Matrix';
import InteractionManager from '../eventer/InteractionManager';

/**
 * @param {object} options 舞台的配置项
 * @param {string} options.dom 舞台要附着的`canvas`元素
 * @param {number} [options.resolution] 设置舞台的分辨率，`默认为` 1
 * @param {boolean} [options.interactive] 设置舞台是否可交互，`默认为` true
 * @param {number} [options.width] 设置舞台的宽, `默认为` 附着的canvas.width
 * @param {number} [options.height] 设置舞台的高, `默认为` 附着的canvas.height
 * @param {string} [options.backgroundColor] 设置舞台的背景颜色，`默认为` ‘transparent’
 */
function Renderer(options) {
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
  this.canvas.style.backgroundColor = options.backgroundColor || 'transparent';

  /**
   * 场景是否自动清除上一帧的像素内容
   *
   * @member {Boolean}
   */
  this.autoClear = true;

  /**
   * 场景是否应用style控制宽高
   *
   * @member {Boolean}
   */
  this.autoStyle = false;

  /**
   * 整个场景的初始矩阵
   */
  this.rootMatrix = new Matrix();

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

  this.currentScene = null;
}

Renderer.prototype.clear = function() {
  this.ctx.setTransform(1, 0, 0, 1, 0, 0);
  this.ctx.clearRect(0, 0, this.width, this.height);
};

Renderer.prototype.render = function(scene, snippet) {
  this.currentScene = scene;

  this.emit('preupdate', snippet);
  this.currentScene.updateTimeline(snippet);
  this.currentScene.updatePosture(this.rootMatrix);
  this.emit('postupdate', snippet);


  this.emit('prerender', snippet);
  if (this.autoClear) this.clear();
  this.currentScene.render(this.ctx);
  this.emit('postrender', snippet);
};

/**
 * 舞台尺寸设置
 *
 * @param {number} w canvas的width值
 * @param {number} h canvas的height值
 */
Renderer.prototype.resize = function(w, h) {
  if (Utils.isNumber(w) && Utils.isNumber(h)) {
    this.realWidth = w;
    this.realHeight = h;
  } else {
    w = this.realWidth;
    h = this.realHeight;
  }
  this.width = this.canvas.width = w * this.resolution;
  this.height = this.canvas.height = h * this.resolution;
};

/**
 * proxy this.interactionManager event-emit
 * Emit an event to all registered event listeners.
 *
 * @param {String} event The name of the event.
 */
Renderer.prototype.emit = function(...args) {
  this.interactionManager.emit(...args);
};

/**
 * proxy this.interactionManager event-on
 * Register a new EventListener for the given event.
 *
 * @param {String} event Name of the event.
 * @param {Function} fn Callback function.
 * @param {Mixed} [context=this] The context of the function.
 */
Renderer.prototype.on = function(...args) {
  this.interactionManager.on(...args);
};

/**
 * proxy this.interactionManager event-once
 * Add an EventListener that's only called once.
 *
 * @param {String} event Name of the event.
 * @param {Function} fn Callback function.
 * @param {Mixed} [context=this] The context of the function.
 */
Renderer.prototype.once = function(...args) {
  this.interactionManager.once(...args);
};

/**
 * proxy this.interactionManager event-off
 * @param {String} event The event we want to remove.
 * @param {Function} fn The listener that we need to find.
 * @param {Mixed} context Only remove listeners matching this context.
 * @param {Boolean} once Only remove once listeners.
 */
Renderer.prototype.off = function(...args) {
  this.interactionManager.off(...args);
};

/**
 * 场景设置分辨率
 *
 * @member {Number}
 * @name resolution
 * @memberof JC.Renderer#
 */
Object.defineProperty(Renderer.prototype, 'resolution', {
  get: function() {
    return this._resolution;
  },
  set: function(value) {
    if (this._resolution !== value) {
      this._resolution = value;
      this.rootMatrix.identity().scale(value, value);
      this.resize();
    }
  },
});

/**
 * 标记场景是否可交互，涉及到是否进行事件检测
 *
 * @member {Boolean}
 * @name enableinteractive
 * @memberof JC.Renderer#
 */
Object.defineProperty(Renderer.prototype, 'enableinteractive', {
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

export {Renderer};
