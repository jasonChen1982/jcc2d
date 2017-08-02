var HEIGHT = window.innerHeight;
var WIDTH = window.innerWidth;
var COLORS = ['#FF324A', '#31FFA6', '#206EFF', '#FFFF99'];

var stage = new JC.Stage({
  dom: 'canvas-3d'
});
var DOC = new JC.Container();
var sphere = null;
resize();

function Rect(color, size) {
  this.size = size || 40;
  this.color = color || '#749d9b';
}
Rect.prototype.render = function (ctx) {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
  ctx.fill();
};

function Euler(x, y, z) {
  this.x = x || 0;
  this.y = y || 0;
  this.z = z || 0;
}
Euler.prototype.rotate = function () {
  var x = JC.Utils.DTR * this.x,
    y = JC.Utils.DTR * this.y,
    z = JC.Utils.DTR * this.z;
  var xc = Math.cos(x),
    xs = Math.sin(x);
  var yc = Math.cos(y),
    ys = Math.sin(y);
  var zc = Math.cos(z),
    zs = Math.sin(z);
  var m = [];

  m[0] = zc * yc - zs * xs * ys;
  m[4] = zs * yc + zc * xs * ys;
  m[8] = -xc * ys;

  m[1] = -zs * xc;
  m[5] = zc * xc;
  m[9] = xs;

  m[2] = zc * ys + zs * xs * yc;
  m[6] = zs * ys - zc * xs * yc;
  m[10] = xc * yc;

  m[3] = 0;
  m[7] = 0;
  m[11] = 0;

  // bottom row
  m[12] = 0;
  m[13] = 0;
  m[14] = 0;
  m[15] = 1;

  return m;
};

function Sphere(row, col, radius) {
  this.vertexs = [];
  this.row = row || 4;
  this.col = col || 8;
  this.radius = radius || 200;

  this.palstance = new Euler(0, 0);
}
Sphere.prototype.createVertex = function (parent, imgs) {
  this.parent = parent;
  var PI_2 = Math.PI * 2,
    degX,
    degY,
    sb = false;
  for (var i = 0; i <= this.row; i++) {
    sb = false;
    if (i === 0 || i === this.row) sb = true;
    degX = PI_2 / 2 * i / this.row;
    for (var j = 0; j < this.col; j++) {
      degY = PI_2 * j / this.col;
      var shape = new JC.Sprite({
        texture: loadBox.getById(JC.Utils.random(imgs))
      });
      shape.pivotX = shape.width >> 1;
      shape.pivotY = shape.height >> 1;

      shape.x = Math.sin(degX) * Math.sin(degY) * this.radius,
        shape.y = Math.cos(degX) * this.radius,
        shape.zIndex = Math.sin(degX) * Math.cos(degY) * this.radius;
      this.parent.adds(shape);
      if (sb) break;
    }
  }
};
Sphere.prototype.update = function () {
  var m = this.palstance.rotate();
  for (var i = 0, l = this.parent.childs.length; i < l; i++) {
    var shape = this.parent.childs[i],
      x = shape.x,
      y = shape.y,
      z = shape.zIndex;

    shape.zIndex = m[8] * x + m[9] * y + m[10] * z;
    shape.x = m[0] * x + m[1] * y + m[2] * z;
    shape.y = m[4] * x + m[5] * y + m[6] * z;
    var zz = (shape.zIndex + 220) / 320;
    shape.alpha = 0.8 * JC.Utils.clamp(zz + 0.4, 0, 1);
    shape.scale = JC.Utils.clamp(zz + 0.5, 0, 1.2);
  }
  this.parent.souldSort = true;
};

var loadBox = JC.loaderUtil({
  pic1: './images/pic1.jpg',
  pic2: './images/pic2.jpg',
  pic3: './images/pic3.jpg',
  pic4: './images/pic4.jpg',
  pic5: './images/pic5.jpg',
  pic6: './images/pic6.jpg',
  pic7: './images/pic7.jpg',
  pic8: './images/pic8.jpg',
  pic9: './images/pic9.jpg',
  pic10: './images/pic10.jpg',
  pic11: './images/pic11.jpg',
  pic12: './images/pic12.jpg'
});

loadBox.on('complete', function () {
  sphere = new Sphere();

  sphere.createVertex(DOC, ['pic1', 'pic2', 'pic3', 'pic4', 'pic5', 'pic6', 'pic7', 'pic8', 'pic9', 'pic10', 'pic11', 'pic12']);
  stage.adds(DOC);

  stage.startEngine();
});

stage.on('touchstart', function (ev) {
  if (sphere === null) return;
  var point = {};
  point.x = ev.global.x - WIDTH / 2;
  point.y = HEIGHT / 2 - ev.global.y;

  var r = Math.sqrt(point.x * point.x + point.y * point.y);

  sphere.palstance.x = point.y / r;
  sphere.palstance.y = point.x / r;

});

stage.on('mousemove', function (ev) {
  if (sphere === null) return;
  var point = {};
  point.x = ev.global.x - WIDTH / 2;
  point.y = HEIGHT / 2 - ev.global.y;

  var r = Math.sqrt(point.x * point.x + point.y * point.y);
  var s = r / Math.max(HEIGHT / 3, WIDTH / 3);
  if (r === 0) return;

  sphere.palstance.x = Math.sqrt(s) * point.y / r;
  sphere.palstance.y = Math.sqrt(s) * point.x / r;

});

/**
 * 帧率监控工具
 */
var stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.top = '0px';
document.body.appendChild(stats.domElement);
stage.on('postrender', function () {
  stats.update();
  sphere.update();
})

window.onresize = function () {
  resize();
};

function resize() {
  WIDTH = window.innerWidth;
  HEIGHT = window.innerHeight;
  DOC.x = WIDTH >> 1;
  DOC.y = HEIGHT >> 1;
  stage.resize(WIDTH, HEIGHT);
}
