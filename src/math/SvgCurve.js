
import { Point } from './Point';
import { Curve } from './Curve';
import { UTILS } from '../util/UTILS';

// SvgCurve.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); // TODO: some like don`t need svg tag to wrap

/**
 *
 * @param {String}  path  array of points
 */
function SvgCurve( path ) {
  if (UTILS.isString(path)) {
    this.path = this.createPath(path);
  } else if (path.nodeName === 'path' && path.getAttribute('d')) {
    this.path = path;
  } else {
    console.warn(
        '%c JC.SvgCurve warn %c: SvgCurve just accept <path d="M10 10"> element or "M10 10" string but found %c' + path + '%c',
        'color: #f98165; background: #80a89e',
        'color: #80a89e; background: #cad9d5;',
        'color: #f98165; background: #cad9d5',
        'color: #80a89e; background: #cad9d5'
    );
  }
  this.totalLength = this.path.getTotalLength();
}

SvgCurve.prototype = Object.create( Curve.prototype );

SvgCurve.prototype.createPath = function (d) {
  var p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  return p.setAttribute(d);
};

SvgCurve.prototype.getPoint = function (t) {
  var point = this.path.getPointAtLength(t * this.totalLength);
  return new Point(point.x, point.y);
};

export { SvgCurve };
