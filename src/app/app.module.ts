import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ArVideoComponent } from './ar-video/ar-video.component';
import { ShapesComponent } from './shapes/shapes.component';
import { ArTypesComponent } from './ar-types/ar-types.component';

import { ArService } from './ar.service';
import { ThreeService } from './three.service';
import { ArDirective } from './ar.directive';



@NgModule({
  declarations: [
    AppComponent,
    ArVideoComponent,
    ArDirective,
    ShapesComponent,
    ArTypesComponent
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
