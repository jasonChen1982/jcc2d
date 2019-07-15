import ShapeTransformManager from './ShapeTransformManager';
import PropertyFactory from './PropertyFactory';
import CVShapeData from './CVShapeData';
import TransformPropertyFactory from './TransformProperty';
import getModifier from './shapes/ShapeModifiers';
import Matrix from './lib/transformation-matrix';

const degToRads = Math.PI/180;

/**
 * a
 * @param {*} element a
 * @param {*} position a
 */
function ProcessedElement(element, position) {
  this.elem = element;
  this.pos = position;
}

/**
 * a
 */
export default class CVShapeElement {
  /**
   * a
   * @param {*} data a
   */
  constructor(data) {
    this.data = data;
    this.shapes = [];
    this.shapesData = data.shapes;
    this.stylesList = [];
    this.itemsData = [];
    this.prevViewData = [];
    this.shapeModifiers = [];
    this.processedElements = [];
    this.transformsManager = new ShapeTransformManager();
    this.lcEnum = {
      '1': 'butt',
      '2': 'round',
      '3': 'square',
    };
    this.ljEnum = {
      '1': 'miter',
      '2': 'round',
      '3': 'bevel',
    };

    // set to true when inpoint is rendered
    this._isFirstFrame = true;
    // list of animated properties
    this.dynamicProperties = [];
    // If layer has been modified in current tick this will be true
    this._mdf = false;

    this.finalTransform = {
      mProp: this.data.ks ? TransformPropertyFactory.getTransformProperty(this, this.data.ks, this) : {o: 0},
      _matMdf: false,
      _opMdf: false,
      mat: new Matrix(),
    };
    if (this.data.ao) {
      this.finalTransform.mProp.autoOriented = true;
    }

    this.transformHelper = { opacity: 1, _opMdf: false };
    this.createContent();
  }

  /**
   * a
   * @param {*} elem a
   */
  searchProcessedElement(elem) {
    let elements = this.processedElements;
    let i = 0;
    const len = elements.length;
    while (i < len) {
      if (elements[i].elem === elem) {
        return elements[i].pos;
      }
      i += 1;
    }
    return 0;
  }


  /**
   * a
   * @param {*} elem a
   * @param {*} pos a
   */
  addProcessedElement(elem, pos) {
    let elements = this.processedElements;
    let i = elements.length;
    while (i) {
      i -= 1;
      if (elements[i].elem === elem) {
        elements[i].pos = pos;
        return;
      }
    }
    elements.push(new ProcessedElement(elem, pos));
  }

  /**
   * a
   * @param {*} data a
   */
  addShapeToModifiers(data) {
    let i;
    const len = this.shapeModifiers.length;
    for (i=0; i<len; i+=1) {
      this.shapeModifiers[i].addShape(data);
    }
  }

  /**
   * a
   * @param {*} num a
   */
  prepareFrame(num) {
    this.prepareProperties(num);
  }

  /**
   * @function
   * Calculates all dynamic values
   *
   * @param {number} num current frame number in Layer's time
   * @param {boolean} isVisible if layers is currently in range
   *
   */
  prepareProperties(num) {
    let i;
    const len = this.dynamicProperties.length;
    for (i = 0; i < len; i += 1) {
      this.dynamicProperties[i].getValue(num);
      if (this.dynamicProperties[i]._mdf) {
        this._mdf = true;
      }
    }
  }

  /**
   * a
   * @param {*} prop a
   */
  addDynamicProperty(prop) {
    if (this.dynamicProperties.indexOf(prop) === -1) {
      this.dynamicProperties.push(prop);
    }
  }

  /**
   * a
   * @param {*} ctx a
   */
  renderFrame(ctx) {
    if (this.data.hd) {
      return;
    }
    this.renderInnerContent(ctx);
    if (this._isFirstFrame) {
      this._isFirstFrame = false;
    }
  }

  /**
   * a
   */
  createContent() {
    this.searchShapes(this.shapesData, this.itemsData, this.prevViewData, true, []);
  }

