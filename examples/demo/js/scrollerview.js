const {
  Bounds,
  Sprite,
  Container,
  Rectangle,
} = JC;


class Point2D {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  set(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }

  copy(point) {
    this.x = point.x;
    this.y = point.y;
    return this;
  }

  multiplyScalar(scalar) {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  length() {
    const x = this.x;
    const y = this.y;
    return Math.sqrt(x * x + y * y);
  }
}

function getLength(points) {
  const dx = points[0].x - points[1].x;
  const dx2 = dx * dx;
  const dy = points[0].y - points[1].y;
  const dy2 = dy * dy;
  return Math.sqrt(dx2 + dy2);
}

function getDistance(begin, end) {
  const x = end.x - begin.x;
  const y = end.y - begin.y;
  return new Point2D(x, y);
}

function getSpeed(begin, end, time = 16.6, scale = 16.6) {
  const distance = getDistance(begin, end);
  distance.multiplyScalar(scale / time);
  const length = distance.length();
  if (length > 100) {
    distance.multiplyScalar(100 / length);
  }
  return distance;
}

function getCenterPoint(points) {
  const x = (points[0].x + points[1].x) / 2;
  const y = (points[0].y + points[1].y) / 2;
  return new Point2D(x, y);
}

class ScrollMaterial extends Container {
  constructor() {
    super();
    this._viewport = new Rectangle();
    this.material = new Sprite();
    this.adds(this.material);
  }

  get viewport() {
    const { x, y } = this.applyOnMaterial(new Point2D());
    const end = this.applyOnMaterial(new Point2D(this.material.width, this.material.height));

    this._viewport.x = x;
    this._viewport.y = y;
    this._viewport.width = end.x - x;
    this._viewport.height = end.y - y;
    return this._viewport;
  }

  applyOnMaterial(point, outPoint = {}) {
    return this.material.worldTransform.apply(point, outPoint);
  }

  applyInverseOnMaterial(point, outPoint = {}) {
    return this.material.worldTransform.applyInverse(point, outPoint);
  }

  updateTexture(texture) {
    this.material.upTexture(texture);
    this.material.x = -texture.width / 2;
    this.material.y = -texture.height / 2;
  }
}

const FillMode = {
  contain: 'contain',
  cover: 'cover',
  withwidth: 'withwidth',
  withheight: 'withheight',
};

class ScrollerView extends Container {
  constructor({ width, height, cssRatio, padding, fillMode = FillMode.contain, control = {} }) {
    super();
    this.width = width;
    this.height = height;
    this.cssRatio = cssRatio;
    this.padding = padding;
    this.fillMode = fillMode;
    this.control = control;
    this._disableAll = false;
    this._disableMove = false;
    this._disableScale = false;
    this._viewport = new Rectangle();

    this.globalAnimate = null;

    this.scrollMaterial = new ScrollMaterial();
    this.adds(this.scrollMaterial);

    this._materialBoundsOnScreen = new Bounds();
    this._leftTop = new Point2D();
    this._imageSize = new Point2D();
    this._cachePoint = new Point2D();

    this.setArea(new Rectangle(0, 0, width, height));

    this.flingStatus = { x: false, y: false };
    this.springStatus = { x: false, y: false };
    this.baseScaleLength = 0;
    // 防止touchmove事件重复触发
    this.fixBugNowTime = 0;
    this.maxScaleOnThisMaterial = 1;
    // this.maxScaleOnThisTime = 1;
    this.speed = new Point2D();
    this.previousPositionPoint = new Point2D();
    this.previousSpeedPoint = new Point2D();
    this.speedCache = new Point2D();

    this.on('touchstart', this.resolveStart);
    this.on('touchmove', this.resolveMove);
    this.on('touchend', this.resolveEnd);
    this.on('touchcancle', this.resolveEnd);

    this.on('pretimeline', this.progressFlingAndSpring);
  }

  get viewport() {
    const paddingTop = this.padding[0] || 0;
    const paddingRight = this.padding[1] || 0;
    const paddingBottom = this.padding[2] || 0;
    const paddingLeft = this.padding[3] || 0;

    this._viewport.x = this.padding[3];
    this._viewport.y = paddingTop;
    this._viewport.width = this.width - paddingLeft - paddingRight;
    this._viewport.height = this.height - paddingTop - paddingBottom;
    return this._viewport;
  }

  get materialBoundsOnScreen() {
    this.scrollMaterial.applyOnMaterial(this._leftTop, this._cachePoint);
    this._materialBoundsOnScreen.minX = this._cachePoint.x;
    this._materialBoundsOnScreen.minY = this._cachePoint.y;

    this.scrollMaterial.applyOnMaterial(this._imageSize, this._cachePoint);
    this._materialBoundsOnScreen.maxX = this._cachePoint.x;
    this._materialBoundsOnScreen.maxY = this._cachePoint.y;
    return this._materialBoundsOnScreen;
  }

