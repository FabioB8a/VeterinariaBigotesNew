import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PetTableComponent} from "./pet/pet-table/pet-table.component";
import {PetDetailComponent} from "./pet/pet-detail/pet-detail.component";
import { PetFormComponent } from './pet/pet-form/pet-form.component';
import { LogInComponent } from './log-in/log-in.component';
import { LandingComponent } from './landing/landing.component';
import {OwnerTableComponent} from "./owner/owner-table/owner-table.component";
import {Owner} from "./model/owner/owner";
import {OwnerFormComponent} from "./owner/owner-form/owner-form.component";
import {OwnerDetailComponent} from "./owner/owner-detail/owner-detail.component";

const routes: Routes = [
  {path: 'home', component: LandingComponent},
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'pet/all', component: PetTableComponent },
  {path: 'owner/all', component: OwnerTableComponent},
  { path : 'pet/detail/:id', component : PetDetailComponent},
  { path : 'owner/detail/:id', component : OwnerDetailComponent},
  { path: 'pet/save', component: PetFormComponent},
  { path: 'owner/save', component: OwnerFormComponent},
  { path: 'login/show', component: LogInComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