  /**
   * a
   * @param {*} data a
   * @param {*} transforms a
   * @return {*}
   */
  createStyleElement(data, transforms) {
    const styleElem = {
      data: data,
      type: data.ty,
      preTransforms: this.transformsManager.addTransformSequence(transforms),
      transforms: [],
      elements: [],
      closed: data.hd === true,
    };
    const elementData = {};
    if (data.ty == 'fl' || data.ty == 'st') {
      elementData.c = PropertyFactory(this, data.c, 1, 255, this);
      if (!elementData.c.k) {
        styleElem.co = 'rgb('+Math.floor(elementData.c.v[0])+','+Math.floor(elementData.c.v[1])+','+Math.floor(elementData.c.v[2])+')';
      }
    } else if (data.ty === 'gf' || data.ty === 'gs') {
      elementData.s = PropertyFactory(this, data.s, 1, null, this);
      elementData.e = PropertyFactory(this, data.e, 1, null, this);
      elementData.h = PropertyFactory(this, data.h||{ k: 0 }, 0, 0.01, this);
      elementData.a = PropertyFactory(this, data.a||{ k: 0 }, 0, degToRads, this);
      // elementData.g = new GradientProperty(this, data.g, this);
    }
    elementData.o = PropertyFactory(this, data.o, 0, 0.01, this);
    if (data.ty == 'st' || data.ty == 'gs') {
      styleElem.lc = this.lcEnum[data.lc] || 'round';
      styleElem.lj = this.ljEnum[data.lj] || 'round';
      if (data.lj == 1) {
        styleElem.ml = data.ml;
      }
      elementData.w = PropertyFactory(this, data.w, 0, null, this);
      if (!elementData.w.k) {
        styleElem.wi = elementData.w.v;
      }
      // if (data.d) {
      //   const d = new DashProperty(this, data.d, 'canvas', this);
      //   elementData.d = d;
      //   if (!elementData.d.k) {
      //     styleElem.da = elementData.d.dashArray;
      //     styleElem.do = elementData.d.dashoffset[0];
      //   }
      // }
    } else {
      styleElem.r = data.r === 2 ? 'evenodd' : 'nonzero';
    }
    this.stylesList.push(styleElem);
    elementData.style = styleElem;
    return elementData;
  }

  /**
   * a
   * @param {*} data a
   * @return {*}
   */
  createGroupElement() {
    return {
      it: [],
      prevViewData: [],
    };
  }

  /**
   * a
   * @param {*} data a
   * @return {*}
   */
  createTransformElement(data) {
    return {
      transform: {
        opacity: 1,
        _opMdf: false,
        key: this.transformsManager.getNewKey(),
        op: PropertyFactory(this, data.o, 0, 0.01, this),
        mProps: TransformPropertyFactory.getTransformProperty(this, data, this),
      },
    };
  }

  /**
   * a
   * @param {*} data a
   * @return {*}
   */
  createShapeElement(data) {
    const elementData = new CVShapeData(this, data, this.stylesList, this.transformsManager);

    this.shapes.push(elementData);
    this.addShapeToModifiers(elementData);
    return elementData;
  }

  /**
   * a
   * @param {*} transform a
   */
  addTransformToStyleList(transform) {
    const len = this.stylesList.length;
    for (let i = 0; i < len; i += 1) {
      if (!this.stylesList[i].closed) {
        this.stylesList[i].transforms.push(transform);
      }
    }
  }

  /**
   * a
   */
  removeTransformFromStyleList() {
    const len = this.stylesList.length;
    for (let i = 0; i < len; i += 1) {
      if (!this.stylesList[i].closed) {
        this.stylesList[i].transforms.pop();
      }
    }
  }

  /**
   * a
   * @param {*} styles a
   */
  closeStyles(styles) {
    const len = styles.length;
    for (let i = 0; i < len; i += 1) {
      styles[i].closed = true;
    }
  }

