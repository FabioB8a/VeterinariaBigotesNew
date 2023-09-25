import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PetTableComponent } from './pet/pet-table/pet-table.component';
import { PetDetailComponent } from './pet/pet-detail/pet-detail.component';
import { PetFormComponent } from './pet/pet-form/pet-form.component';
import {NgOptimizedImage} from "@angular/common";
import { LogInComponent } from './log-in/log-in.component';
import { LandingComponent } from './landing/landing.component';

@NgModule({
  declarations: [
    AppComponent,
    PetTableComponent,
    PetDetailComponent,
    PetFormComponent,
    LogInComponent,
    LandingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgOptimizedImage
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
