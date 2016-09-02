describe('JC.Sprite', function () {
    describe('playMovie', function () {
        it('playMovie is return correct value', function () {
            var img = new Image();
                img.width = 100;
                img.height = 100;
            var sprite = new JC.Sprite({
                    texture: img,
                    width: 10,
                    height: 10,
                    animations: {
                        fall: {start: 0,end: 4,next: 'stand'},
                        fly: {start: 5,end: 6,next: 'stand'},
                        stand: {start: 7,end: 8},
                        walk: {start: 9,end: 10,next: 'stand'}
                    }
                });
            sprite.playMovie({
                movie: 'stand'
            });
            expect(sprite.MovieClip.frames[0]).to.be.at.least(7);
            expect(sprite.MovieClip.frames[1]).to.be.at.least(8);
        });
    });
});
