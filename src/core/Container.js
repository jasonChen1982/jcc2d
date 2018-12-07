
/* eslint prefer-rest-params: 0 */

import {DisplayObject} from './DisplayObject';
import {Bounds} from '../math/Bounds';

/**
 * 显示对象容器，继承至DisplayObject
 *
 * ```js
 * var container = new JC.Container();
 * container.adds(sprite);
 * ```
 *
 * @class
 * @memberof JC
 * @extends JC.DisplayObject
 */
function Container() {
  DisplayObject.call(this);

  /**
   * 渲染对象的列表
   *
   * @member {Array}
   */
  this.childs = [];

  /**
   * 自身及后代动画的缩放比例
   *
   * @member {Number}
   */
  this.timeScale = 1;

  /**
   * 是否暂停自身的动画
   *
   * @member {Boolean}
   */
  this.paused = false;

  /**
   * 当前对象的z-index层级，z-index的值只会影响该对象在其所在的渲染列表内产生影响
   *
   * @private
   * @member {Number}
   */
  this._zIndex = 0;

  /**
   * 强制该对象在渲染子集之前为他们排序
   *
   * @member {Boolean}
   */
  this.souldSort = false;

  /**
   * 显示对象的包围盒
   *
   * @member {JC.Bounds}
   */
  this.bounds = new Bounds();

  /**
   * 显示对象内部表示的边界
   *
   * @private
   * @member {JC.Bounds}
   */
  this._bounds = new Bounds();

  this.vertexData = new Float32Array(8);
}
Container.prototype = Object.create(DisplayObject.prototype);

/**
 * 当前对象的z-index层级，z-index的值只会影响该对象在其所在的渲染列表内产生影响
 *
 * @name zIndex
 * @member {Number}
 * @memberof JC.Container#
 */
Object.defineProperty(Container.prototype, 'zIndex', {
  get: function() {
    return this._zIndex;
  },
  set: function(zIndex) {
    if (this._zIndex !== zIndex) {
      this._zIndex = zIndex;
      if (this.parent) {
        this.parent.souldSort = true;
      }
    }
  },
});

/**
 * 对自身子集进行zIndex排序
 *
 * @private
 * @method _sortList
 */
Container.prototype._sortList = function() {
  /**
   * 因为数组sort排序的不稳定性，顾采用冒泡排序方式
   */
  const childs = this.childs;
  const length = childs.length;
  let i;
  let j;
  let temp;
  for (i = 0; i < length - 1; i++) {
    for (j = 0; j < length - 1 - i; j++) {
      if (childs[j].zIndex > childs[j + 1].zIndex) {
        temp = childs[j];
        childs[j] = childs[j + 1];
        childs[j + 1] = temp;
      }
    }
  }
  this.souldSort = false;
};

/**
 * 更新bodymovin动画
 * @param {number} progress progress
 * @param {object} session
 */
Container.prototype.updateMovin = function(progress, session) {
  const length = this.childs.length;
  for (let i = 0; i < length; i++) {
    const doc = this.childs[i];
    if (doc && !doc._aniRoot && doc.updateMovin) {
      doc.updateMovin(progress, session);
    }
  }
  this.updateKeyframes && this.updateKeyframes(progress, session);
};

/**
 * 向容器添加一个物体
 *
 * ```js
 * container.adds(sprite,sprite2,text3,graphice);
 * ```
 *
 * @param {JC.Container} object
 * @return {JC.Container}
 */
Container.prototype.adds = function(object) {
  if (arguments.length > 1) {
    for (let i = 0; i < arguments.length; i++) {
      this.adds(arguments[i]);
    }
    return this;
  }
  if (object === this) {
    console.error('adds: object can\'t be added as a child of itself.', object);
  }
  if ((object)) {
    if (object.parent !== null) {
      object.parent.remove(object);
    }
    object.parent = this;
    this.childs.push(object);
    this.souldSort = true;
  } else {
    console.error('adds: object not an instance of Container', object);
  }
  return this;
};

/**
 * 从容器移除一个物体
 *
 * ```js
 * container.remove(sprite,sprite2,text3,graphice);
 * ```
 *
 * @param {JC.Container} object
 */
