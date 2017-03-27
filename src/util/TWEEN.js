/* eslint no-cond-assign: "off" */


/**
 * TWEEN 缓动时间运动函数集合
 *
 * ```js
 * dispay.fromTo({
 *   from: {x: 100},
 *   to: {x: 200},
 *   ease: 'linear' // 配置要调用的运动函数
 * })
 * ```
 * @namespace JC.TWEEN
 */

export const TWEEN = {
  /**
   * 匀速运动函数
   *
   * @param {Number} t 当前时间
   * @param {Number} b 起始值
   * @param {Number} c 结束值
   * @param {Number} d 总时间
   * @static
   * @memberof JC.TWEEN
   * @return {Number} 当前时间对应的值
   */
  linear: function(t, b, c, d) {
    return c*t/d + b;
  },

  /**
   * 加速运动函数
   *
   * @param {Number} t 当前时间
   * @param {Number} b 起始值
   * @param {Number} c 结束值
   * @param {Number} d 总时间
   * @static
   * @memberof JC.TWEEN
   * @return {Number} 当前时间对应的值
   */
  easeIn: function(t, b, c, d) {
    return c*(t/=d)*t + b;
  },

  /**
   * 减速运动函数
   *
   * @param {Number} t 当前时间
   * @param {Number} b 起始值
   * @param {Number} c 结束值
   * @param {Number} d 总时间
   * @static
   * @memberof JC.TWEEN
   * @return {Number} 当前时间对应的值
   */
  easeOut: function(t, b, c, d) {
    return -c *(t/=d)*(t-2) + b;
  },

  /**
   * 先加速再减速运动函数
   *
   * @param {Number} t 当前时间
   * @param {Number} b 起始值
   * @param {Number} c 结束值
   * @param {Number} d 总时间
   * @static
   * @memberof JC.TWEEN
   * @return {Number} 当前时间对应的值
   */
  easeBoth: function(t, b, c, d) {
    if ((t/=d/2) < 1) {
      return c/2*t*t + b;
    }
    return -c/2 * ((--t)*(t-2) - 1) + b;
  },

  /**
   * 扩展运动函数
   *
   * ```js
   * JC.TWEEN.extend({
   *   elasticIn: function(t, b, c, d){....},
   *   elasticOut: function(t, b, c, d){....},
   *   ......
   * })
   * ```
   * @param {Number} opts 扩展的时间函数
   * @static
   * @memberof JC.TWEEN
   */
  extend: function(opts) {
    if(!opts)return;
    for(let key in opts) {
      if(key!=='extend'&&opts[key])this[key]=opts[key];
    }
  },
};
