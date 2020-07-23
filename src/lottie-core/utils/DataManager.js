/**
 * complete layers
 * @param {*} layers
 * @param {*} comps
 * @param {*} fontManager
 */
function completeLayers(layers, comps, fontManager) {
  let layerData;
  // let animArray; let lastFrame;
  let i; let len = layers.length;
  let j; let jLen; let k; let kLen;
  for (i=0; i<len; i+=1) {
    layerData = layers[i];
    if (!('ks' in layerData) || layerData.completed) {
      continue;
    }
    layerData.completed = true;
    if (layerData.tt) {
      layers[i-1].td = layerData.tt;
    }
    // animArray = [];
    // lastFrame = -1;
    if (layerData.hasMask) {
      let maskProps = layerData.masksProperties;
      jLen = maskProps.length;
      for (j=0; j<jLen; j+=1) {
        if (maskProps[j].pt.k.i) {
          convertPathsToAbsoluteValues(maskProps[j].pt.k);
        } else {
          kLen = maskProps[j].pt.k.length;
          for (k=0; k<kLen; k+=1) {
            if (maskProps[j].pt.k[k].s) {
              convertPathsToAbsoluteValues(maskProps[j].pt.k[k].s[0]);
            }
            if (maskProps[j].pt.k[k].e) {
              convertPathsToAbsoluteValues(maskProps[j].pt.k[k].e[0]);
            }
          }
        }
      }
    }
    if (layerData.ty===0) {
      layerData.layers = findCompLayers(layerData.refId, comps);
      completeLayers(layerData.layers, comps, fontManager);
    } else if (layerData.ty === 4) {
      completeShapes(layerData.shapes);
    } else if (layerData.ty == 5) {
      completeText(layerData, fontManager);
    }
  }
}

/**
 * findComp Layers
 * @param {*} id layer id
 * @param {*} comps comps
 * @return {Array}
 */
function findCompLayers(id, comps) {
  let i = 0; let len = comps.length;
  while (i<len) {
    if (comps[i].id === id) {
      if (!comps[i].layers.__used) {
        comps[i].layers.__used = true;
        return comps[i].layers;
      }
      return JSON.parse(JSON.stringify(comps[i].layers));
    }
    i += 1;
  }
}

/**
 * completeShapes
 * @param {*} arr shapes
 */
function completeShapes(arr) {
  let i; let len = arr.length;
  let j; let jLen;
  // let hasPaths = false;
  for (i=len-1; i>=0; i-=1) {
    if (arr[i].ty == 'sh') {
      if (arr[i].ks.k.i) {
        convertPathsToAbsoluteValues(arr[i].ks.k);
      } else {
        jLen = arr[i].ks.k.length;
        for (j=0; j<jLen; j+=1) {
          if (arr[i].ks.k[j].s) {
            convertPathsToAbsoluteValues(arr[i].ks.k[j].s[0]);
          }
          if (arr[i].ks.k[j].e) {
            convertPathsToAbsoluteValues(arr[i].ks.k[j].e[0]);
          }
        }
      }
      // hasPaths = true;
    } else if (arr[i].ty == 'gr') {
      completeShapes(arr[i].it);
    }
  }
  /* if(hasPaths){
            //mx: distance
            //ss: sensitivity
            //dc: decay
            arr.splice(arr.length-1,0,{
                "ty": "ms",
                "mx":20,
                "ss":10,
                 "dc":0.001,
                "maxDist":200
            });
        }*/
}

/**
 * convert relative position to absolute
 * @param {path} path path data
 */
function convertPathsToAbsoluteValues(path) {
  let i; let len = path.i.length;
  for (i=0; i<len; i+=1) {
    path.i[i][0] += path.v[i][0];
    path.i[i][1] += path.v[i][1];
    path.o[i][0] += path.v[i][0];
    path.o[i][1] += path.v[i][1];
  }
}