  /**
   * a
   * @param {*} arr a
   * @param {*} itemsData a
   * @param {*} prevViewData a
   * @param {*} shouldRender a
   * @param {*} transforms a
   */
  searchShapes(arr, itemsData, prevViewData, shouldRender, transforms) {
    const len = arr.length - 1;
    const ownStyles = [];
    const ownModifiers = [];
    let processedPos;
    let modifier;
    const ownTransforms = [].concat(transforms);
    for (let i = len; i >= 0; i -= 1) {
      processedPos = this.searchProcessedElement(arr[i]);
      if (!processedPos) {
        arr[i]._shouldRender = shouldRender;
      } else {
        itemsData[i] = prevViewData[processedPos - 1];
      }
      if (arr[i].ty == 'fl' || arr[i].ty == 'st'|| arr[i].ty == 'gf'|| arr[i].ty == 'gs') {
        if (!processedPos) {
          itemsData[i] = this.createStyleElement(arr[i], ownTransforms);
        } else {
          itemsData[i].style.closed = false;
        }
        ownStyles.push(itemsData[i].style);
      } else if (arr[i].ty == 'gr') {
        if (!processedPos) {
          itemsData[i] = this.createGroupElement(arr[i]);
        } else {
          const jLen = itemsData[i].it.length;
          for (let j = 0; j < jLen; j += 1) {
            itemsData[i].prevViewData[j] = itemsData[i].it[j];
          }
        }
        this.searchShapes(arr[i].it, itemsData[i].it, itemsData[i].prevViewData, shouldRender, ownTransforms);
      } else if (arr[i].ty == 'tr') {
        if (!processedPos) {
          const currentTransform = this.createTransformElement(arr[i]);
          itemsData[i] = currentTransform;
        }
        ownTransforms.push(itemsData[i]);
        this.addTransformToStyleList(itemsData[i]);
      } else if (arr[i].ty == 'sh' || arr[i].ty == 'rc' || arr[i].ty == 'el' || arr[i].ty == 'sr') {
        if (!processedPos) {
          itemsData[i] = this.createShapeElement(arr[i]);
        }
      } else if (arr[i].ty == 'tm' || arr[i].ty == 'rd') {
        if (!processedPos) {
          modifier = getModifier(arr[i].ty);
          modifier.init(this, arr[i]);
          itemsData[i] = modifier;
          this.shapeModifiers.push(modifier);
        } else {
          modifier = itemsData[i];
          modifier.closed = false;
        }
        ownModifiers.push(modifier);
      } else if (arr[i].ty == 'rp') {
        if (!processedPos) {
          modifier = getModifier(arr[i].ty);
          itemsData[i] = modifier;
          modifier.init(this, arr, i, itemsData);
          this.shapeModifiers.push(modifier);
          shouldRender = false;
        } else {
          modifier = itemsData[i];
          modifier.closed = true;
        }
        ownModifiers.push(modifier);
      }
      this.addProcessedElement(arr[i], i + 1);
    }
    this.removeTransformFromStyleList();
    this.closeStyles(ownStyles);
    const olen = ownModifiers.length;
    for (let i = 0; i < olen; i += 1) {
      ownModifiers[i].closed = true;
    }
  }

  /**
   * a
   */
  renderModifiers() {
    if (!this.shapeModifiers.length) return;
    const len = this.shapes.length;
    for (let i = 0; i < len; i += 1) {
      this.shapes[i].sh.reset();
    }

    let i = this.shapeModifiers.length - 1;
    for (;i >= 0; i -= 1) {
      this.shapeModifiers[i].processShapes(this._isFirstFrame);
    }
  }

  /**
   * a
   */
  renderInnerContent(ctx) {
    this.transformHelper.opacity = 1;
    this.transformHelper._opMdf = false;
    this.renderModifiers();
    this.transformsManager.processSequences(this._isFirstFrame);
    this.renderShape(this.transformHelper, this.shapesData, this.itemsData, ctx);
  }

  /**
   * a
   * @param {*} parentTransform a
   * @param {*} groupTransform a
   */
  renderShapeTransform(parentTransform, groupTransform) {
    if (parentTransform._opMdf || groupTransform.op._mdf || this._isFirstFrame) {
      groupTransform.opacity = parentTransform.opacity;
      groupTransform.opacity *= groupTransform.op.v;
      groupTransform._opMdf = true;
    }
  }

