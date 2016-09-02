describe('JC.DisplayObject', function () {
    it('set scale can sync scaleX and scaleY', function() {
        var displayObject = new JC.DisplayObject();

        displayObject.scale = 2;
        expect(displayObject.scaleX).to.be.equals(2);
        expect(displayObject.scaleY).to.be.equals(3);
    });
});
