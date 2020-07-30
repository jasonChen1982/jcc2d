import ShapeTransformManager from './helpers/ShapeTransformManager';
import ProcessedElement from './helpers/ProcessedElement';
import ShapeData from './helpers/ShapeData';
import PathPaint from './helpers/PathPaint';
import PropertyFactory from '../utils/PropertyFactory';
import {getTransformProperty} from '../utils/TransformProperty';
// import StyleElement from '../shapes/StyleElement';
import ShapeModifiers from '../utils/shapes/ShapeModifiers';
import DashProperty from '../utils/shapes/DashProperty';
import GradientProperty from '../utils/shapes/GradientProperty';
import DynamicPropertyContainer from '../utils/helpers/dynamicProperties';
// import Matrix from '../utils/lib/transformation-matrix';
// import displayManager from '../displayManager';

import {degToRads} from '../constant/index';

/**
 * ShapesFrames class
 */
export default class ShapesFrames extends DynamicPropertyContainer {
  /**
   * a
   * @param {*} keyframesManager a
   * @param {*} shapes a
   * @param {*} session a
   */
  constructor(keyframesManager, shapes, session) {
    super();
    this.frameId = -1;
    this.keyframesManager = keyframesManager;
    this.elem = keyframesManager.elem;
    this.session = session;
    this.shapes = [];
    this.shapesData = shapes;
    this.stylesList = [];
    this.itemsData = [];
    this.prevViewData = [];
    this.shapeModifiers = [];
    this.processedElements = [];
    this.transformsManager = new ShapeTransformManager();
    this.initDynamicPropertyContainer(keyframesManager);

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

    this.transformHelper = {opacity: 1, _opMdf: false};
    this.searchShapes(this.shapesData, this.itemsData, this.prevViewData, true, []);
    if (!this._isAnimated) {
      this.transformHelper.opacity = 1;
      this.transformHelper._opMdf = false;
      this.updateModifiers(this.frameId);
      this.transformsManager.processSequences(this._isFirstFrame);
      this.updateShape(this.transformHelper, this.shapesData, this.itemsData);

      this.updateGrahpics();
    }
  }


  /**
   * a
   * @param {number} frameNum frameNum
   */
  // prepareProperties(frameNum) {
  //   let i;
  //   const len = this.dynamicProperties.length;
  //   for (i = 0; i < len; i += 1) {
  //     this.dynamicProperties[i].getValue(frameNum);
  //     if (this.dynamicProperties[i]._mdf) {
  //       this._mdf = true;
  //     }
  //   }
  // }

  /**
   * a
   * @param {*} prop a
   */
  // addDynamicProperty(prop) {
  //   if (this.dynamicProperties.indexOf(prop) === -1) {
  //     this.dynamicProperties.push(prop);
  //   }
  // }

