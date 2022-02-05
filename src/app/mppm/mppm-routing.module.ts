import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RacineComponent } from './racine/racine.component';
import { VideoComponent } from './video/video.component';



const routes: Routes = [
  { path: '', component: RacineComponent },
  { path: 'video', component: VideoComponent }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MppmRoutingModule { }