  get overflowInfo() {
    const materialViewport = this.scrollMaterial.viewport;
    const viewport = this.viewport;

    const overflowX = materialViewport.width > viewport.width + 2;
    const overflowY = materialViewport.height > viewport.height + 2;

    const offsetX = materialViewport.x - viewport.x;
    const offsetY = materialViewport.y - viewport.y;

    const scrollWidth = materialViewport.width - viewport.width;
    const scrollHeight = Math.max(materialViewport.height - viewport.height, 0);

    const forceFieldSize = Math.min(viewport.width, viewport.height) * 0.45;

    return { overflowX, overflowY, offsetX, offsetY, scrollWidth, scrollHeight, forceFieldSize };
  }

  cancelFling() {
    this.isFling = false;
    this.isSpring = false;
    this.speed.multiplyScalar(0);
    this.speedCache.multiplyScalar(0);
  }

  getTouchesCopy({ originalEvent, resolution }) {
    const touches = [];
    for (let i = 0; i < originalEvent.touches.length; i++) {
      const touch = originalEvent.touches[i];
      touches[i] = new Point2D(touch.pageX * resolution.x, touch.pageY * resolution.y);
    }
    return touches;
  }

  physicsSimulation(speed, overflow, offset, scrollSize, forceFieldSize) {
    let forceMoment = 0;
    if (overflow) {
      const over = offset > 0;
      const lower = offset < -scrollSize;
      if (over) {
        forceMoment = offset;
      }
      if (lower) {
        forceMoment = offset + scrollSize;
      }
    } else {
      const centreOfGravity = Math.abs(scrollSize) / 2;
      forceMoment = offset - centreOfGravity;
    }

    forceMoment = Math.min(forceFieldSize, Math.max(forceMoment, -forceFieldSize));

    const force = 1 - Math.abs(forceMoment / forceFieldSize);
    speed *= force * force * force * 0.8;
    return speed;
  }

  flingAndSpringSimulation(speed, speedCache, flingStatus, springStatus, { overflow, offset, scrollSize, forceFieldSize }) {
    if (flingStatus && (Math.abs(speedCache) < 1 || Math.sign(speed) !== Math.sign(speedCache))) {
      flingStatus = false;
      springStatus = true;
      console.log('to spring');
    }

    const mass = 0.88;
    speed *= mass;

    let value = 0;
    let forceMoment = 0;
    if (overflow) {
      const over = offset > 0;
      const lower = offset < -scrollSize;
      if (over) {
        forceMoment = offset;
      }
      if (lower) {
        forceMoment = offset + scrollSize;
      }
    } else {
      const centreOfGravity = Math.abs(scrollSize) / 2;
      forceMoment = offset - centreOfGravity;
    }

    console.log(forceMoment, speedCache);
    if (springStatus) {
      if (Math.abs(forceMoment) > 1) {
        value = - 0.2 * forceMoment;
      } else {
        value = -forceMoment;
        springStatus = false;
        console.log('spring end');
      }
      speed = 0;
    } else {
      speed -= 0.1 * forceMoment;
      value = speed;
    }
    return { speed, value, flingStatus, springStatus };
  }

  progressFlingAndSpring = () => {
    if (
      !this.flingStatus.x &&
      !this.flingStatus.y &&
      !this.springStatus.x &&
      !this.springStatus.y
    ) return;
    const { overflowX, overflowY, offsetX, offsetY, scrollWidth, scrollHeight, forceFieldSize } = this.overflowInfo;

    if (this.flingStatus.x || this.springStatus.x) {
      const flingAndSpringResult = this.flingAndSpringSimulation(
        this.speed.x,
        this.speedCache.x,
        this.flingStatus.x,
        this.springStatus.x,
        { overflow: overflowX, offset: offsetX, scrollSize: scrollWidth, forceFieldSize: forceFieldSize },
      );
      this.flingStatus.x = flingAndSpringResult.flingStatus;
      this.springStatus.x = flingAndSpringResult.springStatus;
      this.speed.x = flingAndSpringResult.speed;
      this.scrollMaterial.x += flingAndSpringResult.value;
      console.log('x');
    }

    // if (this.flingStatus.y || this.springStatus.y) {
    //   const flingAndSpringResult = this.flingAndSpringSimulation(
    //     this.speed.y,
    //     this.speedCache.y,
    //     this.flingStatus.y,
    //     this.springStatus.y,
    //     { overflow: overflowY, offset: offsetY, scrollSize: scrollHeight, forceFieldSize: forceFieldSize },
    //   );
    //   this.flingStatus.y = flingAndSpringResult.flingStatus;
    //   this.springStatus.y = flingAndSpringResult.springStatus;
    //   this.speed.y = flingAndSpringResult.speed;
    //   this.scrollMaterial.y += flingAndSpringResult.value;
    //   console.log('x');
    // }
  }

