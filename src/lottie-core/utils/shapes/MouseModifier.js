import ShapeModifier from './ShapeModifier';

/**
 * MouseModifier class
 */
export default class MouseModifier extends ShapeModifier {
  /**
   * init modifier properties
   * @param {*} elem element node
   * @param {*} data mouse value property data
   */
  initModifierProperties(elem, data) {
    this.getValue = this.processKeys;
    this.data = data;
    this.positions = [];
  }

  /**
   * process keys
   * @param {number} frameNum frameNum
   * @param {*} forceRender force render
   */
  processKeys(frameNum, forceRender) {
    if (frameNum === this.frameId && !forceRender) {
      return;
    }
    this._mdf = true;
  }

  /**
   * add shape to modifier
   */
  addShapeToModifier() {
    this.positions.push([]);
  }

  /**
   * a
   * @param {*} path a
   * @param {*} mouseCoords a
   * @param {*} positions a
   * @return {*}
   */
  processPath(path, mouseCoords, positions) {
    let i; let len = path.v.length;
    let vValues = []; let oValues = []; let iValues = [];
    // let dist;
    let theta; let x; let y;
    // // OPTION A
    for (i=0; i<len; i+=1) {
      if (!positions.v[i]) {
        positions.v[i] = [path.v[i][0], path.v[i][1]];
        positions.o[i] = [path.o[i][0], path.o[i][1]];
        positions.i[i] = [path.i[i][0], path.i[i][1]];
        positions.distV[i] = 0;
        positions.distO[i] = 0;
        positions.distI[i] = 0;
      }
      theta = Math.atan2(
        path.v[i][1] - mouseCoords[1],
        path.v[i][0] - mouseCoords[0]
      );

      x = mouseCoords[0] - positions.v[i][0];
      y = mouseCoords[1] - positions.v[i][1];
      let distance = Math.sqrt( (x * x) + (y * y) );
      positions.distV[i] += (distance - positions.distV[i]) * this.data.dc;

      positions.v[i][0] = Math.cos(theta) * Math.max(0, this.data.maxDist-positions.distV[i])/2 + (path.v[i][0]);
      positions.v[i][1] = Math.sin(theta) * Math.max(0, this.data.maxDist-positions.distV[i])/2 + (path.v[i][1]);


      theta = Math.atan2(
        path.o[i][1] - mouseCoords[1],
        path.o[i][0] - mouseCoords[0]
      );

      x = mouseCoords[0] - positions.o[i][0];
      y = mouseCoords[1] - positions.o[i][1];
      distance = Math.sqrt( (x * x) + (y * y) );
      positions.distO[i] += (distance - positions.distO[i]) * this.data.dc;

      positions.o[i][0] = Math.cos(theta) * Math.max(0, this.data.maxDist-positions.distO[i])/2 + (path.o[i][0]);
      positions.o[i][1] = Math.sin(theta) * Math.max(0, this.data.maxDist-positions.distO[i])/2 + (path.o[i][1]);


      theta = Math.atan2(
        path.i[i][1] - mouseCoords[1],
        path.i[i][0] - mouseCoords[0]
      );

      x = mouseCoords[0] - positions.i[i][0];
      y = mouseCoords[1] - positions.i[i][1];
      distance = Math.sqrt( (x * x) + (y * y) );
      positions.distI[i] += (distance - positions.distI[i]) * this.data.dc;

      positions.i[i][0] = Math.cos(theta) * Math.max(0, this.data.maxDist-positions.distI[i])/2 + (path.i[i][0]);
      positions.i[i][1] = Math.sin(theta) * Math.max(0, this.data.maxDist-positions.distI[i])/2 + (path.i[i][1]);

      // ///OPTION 1
      vValues.push(positions.v[i]);
      oValues.push(positions.o[i]);
      iValues.push(positions.i[i]);


      // ///OPTION 2
      // vValues.push(positions.v[i]);
      // iValues.push([path.i[i][0]+(positions.v[i][0]-path.v[i][0]),path.i[i][1]+(positions.v[i][1]-path.v[i][1])]);
      // oValues.push([path.o[i][0]+(positions.v[i][0]-path.v[i][0]),path.o[i][1]+(positions.v[i][1]-path.v[i][1])]);


      // ///OPTION 3
      // vValues.push(positions.v[i]);
      // iValues.push(path.i[i]);
      // oValues.push(path.o[i]);


      // ///OPTION 4
      // vValues.push(path.v[i]);
      // oValues.push(positions.o[i]);
      // iValues.push(positions.i[i]);
    }


    // // OPTION B
    /* for(i=0;i<len;i+=1){
          if(!positions.v[i]){
              positions.v[i] = [path.v[i][0],path.v[i][1]];
              positions.o[i] = [path.o[i][0],path.o[i][1]];
              positions.i[i] = [path.i[i][0],path.i[i][1]];
              positions.distV[i] = 0;

          }
          theta = Math.atan2(
              positions.v[i][1] - mouseCoords[1],
              positions.v[i][0] - mouseCoords[0]
          );
          x = mouseCoords[0] - positions.v[i][0];
          y = mouseCoords[1] - positions.v[i][1];
          var distance = this.data.ss * this.data.mx / Math.sqrt( (x * x) + (y * y) );

          positions.v[i][0] += Math.cos(theta) * distance + (path.v[i][0] - positions.v[i][0]) * this.data.dc;
          positions.v[i][1] += Math.sin(theta) * distance + (path.v[i][1] - positions.v[i][1]) * this.data.dc;


          theta = Math.atan2(
              positions.o[i][1] - mouseCoords[1],
              positions.o[i][0] - mouseCoords[0]
          );
          x = mouseCoords[0] - positions.o[i][0];
          y = mouseCoords[1] - positions.o[i][1];
          var distance =  this.data.ss * this.data.mx / Math.sqrt( (x * x) + (y * y) );

          positions.o[i][0] += Math.cos(theta) * distance + (path.o[i][0] - positions.o[i][0]) * this.data.dc;
          positions.o[i][1] += Math.sin(theta) * distance + (path.o[i][1] - positions.o[i][1]) * this.data.dc;


          theta = Math.atan2(
              positions.i[i][1] - mouseCoords[1],
              positions.i[i][0] - mouseCoords[0]
          );
          x = mouseCoords[0] - positions.i[i][0];
          y = mouseCoords[1] - positions.i[i][1];
          var distance =  this.data.ss * this.data.mx / Math.sqrt( (x * x) + (y * y) );

          positions.i[i][0] += Math.cos(theta) * distance + (path.i[i][0] - positions.i[i][0]) * this.data.dc;
          positions.i[i][1] += Math.sin(theta) * distance + (path.i[i][1] - positions.i[i][1]) * this.data.dc;

          /////OPTION 1
          //vValues.push(positions.v[i]);
          // oValues.push(positions.o[i]);
          // iValues.push(positions.i[i]);


          /////OPTION 2
          //vValues.push(positions.v[i]);
          // iValues.push([path.i[i][0]+(positions.v[i][0]-path.v[i][0]),path.i[i][1]+(positions.v[i][1]-path.v[i][1])]);
          // oValues.push([path.o[i][0]+(positions.v[i][0]-path.v[i][0]),path.o[i][1]+(positions.v[i][1]-path.v[i][1])]);


          /////OPTION 3
          //vValues.push(positions.v[i]);
          //iValues.push(path.i[i]);
          //oValues.push(path.o[i]);


          /////OPTION 4
          //vValues.push(path.v[i]);
          // oValues.push(positions.o[i]);
          // iValues.push(positions.i[i]);
      }*/


    return {
      v: vValues,
      o: oValues,
      i: iValues,
      c: path.c,
    };
  }

  /**
   * process shapes
   */
  processShapes() {
    // FIXME: mouse modifier data
    let mouseX = this.elem.globalData.mouseX;
    let mouseY = this.elem.globalData.mouseY;
    let shapePaths;
    let i; let len = this.shapes.length;
    let j; let jLen;

    if (mouseX) {
      let localMouseCoords = this.elem.globalToLocal([mouseX, mouseY, 0]);

      let shapeData; let newPaths = [];
      for (i=0; i<len; i+=1) {
        shapeData = this.shapes[i];
        if (!shapeData.shape._mdf && !this._mdf) {
          shapeData.shape.paths = shapeData.last;
        } else {
          shapeData.shape._mdf = true;
          shapePaths = shapeData.shape.paths;
          jLen = shapePaths.length;
          for (j=0; j<jLen; j+=1) {
            if (!this.positions[i][j]) {
              this.positions[i][j] = {
                v: [],
                o: [],
                i: [],
                distV: [],
                distO: [],
                distI: [],
              };
            }
            newPaths.push(this.processPath(shapePaths[j], localMouseCoords, this.positions[i][j]));
          }
          shapeData.shape.paths = newPaths;
          shapeData.last = newPaths;
        }
      }
    }
  }
}
