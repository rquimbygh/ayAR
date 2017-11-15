import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArVideoComponent } from './ar-video.component';

describe('ArVideoComponent', () => {
  let component: ArVideoComponent;
  let fixture: ComponentFixture<ArVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArVideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
