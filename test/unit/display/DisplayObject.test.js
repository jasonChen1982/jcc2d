describe('JC.DisplayObject', function () {
    it('should be able to add itself to a Container', function() {
        var child = new JC.DisplayObject(),
            container = new JC.Container();

        expect(container.children.length).to.equal(0);
        child.setParent(container);
        expect(container.children.length).to.equal(1);
        expect(child.parent).to.equal(container);
    });
});
