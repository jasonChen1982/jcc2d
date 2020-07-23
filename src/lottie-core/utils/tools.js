/**
 * get the type by Object.prototype.toString
 * @ignore
 * @param {*} val
 * @return {String} type string value
 */
function _rt(val) {
  return Object.prototype.toString.call(val);
}

/**
 * some useful toolkit
 * @namespace
 */
const Tools = {
  /**
   * simple copy a json data
   * @method
   * @param {JSON} json source data
   * @return {JSON} object
   */
  copyJSON: function(json) {
    return JSON.parse(JSON.stringify(json));
  },

  /**
   * detect the variable is array type
   * @method
   * @param {Array} variable input variable
   * @return {Boolean} result
   */
  isArray: (function() {
    let ks = _rt([]);
    return function(variable) {
      return _rt(variable) === ks;
    };
  })(),

  /**
   * detect the variable is string type
   * @method
   * @param {String} variable input variable
   * @return {Boolean} result
   */
  isString: (function() {
    let ks = _rt('s');
    return function(variable) {
      return _rt(variable) === ks;
    };
  })(),

  /**
   * detect the variable is number type
   * @method
   * @param {Number} variable input variable
   * @return {Boolean} result
   */
  isNumber: (function() {
    let ks = _rt(1);
    return function(variable) {
      return _rt(variable) === ks;
    };
  })(),

  /**
   * 判断变量是否为函数类型
   * @method
   * @param {Function} variable 待判断的变量
   * @return {Boolean} 判断的结果
   */
  isFunction: (function() {
    let ks = _rt(function() {});
    return function(variable) {
      return _rt(variable) === ks;
    };
  })(),

  /**
   * 判断变量是否为undefined
   * @method
   * @param {Function} variable 待判断的变量
   * @return {Boolean} 判断的结果
   */
  isUndefined: function(variable) {
    return typeof variable === 'undefined';
  },

  /**
   * detect the variable is boolean type
   * @method
   * @param {Boolean} variable input variable
   * @return {Boolean} result
   */
  isBoolean: (function() {
    let ks = _rt(true);
    return function(variable) {
      return _rt(variable) === ks;
    };
  })(),

  /**
   * detect the variable is object type
   * @method
   * @param {Object} variable input variable
   * @return {Boolean} result
   */
  isObject: (function() {
    let ks = _rt({});
    return function(variable) {
      return _rt(variable) === ks;
    };
  })(),

  /**
   * euclidean modulo
   * @method
   * @param {Number} n input value
   * @param {Number} m modulo
   * @return {Number} re-map to modulo area
   */
  euclideanModulo: function(n, m) {
    return ((n % m) + m) % m;
  },

  /**
   * bounce value when value spill codomain
   * @method
   * @param {Number} n input value
   * @param {Number} min lower boundary
   * @param {Number} max upper boundary
   * @return {Number} bounce back to boundary area
   */
  codomainBounce: function(n, min, max) {
    if (n < min) return 2 * min - n;
    if (n > max) return 2 * max - n;
    return n;
  },

  /**
   * clamp a value in range
   * @method
   * @param {Number} x input value
   * @param {Number} a lower boundary
   * @param {Number} b upper boundary
   * @return {Number} clamp in range
   */
  clamp: function(x, a, b) {
    return (x < a) ? a : ((x > b) ? b : x);
  },

  /**
   * detect number was in [min, max]
   * @method
   * @param {number} v   value
   * @param {number} min lower
   * @param {number} max upper
   * @return {boolean} in [min, max] range ?
   */
  inRange(v, min, max) {
    return v >= min && v <= max;
  },

  /**
   * get assets from keyframes assets
   * @method
   * @param {string} id assets refid
   * @param {object} assets assets object
   * @return {object} asset object
   */
  getAssets(id, assets) {
    for (let i = 0; i < assets.length; i++) {
      if (id === assets[i].id) return assets[i];
    }
    console.error('have not assets name as', id);
    return {};
  },

  /**
   * get hex number from rgb array
   * @param {array} rgb rgb array
   * @return {number}
   */
  rgb2hex(rgb) {
    return ((rgb[0] << 16) + (rgb[1] << 8) + (rgb[2] | 0));
  },
};

export default Tools;
