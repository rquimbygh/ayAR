import { OnInit, AfterViewInit, Component, ElementRef, Input, ViewChild, HostListener, Renderer2, NgZone } from '@angular/core';
// import { Component, OnInit, ElementRef, Input, ViewChild, HostListener, Renderer2,  } from '@angular/core';

import { ArService } from '../ar.service';
import { ThreeService } from '../three.service';

interface Navigator {
  getMedia: any;
}

/**
 * Takes a pattern image and optional model to render AR
 * Uses ArService to get the user media and ThreeService to render 3D scene.
 */
@Component({
  selector: 'a-pattern-marker',
  templateUrl: './pattern-marker.component.html',
  styleUrls: ['./pattern-marker.component.css']
})

export class PatternMarkerComponent implements OnInit {

  private options = {
    model: {},
    renderer: {},
    rotationTarget: 0
  }

  private arScene: any;
  private streaming: boolean;
  private width: number;
  private height: number;

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  @ViewChild('canvas')
  private canvasRef: ElementRef;

  private get video(): HTMLVideoElement {
    return this.videoRef.nativeElement;
  }

  @ViewChild('video')
  private videoRef: ElementRef;

  @Input()
  set model(model: string) {
    this.options.model = this.three.createModel(model);
  }

  @HostListener('click') onClickHandler(e) {
    console.log('clicked parent');
  }

  constructor(private service: ArService, private three: ThreeService, private ngRenderer: Renderer2, private ngZone: NgZone) {
    this.width = 320;
   }

  ngOnInit() {
    // marker tracking from demo
    //this.service.initAR()(this.arCallback.bind(this));

    // BASIC: add three js geometry to scene
    //this.basicGeometry();

    // INTERMEDIATE: add geometry with transparent background to video stream
    this.startVideoStream();
  }

  setVideoDimensions(this, ev){
    if (!this.streaming) {
      this.height = this.video.videoHeight / (this.video.videoWidth/this.width);
    
      // Firefox currently has a bug where the height can't be read from
      // the video, so we will make assumptions if this happens.
    
      if (isNaN(this.height)) {
        this.height = this.width / (4/3);
      }
    
      this.video.setAttribute('width', this.width.toString());
      this.video.setAttribute('height', this.height.toString());
      this.canvas.setAttribute('width', this.width.toString());
      this.canvas.setAttribute('height', this.height.toString());
      this.streaming = true;
    }
  }

  startVideoStream(){
    navigator.mediaDevices.getUserMedia({video: true})
    .then((stream) => {
      var vendorURL = window.URL;
      this.video.src = vendorURL.createObjectURL(stream);
      this.video.play();})
    .catch((err) => {console.log("An error occured! " + err);});
    
    this.video.addEventListener('canplay', (ev) => this.setVideoDimensions(ev), false);
  }

  basicGeometry() {
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    var model = this.options.model || this.three.createModel('sphere');
    this.arScene = scene;

    const renderer = new THREE.WebGLRenderer({canvas: this.canvas});
    renderer.setSize( window.innerWidth, window.innerHeight );

    scene.add(model);
    camera.position.z = 5;

    var animate = function () {
      requestAnimationFrame( animate );

      model.rotation.x += 0.1;
      model.rotation.y += 0.1;

      renderer.render(scene, camera);
    };

    animate();
  }

  arCallback(arScene, arController, arCamera) {
    var model = this.options.model || this.three.createModel('sphere');
    this.arScene = arScene;
    // Add the style according to based on device orientation
    this.ngRenderer.addClass(this.canvas, arController.orientation);

    // Create a webgl renderer using the component canvasRef
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: this.canvas });
    let rotationV = 0;
    let rotationTarget = 0;
    this.service.setCameraSize(arController, renderer);

    arController.loadMarker('assets/Data/patt.hiro', function(markerId) {
      var markerRoot = arController.createThreeMarker(markerId);

      // adds the object
      markerRoot.add(model);
      arScene.scene.add(markerRoot);
    });
    
    var tick = function() {
      arScene.process();
      rotationV += (rotationTarget - model.rotation.z) * 0.05;
      model.rotation.z += rotationV;
      rotationV *= 0.8;
      arScene.renderOn(renderer);
      requestAnimationFrame(tick);
    };
    tick();
    // this.tick.bind(this, arScene);
    // this.ngZone.runOutsideAngular(this.tick.bind(this, arScene));
  };

  onResize(e) {
    console.log('resized ', e);
  }

  canvasClick(e) {
    e.preventDefault();
    this.options.rotationTarget += 1;
  }

  // tick(arScene) {
  //   // arScene.process();
  //   // console.log('model ', this)
  //   // if (this.options.model.rotation) {
  //   //   rotationV += (this.options.rotationTarget - this.options.model.rotation.z || 0) * 0.05;
  //   //   this.options.model.rotation.z += rotationV;
  //   //   rotationV *= 0.8;
  //   // }
  //   //
  //   // arScene.renderOn(this.options.renderer);
  //   // requestAnimationFrame(() => this.ngZone.runOutsideAngular(this.tick.bind(this, arScene)));
  // }


}