  /**
   * create style element
   * @param {*} data style item data
   * @param {*} transforms transforms array
   * @return {*}
   */
  createStyleElement(data, transforms) {
    // let styleElem = {
    //   data: data,
    //   type: data.ty,
    //   preTransforms: this.transformsManager.addTransformSequence(transforms),
    //   transforms: [],
    //   elements: [],
    //   closed: data.hd === true,
    // };
    const styleElem = new PathPaint(this.elem, data, this.transformsManager.addTransformSequence(transforms));
    const elementData = {};
    if (data.ty == 'fl' || data.ty == 'st') {
      elementData.c = PropertyFactory.getProp(this, data.c, 1, 255, this);
      if (!elementData.c.k) {
        styleElem.co = elementData.c.v;// 'rgb('+bm_floor(elementData.c.v[0])+','+bm_floor(elementData.c.v[1])+','+bm_floor(elementData.c.v[2])+')';
      }
    } else if (data.ty === 'gf' || data.ty === 'gs') {
      elementData.s = PropertyFactory.getProp(this, data.s, 1, null, this);
      elementData.e = PropertyFactory.getProp(this, data.e, 1, null, this);
      elementData.h = PropertyFactory.getProp(this, data.h||{k: 0}, 0, 0.01, this);
      elementData.a = PropertyFactory.getProp(this, data.a||{k: 0}, 0, degToRads, this);
      elementData.g = new GradientProperty(this, data.g, this);
    }
    elementData.o = PropertyFactory.getProp(this, data.o, 0, 0.01, this);
    if (data.ty == 'st' || data.ty == 'gs') {
      styleElem.lc = this.lcEnum[data.lc] || 'round';
      styleElem.lj = this.ljEnum[data.lj] || 'round';
      if (data.lj == 1) {
        styleElem.ml = data.ml;
      }
      elementData.w = PropertyFactory.getProp(this, data.w, 0, null, this);
      if (!elementData.w.k) {
        styleElem.wi = elementData.w.v;
      }
      if (data.d) {
        let d = new DashProperty(this, data.d, 'canvas', this);
        elementData.d = d;
        if (!elementData.d.k) {
          styleElem.da = elementData.d.dashArray;
          styleElem.do = elementData.d.dashoffset[0];
        }
      }
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
   */
  addShapeToModifiers(data) {
    let i; let len = this.shapeModifiers.length;
    for (i=0; i<len; i+=1) {
      this.shapeModifiers[i].addShape(data);
    }
  }

  /**
   * a
   * @param {*} data a
   * @return {Boolean}
   */
  isShapeInAnimatedModifiers(data) {
    let i = 0; let len = this.shapeModifiers.length;
    while (i < len) {
      if (this.shapeModifiers[i].isAnimatedWithShape(data)) {
        return true;
      }
    }
    return false;
  }

  /**
   * a
   * @param {number} frameNum frameNum
   */
  updateModifiers(frameNum) {
    if (!this.shapeModifiers.length) {
      return;
    }
    let i; let len = this.shapes.length;
    for (i=0; i<len; i+=1) {
      this.shapes[i].sh.reset();
    }

    len = this.shapeModifiers.length;
    for (i=len-1; i>=0; i-=1) {
      this.shapeModifiers[i].processShapes(frameNum, this._isFirstFrame);
    }
  }

  /**
   * a
   * @param {*} elem a
   * @return {number}
   */
  searchProcessedElement(elem) {
    let elements = this.processedElements;
    let i = 0; let len = elements.length;
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
   * create group element
   * @return {*}
   */
  createGroupElement() {
    return {
      it: [],
      prevViewData: [],
    };
  }

  /**
   * create transform element
   * @param {*} data a
   * @return {*}
   */
  createTransformElement(data) {
    return {
      transform: {
        opacity: 1,
        _opMdf: false,
        key: this.transformsManager.getNewKey(),
        op: PropertyFactory.getProp(this, data.o, 0, 0.01, this),
        mProps: getTransformProperty(this, data, this),
      },
    };
  }

  /**
   * a
   * @param {*} data a
   * @return {*}
   */
  createShapeElement(data) {
    const elementData = new ShapeData(this, data, this.stylesList, this.transformsManager);

    this.shapes.push(elementData);
    this.addShapeToModifiers(elementData);
    return elementData;
  }

  /**
   * a
   */
  reloadShapes() {
    this._isFirstFrame = true;
    let i; let len = this.itemsData.length;
    for (i = 0; i < len; i += 1) {
      this.prevViewData[i] = this.itemsData[i];
    }
    this.searchShapes(this.shapesData, this.itemsData, this.prevViewData, true, []);
    len = this.dynamicProperties.length;
    for (i = 0; i < len; i += 1) {
      this.dynamicProperties[i].getValue();
    }
    this.updateModifiers();
    this.transformsManager.processSequences(this._isFirstFrame);
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
    let i; let len = arr.length - 1;
    let j; let jLen;
    let ownStyles = []; let ownModifiers = []; let processedPos; let modifier; let currentTransform;
    let ownTransforms = [].concat(transforms);
    for (i=len; i>=0; i-=1) {
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
          jLen = itemsData[i].it.length;
          for (j=0; j<jLen; j+=1) {
            itemsData[i].prevViewData[j] = itemsData[i].it[j];
          }
        }
        this.searchShapes(arr[i].it, itemsData[i].it, itemsData[i].prevViewData, shouldRender, ownTransforms);
      } else if (arr[i].ty == 'tr') {
        if (!processedPos) {
          currentTransform = this.createTransformElement(arr[i]);
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
          modifier = ShapeModifiers.getModifier(arr[i].ty);
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
          modifier = ShapeModifiers.getModifier(arr[i].ty);
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
    len = ownModifiers.length;
    for (i=0; i<len; i+=1) {
      ownModifiers[i].closed = true;
    }
  }

  /**
   * a
   * @param {*} parentTransform a
   * @param {*} groupTransform a
   */
  updateShapeTransform(parentTransform, groupTransform) {
    if (parentTransform._opMdf || groupTransform.op._mdf || this._isFirstFrame) {
      groupTransform.opacity = parentTransform.opacity;
      groupTransform.opacity *= groupTransform.op.v;
      groupTransform._opMdf = true;
    }
  }

  /**
   * a
   * @param {*} styledShape a
   * @param {*} shape a
   */
  updateStyledShape(styledShape, shape) {
    if (this._isFirstFrame || shape._mdf || styledShape.transforms._mdf) {
      let shapeNodes = styledShape.trNodes;
      let paths = shape.paths;
      let i; let len; let j; let jLen = paths._length;
      shapeNodes.length = 0;
      let groupTransformMat = styledShape.transforms.finalTransform;
      for (j = 0; j < jLen; j += 1) {
        let pathNodes = paths.shapes[j];
        if (pathNodes && pathNodes.v) {
          len = pathNodes._length;
          for (i = 1; i < len; i += 1) {
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
   * @param {*} pathData a
   * @param {*} itemData a
   */
  updatePath(pathData, itemData) {
    if (pathData.hd !== true && pathData._shouldRender) {
      let i; let len = itemData.styledShapes.length;
      for (i = 0; i < len; i += 1) {
        this.updateStyledShape(itemData.styledShapes[i], itemData.sh);
      }
    }
  }

  /**
   * a
   * @param {*} styleData a
   * @param {*} itemData a
   * @param {*} groupTransform a
   */
  updateFill(styleData, itemData, groupTransform) {
    const styleElem = itemData.style;

    if (itemData.c._mdf || this._isFirstFrame) {
      // styleElem.co = 'rgb('
      // + Math.floor(itemData.c.v[0]) + ','
      // + Math.floor(itemData.c.v[1]) + ','
      // + Math.floor(itemData.c.v[2]) + ')';
      styleElem.co = itemData.c.v;// rgb2hex(itemData.c.v);
    }
    if (itemData.o._mdf || groupTransform._opMdf || this._isFirstFrame) {
      styleElem.coOp = itemData.o.v * groupTransform.opacity;
    }
  }

  /**
   * a
   * @param {*} styleData a
   * @param {*} itemData aa
   * @param {*} groupTransform a
   */
  updateStroke(styleData, itemData, groupTransform) {
    let styleElem = itemData.style;
    let d = itemData.d;
    if (d && (d._mdf || this._isFirstFrame)) {
      styleElem.da = d.dashArray;
      styleElem.do = d.dashoffset[0];
    }
    if (itemData.c._mdf || this._isFirstFrame) {
      styleElem.co = itemData.c.v;// 'rgb('+bm_floor(itemData.c.v[0])+','+bm_floor(itemData.c.v[1])+','+bm_floor(itemData.c.v[2])+')';
    }
    if (itemData.o._mdf || groupTransform._opMdf || this._isFirstFrame) {
      styleElem.coOp = itemData.o.v*groupTransform.opacity;
    }
    if (itemData.w._mdf || this._isFirstFrame) {
      styleElem.wi = itemData.w.v;
    }
  }

  /**
   * a
   * @param {*} styleData a
   * @param {*} itemData a
   * @param {*} groupTransform a
   */
  updateGradientFill(styleData, itemData, groupTransform) {
    let styleElem = itemData.style;
    // if (!styleElem.grd || itemData.g._mdf || itemData.s._mdf || itemData.e._mdf || (styleData.t !== 1 && (itemData.h._mdf || itemData.a._mdf))) {
    //   let ctx = this.globalData.canvasContext;
    //   let grd;
    //   let pt1 = itemData.s.v; let pt2 = itemData.e.v;
    //   if (styleData.t === 1) {
    //     grd = ctx.createLinearGradient(pt1[0], pt1[1], pt2[0], pt2[1]);
    //   } else {
    //     let rad = Math.sqrt(Math.pow(pt1[0] - pt2[0], 2) + Math.pow(pt1[1] - pt2[1], 2));
    //     let ang = Math.atan2(pt2[1] - pt1[1], pt2[0] - pt1[0]);

    //     let percent = itemData.h.v >= 1 ? 0.99 : itemData.h.v <= -1 ? -0.99: itemData.h.v;
    //     let dist = rad * percent;
    //     let x = Math.cos(ang + itemData.a.v) * dist + pt1[0];
    //     let y = Math.sin(ang + itemData.a.v) * dist + pt1[1];
    //     grd = ctx.createRadialGradient(x, y, 0, pt1[0], pt1[1], rad);
    //   }

    //   let i; let len = styleData.g.p;
    //   let cValues = itemData.g.c;
    //   let opacity = 1;

    //   for (i = 0; i < len; i += 1) {
    //     if (itemData.g._hasOpacity && itemData.g._collapsable) {
    //       opacity = itemData.g.o[i*2 + 1];
    //     }
    //     grd.addColorStop(cValues[i * 4] / 100, 'rgba('+ cValues[i * 4 + 1] + ',' + cValues[i * 4 + 2] + ','+cValues[i * 4 + 3] + ',' + opacity + ')');
    //   }
    //   styleElem.grd = grd;
    // }
    styleElem.grd = itemData.g.c[0];
    styleElem.coOp = itemData.o.v*groupTransform.opacity;
  }

  /**
   * a
   * @param {*} parentTransform a
   * @param {*} items a
   * @param {*} data a
   */
  updateShape(parentTransform, items, data) {
    const len = items.length - 1;
    let groupTransform = parentTransform;
    for (let i = len; i >= 0; i -= 1) {
      if (items[i].ty == 'tr') {
        groupTransform = data[i].transform;
        this.updateShapeTransform(parentTransform, groupTransform);
      } else if (items[i].ty == 'sh' || items[i].ty == 'el' || items[i].ty == 'rc' || items[i].ty == 'sr') {
        this.updatePath(items[i], data[i]);
      } else if (items[i].ty == 'fl') {
        this.updateFill(items[i], data[i], groupTransform);
      } else if (items[i].ty == 'st') {
        this.updateStroke(items[i], data[i], groupTransform);
      } else if (items[i].ty == 'gf' || items[i].ty == 'gs') {
        this.updateGradientFill(items[i], data[i], groupTransform);
      } else if (items[i].ty == 'gr') {
        this.updateShape(groupTransform, items[i].it, data[i].it);
      }
    }
    // if (isMain) {
    //   this.drawLayer();
    // }
  }

  /**
   * a
   */
  updateGrahpics() {
    const len = this.stylesList.length;
    for (let i = 0; i < len; i+=1) {
      const currentStyle = this.stylesList[i];
      currentStyle.updateGrahpics();
    }
  }

  /**
   * a
   * @param {number} frameNum frameNum
   */
  getValue(frameNum) {
    if (frameNum === this.frameId) {
      return;
    }
    this.iterateDynamicProperties(frameNum);
    this.transformHelper.opacity = 1;
    this.transformHelper._opMdf = false;
    this.updateModifiers(frameNum);
    this.transformsManager.processSequences(this._isFirstFrame);
    this.updateShape(this.transformHelper, this.shapesData, this.itemsData);

    this.updateGrahpics();

    this.frameId = frameNum;
  }
}
