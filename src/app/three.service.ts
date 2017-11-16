import { Injectable } from '@angular/core';

@Injectable()
export class ThreeService {
  public renderer = new THREE.WebGLRenderer({ antialias: true });

  // scene
  // camera
  // lighting
  // object
  //  shape define
  //  texture

  constructor() { }

  getRenderer() {
    return this.renderer;
  }

  createModel(type): typeof THREE.Mesh {
    let model: typeof THREE.Mesh ;
    if (type === 'sphere') {
      model = this.createSphere();
    } else if (type === 'torus') {
      model = this.createTorus();
    } else {
      model = this.createBox();
    }
    return model;
  }

  clicked() {
    //Animate...
  }

  createSphere() {
    let sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 8, 8),
      new THREE.MeshNormalMaterial()
    );
    sphere.material.shading = THREE.FlatShading;
    sphere.position.z = 0.5;

    return sphere;
  }

  createBox() {
    let box = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshNormalMaterial()
    );
    box.material.shading = THREE.FlatShading;
    box.position.z = 0.5;
    return box;
  }

  createTorus() {
    var torus = new THREE.Mesh(
      new THREE.TorusGeometry(0.3, 0.2, 8, 8),
      new THREE.MeshNormalMaterial()
    );
    torus.material.shading = THREE.FlatShading;
    torus.position.z = 0.5;
    torus.rotation.x = Math.PI / 2;

    return torus;
  }

  createFromJsonFile(url, cb){
    var loader = new THREE.ObjectLoader();
    loader.load(
      // resource URL
      url,

    // Function when resource is loaded
	  function ( obj ) {      
        cb( obj.children[0] );    
      },
      
      // Function called when download progresses
      function ( xhr ) {
          console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
      },
  
      // Function called when download errors
      function ( xhr ) {
          console.error( 'An error happened' );
      }
    );
  }

  createFromObjFile(objUrl, cb){
    var manager = new THREE.LoadingManager();
    manager.onProgress = function ( item, loaded, total ) {
      console.log( item, loaded, total );
    };

    var loader = new THREE.OBJLoader( manager );
    loader.load(
      // resource URL
      objUrl,

      // pass the loaded data to the onLoad function.
      // Here it is assumed to be an object
      function ( obj ) {             
        if (obj instanceof THREE.Group) {
          //groups can be added to a scene directly
          cb( obj );
        } else{
          // maybe do other things to other types
          cb( obj );
        }
      },

      // Function called when download progresses
      function ( xhr ) {
          console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
      },

      // Function called when download errors
      function ( xhr ) {
          console.error( 'An error happened' );
      }
    );
  }

}
