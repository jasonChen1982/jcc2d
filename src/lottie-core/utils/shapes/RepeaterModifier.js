import ShapeModifier from './ShapeModifier';
import PropertyFactory from '../PropertyFactory';
import {getTransformProperty} from '../TransformProperty';
import Matrix from '../lib/transformation-matrix';

/**
 * a
 */
export default class RepeaterModifier extends ShapeModifier {
  /**
   * a
   * @param {*} elem a
   * @param {*} data a
   */
  initModifierProperties(elem, data) {
    this.getValue = this.processKeys;
    this.c = PropertyFactory.getProp(elem, data.c, 0, null, this);
    this.o = PropertyFactory.getProp(elem, data.o, 0, null, this);
    this.tr = getTransformProperty(elem, data.tr, this);
    this.so = PropertyFactory.getProp(elem, data.tr.so, 0, 0.01, this);
    this.eo = PropertyFactory.getProp(elem, data.tr.eo, 0, 0.01, this);
    this.data = data;
    if (!this.dynamicProperties.length) {
      this.getValue(true);
    }
    this._isAnimated = !!this.dynamicProperties.length;
    this.pMatrix = new Matrix();
    this.rMatrix = new Matrix();
    this.sMatrix = new Matrix();
    this.tMatrix = new Matrix();
    this.matrix = new Matrix();
  }

  /**
   * a
   * @param {*} pMatrix a
   * @param {*} rMatrix a
   * @param {*} sMatrix a
   * @param {*} transform a
   * @param {*} perc a
   * @param {*} inv a
   */
  applyTransforms(pMatrix, rMatrix, sMatrix, transform, perc, inv) {
    let dir = inv ? -1 : 1;
    let scaleX = transform.s.v[0] + (1 - transform.s.v[0]) * (1 - perc);
    let scaleY = transform.s.v[1] + (1 - transform.s.v[1]) * (1 - perc);
    pMatrix.translate(transform.p.v[0] * dir * perc, transform.p.v[1] * dir * perc, transform.p.v[2]);
    rMatrix.translate(-transform.a.v[0], -transform.a.v[1], transform.a.v[2]);
    rMatrix.rotate(-transform.r.v * dir * perc);
    rMatrix.translate(transform.a.v[0], transform.a.v[1], transform.a.v[2]);
    sMatrix.translate(-transform.a.v[0], -transform.a.v[1], transform.a.v[2]);
    sMatrix.scale(inv ? 1/scaleX : scaleX, inv ? 1/scaleY : scaleY);
    sMatrix.translate(transform.a.v[0], transform.a.v[1], transform.a.v[2]);
  }

  /**
   * a
   * @param {*} elem a
   * @param {*} arr a
   * @param {*} pos a
   * @param {*} elemsData a
   */
  init(elem, arr, pos, elemsData) {
    this.elem = elem;
    this.arr = arr;
    this.pos = pos;
    this.elemsData = elemsData;
    this._currentCopies = 0;
    this._elements = [];
    this._groups = [];
    this.frameId = -1;
    this.initDynamicPropertyContainer(elem);
    this.initModifierProperties(elem, arr[pos]);
    while (pos>0) {
      pos -= 1;
      // this._elements.unshift(arr.splice(pos,1)[0]);
      this._elements.unshift(arr[pos]);
    }
    if (this.dynamicProperties.length) {
      this.k = true;
    } else {
      this.getValue(true);
    }
  }

  /**
   * a
   * @param {*} elements a
   */
  resetElements(elements) {
    const len = elements.length;
    for (let i = 0; i < len; i += 1) {
      elements[i]._processed = false;
      if (elements[i].ty === 'gr') {
        this.resetElements(elements[i].it);
      }
    }
  }

  /**
   * a
   * @param {*} elements a
   * @return {*}
   */
  cloneElements(elements) {
    let newElements = JSON.parse(JSON.stringify(elements));
    this.resetElements(newElements);
    return newElements;
  }

  /**
   * a
   * @param {*} elements a
   * @param {*} renderFlag a
   */
  changeGroupRender(elements, renderFlag) {
    const len = elements.length;
    for (let i = 0; i < len; i += 1) {
      elements[i]._render = renderFlag;
      if (elements[i].ty === 'gr') {
        this.changeGroupRender(elements[i].it, renderFlag);
      }
    }
  }

