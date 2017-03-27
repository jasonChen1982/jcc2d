
// import { Point } from './Point';
/**
 * @class Curve
 */
function Curve() {}

Curve.prototype = {

  constructor: Curve,

  getPoint: function( t ) {
    console.warn( 'Curve: Warning, getPoint() not implemented!', t );
    return null;
  },

  getPointAt: function( u ) {
    let t = this.getUtoTmapping( u );
    return this.getPoint( t );
  },

  getPoints: function( divisions ) {
    if ( isNaN( divisions ) ) divisions = 5;

    let points = [];

    for ( let d = 0; d <= divisions; d ++ ) {
      points.push( this.getPoint( d / divisions ) );
    }

    return points;
  },

  getSpacedPoints: function( divisions ) {
    if ( isNaN( divisions ) ) divisions = 5;

    let points = [];

    for ( let d = 0; d <= divisions; d ++ ) {
      points.push( this.getPointAt( d / divisions ) );
    }

    return points;
  },

  getLength: function() {
    let lengths = this.getLengths();
    return lengths[lengths.length - 1];
  },

  getLengths: function( divisions ) {
    if (isNaN(divisions)) divisions = ( this.__arcLengthDivisions ) ?
    ( this.__arcLengthDivisions ) :
    200;

    if ( this.cacheArcLengths
      && ( this.cacheArcLengths.length === divisions + 1 )
      && ! this.needsUpdate ) {
      return this.cacheArcLengths;
    }

    this.needsUpdate = false;

    let cache = [];
    let current;
    let last = this.getPoint( 0 );
    let p;
    let sum = 0;

    cache.push( 0 );

    for ( p = 1; p <= divisions; p ++ ) {
      current = this.getPoint( p / divisions );
      sum += current.distanceTo( last );
      cache.push( sum );
      last = current;
    }
    this.cacheArcLengths = cache;
    return cache;
  },

  updateArcLengths: function() {
    this.needsUpdate = true;
    this.getLengths();
  },

  getUtoTmapping: function( u, distance ) {
    let arcLengths = this.getLengths();

    let i = 0;
    let il = arcLengths.length;
    let t;

    let targetArcLength;

    if ( distance ) {
      targetArcLength = distance;
    } else {
      targetArcLength = u * arcLengths[il - 1];
    }

    let low = 0;
    let high = il - 1;
    let comparison;
    while ( low <= high ) {
      i = Math.floor( low + ( high - low ) / 2 );
      comparison = arcLengths[i] - targetArcLength;
      if ( comparison < 0 ) {
        low = i + 1;
      } else if ( comparison > 0 ) {
        high = i - 1;
      } else {
        high = i;
        break;
      }
    }

    i = high;

    if ( arcLengths[i] === targetArcLength ) {
      t = i / ( il - 1 );
      return t;
    }

    let lengthBefore = arcLengths[i];
    let lengthAfter = arcLengths[i + 1];

    let segmentLength = lengthAfter - lengthBefore;

    let segmentFraction = ( targetArcLength - lengthBefore ) / segmentLength;

    t = ( i + segmentFraction ) / ( il - 1 );

    return t;
  },

  getTangent: function( t ) {
    let delta = 0.0001;
    let t1 = t - delta;
    let t2 = t + delta;

    // TODO: svg and bezier accept out of [0, 1] value
    // if ( t1 < 0 ) t1 = 0;
    // if ( t2 > 1 ) t2 = 1;

    let pt1 = this.getPoint( t1 );
    let pt2 = this.getPoint( t2 );

    let vec = pt2.clone().sub( pt1 );
    return vec.normalize();
  },

  getTangentAt: function( u ) {
    let t = this.getUtoTmapping( u );
    return this.getTangent( t );
  },

};

export {Curve};
