import { Component, OnInit, ElementRef, ViewChild, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'a-shapes',
  templateUrl: './shapes.component.html',
  styleUrls: ['./shapes.component.css']
})
export class ShapesComponent implements OnInit {
  private geometry: string;
  @Output() onShapeChange = new EventEmitter<string>();

  constructor() {
  }

  private get shapes(): HTMLDivElement {
    return this.shapesRef.nativeElement;
  }

  @ViewChild('shapes')
  private shapesRef: ElementRef;

  ngOnInit() {
  }

  public shapeClick(type: string){
    if (type == this.geometry) {
      return;
    }
    
    this.geometry = type;
    this.onShapeChange.emit(this.geometry);
  }

}
