describe('JC.Container', function () {
    describe('parent', function () {
        it('should be present when adding children to Container', function() {
            var container = new JC.Container(),
                child = new JC.DisplayObject();

            expect(container.children.length).to.be.equals(0);
            container.addChild(child);
            expect(container.children.length).to.be.equals(1);
            expect(child.parent).to.be.equals(container);
        });
    });
});
