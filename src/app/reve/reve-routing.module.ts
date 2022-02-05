import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RacineReveComponent } from './racine/racine.component';



const routes: Routes = [
  { path: '', component: RacineReveComponent }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReveRoutingModule { }

