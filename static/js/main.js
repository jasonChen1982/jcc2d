// JC.Tween.extend(tween);

window.onresize = function () {
  resize();
};

function NoiseLine(opts) {
  this.color = '#666666';
  this.width = 0.6;
  this.points = [];
  this.simplexNoise = opts.noise;
  this.channle = opts.channle;
  this.SEGMENT = 8;
  this.amplitude = Math.min(w, h) / 6;
  this.timeScale = JC.Utils.random(0.8, 1.4);
}
NoiseLine.prototype.update = function (snippet) {
  var SEGMENT = this.SEGMENT,
    half = SEGMENT >> 1;
  for (var i = 0; i <= SEGMENT; i++) {
    if (this.points[i] === undefined) this.points[i] = {};
    this.points[i].x = w * i / half - w >> 1;
    this.points[i].y = this.simplexNoise.noise(snippet * this.timeScale + i / SEGMENT, this.channle) * this.amplitude;
  }
};
NoiseLine.prototype.render = function (ctx) {
  var SEGMENT = this.SEGMENT;
  ctx.beginPath();
  ctx.lineWidth = this.width;
  ctx.strokeStyle = this.color;

  ctx.moveTo(this.points[0].x, this.points[0].y);
  for (var j = 1; j <= SEGMENT - 2; j++) {
    var xc = (this.points[j].x + this.points[j + 1].x) / 2;
    var yc = (this.points[j].y + this.points[j + 1].y) / 2;
    ctx.quadraticCurveTo(this.points[j].x, this.points[j].y, xc, yc);
  }
  ctx.quadraticCurveTo(this.points[j].x, this.points[j].y, this.points[j + 1].x, this.points[j + 1].y);

  ctx.stroke();
};

function WaveLines() {
  this.simplexNoise = new SimplexNoise();
  this.CURVE_COUNT = 3;
  this.speed = 0.2;
  this.time = Date.now();
  this.children = [];
  this.init();
}
WaveLines.prototype.init = function () {
  for (var i = 0; i < this.CURVE_COUNT; i++) {
    this.children[i] = new NoiseLine({
      noise: this.simplexNoise,
      channle: i / this.CURVE_COUNT
    });
  }
};
WaveLines.prototype.update = function () {
  var snippet = Date.now() - this.time;
  for (var i = 0; i < this.children.length; i++) {
    if (this.children[i]) this.children[i].update(snippet * this.speed / 1000);
  }
};
WaveLines.prototype.render = function (ctx) {
  this.update();
  for (var i = 0; i < this.children.length; i++) {
    if (this.children[i]) this.children[i].render(ctx);
  }
};


function RectBound() {
  this.width = 400;
}
RectBound.prototype.render = function (ctx) {
  var parentAlpha = ctx.globalAlpha;
  ctx.save();
  ctx.globalCompositeOperation = 'multiply';

  ctx.beginPath();
  ctx.fillStyle = '#d9182d';
  ctx.globalAlpha = 0.5 * parentAlpha;
  ctx.fillRect(280 - this.width, -h, this.width, h);

  ctx.beginPath();
  ctx.globalAlpha = 1 * parentAlpha;
  ctx.fillRect(330 - this.width, -h, this.width, h + 50);

  ctx.beginPath();
  ctx.fillStyle = '#00b2ef';
  ctx.globalAlpha = 0.5 * parentAlpha;
  ctx.fillRect(-this.width, -h, this.width, h * 2);

  ctx.beginPath();
  ctx.globalAlpha = 0.5 * parentAlpha;
  ctx.fillRect(180 - this.width, -h, this.width, h * 2);
  ctx.globalCompositeOperation = 'source-over';
  ctx.restore();

};


function LinkFace(options) {
  this.text = options.text;
  this.font = options.font;
  this.color = options.color;
  this.textColor = options.textColor;
  this.width = JC.UI.RTP(1);
  this.height = JC.UI.RTP(.3);
  this.halfW = this.width / 2;
  this.halfH = this.height / 2;

  this.bound = new JC.Rectangle(-this.halfW, -this.halfH, this.width, this.height);
}
LinkFace.prototype.render = function (ctx) {
  var parentAlpha = ctx.globalAlpha;
  ctx.beginPath();
  ctx.globalAlpha = parentAlpha * 0.6;
  ctx.strokeStyle = this.color;
  ctx.fillStyle = this.color;
  ctx.rect(-this.halfW, -this.halfH, this.width, this.height);
  ctx.stroke();
  ctx.fillRect(4 - this.halfW, 4 - this.halfH, this.width - 8, this.height - 8);


  ctx.globalAlpha = parentAlpha * 1;
  ctx.font = this.font;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = this.textColor;
  ctx.fillText(this.text, 0, 0);
};