/**
 * checkVersion
 * @param {*} minimum minimum version
 * @param {*} animVersionString animate data version
 * @return {Boolean}
 */
function checkVersion(minimum, animVersionString) {
  let animVersion = animVersionString ? animVersionString.split('.') : [100, 100, 100];
  if (minimum[0]>animVersion[0]) {
    return true;
  } else if (animVersion[0] > minimum[0]) {
    return false;
  }
  if (minimum[1]>animVersion[1]) {
    return true;
  } else if (animVersion[1] > minimum[1]) {
    return false;
  }
  if (minimum[2]>animVersion[2]) {
    return true;
  } else if (animVersion[2] > minimum[2]) {
    return false;
  }
}

let checkText = (function() {
  let minimumVersion = [4, 4, 14];

  /**
   * updateTextLayer
   * @param {*} textLayer textLayer
   */
  function updateTextLayer(textLayer) {
    let documentData = textLayer.t.d;
    textLayer.t.d = {
      k: [
        {
          s: documentData,
          t: 0,
        },
      ],
    };
  }

  /**
   * iterateLayers
   * @param {*} layers layers
   */
  function iterateLayers(layers) {
    let i; let len = layers.length;
    for (i=0; i<len; i+=1) {
      if (layers[i].ty === 5) {
        updateTextLayer(layers[i]);
      }
    }
  }

  return function(animationData) {
    if (checkVersion(minimumVersion, animationData.v)) {
      iterateLayers(animationData.layers);
      if (animationData.assets) {
        let i; let len = animationData.assets.length;
        for (i=0; i<len; i+=1) {
          if (animationData.assets[i].layers) {
            iterateLayers(animationData.assets[i].layers);
          }
        }
      }
    }
  };
}());

let checkChars = (function() {
  let minimumVersion = [4, 7, 99];
  return function(animationData) {
    if (animationData.chars && !checkVersion(minimumVersion, animationData.v)) {
      let i; let len = animationData.chars.length; let j; let jLen;// let k; let kLen;
      let pathData; let paths;
      for (i = 0; i < len; i += 1) {
        if (animationData.chars[i].data && animationData.chars[i].data.shapes) {
          paths = animationData.chars[i].data.shapes[0].it;
          jLen = paths.length;

          for (j = 0; j < jLen; j += 1) {
            pathData = paths[j].ks.k;
            if (!pathData.__converted) {
              convertPathsToAbsoluteValues(paths[j].ks.k);
              pathData.__converted = true;
            }
          }
        }
      }
    }
  };
}());

let checkColors = (function() {
  let minimumVersion = [4, 1, 9];

  /**
   * iterateShapes
   * @param {*} shapes shapes
   */
  function iterateShapes(shapes) {
    let i; let len = shapes.length;
    let j; let jLen;
    for (i=0; i<len; i+=1) {
      if (shapes[i].ty === 'gr') {
        iterateShapes(shapes[i].it);
      } else if (shapes[i].ty === 'fl' || shapes[i].ty === 'st') {
        if (shapes[i].c.k && shapes[i].c.k[0].i) {
          jLen = shapes[i].c.k.length;
          for (j=0; j<jLen; j+=1) {
            if (shapes[i].c.k[j].s) {
              shapes[i].c.k[j].s[0] /= 255;
              shapes[i].c.k[j].s[1] /= 255;
              shapes[i].c.k[j].s[2] /= 255;
              shapes[i].c.k[j].s[3] /= 255;
            }
            if (shapes[i].c.k[j].e) {
              shapes[i].c.k[j].e[0] /= 255;
              shapes[i].c.k[j].e[1] /= 255;
              shapes[i].c.k[j].e[2] /= 255;
              shapes[i].c.k[j].e[3] /= 255;
            }
          }
        } else {
          shapes[i].c.k[0] /= 255;
          shapes[i].c.k[1] /= 255;
          shapes[i].c.k[2] /= 255;
          shapes[i].c.k[3] /= 255;
        }
      }
    }
  }

  /**
   * iterateLayers
   * @param {*} layers layers
   */
  function iterateLayers(layers) {
    let i; let len = layers.length;
    for (i=0; i<len; i+=1) {
      if (layers[i].ty === 4) {
        iterateShapes(layers[i].shapes);
      }
    }
  }

  return function(animationData) {
    if (checkVersion(minimumVersion, animationData.v)) {
      iterateLayers(animationData.layers);
      if (animationData.assets) {
        let i; let len = animationData.assets.length;
        for (i=0; i<len; i+=1) {
          if (animationData.assets[i].layers) {
            iterateLayers(animationData.assets[i].layers);
          }
        }
      }
    }
  };
}());

