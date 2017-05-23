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
 * @extends JC.DisplayObject
 * @memberof JC
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
   * @member {Number}
   * @private
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
   * @member {JC.Bounds}
   * @private
   */
  this._bounds = new Bounds();

  this.vertexData = new Float32Array(8);
}
Container.prototype = Object.create(DisplayObject.prototype);

/**
 * 当前对象的z-index层级，z-index的值只会影响该对象在其所在的渲染列表内产生影响
 *
 * @member {number}
 * @name zIndex
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
 * @method _sortList
 * @private
 */
Container.prototype._sortList = function() {
  this.childs.sort(function(a, b) {
    if (a.zIndex > b.zIndex) {
      return 1;
    }
    if (a.zIndex < b.zIndex) {
      return -1;
    }
    return 0;
  });
  this.souldSort = false;
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
  /* eslint prefer-rest-params: "off" */
  if (arguments.length > 1) {
    for (let i = 0; i < arguments.length; i++) {
      this.adds(arguments[i]);
    }
    return this;
  }
  if (object === this) {
    console.error('adds: object can\'t be added as a child of itself.', object);
    return this;
  }
  if ((object && object instanceof Container)) {
    if (object.parent !== null) {
      object.parent.remove(object);
    }
    object.parent = this;
    this.childs.push(object);
    if (object.zIndex !== 0) this.souldSort = true;
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
  let index = this.childs.indexOf(object);
  if (index !== -1) {
    object.parent = null;
    this.childs.splice(index, 1);
  }
};

/**
 * 更新自身的透明度可矩阵姿态更新，并触发后代同步更新
 *
 * @param {Number} snippet
 * @private
 */
Container.prototype.updatePosture = function(snippet) {
  if (!this._ready) return;
  if (this.souldSort) this._sortList();
  snippet = this.timeScale * snippet;
  if (!this.paused) this.updateAnimation(snippet);
  this.updateTransform();

  for (let i = 0, l = this.childs.length; i < l; i++) {
    let child = this.childs[i];
    child.updatePosture(snippet);
  }
};

/**
 * 渲染自己并触发后代渲染
 * @param {context} ctx
 * @private
 */
Container.prototype.render = function(ctx) {
  ctx.save();
  this.setTransform(ctx);
  if (this.mask) this.mask.render(ctx);
  this.renderMe(ctx);

  for (let i = 0, l = this.childs.length; i < l; i++) {
    let child = this.childs[i];
    if (!child.isVisible() || !child._ready) continue;
    child.render(ctx);
  }
  ctx.restore();
};

/**
 * 渲染自己
 * @private
 * @return {Boolean} 是否渲染
 */
Container.prototype.renderMe = function() {
  return true;
};

Container.prototype.calculateVertices = function() {
  let wt = this.worldTransform;
  let a = wt.a;
  let b = wt.b;
  let c = wt.c;
  let d = wt.d;
  let tx = wt.tx;
  let ty = wt.ty;
  let vertexData = this.vertexData;
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
  if(!this.visible) {
    return;
  }
  this._calculateBounds();

  for (let i = 0; i < this.childs.length; i++) {
    let child = this.childs[i];

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
 * 暂停自身的动画进度
 */
Container.prototype.pause = function() {
  this.paused = true;
};

/**
 * 恢复自身的动画进度
 */
Container.prototype.restart = function() {
  this.paused = false;
};

/**
 * 取消自身的所有动画
 */
Container.prototype.cancle = function() {
  this.Animator.clear();
};

export {Container};
