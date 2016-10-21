'use strict';

describe('JC.copyJSON', function () {

    it('should be object', function () {
        var obj1 = { a: 233 }
        var obj2 = { a: [1, 2, 3] }
        expect(JC.copyJSON(obj1)).to.be.an('object')
        expect(JC.copyJSON(obj2)).to.be.an('object')
    });

    it('should equal to origin object', function () {
        var obj1 = { a: 233 }
        var obj2 = { a: [1, 2, 3] }
        var obj3 = { a: { b: [233] } }
        expect(JC.copyJSON(obj1)).to.eql(obj1);
        expect(JC.copyJSON(obj2)).to.eql(obj2);
        expect(JC.copyJSON(obj3)).to.eql(obj3);
    });

});

describe('JS.isArray', function () {

    it('should work', function () {
        expect(JC.isArray([])).to.be.true;
        expect(JC.isArray(['a'])).to.be.true;
        expect(JC.isArray(233)).to.be.false;
    });

});

describe('JS.isObject', function () {

    it('should work', function () {
        expect(JC.isObject({})).to.be.true;
        expect(JC.isObject({ a: 'a' })).to.be.true;
        expect(JC.isObject(233)).to.be.false;
    });

});

describe('JS.isArray', function () {

    it('should work', function () {
        expect(JC.isArray([])).to.be.true;
        expect(JC.isArray(['a'])).to.be.true;
        expect(JC.isArray(233)).to.be.false;
    });

});

describe('JS.isString', function () {

    it('should work', function () {
        expect(JC.isString('')).to.be.true;
        expect(JC.isString('233')).to.be.true;
        expect(JC.isString(233)).to.be.false;
    });

});

describe('JS.isNumber', function () {

    it('should work', function () {
        expect(JC.isNumber(0)).to.be.true;
        expect(JC.isNumber(233)).to.be.true;
        expect(JC.isNumber(-233)).to.be.true;
        expect(JC.isNumber('233')).to.be.false;
    });

});

describe('JS.isFunction', function () {

    it('should work', function () {
        var test1 = function test1() {};
        function test2() {}
        expect(JC.isFunction(function() {})).to.be.true;
        expect(JC.isFunction(test1)).to.be.true;
        expect(JC.isFunction(test2)).to.be.true;
        expect(JC.isFunction('233')).to.be.false;
    });

});

describe('JC.random', function () {
    
    it('should output an number', function () {
        expect(JC.random()).to.be.a("number");
        expect(JC.random(1)).to.be.a("number");
        expect(JC.random(1, 2)).to.be.a("number");
        expect(JC.random([1, 2, 3, 5])).to.be.a("number");
    });
    
    it('should within the arguments', function () {
        expect(JC.random()).to.be.within(0, 1);
        expect(JC.random(1)).to.be.within(0, 1);
        expect(JC.random(1, 10)).to.be.within(1, 10);
        expect(JC.random([1, 2, 3, 4, 5])).to.be.within(1, 5);
        expect(JC.random([7, 3, 1, 5])).to.be.oneOf([1, 3, 5, 7]);
    });
    
});

describe('JC.euclideanModulo', function () {
    
    it('should got correct result ', function () {
        expect(JC.euclideanModulo(233, 4)).to.be.a('number');
        expect(JC.euclideanModulo(233, 4)).to.eql(1);
        expect(JC.euclideanModulo(233, 4)).to.not.eql(100);
    });
    
});

describe('JC.clamp', function () {
    
    it('should got correct result ', function () {
        expect(JC.clamp(-233, 2, 233)).to.be.a('number');
        expect(JC.clamp(-233, 2, 233)).to.eql(2);
        expect(JC.clamp(2, 233, 233)).to.eql(233);
        expect(JC.clamp(2, -233, 233)).to.eql(2);
        expect(JC.clamp(233, -233, 2)).to.eql(2);
    });
    
});
