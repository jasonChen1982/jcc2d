
/**
 * 简单拷贝json对象
 *
 * @name copyJSON
 * @memberof JC
 * @property {JC.copyJSON}
 */
 
JC.copyJSON = function(json){
    return JSON.parse(JSON.stringify(json));
};

/**
 * 将角度转化成弧度
 *
 * @name DTR
 * @memberof JC
 * @property {JC.DTR}
 */

JC.DTR = Math.PI/180;

function _rt(val){
    return Object.prototype.toString.call(val);
}

/**
 * 是否为数组
 *
 * @name isArray
 * @memberof JC
 * @property {JC.isArray}
 */
JC.isArray = (function(){
    var ks = _rt('s');
    return function(object){
        return Object.prototype.toString.call(object) === ks;
    };
})();

/**
 * 是否为对象
 *
 * @name isObject
 * @memberof JC
 * @property {JC.isObject}
 */
JC.isObject = (function(){
    var ks = _rt({});
    return function(object){
        return Object.prototype.toString.call(object) === ks;
    };
})();

/**
 * 是否为数字
 *
 * @name isNumber
 * @memberof JC
 * @property {JC.isNumber}
 */
JC.isNumber = (function(){
    var ks = _rt(1);
    return function(object){
        return Object.prototype.toString.call(object) === ks;
    };
})();

/**
 * 是否为函数
 *
 * @name isFunction
 * @memberof JC
 * @property {JC.isFunction}
 */
JC.isFunction = (function(){
    var ks = _rt(function(){});
    return function(object){
        return Object.prototype.toString.call(object) === ks;
    };
})();

/**
 * 强化的随机数
 *
 * @name random
 * @memberof JC
 * @property {JC.random}
 */

JC.random = function(min, max){
    if (JC.isArray(min))
        return min[~~(Math.random() * min.length)];
    if (!JC.isNumber(max))
        max = min || 1, min = 0;
    return min + Math.random() * (max - min);
};


/**
 * 阿基米德求模
 *
 * @name euclideanModulo
 * @memberof JC
 * @property {JC.euclideanModulo}
 */

JC.euclideanModulo = function(n, m){
    return ((n % m) + m) % m;
};