  /**
   * a
   * @param {*} parentTransform a
   * @param {*} items a
   * @param {*} data a
   * @param {*} ctx a
   */
  renderShape(parentTransform, items, data, ctx) {
    const len = items.length - 1;
    let groupTransform = parentTransform;
    for (let i = len; i >= 0; i -= 1) {
      if (items[i].ty == 'tr') {
        groupTransform = data[i].transform;
        this.renderShapeTransform(parentTransform, groupTransform);
      } else if (items[i].ty == 'sh' || items[i].ty == 'el' || items[i].ty == 'rc' || items[i].ty == 'sr') {
        this.renderPath(items[i], data[i]);
      } else if (items[i].ty == 'fl') {
        this.renderFill(items[i], data[i], groupTransform);
      } else if (items[i].ty == 'st') {
        this.renderStroke(items[i], data[i], groupTransform);
      } else if (items[i].ty == 'gf' || items[i].ty == 'gs') {
        this.renderGradientFill(items[i], data[i], groupTransform);
      } else if (items[i].ty == 'gr') {
        this.renderShape(groupTransform, items[i].it, data[i].it);
      }
    }
    if (ctx) {
      this.drawLayer(ctx);
    }
  }

  /**
   * a
   */
  drawLayer(ctx) {
    const len = this.stylesList.length;
    for (let i = 0; i < len; i+=1) {
      const currentStyle = this.stylesList[i];
      const type = currentStyle.type;

      // Skipping style when
      // Stroke width equals 0
      // style should not be rendered (extra unused repeaters)
      // current opacity equals 0
      // global opacity equals 0
      if (((type === 'st' || type === 'gs') && currentStyle.wi === 0) || !currentStyle.data._shouldRender || currentStyle.coOp === 0) {
        continue;
      }
      ctx.save();
      const elems = currentStyle.elements;
      if (type === 'st' || type === 'gs') {
        ctx.strokeStyle = type === 'st' ? currentStyle.co : currentStyle.grd;
        ctx.lineWidth = currentStyle.wi;
        ctx.lineCap = currentStyle.lc;
        ctx.lineJoin = currentStyle.lj;
        ctx.miterLimit = currentStyle.ml || 0;
      } else {
        ctx.fillStyle = type === 'fl' ? currentStyle.co : currentStyle.grd;
      }
      ctx.globalAlpha = currentStyle.coOp * this.finalTransform.mProp.o.v;
      if (type !== 'st' && type !== 'gs') {
        ctx.beginPath();
      }
      const trProps = currentStyle.preTransforms.finalTransform.props;
      ctx.transform(trProps[0], trProps[1], trProps[4], trProps[5], trProps[12], trProps[13]);
      const jLen = elems.length;
      for (let j = 0; j < jLen; j += 1) {
        if (type === 'st' || type === 'gs') {
          ctx.beginPath();
          if (currentStyle.da) {
            ctx.setLineDash(currentStyle.da);
            ctx.lineDashOffset = currentStyle.do;
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
          if (currentStyle.da) {
            ctx.setLineDash(this.dashResetter);
          }
        }
      }
      if (type !== 'st' && type !== 'gs') {
        ctx.fill(currentStyle.r);
      }
      ctx.restore();
    }
  }

  /**
   * a
   * @param {*} pathData a
   * @param {*} itemData a
   */
  renderPath(pathData, itemData) {
    if (pathData.hd !== true && pathData._shouldRender) {
      const len = itemData.styledShapes.length;
      for (let i = 0; i < len; i += 1) {
        this.renderStyledShape(itemData.styledShapes[i], itemData.sh);
      }
    }
  }

  /**
   * a
   * @param {*} styledShape a
   * @param {*} shape a
   */
  renderStyledShape(styledShape, shape) {
    if (this._isFirstFrame || shape._mdf || styledShape.transforms._mdf) {
      const shapeNodes = styledShape.trNodes;
      const paths = shape.paths;
      const jLen = paths._length;
      shapeNodes.length = 0;
      const groupTransformMat = styledShape.transforms.finalTransform;
      for (let j = 0; j < jLen; j += 1) {
        const pathNodes = paths.shapes[j];
        if (pathNodes && pathNodes.v) {
          let i = 1;
          const len = pathNodes._length;
          for (; i < len; i += 1) {
            if (i === 1) {
              shapeNodes.push({
                t: 'm',
                p: groupTransformMat.applyToPointArray(pathNodes.v[0][0], pathNodes.v[0][1], 0),
              });
            }
            shapeNodes.push({
              t: 'c',
              pts: groupTransformMat.applyToTriplePoints(pathNodes.o[i - 1], pathNodes.i[i], pathNodes.v[i]),
            });
          }
          if (len === 1) {
            shapeNodes.push({
              t: 'm',
              p: groupTransformMat.applyToPointArray(pathNodes.v[0][0], pathNodes.v[0][1], 0),
            });
          }
          if (pathNodes.c && len) {
            shapeNodes.push({
              t: 'c',
              pts: groupTransformMat.applyToTriplePoints(pathNodes.o[i - 1], pathNodes.i[0], pathNodes.v[0]),
            });
            shapeNodes.push({
              t: 'z',
            });
          }
        }
      }
      styledShape.trNodes = shapeNodes;
    }
  }

  /**
   * a
   * @param {*} styleData a
   * @param {*} itemData a
   * @param {*} groupTransform a
   */
  renderFill(styleData, itemData, groupTransform) {
    const styleElem = itemData.style;

    if (itemData.c._mdf || this._isFirstFrame) {
      styleElem.co = 'rgb('
      + Math.floor(itemData.c.v[0]) + ','
      + Math.floor(itemData.c.v[1]) + ','
      + Math.floor(itemData.c.v[2]) + ')';
    }
    if (itemData.o._mdf || groupTransform._opMdf || this._isFirstFrame) {
      styleElem.coOp = itemData.o.v * groupTransform.opacity;
    }
  }

  /**
   * a
   * @param {*} styleData a
   * @param {*} itemData a
   * @param {*} groupTransform a
   */
  renderGradientFill(styleData, itemData, groupTransform) {
    const styleElem = itemData.style;
    if (!styleElem.grd || itemData.g._mdf || itemData.s._mdf || itemData.e._mdf || (styleData.t !== 1 && (itemData.h._mdf || itemData.a._mdf))) {
      const ctx = this.renderer;
      let grd;
      const pt1 = itemData.s.v;
      const pt2 = itemData.e.v;
      if (styleData.t === 1) {
        grd = ctx.createLinearGradient(pt1[0], pt1[1], pt2[0], pt2[1]);
      } else {
        const rad = Math.sqrt(Math.pow(pt1[0] - pt2[0], 2) + Math.pow(pt1[1] - pt2[1], 2));
        const ang = Math.atan2(pt2[1] - pt1[1], pt2[0] - pt1[0]);

        const percent = itemData.h.v >= 1 ? 0.99 : itemData.h.v <= -1 ? -0.99: itemData.h.v;
        const dist = rad * percent;
        const x = Math.cos(ang + itemData.a.v) * dist + pt1[0];
        const y = Math.sin(ang + itemData.a.v) * dist + pt1[1];
        grd = ctx.createRadialGradient(x, y, 0, pt1[0], pt1[1], rad);
      }

      const len = styleData.g.p;
      const cValues = itemData.g.c;
      let opacity = 1;

      for (let i = 0; i < len; i += 1) {
        if (itemData.g._hasOpacity && itemData.g._collapsable) {
          opacity = itemData.g.o[i*2 + 1];
        }
        grd.addColorStop(cValues[i * 4] / 100, 'rgba('+ cValues[i * 4 + 1] + ',' + cValues[i * 4 + 2] + ','+cValues[i * 4 + 3] + ',' + opacity + ')');
      }
      styleElem.grd = grd;
    }
    styleElem.coOp = itemData.o.v*groupTransform.opacity;
  }

  /**
   * a
   * @param {*} styleData a
   * @param {*} itemData a
   * @param {*} groupTransform a
   */
  renderStroke(styleData, itemData, groupTransform) {
    const styleElem = itemData.style;
    const d = itemData.d;
    if (d && (d._mdf || this._isFirstFrame)) {
      styleElem.da = d.dashArray;
      styleElem.do = d.dashoffset[0];
    }
    if (itemData.c._mdf || this._isFirstFrame) {
      styleElem.co = 'rgb('+Math.floor(itemData.c.v[0])+','+Math.floor(itemData.c.v[1])+','+Math.floor(itemData.c.v[2])+')';
    }
    if (itemData.o._mdf || groupTransform._opMdf || this._isFirstFrame) {
      styleElem.coOp = itemData.o.v*groupTransform.opacity;
    }
    if (itemData.w._mdf || this._isFirstFrame) {
      styleElem.wi = itemData.w.v;
    }
  }
}

