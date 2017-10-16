import {Quaternion} from '../math/Quaternion';
import {Vector3} from '../math/Vector3';
import {Matrix4} from '../math/Matrix4';
import {EventDispatcher} from './EventDispatcher';
import {Euler} from '../math/Euler';
import {Layers} from './Layers';
import {Matrix3} from '../math/Matrix3';
import {_Math} from '../math/Math';

/**
 * @author mrdoob / http://mrdoob.com/
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 * @author elephantatwork / www.elephantatwork.ch
 */

let object3DId = 0;

/**
 * 3D类
 */
function Object3D() {
  Object.defineProperty( this, 'id', {value: object3DId ++} );

  this.uuid = _Math.generateUUID();

  this.name = '';
  this.type = 'Object3D';

  this.parent = null;
  this.children = [];

  this.up = Object3D.DefaultUp.clone();

  let position = new Vector3();
  let rotation = new Euler();
  let quaternion = new Quaternion();
  let scale = new Vector3( 1, 1, 1 );

  /**
   * onRotationChange
   */
  function onRotationChange() {
    quaternion.setFromEuler( rotation, false );
  }

  /**
   * onQuaternionChange
   */
  function onQuaternionChange() {
    rotation.setFromQuaternion( quaternion, undefined, false );
  }

  rotation.onChange( onRotationChange );
  quaternion.onChange( onQuaternionChange );

  Object.defineProperties( this, {
    position: {
      enumerable: true,
      value: position,
    },
    rotation: {
      enumerable: true,
      value: rotation,
    },
    quaternion: {
      enumerable: true,
      value: quaternion,
    },
    scale: {
      enumerable: true,
      value: scale,
    },
    modelViewMatrix: {
      value: new Matrix4(),
    },
    normalMatrix: {
      value: new Matrix3(),
    },
  } );

  this.matrix = new Matrix4();
  this.matrixWorld = new Matrix4();

  this.matrixAutoUpdate = Object3D.DefaultMatrixAutoUpdate;
  this.matrixWorldNeedsUpdate = false;

  this.layers = new Layers();
  this.visible = true;

  this.castShadow = false;
  this.receiveShadow = false;

  this.frustumCulled = true;
  this.renderOrder = 0;

  this.userData = {};

  this.onBeforeRender = function() {};
  this.onAfterRender = function() {};
}

Object3D.DefaultUp = new Vector3( 0, 1, 0 );
Object3D.DefaultMatrixAutoUpdate = true;

