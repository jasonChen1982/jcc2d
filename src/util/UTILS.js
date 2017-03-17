function _rt(val){
  return Object.prototype.toString.call(val);
}

/**
 * UTILS 引擎工具箱
 *
 * @namespace JC.UTILS
 */
export var UTILS = {
  /**
   * 简单拷贝纯数据的JSON对象
   *
   * @static
   * @memberof JC.UTILS
   * @param {JSON} json 待拷贝的纯数据JSON
   * @return {JSON} 拷贝后的纯数据JSON
   */
  copyJSON: function(json){
    return JSON.parse(JSON.stringify(json));
  },

  /**
   * 将角度转化成弧度的乘法因子
   *
   * @static
   * @memberof JC.UTILS
   * @type {number}
   */
  DTR: Math.PI/180,

  /**
   * 将弧度转化成角度的乘法因子
   *
   * @static
   * @memberof JC.UTILS
   * @type {number}
   */
  RTD: 180/Math.PI,

  /**
   * 判断变量是否为数组类型
   *
   * @static
   * @method
   * @memberof JC.UTILS
   * @param {Array} variable 待判断的变量
   * @return {Boolean} 判断的结果
   */
  isArray: (function(){
    var ks = _rt([]);
    return function(object){
      return _rt(object) === ks;
    };
  })(),

  /**
   * 判断变量是否为对象类型
   *
   * @static
   * @method
   * @memberof JC.UTILS
   * @param {Object} variable 待判断的变量
   * @return {Boolean} 判断的结果
   */
  isObject: (function(){
    var ks = _rt({});
    return function(object){
      return _rt(object) === ks;
    };
  })(),

  /**
   * 判断变量是否为字符串类型
   *
   * @static
   * @method
   * @memberof JC.UTILS
   * @param {String} variable 待判断的变量
   * @return {Boolean} 判断的结果
   */
  isString: (function(){
    var ks = _rt('s');
    return function(object){
      return _rt(object) === ks;
    };
  })(),

  /**
   * 判断变量是否为数字类型
   *
   * @static
   * @method
   * @memberof JC.UTILS
   * @param {Number} variable 待判断的变量
   * @return {Boolean} 判断的结果
   */
  isNumber: (function(){
    var ks = _rt(1);
    return function(object){
      return _rt(object) === ks;
    };
  })(),

  /**
   * 判断变量是否为函数类型
   *
   * @static
   * @method
   * @memberof JC.UTILS
   * @param {Function} variable 待判断的变量
   * @return {Boolean} 判断的结果
   */
  isFunction: (function(){
    var ks = _rt(function(){});
    return function(object){
      return _rt(object) === ks;
    };
  })(),

  /**
   * 强化的随机数，可以随机产生给定区间内的数字、随机输出数字内的项
   *
   * @static
   * @method
   * @memberof JC.UTILS
   * @param {Array | Number} min 当只传入一个变量时变量应该为数字，否则为所给定区间较小的数字
   * @param {Number} max 所给定区间较大的数字
   * @return {ArrayItem | Number} 返回数组中大一项或者给定区间内的数字
   */
  random: function(min, max){
    if (this.isArray(min))
      return min[~~(Math.random() * min.length)];
    if (!this.isNumber(max))
      max = min || 1, min = 0;
    return min + Math.random() * (max - min);
  },

  /**
   * 阿基米德求模
   *
   * @static
   * @method
   * @memberof JC.UTILS
   * @param {Number} n 索引
   * @param {Number} m 模
   * @return {Number} 映射到模长内到索引
   */
  euclideanModulo: function(n, m){
    return ((n % m) + m) % m;
  },

  /**
   * 数字区间闭合，避免超出区间
   *
   * @static
   * @method
   * @memberof JC.UTILS
   * @param {Number} x 待闭合到值
   * @param {Number} a 闭合区间左边界
   * @param {Number} b 闭合区间右边界
   * @return {Number} 闭合后的值
   */
  clamp: function(x, a, b) {
    return (x < a) ? a : ((x > b) ? b : x);
  },
};
