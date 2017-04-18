
import {Container} from './Container';
import {InteractionManager} from '../eventer/InteractionManager';
import {Utils} from '../util/Utils';

/* global RAF CAF */
/* eslint new-cap: 0 */

/**
 * 舞台对象，继承至Eventer
 *
 *
 * ```js
 * var stage = new JC.Stage('demo_canvas','#fff');
 * ```
 *
 * @class
 * @extends JC.Container
 * @memberof JC
 * @param {json} options
 */
function Stage(options) { // canvas, bgColor, resolution
  options = options || {};
  Container.call(this);

  /**
   * 场景的canvas的dom
   *
   * @member {CANVAS}
   */
  this.canvas = Utils.isString(options.dom)
                ?
                document.getElementById(options.dom) : options.dom;

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
   * 场景分辨率
   *
   * @member {Number}
   */
  this._resolution = 0;

  /**
   * 场景分辨率
   *
   * @member {Number}
   */
  this.resolution = options.resolution || 1;

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
  this.enableFPS = true;

  this.interactionManager = new InteractionManager(this);

  this._interactive = false;


  this.interactiveOnChange = function() {
    if (this.interactive) {
      this.interactionManager.addEvents();
    } else {
      this.interactionManager.removeEvents();
    }
  };

  /**
   * 设置canvas是否可交互
   *
   * @member {Boolean}
   */
  this.interactive = true;

  this.proxyOn();
}
Stage.prototype = Object.create(Container.prototype);

Stage.prototype.proxyOn = function() {
  let This = this;
  this.interactionManager.on('click', function(ev) {
    This.emit('click', ev);
  });

  this.interactionManager.on('mousemove', function(ev) {
    This.emit('mousemove', ev);
  });

  this.interactionManager.on('mousedown', function(ev) {
    This.emit('mousedown', ev);
  });

  this.interactionManager.on('mouseout', function(ev) {
    This.emit('mouseout', ev);
  });

  this.interactionManager.on('mouseover', function(ev) {
    This.emit('mouseover', ev);
  });

  this.interactionManager.on('touchstart', function(ev) {
    This.emit('touchstart', ev);
  });

  this.interactionManager.on('touchend', function(ev) {
    This.emit('touchend', ev);
  });

  this.interactionManager.on('touchmove', function(ev) {
    This.emit('touchmove', ev);
  });

  this.interactionManager.on('mouseup', function(ev) {
    This.emit('mouseup', ev);
  });
};

/**
 * 标记场景是否可交互，涉及到是否进行事件检测
 *
 * @member {Boolean}
 * @name interactive
 * @memberof JC.Stage#
 */
Object.defineProperty(Stage.prototype, 'interactive', {
  get: function() {
    return this._interactive;
  },
  set: function(value) {
    if (this._interactive !== value) {
      this._interactive = value;
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

/**
 * 舞台尺寸设置
 *
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
 *
 *
 */
Stage.prototype.render = function() {
  this.emit('prerender');

  this.timeline();

  if (this.autoClear) {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
  if (this.autoUpdate) this.updatePosture();

  for (let i = 0, l = this.childs.length; i < l; i++) {
    let child = this.childs[i];
    if (!child.isVisible() || !child._ready) continue;
    child.render(this.ctx);
  }

  this.emit('postrender');
};

/**
 * 更新场景内物体状态
 *
 *
 */
// Stage.prototype.update = function() {
//   this.updateTransform();
//   this.updatePosture(this.timeScale * this.snippet);
// };

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

  if(this.enableFPS) {
    this._renderTimes++;
    this._takeTime += Math.max(15, this.snippet);
    this.fps = 1000 / Math.max(15, this.snippet) >> 0;
    this.averageFps = 1000 / (this._takeTime / this._renderTimes) >> 0;
  }

  this.pt += this.snippet;
};

/**
 * 更新场景内物体的姿态
 *
 *
 * @method updatePosture
 * @private
 * @param {number} snippet
 */
// Stage.prototype.updatePosture = function(snippet) {
//   for (let i = 0, l = this.childs.length; i < l; i++) {
//     let child = this.childs[i];
//     child.updatePosture(snippet);
//   }
// };

/**
 * 启动渲染引擎
 *
 * @method startEngine
 */
Stage.prototype.startEngine = function() {
  if (this.inRender) return;
  this.inRender = true;
  this.animate();
};

/**
 * 关闭渲染引擎
 *
 * @method stopEngine
 */
Stage.prototype.stopEngine = function() {
  CAF(this.loop);
  this.inRender = false;
};

/**
 * 更新场景内物体的姿态
 *
 * @method stopEngine
 */
Stage.prototype.stopEngine = function() {
  const This = this;
  /**
   * render loop
   */
  function render() {
    This.stage.render();
    This.loop = RAF(render);
  }
  render();
};

export {Stage};
