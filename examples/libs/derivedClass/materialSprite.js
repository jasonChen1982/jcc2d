function MaterialSprite(opts) {
    JC.Sprite.call(this,opts);
    this.putEars();
}
JC.MaterialSprite = MaterialSprite;
MaterialSprite.prototype = Object.create( JC.Sprite.prototype );
MaterialSprite.prototype.constructor = JC.MaterialSprite;
MaterialSprite.prototype.putEars = function() {
    var This = this;
    this.on('touchstart', function(ev) {
        ev.originalEvent.preventDefault();
        if (ev.touches.length > 1) {
            This.isTwo = true;
            This.startScale(ev);
            This.startRotate(ev);
        } else {
            This.isTwo = false;
            This.startPos(ev);
        }
    });
    this.on('touchmove', function(ev) {
        if (ev.touches.length > 1 && This.disMark !== 0) {
            This.isTwo = true;
            This.moveScale(ev);
            if (This.disMark > 60) This.moveRotate(ev);
        } else {
            if (This.isTwo) This.startPos(ev);
            This.isTwo = false;
            This.movePos(ev);
        }
    });
    this.on('touchend', function(ev) {
        if (This.isTwo) {
            This.endScale();
            This.endRotate();
        } else {
            This.endPos();
        }
    });
};
MaterialSprite.prototype.startPos = function(ev) {
    this.startPosX = ev.touches[0].global.x;
    this.startPosY = ev.touches[0].global.y;
    if(this.oldPosX===undefined||this.oldPosX===undefined){
        this.oldPosX = this.x;
        this.oldPosY = this.y;
    }
};
MaterialSprite.prototype.movePos = function(ev) {
    var intervalX = ev.touches[0].global.x - this.startPosX;
    var intervalY = ev.touches[0].global.y - this.startPosY;
    this.x = this.oldPosX + intervalX;
    this.y = this.oldPosY + intervalY;
};
MaterialSprite.prototype.endPos = function(ev) {
    this.oldPosX = this.x;
    this.oldPosY = this.y;
};
MaterialSprite.prototype.startScale = function(ev) {
    var x = ev.touches[0].global.x - ev.touches[1].global.x;
    var y = ev.touches[0].global.y - ev.touches[1].global.y;
    this.disMark = Math.sqrt(x * x + y * y);
    if(this.oldScale===undefined)this.oldScale = this.scaleX;
};
MaterialSprite.prototype.moveScale = function(ev) {
    var x = ev.touches[0].global.x - ev.touches[1].global.x;
    var y = ev.touches[0].global.y - ev.touches[1].global.y;
    var scale = Math.sqrt(x * x + y * y) / this.disMark;
    this.scaleX = this.scaleY = this.oldScale * scale;
};
MaterialSprite.prototype.endScale = function(ev) {
    this.oldScale = this.scaleX;
};
MaterialSprite.prototype.startRotate = function(ev) {
    var p1 = {},
        p2 = {};
    p1.x = ev.touches[0].global.x;
    p1.y = ev.touches[0].global.y;
    p2.x = ev.touches[1].global.x;
    p2.y = ev.touches[1].global.y;
    this.SV = {
        x: p1.x - p2.x,
        y: p1.y - p2.y
    };
    if(this.preDeg===undefined)this.preDeg = this.rotation;
};
MaterialSprite.prototype.moveRotate = function(ev) {
    var p1 = {},
        p2 = {};
    p1.x = ev.touches[0].global.x;
    p1.y = ev.touches[0].global.y;
    p2.x = ev.touches[1].global.x;
    p2.y = ev.touches[1].global.y;
    var INV = {
        x: p1.x - p2.x,
        y: p1.y - p2.y
    };
    var nor = this.SV.x * INV.y - INV.x * this.SV.y;
    var pi = nor > 0 ? 1 : -1;
    var tmp = (INV.x * this.SV.x + INV.y * this.SV.y) / (Math.sqrt(INV.x * INV.x + INV.y * INV.y) * Math.sqrt(this.SV.x * this.SV.x + this.SV.y * this.SV.y));

    var iNowDeg = pi * Math.acos(tmp) * 180/Math.PI;
    if(isNaN(iNowDeg))return;
    this.rotation = this.preDeg + iNowDeg;
};
MaterialSprite.prototype.endRotate = function(ev) {
    this.preDeg = this.rotation;
};