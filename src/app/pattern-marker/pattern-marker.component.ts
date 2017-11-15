import { OnInit, AfterViewInit, Component, ElementRef, Input, ViewChild, HostListener, Renderer2, NgZone } from '@angular/core';
// import { Component, OnInit, ElementRef, Input, ViewChild, HostListener, Renderer2,  } from '@angular/core';

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

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  @ViewChild('canvas')
  private canvasRef: ElementRef;

  private get hiddenCanvas(): HTMLCanvasElement {
    return this.hiddenCanvasRef.nativeElement;
  }

  @ViewChild('hiddenCanvas')
  private hiddenCanvasRef: ElementRef;

  private get photoDiv(): HTMLDivElement {
    return this.photoRef.nativeElement;
  }

  private get photo(): HTMLImageElement {
    return this.photoDiv.getElementsByTagName('img')[0];
  }

  @ViewChild('photo')
  private photoRef: ElementRef;

  private get video(): HTMLVideoElement {
    return this.videoRef.nativeElement;
  }

  @ViewChild('video')
  private videoRef: ElementRef;

  @Input()
  set model(model: string) {
    this.options.model = this.three.createModel(model);
  }

  private get shapes(): HTMLDivElement {
    return this.shapesRef.nativeElement;
  }

  @ViewChild('shapes')
  private shapesRef: ElementRef;

  public shapeClick(type: string){
    if (type == this.options.geometryType) {
      return;
    }
    this.options.model = null;
    this.options.geometryType = type;
    this.basicGeometry();
  }

  private get arTypes(): HTMLDivElement {
    return this.arTypesRef.nativeElement;
  }

  @ViewChild('arTypes')
  private arTypesRef: ElementRef;

  public arTypeClick(type: string){
    if (type == this.options.arType) {
      return;
    }
    if (type == 'trackTexture') {
      this.trackTexture.style.display = 'inline';
    } else {
      this.trackTexture.style.display = 'none';
    }
    this.options.arType = type;
    this.options.model = null;
    this.ngOnInit();
  }

  private get trackTexture(): HTMLDivElement {
    return this.trackTextureRef.nativeElement;
  }

  @ViewChild('trackTexture')
  private trackTextureRef: ElementRef;

  constructor(private service: ArService, private three: ThreeService, private ngRenderer: Renderer2, private ngZone: NgZone) {
    this.width = 320;
   }

  ngOnInit() {
    switch (this.options.arType) {
      case 'basic':
        // add geometry with transparent background to video stream
        this.startVideoStream();
        if (this.streaming){
          this.basicGeometry();
        } else {
          this.video.addEventListener('canplay', (ev) => {
            this.setVideoDimensions(ev);
            this.basicGeometry();    
          }, false);
        }        
        return;
      case 'unity':
        this.startVideoStream();
        if (this.streaming){
          this.unityModel();
        } else {
          this.video.addEventListener('canplay', (ev) => {
            this.setVideoDimensions(ev);
            this.unityModel();    
          }, false);
        }  
        return;
      case 'trackHiro':
        // marker tracking from demo
        this.service.initAR()(this.arCallback.bind(this));
        return;
      default:
        // TODO
    }  
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
      this.hiddenCanvas.setAttribute('width', this.width.toString());
      this.hiddenCanvas.setAttribute('height', this.height.toString());
      this.shapes.style.top = (this.height + 10).toString() + 'px';
      this.arTypes.style.top = (this.height + 40).toString() + 'px';
      this.trackTexture.style.top = (this.height + 70).toString() + 'px';

      this.photoDiv.style.top = (this.height + 100).toString() + 'px';
      this.hiddenCanvas.style.top = (this.height + 110 + this.height).toString() + 'px';       

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

  public captureImageClick(e) {
    e.preventDefault();
    var context = this.hiddenCanvas.getContext('2d');
    if (this.width && this.height) {
      this.hiddenCanvas.width = this.width;
      this.hiddenCanvas.height = this.height;
      context.drawImage(this.video, 0, 0, this.width, this.height);    
      var data = this.hiddenCanvas.toDataURL('image/png');

      var imageObj = new Image();
      imageObj.onload = () => {
        // draw cropped image
        var sourceX = 150;
        var sourceY = 0;
        var sourceWidth = 150;
        var sourceHeight = 150;
        var destWidth = sourceWidth;
        var destHeight = sourceHeight;
        var destX = this.hiddenCanvas.width / 2 - destWidth / 2;
        var destY = this.hiddenCanvas.height / 2 - destHeight / 2;
        context.clearRect(0, 0, this.hiddenCanvas.width, this.hiddenCanvas.height);
        context.drawImage(imageObj, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
        
        //draw black border
        context.strokeStyle = 'black';
        context.lineWidth = 20;     
        context.strokeRect(destX, destY, sourceWidth, sourceHeight );
      }
      imageObj.src = data;
      this.photo.setAttribute('src', imageObj.src);
    } 
  }

}
