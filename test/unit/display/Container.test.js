describe('JC.Container', function () {
    describe('parent', function () {
        it('should be present when adding cds to Container', function() {
            var container = new JC.Container(),
                child = new JC.DisplayObject();

            expect(container.cds.length).to.be.equals(0);
            container.addChilds(child);
            expect(container.cds.length).to.be.equals(1);
            expect(child.parent).to.be.equals(container);
        });
    });
});