  resolveStart = ev => {
    this._disableAll = this.control.disable;
    this._disableMove = this.control.disableMove;
    this._disableScale = this.control.disableScale;
    if (this._disableAll) return;

    if (this.globalAnimate) this.globalAnimate.cancle();

    const touches = this.getTouchesCopy(ev.data);
    const length = touches.length;
    if (length > 0 && length <= 2) {
      this._pt = Date.now();
      this.cancelFling();
      if (!this._disableMove && length === 1) {
        this.previousPositionPoint.copy(touches[0]);
      }
      if (!this._disableScale && length === 2) {
        const startCenter = getCenterPoint(touches);
        this.previousPositionPoint.copy(startCenter);
        this.baseScaleLength = Math.max(getLength(touches), 10);
        // this.scaleCache = this.scrollMaterial.material.scale;
        // this.maxScaleOnThisTime = this.getMaxScaleOnThisTime();
        const origin = this.scrollMaterial.applyInverseOnMaterial(startCenter, {});
        this.scrollMaterial.material.originX = origin.x;
        this.scrollMaterial.material.originY = origin.y;
      }
      this.previousSpeedPoint.copy(this.scrollMaterial);
    }
  }

  resolveMove = ev => {
    if (this._disableAll) return;
    ev.data.originalEvent.preventDefault();
    if (this.fixBugNowTime === ev.timeId) return;
    this.fixBugNowTime = ev.timeId;
    const touches = this.getTouchesCopy(ev.data);
    const length = touches.length;

    const { overflowX, overflowY, offsetX, offsetY, scrollWidth, scrollHeight, forceFieldSize } = this.overflowInfo;
    if (!this._disableMove && length === 1) {
      const currentPositionPoint = touches[0];
      const distance = getDistance(this.previousPositionPoint, currentPositionPoint);
      this.scrollMaterial.x += this.physicsSimulation(distance.x, overflowX, offsetX, scrollWidth, forceFieldSize);
      this.scrollMaterial.y += this.physicsSimulation(distance.y, overflowY, offsetY, scrollHeight, forceFieldSize);

      this.previousPositionPoint.copy(currentPositionPoint);

      const now = Date.now();
      const time = now - this._pt;
      this._pt = now;
      const speed = getSpeed(this.previousSpeedPoint, this.scrollMaterial, time);
      this.speedCache.copy(speed);
      this.previousSpeedPoint.copy(this.scrollMaterial);
      this.emit('scrollchange');
    } else if (!this._disableScale && length === 2) {
      const currentScaleLength = Math.max(getLength(touches), 10);
      const scale = currentScaleLength / this.baseScaleLength;
      const totalScale = this.scrollMaterial.scale * scale;
      if (totalScale >= this.maxScaleOnThisMaterial) {
        this.scrollMaterial.material.scale = this.maxScaleOnThisMaterial / this.scrollMaterial.scale;
      } else {
        this.scrollMaterial.material.scale = scale;
      }

      const currentPositionPoint = getCenterPoint(touches);
      const distance = getDistance(this.previousPositionPoint, currentPositionPoint);
      this.scrollMaterial.x += this.physicsSimulation(distance.x, overflowX, offsetX, scrollWidth, forceFieldSize);
      this.scrollMaterial.y += this.physicsSimulation(distance.y, overflowY, offsetY, scrollHeight, forceFieldSize);
      this.previousPositionPoint.copy(currentPositionPoint);

      const now = Date.now();
      const time = now - this._pt;
      this._pt = now;
      const speed = getSpeed(this.previousSpeedPoint, this.scrollMaterial, time);
      this.speedCache.copy(speed);
      this.previousSpeedPoint.copy(this.scrollMaterial);
      this.emit('scrollchange');
    }
  }

  resolveEnd = () => {
    if (this._disableAll) return;
    const targetPoint = this.scrollMaterial.applyOnMaterial({ x: 0, y: 0 });
    this.scrollMaterial.scale *= this.scrollMaterial.material.scale;
    this.scrollMaterial.material.scale = 1;
    this.updatePosture();
    const nowPoint = this.scrollMaterial.applyOnMaterial({ x: 0, y: 0 });
    this.scrollMaterial.x += targetPoint.x - nowPoint.x;
    this.scrollMaterial.y += targetPoint.y - nowPoint.y;
    this.updatePosture();

    const { overflowX, overflowY } = this.overflowInfo;

    if (overflowX || overflowY) {
      this.flingStatus.x = true;
      this.flingStatus.y = true;
      this.speed.copy(this.speedCache);
    } else {
      this.autoFitViewport();
    }
    console.log('resolveEnd', overflowX, overflowY);
  }

