import {Utils} from '../utils/Utils';
import {Eventer} from '../eventer/Eventer';

/**
 * ticker class
 * @param {boolean} enableFPS
 */
function Ticker(enableFPS) {
  Eventer.call(this);

  /**
   * 是否记录渲染性能
   *
   * @member {Boolean}
   */
  this.enableFPS = Utils.isBoolean(enableFPS) ?
    enableFPS :
    true;

  /**
   * 上一次绘制的时间点
   *
   * @member {Number}
   * @private
   */
  this.pt = 0;

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
   * 是否开启 ticker
   *
   * @member {Boolean}
   */
  this.started = false;

  /**
   * 是否暂停 ticker
   *
   * @member {Boolean}
   */
  this.paused = false;
}

Ticker.prototype = Object.create(Eventer.prototype);

Ticker.prototype.timeline = function() {
  this.snippet = Date.now() - this.pt;
  if (this.pt === 0 || this.snippet > 200) {
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

Ticker.prototype.tick = function() {
  if (this.paused) return;
  this.timeline();
  this.emit('tick', this.snippet);
};

/**
 * 渲染循环
 *
 * @method start
 */
Ticker.prototype.start = function() {
  if (this.started) return;
  this.started = true;
  const loop = () => {
    this.tick();
    this.loop = RAF(loop);
  };
  loop();
};

/**
 * 渲染循环
 *
 * @method stop
 */
Ticker.prototype.stop = function() {
  CAF(this.loop);
  this.started = false;
};

/**
 * 暂停触发 tick
 *
 * @method pause
 */
Ticker.prototype.pause = function() {
  this.paused = true;
};

/**
 * 恢复触发 tick
 *
 * @method resume
 */
Ticker.prototype.resume = function() {
  this.paused = false;
};


export {Ticker};
