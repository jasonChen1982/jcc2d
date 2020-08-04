
import {Matrix, IDENTITY} from '../../math/Matrix';
import {Graphics} from '../../core/Graphics';

/**
 * a
 * @param {*} v a
 * @return {string}
 */
function rgbaToColor(v) {
  return 'rgba(' + v.join(',') + ')';
}

/**
 * a
 */
class DrawShape {
  /**
   * a
   */
  constructor() {
    this.primitive = null;
    this.dashResetter = [];
  }

  /**
   * a
   * @param {*} ctx a
   */
  render(ctx) {
    if (!this.primitive) return;
    const primitive = this.primitive;
    const type = primitive.type;

    // Skipping style when
    // Stroke width equals 0
    // style should not be rendered (extra unused repeaters)
    // current opacity equals 0
    // global opacity equals 0
    if (((type === 'st' || type === 'gs') && primitive.wi === 0) || !primitive.data._shouldRender || primitive.coOp === 0) {
      return;
    }
    ctx.save();
    const elems = primitive.elements;
    if (type === 'st' || type === 'gs') {
      ctx.strokeStyle = type === 'st' ? rgbaToColor(primitive.co) : primitive.grd;
      ctx.lineWidth = primitive.wi;
      ctx.lineCap = primitive.lc;
      ctx.lineJoin = primitive.lj;
      ctx.miterLimit = primitive.ml || 0;
    } else {
      ctx.fillStyle = type === 'fl' ? rgbaToColor(primitive.co) : primitive.grd;
    }
    // ctx.globalAlpha = primitive.coOp * this.finalTransform.mProp.o.v;
    if (type !== 'st' && type !== 'gs') {
      ctx.beginPath();
    }
    // const trProps = primitive.preTransforms.finalTransform.props;
    // ctx.transform(trProps[0], trProps[1], trProps[4], trProps[5], trProps[12], trProps[13]);
    const jLen = elems.length;
    for (let j = 0; j < jLen; j += 1) {
      if (type === 'st' || type === 'gs') {
        ctx.beginPath();
        if (primitive.da) {
          ctx.setLineDash(primitive.da);
          ctx.lineDashOffset = primitive.do;
        }
      }
      const nodes = elems[j].trNodes;
      const kLen = nodes.length;

      for (let k = 0; k < kLen; k++) {
        if (nodes[k].t == 'm') {
          ctx.moveTo(nodes[k].p[0], nodes[k].p[1]);
        } else if (nodes[k].t == 'c') {
          ctx.bezierCurveTo(nodes[k].pts[0], nodes[k].pts[1], nodes[k].pts[2], nodes[k].pts[3], nodes[k].pts[4], nodes[k].pts[5]);
        } else {
          ctx.closePath();
        }
      }
      if (type === 'st' || type === 'gs') {
        ctx.stroke();
        if (primitive.da) {
          ctx.setLineDash(this.dashResetter);
        }
      }
    }
    if (type !== 'st' && type !== 'gs') {
      ctx.fill(primitive.r);
    }
    ctx.restore();
  }
}

/**
 * NullElement class
 * @class
 * @private
 */
export default class PathPrimitive extends Graphics {
  /**
   * NullElement constructor
   * @param {object} elem layer data information
   * @param {object} config layer data information
   */
  constructor(elem, config) {
    const drawShape = new DrawShape();
    super(drawShape);
    this.elem = elem;
    this.config = config;

    this.__sftp = this.elem.preTransforms.finalTransform.props;

    this.passMatrix = new Matrix();
    this.drawShape = drawShape;
  }

  /**
   * a
   */
  setSelfTransform() {
    const trProps = this.__sftp;
    // __CacheArray[0] = trProps[0];
    // __CacheArray[1] = trProps[1];
    // __CacheArray[2] = trProps[4];
    // __CacheArray[3] = trProps[5];
    // __CacheArray[4] = trProps[12];
    // __CacheArray[5] = trProps[13];
    this.passMatrix.a = trProps[0];
    this.passMatrix.b = trProps[1];
    this.passMatrix.c = trProps[4];
    this.passMatrix.d = trProps[5];
    this.passMatrix.tx = trProps[12];
    this.passMatrix.ty = trProps[13];
    // this.passMatrix.fromArray(__CacheArray);
    // this.transform.setFromMatrix(this.passMatrix);
  }

  /**
   * 更新对象本身的矩阵姿态以及透明度
   *
   * @private
   * @param {Matrix} rootMatrix
   */
  updateTransform(rootMatrix) {
    this.setSelfTransform();

    const pt = rootMatrix || (this.hierarchy && this.hierarchy.worldTransform) || (this.parent && this.parent.worldTransform) || IDENTITY;
    const worldAlpha = (this.parent && this.parent.worldAlpha) || 1;

    const st = this.passMatrix;
    const wt = this.worldTransform;
    wt.a = st.a * pt.a + st.b * pt.c;
    wt.b = st.a * pt.b + st.b * pt.d;
    wt.c = st.c * pt.a + st.d * pt.c;
    wt.d = st.c * pt.b + st.d * pt.d;
    wt.tx = st.tx * pt.a + st.ty * pt.c + pt.tx;
    wt.ty = st.tx * pt.b + st.ty * pt.d + pt.ty;

    // multiply the alphas..
    this.worldAlpha = this.alpha * worldAlpha;
  }

  /**
   * a
   * @param {*} grahpics a
   */
  updateLottieGrahpics(grahpics) {
    this.drawShape.primitive = grahpics;
    this.alpha = grahpics.coOp;
  }
}