var w = window.innerWidth,
  h = window.innerHeight,
  curvePath = new JC.Graphics(new WaveLines()),
  rectLeftBack = new JC.Graphics(new RectBound()),
  rectLeftFront = new JC.Graphics(new RectBound()),
  rectRightBack = new JC.Graphics(new RectBound()),
  rectRightFront = new JC.Graphics(new RectBound()),
  stage = new JC.Stage({
    dom: 'line-canvas',
    resolution: window.devicePixelRatio,
  }),
  BG = new JC.Container(),
  DOC = new JC.Container(),
  LOGO = new JC.Container(),
  BTNBOX = new JC.Container(),
  banner = new JC.Container(),
  bannerLeft = new JC.Container(),
  bannerRight = new JC.Container(),
  easeInOutStrong = JC.Tween.Ease.Beizer(.7, 0, .3, 1);
resize();
LOGO.x = DOC.x = w / 2;
DOC.y = h / 2;
LOGO.y = h * 0.38;
banner.y = h / 2;
bannerRight.x = w;
bannerRight.y = -0.25 * h;
bannerLeft.y = 0.25 * h;


rectLeftBack.alpha = 0;
rectLeftBack.animate({
  to: {
    alpha: 1
  },
  ease: easeInOutStrong,
  duration: 600,
  delay: 1800,
  infinite: true,
  alternate: true
});

rectLeftFront.animate({
  to: {
    y: -120
  },
  ease: easeInOutStrong,
  duration: 600,
  delay: 1800,
  infinite: true,
  alternate: true
});

rectLeftFront.skewX = rectLeftBack.skewX = 30;
bannerLeft.adds(rectLeftBack, rectLeftFront);
bannerLeft.animate({
  to: {
    x: -60
  },
  ease: JC.Tween.Ease.InOut,
  duration: 2000,
  infinite: true,
  alternate: true
});

rectRightBack.alpha = 0;
rectRightBack.animate({
  to: {
    alpha: 1
  },
  ease: easeInOutStrong,
  duration: 600,
  delay: 1800,
  infinite: true,
  alternate: true
});

rectRightFront.animate({
  to: {
    y: -120
  },
  ease: easeInOutStrong,
  duration: 600,
  delay: 1800,
  infinite: true,
  alternate: true
});

rectRightFront.skewX = rectRightBack.skewX = 30;
bannerRight.rotation = 180;
bannerRight.adds(rectRightBack, rectRightFront);
bannerRight.animate({
  to: {
    x: w + 60
  },
  ease: JC.Tween.Ease.InOut,
  duration: 2000,
  infinite: true,
  alternate: true
});


var particleEngine = new ParticleEngine(w, h);
var particleDOC = new JC.Container();
particleDOC.scale = 0.6;
particleDOC.alpha = 0;
var emiter = new Emitter({
  count: 15,
  type: ParticleCricle
});
particleEngine.addEmitter(emiter);
var emiter2 = new Emitter({
  count: 10,
  type: ParticleTriangle
});
particleEngine.addEmitter(emiter2);
var emiter3 = new Emitter({
  count: 5,
  type: ParticlePlus
});
particleEngine.addEmitter(emiter3);
particleDOC.adds(emiter.doc);
particleDOC.adds(emiter2.doc);
particleDOC.adds(emiter3.doc);
particleDOC.animate({
  to: {
    scale: 1,
    alpha: 1
  },
  duration: 1000,
  ease: JC.Tween.Back.Out,
  onCompelete: function () {
    shapeIn = true;
    if (fontLoaded && shapeIn) logoIn();
  }
});

