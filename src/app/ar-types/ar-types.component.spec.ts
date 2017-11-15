import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArTypesComponent } from './ar-types.component';

describe('ArTypesComponent', () => {
  let component: ArTypesComponent;
  let fixture: ComponentFixture<ArTypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArTypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
