
import {Point} from './Point';

let NURBSUtils = {

  /**
   * Finds knot vector span.
   * @param {number} p degree
   * @param {number} u parametric value
   * @param {number} U knot vector
   * @return {number} span
   */
  findSpan: function( p, u, U ) {
    let n = U.length - p - 1;

    if ( u >= U[n] ) {
      return n - 1;
    }

    if ( u <= U[p] ) {
      return p;
    }

    let low = p;
    let high = n;
    let mid = Math.floor( ( low + high ) / 2 );

    while ( u < U[mid] || u >= U[mid + 1] ) {
      if ( u < U[mid] ) {
        high = mid;
      } else {
        low = mid;
      }

      mid = Math.floor( ( low + high ) / 2 );
    }

    return mid;
  },


  /**
   * Calculate basis functions. See The NURBS Book, page 70, algorithm A2.2
   * @param {number} span span in which u lies
   * @param {number} u parametric point
   * @param {number} p degree
   * @param {number} U knot vector
   * @return {array} array[p+1] with basis functions values.
   */
  calcBasisFunctions: function( span, u, p, U ) {
    let N = [];
    let left = [];
    let right = [];
    N[0] = 1.0;

    for ( let j = 1; j <= p; ++ j ) {
      left[j] = u - U[span + 1 - j];
      right[j] = U[span + j] - u;

      let saved = 0.0;

      for ( let r = 0; r < j; ++ r ) {
        let rv = right[r + 1];
        let lv = left[j - r];
        let temp = N[r] / ( rv + lv );
        N[r] = saved + rv * temp;
        saved = lv * temp;
      }

      N[j] = saved;
    }

    return N;
  },


  /**
   * Calculate B-Spline curve points. See The NURBS Book, page 82
   * @param {number} p degree of B-Spline
   * @param {vector} U knot vector
   * @param {vector} P control points (x, y, z, w)
   * @param {vector} u parametric point
   * @return {point} point for given u
  */
  calcBSplinePoint: function( p, U, P, u ) {
    let span = this.findSpan( p, u, U );
    let N = this.calcBasisFunctions( span, u, p, U );
    let C = new Point( 0, 0, 0, 0 );

    for ( let j = 0; j <= p; ++ j ) {
      let point = P[span - p + j];
      let Nj = N[j];
      let wNj = point.w * Nj;
      C.x += point.x * wNj;
      C.y += point.y * wNj;
      C.z += point.z * wNj;
      C.w += point.w * Nj;
    }

    return C;
  },


  /**
   * Calculate basis functions derivatives.
   * See The NURBS Book, page 72, algorithm A2.3.
   * @param {number} span span in which u lies
   * @param {number} u    parametric point
   * @param {number} p    degree
   * @param {number} n    number of derivatives to calculate
   * @param {number} U    knot vector
   * @return {array} ders
   */
  calcBasisFunctionDerivatives: function( span, u, p, n, U ) {
    let zeroArr = [];
    let i = 0;
    for ( i = 0; i <= p; ++ i ) {
      zeroArr[i] = 0.0;
    }

    let ders = [];
    for ( i = 0; i <= n; ++ i ) {
      ders[i] = zeroArr.slice( 0 );
    }

    let ndu = [];
    for ( i = 0; i <= p; ++ i ) {
      ndu[i] = zeroArr.slice( 0 );
    }

    ndu[0][0] = 1.0;

    let left = zeroArr.slice( 0 );
    let right = zeroArr.slice( 0 );
    let j = 1;
    let r = 0;
    let k = 1;

    for ( j = 1; j <= p; ++ j ) {
      left[j] = u - U[span + 1 - j];
      right[j] = U[span + j] - u;

      let saved = 0.0;
      for ( r = 0; r < j; ++ r ) {
        let rv = right[r + 1];
        let lv = left[j - r];
        ndu[j][r] = rv + lv;

        let temp = ndu[r][j - 1] / ndu[j][r];
        ndu[r][j] = saved + rv * temp;
        saved = lv * temp;
      }

      ndu[j][j] = saved;
    }

    for ( j = 0; j <= p; ++ j ) {
      ders[0][j] = ndu[j][p];
    }

    for ( r = 0; r <= p; ++ r ) {
      let s1 = 0;
      let s2 = 1;

      let a = [];
      for ( i = 0; i <= p; ++ i ) {
        a[i] = zeroArr.slice( 0 );
      }
      a[0][0] = 1.0;

      for ( k = 1; k <= n; ++ k ) {
        let d = 0.0;
        let rk = r - k;
        let pk = p - k;

        if ( r >= k ) {
          a[s2][0] = a[s1][0] / ndu[pk + 1][rk];
          d = a[s2][0] * ndu[rk][pk];
        }

        let j1 = ( rk >= - 1 ) ? 1 : - rk;
        let j2 = ( r - 1 <= pk ) ? k - 1 : p - r;

        for ( j = j1; j <= j2; ++ j ) {
          a[s2][j] = ( a[s1][j] - a[s1][j - 1] ) / ndu[pk + 1][rk + j];
          d += a[s2][j] * ndu[rk + j][pk];
        }

        if ( r <= pk ) {
          a[s2][k] = - a[s1][k - 1] / ndu[pk + 1][r];
          d += a[s2][k] * ndu[r][pk];
        }

        ders[k][r] = d;

        j = s1;
        s1 = s2;
        s2 = j;
      }
    }

    r = p;

    for ( k = 1; k <= n; ++ k ) {
      for ( j = 0; j <= p; ++ j ) {
        ders[k][j] *= r;
      }
      r *= p - k;
    }

    return ders;
  },


  /**
   * Calculate derivatives of a B-Spline.
   * See The NURBS Book, page 93, algorithm A3.2.
   * @param {number} p   degree
   * @param {number} U   knot vector
   * @param {number} P   control points
   * @param {number} u   Parametric points
   * @param {number} nd  number of derivatives
   * @return {array} array[d+1] with derivatives
   */
  calcBSplineDerivatives: function( p, U, P, u, nd ) {
    let du = nd < p ? nd : p;
    let CK = [];
    let span = this.findSpan( p, u, U );
    let nders = this.calcBasisFunctionDerivatives( span, u, p, du, U );
    let Pw = [];
    let point;
    let i = 0;
    let k = 0;

    for ( ; i < P.length; ++ i ) {
      point = P[i].clone();
      let w = point.w;

      point.x *= w;
      point.y *= w;
      point.z *= w;

      Pw[i] = point;
    }
    for ( ; k <= du; ++ k ) {
      point = Pw[span - p].clone().multiplyScalar( nders[k][0] );

      for ( let j = 1; j <= p; ++ j ) {
        point.add( Pw[span - p + j].clone().multiplyScalar( nders[k][j] ) );
      }

      CK[k] = point;
    }

    for ( k = du + 1; k <= nd + 1; ++ k ) {
      CK[k] = new Point( 0, 0, 0 );
    }

    return CK;
  },


  /*
  Calculate "K over I"

  returns k!/(i!(k-i)!)
  */
  calcKoverI: function( k, i ) {
    let nom = 1;
    let j = 2;

    for ( j = 2; j <= k; ++ j ) {
      nom *= j;
    }

    let denom = 1;

    for ( j = 2; j <= i; ++ j ) {
      denom *= j;
    }

    for ( j = 2; j <= k - i; ++ j ) {
      denom *= j;
    }

    return nom / denom;
  },


  /**
   * Calculate derivatives (0-nd) of rational curve.
   * See The NURBS Book, page 127, algorithm A4.2.
   * @param {array} Pders result of function calcBSplineDerivatives
   * @return {array} with derivatives for rational curve.
   */
  calcRationalCurveDerivatives: function( Pders ) {
    let nd = Pders.length;
    let Aders = [];
    let wders = [];
    let i = 0;

    for ( i = 0; i < nd; ++ i ) {
      let point = Pders[i];
      Aders[i] = new Point( point.x, point.y, point.z );
      wders[i] = point.w;
    }

    let CK = [];

    for ( let k = 0; k < nd; ++ k ) {
      let v = Aders[k].clone();

      for ( i = 1; i <= k; ++ i ) {
        v.sub(
          CK[k - i].
            clone().
            multiplyScalar( this.calcKoverI( k, i ) * wders[i] )
        );
      }

      CK[k] = v.divideScalar( wders[0] );
    }

    return CK;
  },


  /**
   * Calculate NURBS curve derivatives.
   * See The NURBS Book, page 127, algorithm A4.2.
   * @param {number} p  degree
   * @param {number} U  knot vector
   * @param {number} P  control points in homogeneous space
   * @param {number} u  parametric points
   * @param {number} nd number of derivatives
   * @return {array} returns array with derivatives.
   */
  calcNURBSDerivatives: function( p, U, P, u, nd ) {
    let Pders = this.calcBSplineDerivatives( p, U, P, u, nd );
    return this.calcRationalCurveDerivatives( Pders );
  },


  /**
   * Calculate rational B-Spline surface point.
   * See The NURBS Book, page 134, algorithm A4.3.
   * @param {number} p degrees of B-Spline surface
   * @param {number} q degrees of B-Spline surface
   *
   * @param {number} U knot vectors
   * @param {number} V knot vectors
   *
   * @param {number} P control points (x, y, z, w)
   *
   * @param {number} u parametric values
   * @param {number} v parametric values
   * @return {JC.Point} point for given (u, v)
   */
  calcSurfacePoint: function( p, q, U, V, P, u, v ) {
    let uspan = this.findSpan( p, u, U );
    let vspan = this.findSpan( q, v, V );
    let Nu = this.calcBasisFunctions( uspan, u, p, U );
    let Nv = this.calcBasisFunctions( vspan, v, q, V );
    let temp = [];
    let l = 0;

    for ( ; l <= q; ++ l ) {
      temp[l] = new Point( 0, 0, 0, 0 );
      for ( let k = 0; k <= p; ++ k ) {
        let point = P[uspan - p + k][vspan - q + l].clone();
        let w = point.w;
        point.x *= w;
        point.y *= w;
        point.z *= w;
        temp[l].add( point.multiplyScalar( Nu[k] ) );
      }
    }

    let Sw = new Point( 0, 0, 0, 0 );
    for ( l = 0; l <= q; ++ l ) {
      Sw.add( temp[l].multiplyScalar( Nv[l] ) );
    }

    Sw.divideScalar( Sw.w );
    return new Point( Sw.x, Sw.y, Sw.z );
  },

};

export {NURBSUtils};