var texts = [{
      text: 'j',
      x: -JC.UI.RTP(.64)
    },
    {
      text: 'c',
      x: -JC.UI.RTP(.5)
    },
    {
      text: 'c',
      x: -JC.UI.RTP(.3)
    },
    {
      text: '2',
      x: -JC.UI.RTP(.08)
    },
    {
      text: 'd',
      x: JC.UI.RTP(.14)
    },
    {
      text: '\.',
      x: JC.UI.RTP(.34)
    },
    {
      text: 'j',
      x: JC.UI.RTP(.54)
    },
    {
      text: 's',
      x: JC.UI.RTP(.74)
    }
  ],
  textDOC = [];
for (var i = 0; i < texts.length; i++) {
  textDOC[i] = new JC.TextFace(texts[i].text, {
    fontWeight: 'bold',
    fontSize: JC.UI.RTP(.7) + 'px',
    fontFamily: 'Tangerine',
  });
  textDOC[i].x = texts[i].x;
  textDOC[i].y = -h / 3;
  textDOC[i].alpha = 0;
  LOGO.adds(textDOC[i]);
}
var miniText = new JC.TextFace('The canvas 2d renderer & An awesome animator', {
  fontWeight: 'normal',
  fontSize: JC.UI.RTP(.2) + 'px',
  fontFamily: 'Tangerine',
});
miniText.y = JC.UI.RTP(.7);
miniText.alpha = 0;
LOGO.adds(miniText, BTNBOX);
var linkFace = new LinkFace({
  text: 'Document',
  font: 'bold ' + JC.UI.RTP(.16) + 'px Tangerine',
  color: '#eca31c',
  textColor: '#000000'
});
var documentLink = new JC.Graphics(linkFace);
documentLink.buttonMode = true;
documentLink.setArea(linkFace.bound);
documentLink.x = -JC.UI.RTP(1.2);
documentLink.alpha = 0;
documentLink.on('click', function () {
  window.location.href = './docs';
});

BTNBOX.adds(documentLink);


var linkFace2 = new LinkFace({
  text: 'Examples',
  font: 'bold ' + JC.UI.RTP(.16) + 'px Tangerine',
  color: '#53d497',
  textColor: '#000000'
});
var examplesLink = new JC.Graphics(linkFace2);
examplesLink.buttonMode = true;
examplesLink.setArea(linkFace2.bound);
examplesLink.x = JC.UI.RTP(1.2);
examplesLink.alpha = 0;
examplesLink.on('click', function () {
  window.location.href = './examples';
});

BTNBOX.adds(examplesLink);
BTNBOX.y = JC.UI.RTP(.84);

DOC.adds(particleDOC, curvePath);
banner.adds(bannerLeft, bannerRight);
BG.adds(DOC, banner);
stage.adds(BG, LOGO);

stage.on('postrender', function () {
  particleEngine.update();
});
stage.startEngine();

function logoIn() {
  for (var i = 0; i < textDOC.length; i++) {
    var animate = textDOC[i].animate({
      to: {
        y: 0,
        alpha: 1
      },
      ease: JC.Tween.Bounce.Out,
      duration: 800,
      wait: i * 100
    });
    if (i === textDOC.length - 1) animate.on('compelete', function () {
      miniText.animate({
        to: {
          y: JC.UI.RTP(.5),
          alpha: 1
        },
        duration: 1000
      });
      documentLink.animate({
        to: {
          x: -JC.UI.RTP(.7),
          alpha: 1
        },
        duration: 1000
      });
      examplesLink.animate({
        to: {
          x: JC.UI.RTP(.7),
          alpha: 1
        },
        duration: 1000
      });
      // BG.animate({
      //     to: {alpha: 0.5},
      //     duration: 1000
      // });
    });
  }
}

function resize() {
  w = window.innerWidth;
  h = window.innerHeight;
  bannerLeft.scale = bannerRight.scale = Math.sqrt(Math.min(1, w / 1280), 0.5);
  stage.resize(w, h);
}


var fontLoaded = false;
var shapeIn = false;
WebFontConfig = {
  custom: {
    families: ['Tangerine'],
    urls: ['./static/css/tangerine.css']
  },
  active: function () {
    fontLoaded = true;
    if (fontLoaded && shapeIn) logoIn();
  },
  fontinactive: function () {
    fontLoaded = true;
    if (fontLoaded && shapeIn) logoIn();
  }
};
(function () {
  var wf = document.createElement('script');
  wf.src = './static/js/webfont.js';
  wf.type = 'text/javascript';
  wf.async = 'true';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(wf, s);
})();
