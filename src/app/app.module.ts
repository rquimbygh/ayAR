import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PatternMarkerComponent } from './pattern-marker/pattern-marker.component';
import { ShapesComponent } from './shapes/shapes.component';

import { ArService } from './ar.service';
import { ThreeService } from './three.service';
import { ArDirective } from './ar.directive';


@NgModule({
  declarations: [
    AppComponent,
    PatternMarkerComponent,
    ArDirective,
    ShapesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [ArService, ThreeService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
