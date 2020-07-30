import {BezierEasing} from '../lottie-core/index';
/* eslint no-cond-assign: "off" */
/* eslint new-cap: 0 */
/* eslint max-len: 0 */


/**
 * Tween timing-function set
 *
 * ```js
 * // demo-A
 * dispayA.animate({
 *   from: {x: 100},
 *   to: {x: 200},
 *   ease: Tween.Ease.In, // use which timing-function ?
 * })
 * // demo-B
 * dispayB.animate({
 *   from: {x: 100},
 *   to: {x: 200},
 *   ease: Tween.Ease.Bezier(0.4, 0.34, 0.6, 0.78), // use which timing-function ?
 * })
 * ```
 * @namespace Tween
 */

export const Tween = {

  /**
   * Tween.Linear timing-function set
   *
   * @memberof Tween
   * @name Linear
   * @type {object}
   * @property {function} None - linear function
   */
  Linear: {

    /**
     * Linear.None
     * @private
     * @param {number} k 0 - 1 time progress
     * @return {number}
     */
    None: function(k) {
      return k;
    },

  },

  /**
   * Tween.Ease timing-function set
   *
   * @memberof Tween
   * @name Ease
   * @type {object}
   * @property {function} In - ease-in function
   * @property {function} Out - ease-out function
   * @property {function} InOut - ease-in-out function
   * @property {function} Bezier - return ease-bezier function
   */
  Ease: {

    /**
     * Ease.In
     * @private
     * @param {number} k 0 - 1 time progress
     * @return {number}
     */
    In: (function() {
      const bezier = new BezierEasing(.42, 0, 1, 1);
      return function(k) {
        return bezier.get(k);
      };
    })(),

    /**
     * Ease.Out
     * @private
     * @param {number} k 0 - 1 time progress
     * @return {number}
     */
    Out: (function() {
      const bezier = new BezierEasing(0, 0, .58, 1);
      return function(k) {
        return bezier.get(k);
      };
    })(),

    /**
     * Ease.InOut
     * @private
     * @param {number} k 0 - 1 time progress
     * @return {number}
     */
    InOut: (function() {
      const bezier = new BezierEasing(.42, 0, .58, 1);
      return function(k) {
        return bezier.get(k);
      };
    })(),

    /**
     * Ease.Bezier
     * @private
     * @param {*} x1 control point-in x component
     * @param {*} y1 control point-in y component
     * @param {*} x2 control point-out x component
     * @param {*} y2 control point-out y component
     * @return {bezier} return bezier function and cacl number
     */
    Bezier: function(x1, y1, x2, y2) {
      const bezier = new BezierEasing(x1, y1, x2, y2);
      return function(k) {
        return bezier.get(k);
      };
    },

  },

  /**
   * Tween.Elastic timing-function set
   *
   * @memberof Tween
   * @name Elastic
   * @type {object}
   * @property {function} In - elastic-in function
   * @property {function} Out - elastic-out function
   * @property {function} InOut - elastic-in-out function
   */
  Elastic: {

    /**
     * Elastic.In
     * @private
     * @param {number} k 0 - 1 time progress
     * @return {number}
     */
    In: function(k) {
      if (k === 0) {
        return 0;
      }
      if (k === 1) {
        return 1;
      }
      return -Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
    },

    /**
     * Elastic.Out
     * @private
     * @param {number} k 0 - 1 time progress
     * @return {number}
     */
    Out: function(k) {
      if (k === 0) {
        return 0;
      }
      if (k === 1) {
        return 1;
      }
      return Math.pow(2, -10 * k) * Math.sin((k - 0.1) * 5 * Math.PI) + 1;
    },

    /**
     * Elastic.InOut
     * @private
     * @param {number} k 0 - 1 time progress
     * @return {number}
     */
    InOut: function(k) {
      if (k === 0) {
        return 0;
      }
      if (k === 1) {
        return 1;
      }
      k *= 2;
      if (k < 1) {
        return -0.5 * Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
      }
      return 0.5 * Math.pow(2, -10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI) + 1;
    },

  },

  /**
   * Tween.Elastic timing-function set
   *
   * @memberof Tween
   * @name Back
   * @type {object}
   * @property {function} In - back-in function
   * @property {function} Out - back-out function
   * @property {function} InOut - back-in-out function
   */
  Back: {

    /**
     * Back.In
     * @private
     * @param {number} k 0 - 1 time progress
     * @return {number}
     */
    In: function(k) {
      let s = 1.70158;
      return k * k * ((s + 1) * k - s);
    },

    /**
     * Back.Out
     * @private
     * @param {number} k 0 - 1 time progress
     * @return {number}
     */
    Out: function(k) {
      let s = 1.70158;
      return --k * k * ((s + 1) * k + s) + 1;
    },

    /**
     * Back.InOut
     * @private
     * @param {number} k 0 - 1 time progress
     * @return {number}
     */
    InOut: function(k) {
      let s = 1.70158 * 1.525;
      if ((k *= 2) < 1) {
        return 0.5 * (k * k * ((s + 1) * k - s));
      }
      return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
    },

  },

  /**
   * Tween.Elastic timing-function set
   *
   * @memberof Tween
   * @name Bounce
   * @type {object}
   * @property {function} In - bounce-in function
   * @property {function} Out - bounce-out function
   * @property {function} InOut - bounce-in-out function
   */
  Bounce: {

    /**
     * Bounce.In
     * @private
     * @param {number} k 0 - 1 time progress
     * @return {number}
     */
    In: function(k) {
      return 1 - Tween.Bounce.Out(1 - k);
    },

    /**
     * Bounce.Out
     * @private
     * @param {number} k 0 - 1 time progress
     * @return {number}
     */
    Out: function(k) {
      if (k < (1 / 2.75)) {
        return 7.5625 * k * k;
      } else if (k < (2 / 2.75)) {
        return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
      } else if (k < (2.5 / 2.75)) {
        return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
      } else {
        return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
      }
    },

    /**
     * Bounce.InOut
     * @private
     * @param {number} k 0 - 1 time progress
     * @return {number}
     */
    InOut: function(k) {
      if (k < 0.5) {
        return Tween.Bounce.In(k * 2) * 0.5;
      }
      return Tween.Bounce.Out(k * 2 - 1) * 0.5 + 0.5;
    },
  },
};
