import { OnInit, AfterViewInit, Component, ElementRef, Input, ViewChild, HostListener, Renderer2, NgZone } from '@angular/core';
import { ArTypesComponent } from '../ar-types/ar-types.component';
import { ArService } from '../ar.service';
import { ThreeService } from '../three.service';


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
    arType: 'basic',
    geometryType: 'sphere',
    model: THREE.Mesh,
    renderer: {},
    rotationTarget: 0
  }

  private arScene: any;
  private streaming: boolean;
  private width: number;
  private height: number;

  @ViewChild('canvas')
  private canvasRef: ElementRef;

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  @ViewChild('video')
  private videoRef: ElementRef;

  private get video(): HTMLVideoElement {
    return this.videoRef.nativeElement;
  }

  @ViewChild(ArTypesComponent)
  private arTypesComponent: ArTypesComponent;

  @Input()
  set model(model: string) {
    this.options.model = this.three.createModel(model);
  }

  constructor(private service: ArService, private three: ThreeService, private ngRenderer: Renderer2, private ngZone: NgZone) {
    this.width = 320;
   }

  ngOnInit() {
    this.startVideoStream();
  }

  showAR(){
    switch (this.options.arType) {
      case 'basic':
        // add geometry with transparent background to video stream
        this.basicGeometry();       
        return;
      case 'unity':
        this.unityModel();
        return;
      case 'trackHiro':
        // marker tracking from demo
        this.service.initAR()(this.arCallback.bind(this));
        return;
      default:
        // TODO
    }  
  }

  startVideoStream(){
    this.video.oncanplay = (ev) => {this.onVideoStreaming(ev)};
    navigator.mediaDevices.getUserMedia({video: true})
    .then((stream) => {
      var vendorURL = window.URL;
      this.video.src = vendorURL.createObjectURL(stream);
      this.video.play();})
    .catch((err) => {console.log("An error occured! " + err);});
  }

  onVideoStreaming(this, ev){
    this.setVideoDimensions();
    this.arTypesComponent.width = this.width;
    this.arTypesComponent.height = this.height;
    this.arTypesComponent.video = this.video;
    this.showAR();
  }

  setVideoDimensions(){
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

  onShapeChange(newShape) {
    this.options.model = null;
    this.options.geometryType = newShape;
    this.basicGeometry();
  }

  onArTypeChange(newType){
    this.options.model = null;    
    this.options.arType = newType;
    this.showAR(); 
  }

  basicGeometry() {    
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, this.width / this.height, 0.1, 1000 );

    var model = this.options.model || this.three.createModel(this.options.geometryType);
    model.position.set(3,2,0);
    this.arScene = scene;

    var renderer = new THREE.WebGLRenderer({alpha: true, canvas: this.canvas});
    renderer.setSize( this.width, this.height );

    scene.add(model);
    camera.position.z = 5;

    var animate = () => {
      if (this.options.arType == 'basic') {
        requestAnimationFrame( animate );
        
        model.rotation.x += 0.1;
        model.rotation.y += 0.1;
  
        renderer.render(scene, camera);
      } 
    };

    animate();
  }

  unityModel(){
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, this.width / this.height, 0.1, 1000 );    
    this.arScene = scene;

    camera.position.z = 5;

    var renderer = new THREE.WebGLRenderer({alpha: true, canvas: this.canvas});
    renderer.setSize( this.width, this.height );

    this.three.createFromObjFile("assets/fish.obj", scene.add);

    var animate = () => {
      if (this.options.arType == 'unity') {
        requestAnimationFrame( animate );
  
        renderer.render(scene, camera);
      } 
    };

    animate();
  }

  arCallback(arScene, arController, arCamera) {    
    var model = this.options.model || this.three.createModel(this.options.geometryType);
    this.arScene = arScene;
    arController.videoHeight = this.height;
    arController.videoWidth = this.width;
    // Add the style according to based on device orientation
    this.ngRenderer.addClass(this.canvas, arController.orientation);

    // Create a webgl renderer using the component canvasRef
    var renderer = new THREE.WebGLRenderer({ antialias: true, canvas: this.canvas });
    let rotationV = 0;
    let rotationTarget = 0;
    this.service.setCameraSize(arController, renderer);

    arController.loadMarker('assets/Data/patt.hiro', function(markerId) {
      var markerRoot = arController.createThreeMarker(markerId);

      // adds the object
      markerRoot.add(model);
      arScene.scene.add(markerRoot);
    });
    
    var tick = () => {
      if (this.options.arType == 'trackHiro') {
        arScene.process();
        rotationV += (rotationTarget - model.rotation.z) * 0.05;
        model.rotation.z += rotationV;
        rotationV *= 0.8;
        arScene.renderOn(renderer);
        requestAnimationFrame(tick);
      } 
    };
    tick();
  };

  onResize(e) {
    console.log('resized ', e);
  }

  public canvasClick(e) {
    e.preventDefault();
    this.options.rotationTarget += 1;
  }

  clearCanvas(){
    //TODO ctx is coming back null
    var ctx = this.canvas.getContext('2d');
    var w = this.canvas.width;
    var h = this.canvas.height;
    ctx.clearRect(0, 0 , w, h);
  }

}
