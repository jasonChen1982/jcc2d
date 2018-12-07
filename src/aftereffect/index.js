import {Ticker} from '../utils/Ticker';
import AnimationGroup from './core/AnimationGroup';

/**
 * all animation manager, manage ticker and animation groups
 * @example
 * var manager = new PIXI.AnimationManager(app.ticker);
 * var ani = manager.parseAnimation({
 *   keyframes: data,
 *   infinite: true,
 * });
 * @class
 */
class AnimationManager {
  /**
   * animation manager, optional a ticker param
   * @param {Ticker} _ticker
   */
  constructor(_ticker) {
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
     * ticker engine
     * @private
     */
    this.ticker = _ticker || new Ticker();

    /**
     * all animation groups
     * @private
     */
    this.groups = [];

    this.ticker.on('update', (snippet) => {
      this.update(snippet);
    });
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
   * @param {object} options bodymovin data
   * @param {Object} options.keyframes bodymovin data, which export from AE
   * @param {Number} [options.repeats=0] need repeat somt times?
   * @param {Boolean} [options.infinite=false] play this animation round and round forever
   * @param {Boolean} [options.alternate=false] alternate direction every round
   * @param {Number} [options.wait=0] need wait how much time to start
   * @param {Number} [options.delay=0] need delay how much time to begin, effect every round
   * @param {String} [options.prefix=''] assets url prefix, like link path
   * @param {Number} [options.timeScale=1] animation speed
   * @param {Number} [options.autoStart=true] auto start animation after assets loaded
   * @return {AnimationGroup}
   * @example
   * var manager = new PIXI.AnimationManager(app.ticker);
   * var ani = manager.parseAnimation({
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
   * update
   * @private
   * @param {number} snippet
   */
  update(snippet) {
    if (this.paused) return;
    const snippetCache = this.timeScale * snippet;
    const length = this.groups.length;
    for (let i = 0; i < length; i++) {
      const animationGroup = this.groups[i];
      animationGroup.update(snippetCache);
    }
  }
}


export {
  AnimationGroup,
  AnimationManager,
};