  transition({ from, to, duration = 200 }) {
    this.globalAnimate = this.scrollMaterial.animate({
      from,
      to,
      duration,
    }, true);
    return this.globalAnimate;
  }

  offsetInScroll(x = 0, y = 0) {
    const { overflowX, overflowY, offsetX, offsetY, scrollWidth, scrollHeight } = this.overflowInfo;
    let tx = this.scrollMaterial.x;
    let ty = this.scrollMaterial.y;
    if (overflowX) {
      tx -= Math.min(scrollWidth + offsetX, x);
    }
    if (overflowY) {
      ty -= Math.min(scrollHeight + offsetY, y);
    }
    this.scrollMaterial.x = tx;
    this.scrollMaterial.y = ty;
    this.updatePosture();
  }

  getScrollDPR() {
    const begin = this.getLocalPointFromTailor(0, 0);
    const end = this.getLocalPointFromTailor(1, 0);
    const x = end.x - begin.x;
    const y = end.y - begin.y;
    const dpr = Math.sqrt(x * x + y * y);
    return dpr;
  }

  autoFitViewport() {
    const material = this.scrollMaterial.material;
    const viewport = this.viewport;
    const ratioWidth = viewport.width / material.width;
    const ratioHeight = viewport.height / material.height;
    const minRatio = Math.min(ratioWidth, ratioHeight);
    const x = viewport.x + viewport.width / 2;
    const y = viewport.y + viewport.height / 2;
    const scale = minRatio;
    const to = { x, y, scale };
    return this.transition({ to });
  }

  setMaterial(sessionImage) {
    const texture = sessionImage.texture;
    const { width, height } = texture;
    this._imageSize.set(width, height);
    this.scrollMaterial.updateTexture({ texture, width, height });
    this.maxScaleOnThisMaterial = 1.2 * width / this.width;
    this.autoContain();
    this.updatePosture();
  }

  autoContain() {
    const { x, y } = this._imageSize;
    if (this.fillMode === FillMode.contain) {
      this.fillWithContain(x, y);
    } else if (this.fillMode === FillMode.cover) {
      this.fillWithCover(x, y);
    } else if (this.fillMode === FillMode.withwidth) {
      this.fillWithWidth(x, y);
    } else if (this.fillMode === FillMode.withheight) {
      this.fillWithHeight(x, y);
    }
  }

  fillWithContain(imageWidth, imageHeight) {
    const { x, y, width, height } = this.viewport;
    const ratioWidth = width / imageWidth;
    const ratioHeight = height / imageHeight;
    const minRatio = Math.min(ratioWidth, ratioHeight);
    this.scrollMaterial.x = x + width / 2;
    this.scrollMaterial.y = y + height / 2;
    this.scrollMaterial.scale = minRatio;
  }

  fillWithCover(imageWidth, imageHeight) {
    const { x, y, width, height } = this.viewport;
    const ratioWidth = width / imageWidth;
    const ratioHeight = height / imageHeight;
    const maxRatio = Math.max(ratioWidth, ratioHeight);
    this.scrollMaterial.x = x + width / 2;
    this.scrollMaterial.y = y + height / 2;
    this.scrollMaterial.scale = maxRatio;
  }

  fillWithWidth(imageWidth) {
    const { x, y, width, height } = this.viewport;
    const scale = width / imageWidth;
    this.scrollMaterial.scale = scale;
    this.scrollMaterial.x = x + width / 2;
    this.scrollMaterial.y = y + height / 2;
    this.updatePosture();
    const { offsetY, overflowY } = this.overflowInfo;
    if (overflowY) this.scrollMaterial.y -= offsetY;
  }

  fillWithHeight(_, imageHeight) {
    const { x, y, width, height } = this.viewport;
    const scale = height / imageHeight;
    this.scrollMaterial.scale = scale;
    this.scrollMaterial.x = x + width / 2;
    this.scrollMaterial.y = y + height / 2;
    this.updatePosture();
    const { offsetX, overflowX } = this.overflowInfo;
    if (overflowX) this.scrollMaterial.x -= offsetX;
  }

  addContent(child) {
    this.scrollMaterial.material.adds(child);
  }

  removeContent(child) {
    this.scrollMaterial.material.remove(child);
  }

  getLocalPointFromTailor(x, y) {
    return this.scrollMaterial.applyInverseOnMaterial({ x, y }, {});
  }

  getGlobalPointFromMaterial(x, y) {
    return this.scrollMaterial.applyOnMaterial({ x, y }, {});
  }
}
