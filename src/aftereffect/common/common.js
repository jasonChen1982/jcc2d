/**
 * detect number was in [min, max]
 * @method
 * @param {number} v   value
 * @param {number} min lower
 * @param {number} max upper
 * @return {boolean} in [min, max] range ?
 */
export function inRange(v, min, max) {
  return v >= min && v <= max;
}

/**
 * detect current frame index
 * @method
 * @param {array} steps frames array
 * @param {number} progress current time
 * @return {number} which frame index
 */
export function findStep(steps, progress) {
  const last = steps.length - 1;
  for (let i = 0; i < last; i++) {
    const step = steps[i];
    if (inRange(progress, step.ost, step.oet)) {
      return i;
    }
  }
}

/**
 * prefix
 * @method
 * @param {object} asset asset
 * @param {string} prefix prefix
 * @return {string}
 */
export function createUrl(asset, prefix) {
  if (prefix) prefix = prefix.replace(/\/?$/, '/');
  const up = asset.u + asset.p;
  const url = asset.up || prefix + up;
  return url;
}

/**
 * get assets from keyframes assets
 * @method
 * @param {string} id assets refid
 * @param {object} assets assets object
 * @return {object} asset object
 */
export function getAssets(id, assets) {
  for (let i = 0; i < assets.length; i++) {
    if (id === assets[i].id) return assets[i];
  }
  return {};
}
