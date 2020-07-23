import Matrix from '../../utils/lib/transformation-matrix';

/**
 * a
 */
export default class ShapeTransformManager {
  /**
   * a
   */
  constructor() {
    this.sequences = {};
    this.sequenceList = [];
    this.transform_key_count = 0;
  }

  /**
   * a
   * @param {*} transforms a
   * @return {*}
   */
  addTransformSequence(transforms) {
    const len = transforms.length;
    let key = '_';
    for (let i = 0; i < len; i += 1) {
      key += transforms[i].transform.key + '_';
    }
    let sequence = this.sequences[key];
    if (!sequence) {
      sequence = {
        transforms: [].concat(transforms),
        finalTransform: new Matrix(),
        _mdf: false,
      };
      this.sequences[key] = sequence;
      this.sequenceList.push(sequence);
    }
    return sequence;
  }

  /**
   * a
   * @param {*} sequence a
   * @param {*} isFirstFrame a
   */
  processSequence(sequence, isFirstFrame) {
    let i = 0;
    let _mdf = isFirstFrame;
    const len = sequence.transforms.length;
    while (i < len && !isFirstFrame) {
      if (sequence.transforms[i].transform.mProps._mdf) {
        _mdf = true;
        break;
      }
      i += 1;
    }
    if (_mdf) {
      let props;
      sequence.finalTransform.reset();
      for (i = len - 1; i >= 0; i -= 1) {
        props = sequence.transforms[i].transform.mProps.v.props;
        sequence.finalTransform.transform(props[0], props[1], props[2], props[3], props[4], props[5], props[6], props[7], props[8], props[9], props[10], props[11], props[12], props[13], props[14], props[15]);
      }
    }
    sequence._mdf = _mdf;
  }

  /**
   * a
   * @param {*} isFirstFrame a
   */
  processSequences(isFirstFrame) {
    const len = this.sequenceList.length;
    for (let i = 0; i < len; i += 1) {
      this.processSequence(this.sequenceList[i], isFirstFrame);
    }
  }

  /**
   * a
   * @return {*}
   */
  getNewKey() {
    return '_' + this.transform_key_count++;
  }
}
