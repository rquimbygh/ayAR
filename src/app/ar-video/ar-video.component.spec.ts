import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatternMarkerComponent } from './ar-video.component';

describe('PatternMarkerComponent', () => {
  let component: PatternMarkerComponent;
  let fixture: ComponentFixture<PatternMarkerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatternMarkerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatternMarkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
