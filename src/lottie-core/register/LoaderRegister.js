
let LoaderClass = null;

/**
 * register an image loader
 * @param {*} _LoaderClass a
 */
function registerLoader(_LoaderClass) {
  LoaderClass = _LoaderClass;
}

/**
 * a
 * @return {Loader}
 */
function getLoader() {
  if (!LoaderClass) {
    console.warn('must register an image loader, before you parse an animation');
  }
  return LoaderClass;
}

export default {registerLoader, getLoader};