  /**
   * a
   * @param {*} _isFirstFrame a
   */
  processShapes(_isFirstFrame) {
    // let items, itemsTransform, i, dir, cont;
    if (this._mdf || _isFirstFrame) {
      let copies = Math.ceil(this.c.v);
      if (this._groups.length < copies) {
        while (this._groups.length < copies) {
          let group = {
            it: this.cloneElements(this._elements),
            ty: 'gr',
          };
          group.it.push({'a': {'a': 0, 'ix': 1, 'k': [0, 0]}, 'nm': 'Transform', 'o': {'a': 0, 'ix': 7, 'k': 100}, 'p': {'a': 0, 'ix': 2, 'k': [0, 0]}, 'r': {'a': 1, 'ix': 6, 'k': [{s: 0, e: 0, t: 0}, {s: 0, e: 0, t: 1}]}, 's': {'a': 0, 'ix': 3, 'k': [100, 100]}, 'sa': {'a': 0, 'ix': 5, 'k': 0}, 'sk': {'a': 0, 'ix': 4, 'k': 0}, 'ty': 'tr'});

          this.arr.splice(0, 0, group);
          this._groups.splice(0, 0, group);
          this._currentCopies += 1;
        }
        this.elem.reloadShapes();
      }
      let cont = 0;
      let i;
      let renderFlag;
      for (i = 0; i <= this._groups.length - 1; i += 1) {
        renderFlag = cont < copies;
        this._groups[i]._render = renderFlag;
        this.changeGroupRender(this._groups[i].it, renderFlag);
        cont += 1;
      }

      this._currentCopies = copies;
      // //

      let offset = this.o.v;
      let offsetModulo = offset%1;
      let roundOffset = offset > 0 ? Math.floor(offset) : Math.ceil(offset);
      // let k;
      // let tMat = this.tr.v.props;
      let pProps = this.pMatrix.props;
      let rProps = this.rMatrix.props;
      let sProps = this.sMatrix.props;
      this.pMatrix.reset();
      this.rMatrix.reset();
      this.sMatrix.reset();
      this.tMatrix.reset();
      this.matrix.reset();
      let iteration = 0;

      if (offset > 0) {
        while (iteration<roundOffset) {
          this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, 1, false);
          iteration += 1;
        }
        if (offsetModulo) {
          this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, offsetModulo, false);
          iteration += offsetModulo;
        }
      } else if (offset < 0) {
        while (iteration>roundOffset) {
          this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, 1, true);
          iteration -= 1;
        }
        if (offsetModulo) {
          this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, - offsetModulo, true);
          iteration -= offsetModulo;
        }
      }
      i = this.data.m === 1 ? 0 : this._currentCopies - 1;
      const dir = this.data.m === 1 ? 1 : -1;
      cont = this._currentCopies;
      while (cont) {
        const items = this.elemsData[i].it;
        const itemsTransform = items[items.length - 1].transform.mProps.v.props;
        const jLen = itemsTransform.length;
        items[items.length - 1].transform.mProps._mdf = true;
        items[items.length - 1].transform.op._mdf = true;
        items[items.length - 1].transform.op.v = this.so.v + (this.eo.v - this.so.v) * (i / (this._currentCopies - 1));
        if (iteration !== 0) {
          if ((i !== 0 && dir === 1) || (i !== this._currentCopies - 1 && dir === -1)) {
            this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, 1, false);
          }
          this.matrix.transform(rProps[0], rProps[1], rProps[2], rProps[3], rProps[4], rProps[5], rProps[6], rProps[7], rProps[8], rProps[9], rProps[10], rProps[11], rProps[12], rProps[13], rProps[14], rProps[15]);
          this.matrix.transform(sProps[0], sProps[1], sProps[2], sProps[3], sProps[4], sProps[5], sProps[6], sProps[7], sProps[8], sProps[9], sProps[10], sProps[11], sProps[12], sProps[13], sProps[14], sProps[15]);
          this.matrix.transform(pProps[0], pProps[1], pProps[2], pProps[3], pProps[4], pProps[5], pProps[6], pProps[7], pProps[8], pProps[9], pProps[10], pProps[11], pProps[12], pProps[13], pProps[14], pProps[15]);

          for (let j=0; j<jLen; j+=1) {
            itemsTransform[j] = this.matrix.props[j];
          }
          this.matrix.reset();
        } else {
          this.matrix.reset();
          for (let j=0; j<jLen; j+=1) {
            itemsTransform[j] = this.matrix.props[j];
          }
        }
        iteration += 1;
        cont -= 1;
        i += dir;
      }
    } else {
      let cont = this._currentCopies;
      let i = 0;
      const dir = 1;
      while (cont) {
        const items = this.elemsData[i].it;
        // const itemsTransform = items[items.length - 1].transform.mProps.v.props;
        items[items.length - 1].transform.mProps._mdf = false;
        items[items.length - 1].transform.op._mdf = false;
        cont -= 1;
        i += dir;
      }
    }
  }

  /**
   * a
   */
  addShape() {}
}
