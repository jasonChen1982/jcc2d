import {FrameBuffer} from './FrameBuffer';
import {Container} from '../core/Container';
import {Matrix} from '../math/Matrix';
import {Utils} from '../utils/Utils';

/**
 *
 * @class
 * @memberof JC
 * @param {number} blurX x轴的模糊值
 * @param {number} blurY y轴的模糊值
 * @param {number} quality 模糊的质量，模糊计算会被递归多少次
 */
function FilterGroup() {
  Container.call(this);

  /**
   * 帧缓冲区
   * @property frameBuffer
   * @default FrameBuffer
   * @type FrameBuffer
   **/
  this.frameBuffer = new FrameBuffer();

  /**
   * 帧缓冲区
   * @property frameBuffer
   * @default []
   * @type {FrameBuffer}
   **/
  this.filters = [];

  /**
   * 下一帧的图像需要更新
   * @property needUpdateBuffer
   * @default false
   * @type Boolean
   **/
  this.needUpdateBuffer = true;

  /**
   * 每一帧渲染都重新绘制
   * @property autoUpdateBuffer
   * @default false
   * @type Boolean
   **/
  this.autoUpdateBuffer = false;

  /**
   * 时候给帧缓冲区加padding
   * @property padding
   * @default {x:0,y:0}
   * @type Object
   **/
  this.padding = {
    x: 0,
    y: 0,
  };
}

FilterGroup.prototype = Object.create( Container.prototype );

FilterGroup.prototype.updatePosture = function() {
  if (this.souldSort) this._sortList();
  this.updateTransform();

  if (this.needUpdateBuffer || this.autoUpdateBuffer) {
    this.cacheMatrix = this.worldTransform;
    this.worldTransform = __tmpMatrix.identity();
    this._upc();

    this.calculateBounds();
    this.__o = this.bounds.getRectangle();

    this.__o.px = this.padding.x;
    this.__o.py = this.padding.y;

    // 保证子级是以(0, 0)点写入帧缓冲区
    this.worldTransform.translate(
      -this.__o.x + this.__o.px,
      -this.__o.y + this.__o.py
    );
    this._upc();

    this.worldTransform = this.cacheMatrix;
  } else {
    this._upc();
  }
};

FilterGroup.prototype._upc = function() {
  let i = 0;
  const l = this.childs.length;
  while (i < l) {
    const child = this.childs[i];
    child.updatePosture();
    i++;
  }
};

FilterGroup.prototype.addFilter = function(filter, idx) {
  if (idx >= 0) {
    this.filters.splice(idx, 0, filter);
  } else if (Utils.isUndefined(idx)) {
    this.filters.push(filter);
  } else {
    console.warn('add filter error');
  }
};

FilterGroup.prototype.render = function(ctx) {
  ctx.save();
  if (this.needUpdateBuffer || this.autoUpdateBuffer) {
    let i = 0;
    const l = this.childs.length;
    let child = null;

    this.frameBuffer.clear();
    this.frameBuffer.setSize(this.__o);
    for (i = 0; i < l; i++) {
      child = this.childs[i];
      if (!child.isVisible()) continue;
      child.render(this.frameBuffer.ctx);
    }
    this.filtersRunner(this.frameBuffer.getBuffer());

    this.needUpdateBuffer = false;
  }
  this.renderMe(ctx);
  ctx.restore();
};

FilterGroup.prototype.renderMe = function(ctx) {
  const x = this.__o.x - this.__o.px;
  const y = this.__o.y - this.__o.py;
  const w = this.frameBuffer.width;
  const h = this.frameBuffer.height;
  this.setTransform(ctx);
  if (this.mask) this.mask.render(ctx);
  ctx.drawImage(this.frameBuffer.putBuffer(), 0, 0, w, h, x, y, w, h);
};

FilterGroup.prototype.filtersRunner = function(buffer) {
  if (this.filters.length === 0) return;
  this.filters.forEach(function(filter) {
    filter.applyFilter(buffer);
  });
};

const __tmpMatrix = new Matrix();

export {FilterGroup};
