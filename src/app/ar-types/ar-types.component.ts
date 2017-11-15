import { Component, OnInit, ElementRef, ViewChild, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'a-ar-types',
  templateUrl: './ar-types.component.html',
  styleUrls: ['./ar-types.component.css']
})
export class ArTypesComponent implements OnInit {
  private arType: string;
  public video: HTMLVideoElement;
  public width: number;
  public height: number;

  @Output() onArTypeChange = new EventEmitter<string>();

  constructor() { }

  @ViewChild('arTypes')
  private arTypesRef: ElementRef;

  private get arTypes(): HTMLDivElement {
    return this.arTypesRef.nativeElement;
  }
 
  @ViewChild('trackTexture')
  private trackTextureRef: ElementRef;

  private get trackTexture(): HTMLDivElement {
    return this.trackTextureRef.nativeElement;
  } 

  @ViewChild('hiddenCanvas')
  private hiddenCanvasRef: ElementRef;

  private get hiddenCanvas(): HTMLCanvasElement {
    return this.hiddenCanvasRef.nativeElement;
  }

  @ViewChild('photo')
  private photoRef: ElementRef;

  private get photoDiv(): HTMLDivElement {
    return this.photoRef.nativeElement;
  }

  private get photo(): HTMLImageElement {
    return this.photoDiv.getElementsByTagName('img')[0];
  }

  ngOnInit() { }
  
  public arTypeClick(type: string){
    if (type == this.arType) {
      return;
    }
    if (type == 'trackTexture'){
      this.photo.removeAttribute('src');
    }

    this.arType = type;
    this.onArTypeChange.emit(this.arType);
  }

  public captureImageClick(e) {
    e.preventDefault();
    this.hiddenCanvas.setAttribute('width', this.width.toString());
    this.hiddenCanvas.setAttribute('height', this.height.toString());

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