Container.prototype.remove = function(object) {
  if (arguments.length > 1) {
    for (let i = 0; i < arguments.length; i++) {
      this.remove(arguments[i]);
    }
  }
  const index = this.childs.indexOf(object);
  if (index !== -1) {
    object.parent = null;
    this.childs.splice(index, 1);
  }
};

/**
 * 更新自身的透明度可矩阵姿态更新，并触发后代同步更新
 *
 * @private
 * @param {Number} snippet
 */
Container.prototype.updateTimeline = function(snippet) {
  this.emit('pretimeline', snippet);
  if (this.paused) return;
  snippet = this.timeScale * snippet;
  this.updateAnimation(snippet);

  let i = 0;
  const l = this.childs.length;
  while (i < l) {
    const child = this.childs[i];
    child.updateTimeline(snippet);
    i++;
  }
  this.emit('posttimeline', snippet);
};

/**
 * 更新自身的透明度可矩阵姿态更新，并触发后代同步更新
 *
 * @private
 */
Container.prototype.updatePosture = function() {
  this.emit('preposture');
  if (this.souldSort) this._sortList();
  this.updateTransform();

  let i = 0;
  const l = this.childs.length;
  while (i < l) {
    const child = this.childs[i];
    child.updatePosture();
    i++;
  }
  this.emit('postposture');
};

/**
 * 渲染自己并触发后代渲染
 * @param {context} ctx
 * @private
 */
Container.prototype.render = function(ctx) {
  this.emit('prerender');
  ctx.save();
  this.setTransform(ctx);
  if (this.mask) this.mask.render(ctx);
  this.renderMe(ctx);

  let i = 0;
  const l = this.childs.length;
  while (i < l) {
    const child = this.childs[i];
    i++;
    if (!child.isVisible()) continue;
    child.render(ctx);
  }
  ctx.restore();
  this.emit('postrender');
};

/**
 * 渲染自己
 * @private
 * @return {Boolean} 是否渲染
 */
Container.prototype.renderMe = function() {
  return true;
};

/**
 * 计算自己的包围盒
 * @private
 */
Container.prototype.calculateVertices = function() {
  const wt = this.worldTransform;
  const a = wt.a;
  const b = wt.b;
  const c = wt.c;
  const d = wt.d;
  const tx = wt.tx;
  const ty = wt.ty;
  const vertexData = this.vertexData;
  let w0;
  let w1;
  let h0;
  let h1;

  w0 = this._bounds.minX;
  w1 = this._bounds.maxX;

  h0 = this._bounds.minY;
  h1 = this._bounds.maxY;

  // xy
  vertexData[0] = a * w1 + c * h1 + tx;
  vertexData[1] = d * h1 + b * w1 + ty;

  // xy
  vertexData[2] = a * w0 + c * h1 + tx;
  vertexData[3] = d * h1 + b * w0 + ty;

  // xy
  vertexData[4] = a * w0 + c * h0 + tx;
  vertexData[5] = d * h0 + b * w0 + ty;

  // xy
  vertexData[6] = a * w1 + c * h0 + tx;
  vertexData[7] = d * h0 + b * w1 + ty;
};


/**
 * 计算包围盒子
 *
 * @method calculateBounds
 */
Container.prototype.calculateBounds = function() {
  this.bounds.clear();
  if (!this.visible) {
    return;
  }
  this._calculateBounds();

  for (let i = 0; i < this.childs.length; i++) {
    const child = this.childs[i];

    child.calculateBounds();

    this.bounds.addBounds(child.bounds);
  }
};

Container.prototype._calculateBounds = function() {
  this.calculateVertices();
  this.bounds.addVert(this.vertexData);
};


/**
 * 设置渲染物体的包围盒
 * @param {JC.Bounds} bounds
 */
Container.prototype.setBounds = function(bounds) {
  if (bounds instanceof Bounds) {
    this._bounds = bounds;
  }
};

/**
 * 暂停自身和子级的所有动画进度
 */
Container.prototype.pause = function() {
  this.paused = true;
};

/**
 * 恢复自身和子级的所有动画进度
 */
Container.prototype.restart = function() {
  this.paused = false;
};

/**
 * 设置自身及子级的动画速度
 * @param {Number} speed 设置的速率值
 */
Container.prototype.setSpeed = function(speed) {
  this.timeScale = speed;
};

export {Container};
