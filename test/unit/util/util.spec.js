'use strict';

describe('JC.Utils.copyJSON', function () {

    it('should be object', function () {
        var obj1 = { a: 233 }
        var obj2 = { a: [1, 2, 3] }
        expect(JC.Utils.copyJSON(obj1)).to.be.an('object')
        expect(JC.Utils.copyJSON(obj2)).to.be.an('object')
    });

    it('should equal to origin object', function () {
        var obj1 = { a: 233 }
        var obj2 = { a: [1, 2, 3] }
        var obj3 = { a: { b: [233] } }
        expect(JC.Utils.copyJSON(obj1)).to.eql(obj1);
        expect(JC.Utils.copyJSON(obj2)).to.eql(obj2);
        expect(JC.Utils.copyJSON(obj3)).to.eql(obj3);
    });

});

describe('JS.Utils.isArray', function () {

    it('should work', function () {
        expect(JC.Utils.isArray([])).to.be.true;
        expect(JC.Utils.isArray(['a'])).to.be.true;
        expect(JC.Utils.isArray(233)).to.be.false;
    });

});

describe('JS.Utils.isObject', function () {

    it('should work', function () {
        expect(JC.Utils.isObject({})).to.be.true;
        expect(JC.Utils.isObject({ a: 'a' })).to.be.true;
        expect(JC.Utils.isObject(233)).to.be.false;
    });

});

describe('JS.Utils.isString', function () {

    it('should work', function () {
        expect(JC.Utils.isString('')).to.be.true;
        expect(JC.Utils.isString('233')).to.be.true;
        expect(JC.Utils.isString(233)).to.be.false;
    });

});

describe('JS.Utils.isNumber', function () {

    it('should work', function () {
        expect(JC.Utils.isNumber(0)).to.be.true;
        expect(JC.Utils.isNumber(233)).to.be.true;
        expect(JC.Utils.isNumber(-233)).to.be.true;
        expect(JC.Utils.isNumber('233')).to.be.false;
    });

});

describe('JS.Utils.isFunction', function () {

    it('should work', function () {
        var test1 = function test1() {};
        function test2() {}
        expect(JC.Utils.isFunction(function() {})).to.be.true;
        expect(JC.Utils.isFunction(test1)).to.be.true;
        expect(JC.Utils.isFunction(test2)).to.be.true;
        expect(JC.Utils.isFunction('233')).to.be.false;
    });

});

describe('JC.Utils.random', function () {

    it('should output an number', function () {
        expect(JC.Utils.random()).to.be.a("number");
        expect(JC.Utils.random(1)).to.be.a("number");
        expect(JC.Utils.random(1, 2)).to.be.a("number");
        expect(JC.Utils.random([1, 2, 3, 5])).to.be.a("number");
    });

    it('should within the arguments', function () {
        expect(JC.Utils.random()).to.be.within(0, 1);
        expect(JC.Utils.random(1)).to.be.within(0, 1);
        expect(JC.Utils.random(1, 10)).to.be.within(1, 10);
        expect(JC.Utils.random([1, 2, 3, 4, 5])).to.be.within(1, 5);
        expect(JC.Utils.random([7, 3, 1, 5])).to.be.oneOf([1, 3, 5, 7]);
    });

});

describe('JC.Utils.euclideanModulo', function () {

    it('should got correct result ', function () {
        expect(JC.Utils.euclideanModulo(233, 4)).to.be.a('number');
        expect(JC.Utils.euclideanModulo(233, 4)).to.eql(1);
        expect(JC.Utils.euclideanModulo(233, 4)).to.not.eql(100);
    });

});

describe('JC.Utils.clamp', function () {

    it('should got correct result ', function () {
        expect(JC.Utils.clamp(-233, 2, 233)).to.be.a('number');
        expect(JC.Utils.clamp(-233, 2, 233)).to.eql(2);
        expect(JC.Utils.clamp(2, 233, 233)).to.eql(233);
        expect(JC.Utils.clamp(2, -233, 233)).to.eql(2);
        expect(JC.Utils.clamp(233, -233, 2)).to.eql(2);
    });

});
