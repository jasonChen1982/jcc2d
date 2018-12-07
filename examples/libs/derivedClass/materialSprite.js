function MaterialSprite(opts) {
  JC.Sprite.call(this, opts);
  this.putEars();
}
JC.MaterialSprite = MaterialSprite;
MaterialSprite.prototype = Object.create(JC.Sprite.prototype);
MaterialSprite.prototype.constructor = JC.MaterialSprite;
MaterialSprite.prototype.putEars = function () {
  var This = this;
  this.on('touchstart', function (ev) {
    var originalEvent = ev.data.originalEvent;
    originalEvent.preventDefault();
    if (originalEvent.touches.length > 1) {
      This.isTwo = true;
      This.startScale(originalEvent);
      This.startRotate(originalEvent);
    } else {
      This.isTwo = false;
      This.startPos(originalEvent);
    }
  });
  this.on('touchmove', function (ev) {
    var originalEvent = ev.data.originalEvent;
    if (originalEvent.touches.length > 1 && This.disMark !== 0) {
      This.isTwo = true;
      This.moveScale(originalEvent);
      if (This.disMark > 60) This.moveRotate(originalEvent);
    } else {
      if (This.isTwo) This.startPos(originalEvent);
      This.isTwo = false;
      This.movePos(originalEvent);
    }
  });
  this.on('touchend', function (ev) {
    if (This.isTwo) {
      This.endScale();
      This.endRotate();
    } else {
      This.endPos();
    }
  });
};
MaterialSprite.prototype.startPos = function (ev) {
  this.startPosX = ev.touches[0].clientX;
  this.startPosY = ev.touches[0].clientY;
  if (this.oldPosX === undefined || this.oldPosX === undefined) {
    this.oldPosX = this.x;
    this.oldPosY = this.y;
  }
};
MaterialSprite.prototype.movePos = function (ev) {
  var intervalX = ev.touches[0].clientX - this.startPosX;
  var intervalY = ev.touches[0].clientY - this.startPosY;
  this.x = this.oldPosX + intervalX;
  this.y = this.oldPosY + intervalY;
};
MaterialSprite.prototype.endPos = function (ev) {
  this.oldPosX = this.x;
  this.oldPosY = this.y;
};
MaterialSprite.prototype.startScale = function (ev) {
  var x = ev.touches[0].clientX - ev.touches[1].clientX;
  var y = ev.touches[0].clientY - ev.touches[1].clientY;
  this.disMark = Math.sqrt(x * x + y * y);
  if (this.oldScale === undefined) this.oldScale = this.scaleX;
};
MaterialSprite.prototype.moveScale = function (ev) {
  var x = ev.touches[0].clientX - ev.touches[1].clientX;
  var y = ev.touches[0].clientY - ev.touches[1].clientY;
  var scale = Math.sqrt(x * x + y * y) / this.disMark;
  this.scaleX = this.scaleY = this.oldScale * scale;
};
MaterialSprite.prototype.endScale = function (ev) {
  this.oldScale = this.scaleX;
};
MaterialSprite.prototype.startRotate = function (ev) {
  var p1 = {},
    p2 = {};
  p1.x = ev.touches[0].clientX;
  p1.y = ev.touches[0].clientY;
  p2.x = ev.touches[1].clientX;
  p2.y = ev.touches[1].clientY;
  this.SV = {
    x: p1.x - p2.x,
    y: p1.y - p2.y
  };
  if (this.preDeg === undefined) this.preDeg = this.rotation;
};
MaterialSprite.prototype.moveRotate = function (ev) {
  var p1 = {},
    p2 = {};
  p1.x = ev.touches[0].clientX;
  p1.y = ev.touches[0].clientY;
  p2.x = ev.touches[1].clientX;
  p2.y = ev.touches[1].clientY;
  var INV = {
    x: p1.x - p2.x,
    y: p1.y - p2.y
  };
  var nor = this.SV.x * INV.y - INV.x * this.SV.y;
  var pi = nor > 0 ? 1 : -1;
  var tmp = (INV.x * this.SV.x + INV.y * this.SV.y) / (Math.sqrt(INV.x * INV.x + INV.y * INV.y) * Math.sqrt(this.SV.x * this.SV.x + this.SV.y * this.SV.y));

  var iNowDeg = pi * Math.acos(tmp);
  if (isNaN(iNowDeg)) return;
  this.rotation = this.preDeg + iNowDeg;
};
MaterialSprite.prototype.endRotate = function (ev) {
  this.preDeg = this.rotation;
};
