import Eventer from './utils/Eventer';
import AnimationGroup from './AnimationGroup';

/**
 * all lottie animation manager, manage update loop and animation groups
 * @example
 * const manager = new PIXI.AnimationManager(app);
 * const ani = manager.parseAnimation({
 *   keyframes: data,
 *   infinite: true,
 * });
 * @class
 */
export default class AnimationManager extends Eventer {
  /**
   * animation manager, a ticker instance
   * @param {Application} app app object
   */
  constructor(app) {
    super();
    /**
     * pre-time cache
     *
     * @member {Number}
     * @private
     */
    this.pt = 0;

    /**
     * how long the time through, at this tick
     *
     * @member {Number}
     * @private
     */
    this.snippet = 0;

    /**
     * time scale, just like speed scalar
     *
     * @member {Number}
     */
    this.timeScale = 1;

    /**
     * mark the manager was pause or not
     *
     * @member {Boolean}
     */
    this.paused = false;

    /**
     * get shared ticker from app object
     * @private
     */
    this.ticker = app.ticker ? app.ticker : app;

    /**
     * all animation groups
     * @private
     */
    this.groups = [];

    this.update = this.update.bind(this);

    if (this.ticker) this.start();
  }

  /**
   * add a animationGroup child to array
   * @param {AnimationGroup} child AnimationGroup instance
   * @return {AnimationGroup} child
   */
  add(child) {
    const argumentsLength = arguments.length;

    if (argumentsLength > 1) {
      for (let i = 0; i < argumentsLength; i++) {
        /* eslint prefer-rest-params: 0 */
        this.add(arguments[i]);
      }
    } else {
      this.groups.push(child);
    }

    return child;
  }

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
   * @return {AnimationGroup}
   * @example
   * const manager = new PIXI.AnimationManager(app);
   * const ani = manager.parseAnimation({
   *   keyframes: data,
   *   infinite: true,
   * });
   */
  parseAnimation(options) {
    const animate = new AnimationGroup(options);
    return this.add(animate);
  }

  /**
   * set animation speed, time scale
   * @param {number} speed
   */
  setSpeed(speed) {
    this.timeScale = speed;
  }

  /**
   * start update loop
   * @return {this}
   */
  start() {
    this.pt = Date.now();
    this.ticker.on('update', this.update);
    return this;
  }

  /**
   * stop update loop
   * @return {this}
   */
  stop() {
    this.ticker.off('update', this.update);
    return this;
  }

  /**
   * pause all animation groups
   * @return {this}
   */
  pause() {
    this.paused = true;
    return this;
  }

  /**
   * pause all animation groups
   * @return {this}
   */
  resume() {
    this.paused = false;
    return this;
  }

  /**
   * update all active animation
   * @private
   */
  update() {
    this.timeline();
    if (this.paused) return;
    const snippetCache = this.timeScale * this.snippet;
    const length = this.groups.length;
    for (let i = 0; i < length; i++) {
      const animationGroup = this.groups[i];
      animationGroup.update(snippetCache);
    }
    this.emit('update', this.snippet);
  }

  /**
   * get timeline snippet
   * @private
   */
  timeline() {
    let snippet = Date.now() - this.pt;
    if (!this.pt || snippet > 200) {
      this.pt = Date.now();
      snippet = Date.now() - this.pt;
    }
    this.pt += snippet;
    this.snippet = snippet;
  }
}