let checkShapes = (function() {
  let minimumVersion = [4, 4, 18];

  /**
   * completeShapes
   * @param {*} arr arr
   */
  function completeShapes(arr) {
    let i; let len = arr.length;
    let j; let jLen;
    // let hasPaths = false;
    for (i=len-1; i>=0; i-=1) {
      if (arr[i].ty == 'sh') {
        if (arr[i].ks.k.i) {
          arr[i].ks.k.c = arr[i].closed;
        } else {
          jLen = arr[i].ks.k.length;
          for (j=0; j<jLen; j+=1) {
            if (arr[i].ks.k[j].s) {
              arr[i].ks.k[j].s[0].c = arr[i].closed;
            }
            if (arr[i].ks.k[j].e) {
              arr[i].ks.k[j].e[0].c = arr[i].closed;
            }
          }
        }
        // hasPaths = true;
      } else if (arr[i].ty == 'gr') {
        completeShapes(arr[i].it);
      }
    }
  }

  /**
   * iterateLayers
   * @param {*} layers layers
   */
  function iterateLayers(layers) {
    let layerData;
    let i; let len = layers.length;
    let j; let jLen; let k; let kLen;
    for (i=0; i<len; i+=1) {
      layerData = layers[i];
      if (layerData.hasMask) {
        let maskProps = layerData.masksProperties;
        jLen = maskProps.length;
        for (j=0; j<jLen; j+=1) {
          if (maskProps[j].pt.k.i) {
            maskProps[j].pt.k.c = maskProps[j].cl;
          } else {
            kLen = maskProps[j].pt.k.length;
            for (k=0; k<kLen; k+=1) {
              if (maskProps[j].pt.k[k].s) {
                maskProps[j].pt.k[k].s[0].c = maskProps[j].cl;
              }
              if (maskProps[j].pt.k[k].e) {
                maskProps[j].pt.k[k].e[0].c = maskProps[j].cl;
              }
            }
          }
        }
      }
      if (layerData.ty === 4) {
        completeShapes(layerData.shapes);
      }
    }
  }

  return function(animationData) {
    if (checkVersion(minimumVersion, animationData.v)) {
      iterateLayers(animationData.layers);
      if (animationData.assets) {
        let i; let len = animationData.assets.length;
        for (i=0; i<len; i+=1) {
          if (animationData.assets[i].layers) {
            iterateLayers(animationData.assets[i].layers);
          }
        }
      }
    }
  };
}());

/**
 * completeData
 * @param {*} animationData animationData
 * @param {*} fontManager fontManager
 */
function completeData(animationData, fontManager) {
  if (animationData.__complete) {
    return;
  }
  checkColors(animationData);
  checkText(animationData);
  checkChars(animationData);
  checkShapes(animationData);
  completeLayers(animationData.layers, animationData.assets, fontManager);
  animationData.__complete = true;
  // blitAnimation(animationData, animationData.assets, fontManager);
}

/**
 * completeText
 * @param {*} data data
 * @param {*} fontManager fontManager
 */
function completeText(data, fontManager) {
  if (data.t.a.length === 0 && !('m' in data.t.p)) {
    data.singleShape = true;
  }
}

export default {
  completeData,
  checkColors,
  checkChars,
  checkShapes,
  completeLayers,
};
