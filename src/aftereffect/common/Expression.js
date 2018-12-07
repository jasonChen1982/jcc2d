import {Utils} from '../../utils/Utils';

const EX_REG = /(loopIn|loopOut)\(([^)]+)/;
const STR_REG = /["']\w+["']/;

/**
 * Cycle
 * @class
 * @private
 */
class Cycle {
  /**
   * Pingpong
   * @param {*} type Pingpong
   * @param {*} begin Pingpong
   * @param {*} end Pingpong
   */
  constructor(type, begin, end) {
    this.begin = begin;
    this.end = end;
    this.total = this.end - this.begin;
    this.type = type;
  }

  /**
   * progress
   * @param {number} progress progress
   * @return {number} progress
   */
  update(progress) {
    if (this.type === 'in') {
      if (progress >= this.begin) return progress;
      return this.end - Utils.euclideanModulo(this.begin - progress, this.total);
    } else if (this.type === 'out') {
      if (progress <= this.end) return progress;
      return this.begin + Utils.euclideanModulo(progress - this.end, this.total);
    }
  }
}

/**
 * Pingpong
 * @class
 * @private
 */
class Pingpong {
  /**
   * Pingpong
   * @param {*} type Pingpong
   * @param {*} begin Pingpong
   * @param {*} end Pingpong
   */
  constructor(type, begin, end) {
    this.begin = begin;
    this.end = end;
    this.total = this.end - this.begin;
    this.type = type;
  }

  /**
   * progress
   * @param {number} progress progress
   * @return {number} progress
   */
  update(progress) {
    if ((this.type === 'in' && progress < this.begin) || (this.type === 'out' && progress > this.end)) {
      const space = progress - this.end;
      return this.pingpong(space);
    }
    return progress;
  }

  /**
   * pingpong
   * @param {number} space
   * @return {number}
   */
  pingpong(space) {
    const dir = Math.floor(space / this.total) % 2;
    if (dir) {
      return this.begin + Utils.euclideanModulo(space, this.total);
    } else {
      return this.end - Utils.euclideanModulo(space, this.total);
    }
  }
}

const FN_MAPS = {
  loopIn(datak, mode, offset) {
    const begin = datak[0].t;
    const end = datak[offset].t;
    switch (mode) {
    case 'cycle':
      return new Cycle('in', begin, end);
    case 'pingpong':
      return new Pingpong('in', begin, end);
    default:
      break;
    }
    return null;
  },
  loopOut(datak, mode, offset) {
    const last = datak.length - 1;
    const begin = datak[last - offset].t;
    const end = datak[last].t;
    switch (mode) {
    case 'cycle':
      return new Cycle('out', begin, end);
    case 'pingpong':
      return new Pingpong('out', begin, end);
    default:
      break;
    }
    return null;
  },
};

/**
 * parseParams
 * @ignore
 * @param {string} pStr string
 * @return {array}
 */
function parseParams(pStr) {
  const params = pStr.split(/\s*,\s*/);
  return params.map((it) => {
    if (STR_REG.test(it)) return it.replace(/"|'/g, '');
    return parseInt(it);
  });
}

/**
 * parseEx
 * @ignore
 * @param {string} ex string
 * @return {object}
 */
function parseEx(ex) {
  const rs = ex.match(EX_REG);
  const ps = parseParams(rs[2]);
  return {
    name: rs[1],
    mode: ps[0],
    offset: ps[1],
  };
}

/**
 * hasExpression
 * @ignore
 * @param {string} ex string
 * @return {boolean}
 */
function hasExpression(ex) {
  return EX_REG.test(ex);
}

/**
 * getEX
 * @ignore
 * @param {object} ksp ksp
 * @return {object}
 */
function getEX(ksp) {
  const {name, mode, offset} = parseEx(ksp.x);
  const _offset = offset === 0 ? ksp.k.length - 1 : offset;
  return FN_MAPS[name] && FN_MAPS[name](ksp.k, mode, _offset);
}

export {hasExpression, getEX};
