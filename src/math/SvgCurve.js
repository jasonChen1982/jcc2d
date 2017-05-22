
import {Point} from './Point';
import {Curve} from './Curve';
import {Utils} from '../util/Utils';

// SvgCurve.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); // TODO: some like don`t need svg tag to wrap

/**
 *
 * @param {String}  path  array of points
 */
function SvgCurve( path ) {
  if (Utils.isString(path)) {
    this.path = this.createPath(path);
  } else if (path.nodeName === 'path' && path.getAttribute('d')) {
    this.path = path;
  } else {
    /* eslint max-len: "off" */
    console.warn(
      'path just accept <path d="M10 10"> element or "M10 10" string but found ' + path
    );
  }
  this.totalLength = this.path.getTotalLength();
}

SvgCurve.prototype = Object.create( Curve.prototype );

SvgCurve.prototype.createPath = function(d) {
  let p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  return p.setAttribute(d);
};

SvgCurve.prototype.getPoint = function(t) {
  let point = this.path.getPointAtLength(t * this.totalLength);
  return new Point(point.x, point.y);
};

export {SvgCurve};
