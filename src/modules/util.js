
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



JC.isArray = function(object){
    return Object.prototype.toString.call(object) === '[object Array]';
};

JC.isNumber = function(object){
    return typeof object === 'number';
};

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



