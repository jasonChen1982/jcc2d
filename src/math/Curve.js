
// import { Point } from './Point';

function Curve() {}

Curve.prototype = {

  constructor: Curve,

  getPoint: function ( t ) {

    console.warn( 'Curve: Warning, getPoint() not implemented!', t );
    return null;

  },

  getPointAt: function ( u ) {

    var t = this.getUtoTmapping( u );
    return this.getPoint( t );

  },

  getPoints: function ( divisions ) {

    if ( isNaN( divisions ) ) divisions = 5;

    var points = [];

    for ( var d = 0; d <= divisions; d ++ ) {

      points.push( this.getPoint( d / divisions ) );

    }

    return points;

  },

  getSpacedPoints: function ( divisions ) {

    if ( isNaN( divisions ) ) divisions = 5;

    var points = [];

    for ( var d = 0; d <= divisions; d ++ ) {

      points.push( this.getPointAt( d / divisions ) );

    }

    return points;

  },

  getLength: function () {

    var lengths = this.getLengths();
    return lengths[ lengths.length - 1 ];

  },

  getLengths: function ( divisions ) {

    if ( isNaN( divisions ) ) divisions = ( this.__arcLengthDivisions ) ? ( this.__arcLengthDivisions ) : 200;

    if ( this.cacheArcLengths
      && ( this.cacheArcLengths.length === divisions + 1 )
      && ! this.needsUpdate ) {
      return this.cacheArcLengths;
    }

    this.needsUpdate = false;

    var cache = [];
    var current, last = this.getPoint( 0 );
    var p, sum = 0;

    cache.push( 0 );

    for ( p = 1; p <= divisions; p ++ ) {
      current = this.getPoint ( p / divisions );
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

  getUtoTmapping: function ( u, distance ) {

    var arcLengths = this.getLengths();

    var i = 0, il = arcLengths.length, t;

    var targetArcLength;

    if ( distance ) {

      targetArcLength = distance;

    } else {

      targetArcLength = u * arcLengths[ il - 1 ];

    }

    var low = 0, high = il - 1, comparison;
    while ( low <= high ) {
      i = Math.floor( low + ( high - low ) / 2 );
      comparison = arcLengths[ i ] - targetArcLength;
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

    if ( arcLengths[ i ] === targetArcLength ) {
      t = i / ( il - 1 );
      return t;
    }

    var lengthBefore = arcLengths[ i ];
    var lengthAfter = arcLengths[ i + 1 ];

    var segmentLength = lengthAfter - lengthBefore;

    var segmentFraction = ( targetArcLength - lengthBefore ) / segmentLength;

    t = ( i + segmentFraction ) / ( il - 1 );

    return t;
  },

  getTangent: function( t ) {

    var delta = 0.0001;
    var t1 = t - delta;
    var t2 = t + delta;

    // TODO: svg and bezier accept out of [0, 1] value
    // if ( t1 < 0 ) t1 = 0;
    // if ( t2 > 1 ) t2 = 1;

    var pt1 = this.getPoint( t1 );
    var pt2 = this.getPoint( t2 );

    var vec = pt2.clone().sub( pt1 );
    return vec.normalize();

  },

  getTangentAt: function ( u ) {

    var t = this.getUtoTmapping( u );
    return this.getTangent( t );

  },

};

export { Curve };
