import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RacineEpicerieComponent } from './racine/racine.component';



const routes: Routes = [
  { path: '', component: RacineEpicerieComponent }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommunicationRoutingModule { }

