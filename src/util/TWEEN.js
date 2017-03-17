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

export var TWEEN = {
    /**
     * 匀速运动函数
     *
     * @static
     * @memberof JC.TWEEN
     */
  linear: function (t, b, c, d){
    return c*t/d + b;
  },

    /**
     * 加速运动函数
     *
     * @static
     * @memberof JC.TWEEN
     */
  easeIn: function(t, b, c, d){
    return c*(t/=d)*t + b;
  },

    /**
     * 减速运动函数
     *
     * @static
     * @memberof JC.TWEEN
     */
  easeOut: function(t, b, c, d){
    return -c *(t/=d)*(t-2) + b;
  },

    /**
     * 先加速再减速运动函数
     *
     * @static
     * @memberof JC.TWEEN
     */
  easeBoth: function(t, b, c, d){
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
     * @static
     * @memberof JC.TWEEN
     */
  extend: function(opts){
    if(!opts)return;
    for(var key in opts){
      if(key!=='extend'&&opts[key])this[key]=opts[key];
    }
  }
};
