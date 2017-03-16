
import { Point } from './Point';
import { Curve } from './Curve';
import { NURBSUtils } from './NURBSUtils';

/**
 *
 * @param {Number} degree
 * @param {Array}  knots           array of reals
 * @param {Array}  controlPoints   array of Point
 */

function NURBSCurve( degree, knots, controlPoints ) {
    this.degree = degree;
    this.knots = knots;
    this.controlPoints = controlPoints; // [];
    // for ( var i = 0; i < controlPoints.length; ++ i ) {
    //     // ensure Vector4 for control points
    //     var point = controlPoints[ i ];
    //     this.controlPoints[ i ] = new Point( point.x, point.y, point.z, point.w );
    // }
}


NURBSCurve.prototype = Object.create( Curve.prototype );
NURBSCurve.prototype.constructor = NURBSCurve;


NURBSCurve.prototype.getPoint = function ( t ) {

    var u = this.knots[ 0 ] + t * ( this.knots[ this.knots.length - 1 ] - this.knots[ 0 ] ); // linear mapping t->u

    // following results in (wx, wy, wz, w) homogeneous point
    var hpoint = NURBSUtils.calcBSplinePoint( this.degree, this.knots, this.controlPoints, u );

    if ( hpoint.w != 1.0 ) {

        // project to 3D space: (wx, wy, wz, w) -> (x, y, z, 1)
        hpoint.divideScalar( hpoint.w );

    }

    return new Point( hpoint.x, hpoint.y, hpoint.z );

};


NURBSCurve.prototype.getTangent = function ( t ) {

    var u = this.knots[ 0 ] + t * ( this.knots[ this.knots.length - 1 ] - this.knots[ 0 ] );
    var ders = NURBSUtils.calcNURBSDerivatives( this.degree, this.knots, this.controlPoints, u, 1 );
    var tangent = ders[ 1 ].clone();
    tangent.normalize();

    return tangent;

};

