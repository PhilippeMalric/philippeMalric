import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RacineComponent } from './racine/racine.component';



const routes: Routes = [
  { path: '', component: RacineComponent }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Depenses2RoutingModule { }

