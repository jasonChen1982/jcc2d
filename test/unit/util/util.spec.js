'use strict';

describe('JC.UTILS.copyJSON', function () {

    it('should be object', function () {
        var obj1 = { a: 233 }
        var obj2 = { a: [1, 2, 3] }
        expect(JC.UTILS.copyJSON(obj1)).to.be.an('object')
        expect(JC.UTILS.copyJSON(obj2)).to.be.an('object')
    });

    it('should equal to origin object', function () {
        var obj1 = { a: 233 }
        var obj2 = { a: [1, 2, 3] }
        var obj3 = { a: { b: [233] } }
        expect(JC.UTILS.copyJSON(obj1)).to.eql(obj1);
        expect(JC.UTILS.copyJSON(obj2)).to.eql(obj2);
        expect(JC.UTILS.copyJSON(obj3)).to.eql(obj3);
    });

});

describe('JS.UTILS.isArray', function () {

    it('should work', function () {
        expect(JC.UTILS.isArray([])).to.be.true;
        expect(JC.UTILS.isArray(['a'])).to.be.true;
        expect(JC.UTILS.isArray(233)).to.be.false;
    });

});

describe('JS.UTILS.isObject', function () {

    it('should work', function () {
        expect(JC.UTILS.isObject({})).to.be.true;
        expect(JC.UTILS.isObject({ a: 'a' })).to.be.true;
        expect(JC.UTILS.isObject(233)).to.be.false;
    });

});

describe('JS.UTILS.isString', function () {

    it('should work', function () {
        expect(JC.UTILS.isString('')).to.be.true;
        expect(JC.UTILS.isString('233')).to.be.true;
        expect(JC.UTILS.isString(233)).to.be.false;
    });

});

describe('JS.UTILS.isNumber', function () {

    it('should work', function () {
        expect(JC.UTILS.isNumber(0)).to.be.true;
        expect(JC.UTILS.isNumber(233)).to.be.true;
        expect(JC.UTILS.isNumber(-233)).to.be.true;
        expect(JC.UTILS.isNumber('233')).to.be.false;
    });

});

describe('JS.UTILS.isFunction', function () {

    it('should work', function () {
        var test1 = function test1() {};
        function test2() {}
        expect(JC.UTILS.isFunction(function() {})).to.be.true;
        expect(JC.UTILS.isFunction(test1)).to.be.true;
        expect(JC.UTILS.isFunction(test2)).to.be.true;
        expect(JC.UTILS.isFunction('233')).to.be.false;
    });

});

describe('JC.UTILS.random', function () {

    it('should output an number', function () {
        expect(JC.UTILS.random()).to.be.a("number");
        expect(JC.UTILS.random(1)).to.be.a("number");
        expect(JC.UTILS.random(1, 2)).to.be.a("number");
        expect(JC.UTILS.random([1, 2, 3, 5])).to.be.a("number");
    });

    it('should within the arguments', function () {
        expect(JC.UTILS.random()).to.be.within(0, 1);
        expect(JC.UTILS.random(1)).to.be.within(0, 1);
        expect(JC.UTILS.random(1, 10)).to.be.within(1, 10);
        expect(JC.UTILS.random([1, 2, 3, 4, 5])).to.be.within(1, 5);
        expect(JC.UTILS.random([7, 3, 1, 5])).to.be.oneOf([1, 3, 5, 7]);
    });

});

describe('JC.UTILS.euclideanModulo', function () {

    it('should got correct result ', function () {
        expect(JC.UTILS.euclideanModulo(233, 4)).to.be.a('number');
        expect(JC.UTILS.euclideanModulo(233, 4)).to.eql(1);
        expect(JC.UTILS.euclideanModulo(233, 4)).to.not.eql(100);
    });

});

describe('JC.UTILS.clamp', function () {

    it('should got correct result ', function () {
        expect(JC.UTILS.clamp(-233, 2, 233)).to.be.a('number');
        expect(JC.UTILS.clamp(-233, 2, 233)).to.eql(2);
        expect(JC.UTILS.clamp(2, 233, 233)).to.eql(233);
        expect(JC.UTILS.clamp(2, -233, 233)).to.eql(2);
        expect(JC.UTILS.clamp(233, -233, 2)).to.eql(2);
    });

});
