describe('JC.Container', function () {
    describe('parent', function () {
        it('should be present when adding childs to Container', function() {
            var container = new JC.Container(),
                child = new JC.Container();

            expect(container.childs.length).to.be.equals(0);
            container.adds(child);
            expect(container.childs.length).to.be.equals(1);
            expect(child.parent).to.be.equals(container);
        });
    });
});
