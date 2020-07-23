import {TransformProperty} from '../utils/TransformProperty';

/**
 * a
 */
export default class TransformFrames extends TransformProperty {
  /**
   * a
   * @param {*} elem a
   * @param {*} hs a
   * @param {*} session a
   */
  constructor(elem, hs, session) {
    super(elem, hs);
    this.frameId = -1;
    this.hs = hs;
    this.session = session;
  }

  /**
   * get transform
   * @param {number} frameNum frameNum
   */
  getValue(frameNum) {
    if (frameNum === this.frameId) {
      return;
    }

    this.iterateDynamicProperties(frameNum);

    this.frameId = frameNum;
  }

  /**
   * get position x
   */
  get x() {
    return this.p ? this.p.v[0] : this.px.v;
  }

  /**
   * get position x
   */
  get y() {
    return this.p ? this.p.v[1] : this.py.v;
  }

  /**
   * get anchor x
   */
  get anchorX() {
    return this.a.v[0];
  }

  /**
   * get anchor x
   */
  get anchorY() {
    return this.a.v[1];
  }

  /**
   * get scale x
   */
  get scaleX() {
    return this.s.v[0];
  }

  /**
   * get scale x
   */
  get scaleY() {
    return this.s.v[1];
  }

  /**
   * get rotation
   */
  get rotation() {
    return this.r.v;
  }

  /**
   * get alpha
   */
  get alpha() {
    return this.o.v;
  }
}
