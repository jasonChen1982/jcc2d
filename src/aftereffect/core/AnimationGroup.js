import Register from './Register';
import {Utils} from '../../utils/Utils';
import CompElement from './elements/CompElement';

/**
 * an animation group, store and compute frame information
 * @class
 */
class AnimationGroup {
  /**
   * pass a data and extra config
   * @param {object} options config and data
   * @param {Object} options.keyframes bodymovin data, which export from AE
   * @param {Number} [options.repeats=0] need repeat somt times?
   * @param {Boolean} [options.infinite=false] play this animation round and round forever
   * @param {Boolean} [options.alternate=false] alternate direction every round
   * @param {Number} [options.wait=0] need wait how much time to start
   * @param {Number} [options.delay=0] need delay how much time to begin, effect every round
   * @param {String} [options.prefix=''] assets url prefix, like link path
   * @param {Number} [options.timeScale=1] animation speed
   * @param {Number} [options.autoStart=true] auto start animation after assets loaded
   */
  constructor(options) {
    this.prefix = options.prefix || options.keyframes.prefix || '';
    this.keyframes = options.keyframes;
    this.fr = this.keyframes.fr;
    this.ip = this.keyframes.ip;
    this.op = this.keyframes.op;

    this.tpf = 1000 / this.fr;
    this.tfs = Math.floor(this.op - this.ip);

    this.living = true;
    this.alternate = options.alternate || false;
    this.infinite = options.infinite || false;
    this.repeats = options.repeats || 0;
    this.delay = options.delay || 0;
    this.wait = options.wait || 0;
    this.duration = this.tfs;
    this.progress = 0;
    this._pf = -10000;

    this.timeScale = Utils.isNumber(options.timeScale) ?
      options.timeScale :
      1;

    this.direction = 1;
    this.repeatsCut = this.repeats;
    this.delayCut = this.delay;
    this.waitCut = this.wait;

    this._paused = true;

    this.register = new Register(this.keyframes.assets, this.prefix);

    this.register.loader.once('complete', () => {
      this._paused = Utils.isBoolean(options.autoStart) ? !options.autoStart : false;
    });

    this.group = new CompElement(this.keyframes.layers, {
      assets: this.keyframes.assets,
      size: {w: this.keyframes.w, h: this.keyframes.h},
      prefix: this.prefix,
      register: this.register,
      parentName: this.keyframes.nm,
    });
    this.group._aniRoot = true;

    this.updateSession = {forever: this.isForever()};
  }

  /**
   * get layer by name path
   * @param {string} name layer name path, example: root.gift.star1
   * @return {object}
   */
  getLayerByName(name) {
    return this.register.getLayer(name);
  }

  /**
   * bind other animation group to this animation group with name path
   * @param {*} name
   * @param {*} slot
   */
  bindSlot(name, slot) {
    const slotDot = this.getLayerByName(name);
    if (slotDot) slotDot.add(slot);
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
   */
  update(snippetCache) {
    if (!this.living) return;

    const isEnd = this.updateTime(snippetCache);

    this.group.updateMovin(this.progress, this.updateSession);

    const np = this.progress >> 0;
    if (this._pf !== np) {
      this.emitFrame( this.direction > 0 ? np : this._pf);
      this._pf = np;
    }
    if (isEnd === false) {
      this.emit('update', this.progress / this.duration);
    } else if (isEnd === true) {
      this.emit('complete');
    }
  }

  /**
   * update timeline with time snippet
   * @private
   * @param {number} snippet snippet
   * @return {boolean} progress status
   */
  updateTime(snippet) {
    const snippetCache = this.direction * this.timeScale * snippet;
    if (this.waitCut > 0) {
      this.waitCut -= Math.abs(snippetCache);
      return null;
    }
    if (this._paused || this.delayCut > 0) {
      if (this.delayCut > 0) this.delayCut -= Math.abs(snippetCache);
      return null;
    }

    this.progress += snippetCache / this.tpf;
    let isEnd = false;

    if (!this.updateSession.forever && this.spill()) {
      if (this.repeatsCut > 0 || this.infinite) {
        if (this.repeatsCut > 0) --this.repeatsCut;
        this.delayCut = this.delay;
        if (this.alternate) {
          this.direction *= -1;
          this.progress = Utils.codomainBounce(this.progress, 0, this.duration);
        } else {
          this.direction = 1;
          this.progress = Utils.euclideanModulo(this.progress, this.duration);
        }
      } else {
        this.progress = Utils.clamp(this.progress, 0, this.duration);
        isEnd = true;
        this.living = false;
      }
    }

    return isEnd;
  }

  /**
   * check the animation group was in forever mode
   * @private
   * @return {boolean}
   */
  isForever() {
    return this.register._forever;
  }

  /**
   * is this time progress spill the range
   * @private
   * @return {boolean}
   */
  spill() {
    const bottomSpill = this.progress <= 0 && this.direction === -1;
    const topSpill = this.progress >= this.duration && this.direction === 1;
    return bottomSpill || topSpill;
  }

  /**
   * get time
   * @param {number} frame frame index
   * @return {number}
   */
  frameToTime(frame) {
    return frame * this.tpf;
  }

  /**
   * set animation speed, time scale
   * @param {number} speed
   */
  setSpeed(speed) {
    this.timeScale = speed;
  }

  /**
   * pause this animation group
   * @return {this}
   */
  pause() {
    this._paused = true;
    return this;
  }

  /**
   * resume or play this animation group
   * @return {this}
   */
  resume() {
    this._paused = false;
    return this;
  }

  /**
   * play this animation group
   * @return {this}
   */
  play() {
    this._paused = false;
    return this;
  }

  /**
   * replay this animation group
   * @return {this}
   */
  replay() {
    this._paused = false;
    this.living = true;
    this.progress = 0;
    return this;
  }

  /**
   * proxy this.group event-emit
   * Emit an event to all registered event listeners.
   *
   * @param {String} event The name of the event.
   */
  emit(...args) {
    this.group.emit(...args);
  }

  /**
   * proxy this.group event-on
   * Register a new EventListener for the given event.
   *
   * @param {String} event Name of the event.
   * @param {Function} fn Callback function.
   * @param {Mixed} [context=this] The context of the function.
   */
  on(...args) {
    this.group.on(...args);
  }

  /**
   * proxy this.group event-once
   * Add an EventListener that's only called once.
   *
   * @param {String} event Name of the event.
   * @param {Function} fn Callback function.
   * @param {Mixed} [context=this] The context of the function.
   */
  once(...args) {
    this.group.once(...args);
  }

  /**
   * proxy this.group event-off
   * @param {String} event The event we want to remove.
   * @param {Function} fn The listener that we need to find.
   * @param {Mixed} context Only remove listeners matching this context.
   * @param {Boolean} once Only remove once listeners.
   */
  off(...args) {
    this.group.off(...args);
  }

  /**
   * proxy this.group event-removeAllListeners
   * Remove event listeners.
   *
   * @param {String} event The event we want to remove.
   * @param {Function} fn The listener that we need to find.
   * @param {Mixed} context Only remove listeners matching this context.
   * @param {Boolean} once Only remove once listeners.
   */
  removeAllListeners(...args) {
    this.group.removeAllListeners(...args);
  }
}

export default AnimationGroup;