Object3D.prototype = {

  constructor: Object3D,

  isObject3D: true,

  applyMatrix: function( matrix ) {
    this.matrix.multiplyMatrices( matrix, this.matrix );

    this.matrix.decompose( this.position, this.quaternion, this.scale );
  },

  setRotationFromAxisAngle: function( axis, angle ) {
    // assumes axis is normalized

    this.quaternion.setFromAxisAngle( axis, angle );
  },

  setRotationFromEuler: function( euler ) {
    this.quaternion.setFromEuler( euler, true );
  },

  setRotationFromMatrix: function( m ) {
    // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

    this.quaternion.setFromRotationMatrix( m );
  },

  setRotationFromQuaternion: function( q ) {
    // assumes q is normalized

    this.quaternion.copy( q );
  },

  rotateOnAxis: function() {
    // rotate object on axis in object space
    // axis is assumed to be normalized

    let q1 = new Quaternion();

    return function rotateOnAxis( axis, angle ) {
      q1.setFromAxisAngle( axis, angle );

      this.quaternion.multiply( q1 );

      return this;
    };
  }(),

  rotateX: function() {
    let v1 = new Vector3( 1, 0, 0 );

    return function rotateX( angle ) {
      return this.rotateOnAxis( v1, angle );
    };
  }(),

  rotateY: function() {
    let v1 = new Vector3( 0, 1, 0 );

    return function rotateY( angle ) {
      return this.rotateOnAxis( v1, angle );
    };
  }(),

  rotateZ: function() {
    let v1 = new Vector3( 0, 0, 1 );

    return function rotateZ( angle ) {
      return this.rotateOnAxis( v1, angle );
    };
  }(),

  translateOnAxis: function() {
    // translate object by distance along axis in object space
    // axis is assumed to be normalized

    let v1 = new Vector3();

    return function translateOnAxis( axis, distance ) {
      v1.copy( axis ).applyQuaternion( this.quaternion );

      this.position.add( v1.multiplyScalar( distance ) );

      return this;
    };
  }(),

  translateX: function() {
    let v1 = new Vector3( 1, 0, 0 );

    return function translateX( distance ) {
      return this.translateOnAxis( v1, distance );
    };
  }(),

  translateY: function() {
    let v1 = new Vector3( 0, 1, 0 );

    return function translateY( distance ) {
      return this.translateOnAxis( v1, distance );
    };
  }(),

  translateZ: function() {
    let v1 = new Vector3( 0, 0, 1 );

    return function translateZ( distance ) {
      return this.translateOnAxis( v1, distance );
    };
  }(),

  localToWorld: function( vector ) {
    return vector.applyMatrix4( this.matrixWorld );
  },

  worldToLocal: function() {
    let m1 = new Matrix4();

    return function worldToLocal( vector ) {
      return vector.applyMatrix4( m1.getInverse( this.matrixWorld ) );
    };
  }(),

  lookAt: function() {
    let m1 = new Matrix4();

    return function lookAt( vector ) {
      m1.lookAt( vector, this.position, this.up );

      this.quaternion.setFromRotationMatrix( m1 );
    };
  }(),

  add: function( object ) {
    if ( arguments.length > 1 ) {
      for ( let i = 0; i < arguments.length; i ++ ) {
        /* eslint prefer-rest-params: 0 */
        this.add( arguments[i] );
      }

      return this;
    }

    if ( object === this ) {
      console.error( 'add: can\'t be added as a child of itself.', object );
      return this;
    }

    if ( ( object && object.isObject3D ) ) {
      if ( object.parent !== null ) {
        object.parent.remove( object );
      }

      object.parent = this;
      object.dispatchEvent( {type: 'added'} );

      this.children.push( object );
    } else {
      console.error( 'add: object not an instance of ', object );
    }

    return this;
  },

  remove: function( object ) {
    if ( arguments.length > 1 ) {
      for ( let i = 0; i < arguments.length; i ++ ) {
        this.remove( arguments[i] );
      }
    }

    let index = this.children.indexOf( object );

    if ( index !== - 1 ) {
      object.parent = null;

      object.dispatchEvent( {type: 'removed'} );

      this.children.splice( index, 1 );
    }
  },

  getObjectById: function( id ) {
    return this.getObjectByProperty( 'id', id );
  },

  getObjectByName: function( name ) {
    return this.getObjectByProperty( 'name', name );
  },

  getObjectByProperty: function( name, value ) {
    if ( this[name] === value ) return this;

    for ( let i = 0, l = this.children.length; i < l; i ++ ) {
      let child = this.children[i];
      let object = child.getObjectByProperty( name, value );

      if ( object !== undefined ) {
        return object;
      }
    }

    return undefined;
  },

  getWorldPosition: function( optionalTarget ) {
    let result = optionalTarget || new Vector3();

    this.updateMatrixWorld( true );

    return result.setFromMatrixPosition( this.matrixWorld );
  },

  getWorldQuaternion: function() {
    let position = new Vector3();
    let scale = new Vector3();

    return function getWorldQuaternion( optionalTarget ) {
      let result = optionalTarget || new Quaternion();

      this.updateMatrixWorld( true );

      this.matrixWorld.decompose( position, result, scale );

      return result;
    };
  }(),

  getWorldRotation: function() {
    let quaternion = new Quaternion();

    return function getWorldRotation( optionalTarget ) {
      let result = optionalTarget || new Euler();

      this.getWorldQuaternion( quaternion );

      return result.setFromQuaternion( quaternion, this.rotation.order, false );
    };
  }(),

  getWorldScale: function() {
    let position = new Vector3();
    let quaternion = new Quaternion();

    return function getWorldScale( optionalTarget ) {
      let result = optionalTarget || new Vector3();

      this.updateMatrixWorld( true );

      this.matrixWorld.decompose( position, quaternion, result );

      return result;
    };
  }(),

  getWorldDirection: function() {
    let quaternion = new Quaternion();

    return function getWorldDirection( optionalTarget ) {
      let result = optionalTarget || new Vector3();

      this.getWorldQuaternion( quaternion );

      return result.set( 0, 0, 1 ).applyQuaternion( quaternion );
    };
  }(),

  raycast: function() {},

  traverse: function( callback ) {
    callback( this );

    let children = this.children;

    for ( let i = 0, l = children.length; i < l; i ++ ) {
      children[i].traverse( callback );
    }
  },

  traverseVisible: function( callback ) {
    if ( this.visible === false ) return;

    callback( this );

    let children = this.children;

    for ( let i = 0, l = children.length; i < l; i ++ ) {
      children[i].traverseVisible( callback );
    }
  },

  traverseAncestors: function( callback ) {
    let parent = this.parent;

    if ( parent !== null ) {
      callback( parent );

      parent.traverseAncestors( callback );
    }
  },

  updateMatrix: function() {
    this.matrix.compose( this.position, this.quaternion, this.scale );

    this.matrixWorldNeedsUpdate = true;
  },

  updateMatrixWorld: function( force ) {
    if ( this.matrixAutoUpdate === true ) this.updateMatrix();

    if ( this.matrixWorldNeedsUpdate === true || force === true ) {
      if ( this.parent === null ) {
        this.matrixWorld.copy( this.matrix );
      } else {
        this.matrixWorld.multiplyMatrices(
          this.parent.matrixWorld,
          this.matrix
        );
      }

      this.matrixWorldNeedsUpdate = false;

      force = true;
    }

    // update children

    let children = this.children;

    for ( let i = 0, l = children.length; i < l; i ++ ) {
      children[i].updateMatrixWorld( force );
    }
  },

  toJSON: function( meta ) {
    // meta is '' when called from JSON.stringify
    let isRootObject = ( meta === undefined || meta === '' );

    let output = {};

    // meta is a hash used to collect geometries, materials.
    // not providing it implies that this is the root object
    // being serialized.
    if ( isRootObject ) {
      // initialize meta obj
      meta = {
        geometries: {},
        materials: {},
        textures: {},
        images: {},
      };

      output.metadata = {
        version: 4.4,
        type: 'Object',
        generator: 'Object3D.toJSON',
      };
    }

    // standard Object3D serialization

    let object = {};

    object.uuid = this.uuid;
    object.type = this.type;

    if ( this.name !== '' ) object.name = this.name;
    if ( JSON.stringify( this.userData ) !== '{}' ) {
      object.userData = this.userData;
    }
    if ( this.castShadow === true ) object.castShadow = true;
    if ( this.receiveShadow === true ) object.receiveShadow = true;
    if ( this.visible === false ) object.visible = false;

    object.matrix = this.matrix.toArray();

    //

    if ( this.geometry !== undefined ) {
      if ( meta.geometries[this.geometry.uuid] === undefined ) {
        meta.geometries[this.geometry.uuid] = this.geometry.toJSON( meta );
      }

      object.geometry = this.geometry.uuid;
    }

    if ( this.material !== undefined ) {
      if ( meta.materials[this.material.uuid] === undefined ) {
        meta.materials[this.material.uuid] = this.material.toJSON( meta );
      }

      object.material = this.material.uuid;
    }

    //

    if ( this.children.length > 0 ) {
      object.children = [];

      for ( let i = 0; i < this.children.length; i ++ ) {
        object.children.push( this.children[i].toJSON( meta ).object );
      }
    }

    if ( isRootObject ) {
      let geometries = extractFromCache( meta.geometries );
      let materials = extractFromCache( meta.materials );
      let textures = extractFromCache( meta.textures );
      let images = extractFromCache( meta.images );

      if ( geometries.length > 0 ) output.geometries = geometries;
      if ( materials.length > 0 ) output.materials = materials;
      if ( textures.length > 0 ) output.textures = textures;
      if ( images.length > 0 ) output.images = images;
    }

    output.object = object;

    return output;

    // extract data from the cache hash
    // remove metadata on each item
    // and return as array
    /**
     * extractFromCache
     * @param {*} cache
     * @return {array}
     */
    function extractFromCache( cache ) {
      let values = [];
      /* eslint guard-for-in: 0 */
      for ( let key in cache ) {
        let data = cache[key];
        delete data.metadata;
        values.push( data );
      }
      return values;
    }
  },

  clone: function( recursive ) {
    return new this.constructor().copy( this, recursive );
  },

  copy: function( source, recursive ) {
    if ( recursive === undefined ) recursive = true;

    this.name = source.name;

    this.up.copy( source.up );

    this.position.copy( source.position );
    this.quaternion.copy( source.quaternion );
    this.scale.copy( source.scale );

    this.matrix.copy( source.matrix );
    this.matrixWorld.copy( source.matrixWorld );

    this.matrixAutoUpdate = source.matrixAutoUpdate;
    this.matrixWorldNeedsUpdate = source.matrixWorldNeedsUpdate;

    this.layers.mask = source.layers.mask;
    this.visible = source.visible;

    this.castShadow = source.castShadow;
    this.receiveShadow = source.receiveShadow;

    this.frustumCulled = source.frustumCulled;
    this.renderOrder = source.renderOrder;

    this.userData = JSON.parse( JSON.stringify( source.userData ) );

    if ( recursive === true ) {
      for ( let i = 0; i < source.children.length; i ++ ) {
        let child = source.children[i];
        this.add( child.clone() );
      }
    }

    return this;
  },

};

Object.assign( Object3D.prototype, EventDispatcher.prototype );

export {Object3D};
