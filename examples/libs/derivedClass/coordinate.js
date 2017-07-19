function Coordinate(options) {
  options = options || {};
  this.segment = options.segment || 10;
  this.size = options.size || 400;
  this.jutting = options.jutting || 50;
  this.gridColor = options.gridColor || '#444a61';
  this.axisColor = options.axisColor || '#646794';
}

Coordinate.prototype.render = function(ctx) {
  this._renderGrid(ctx);
  this._renderAxis(ctx);
};

Coordinate.prototype._renderAxis = function(ctx) {
  var s = this.jutting;
  var l = this.size;
  var e = s + l;
  var ax = 6;
  var ay = 12;

  ctx.beginPath();
  ctx.moveTo(0, s);
  ctx.lineTo(0, -e);
  ctx.moveTo(-ax, -e + ay);
  ctx.lineTo(0, -e);
  ctx.lineTo(ax, -e + ay);

  ctx.moveTo(-s, 0);
  ctx.lineTo(e, 0);
  ctx.moveTo(e - ay, ax);
  ctx.lineTo(e, 0);
  ctx.lineTo(e - ay, -ax);

  ctx.strokeStyle = this.axisColor;
  ctx.lineWidth = 4;
  ctx.stroke();
};

Coordinate.prototype._renderGrid = function(ctx) {
  var size = this.size;
  var seg = this.segment;

  ctx.beginPath();
  ctx.lineWidth = 1;
  for (var i = 1; i <= this.segment; i++) {
    var step = i * size / seg;
    ctx.moveTo(step, 0);
    ctx.lineTo(step, -size);
    ctx.moveTo(0, -step);
    ctx.lineTo(size, -step);
  }
  ctx.strokeStyle = this.gridColor;
  ctx.stroke();
};
