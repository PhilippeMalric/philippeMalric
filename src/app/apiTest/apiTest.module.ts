import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
;
import { DragDropModule } from '@angular/cdk/drag-drop';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { SondageRoutingModule } from './apiTest-routing.module';
import { RacineComponent } from './racine/racine.component';

import {MatInputModule} from '@angular/material/input';
import {MatGridListModule} from '@angular/material/grid-list';
import { VizComponent } from './viz/viz.component';
import { VizGoogleChartComponent } from './viz_google_chart/viz_google_chart.component';
import { DonneesQuebecComponent } from './donnees-quebec/donnees-quebec.component';


@NgModule({
  declarations: [
    VizGoogleChartComponent,
    RacineComponent,
     VizComponent ,
     DonneesQuebecComponent
  ],
  imports: [
    
    MatGridListModule,
    MatInputModule,
    CommonModule,
    RouterModule,
    SharedModule,
    SondageRoutingModule,
    FormsModule,
    DragDropModule,
    MatDialogModule,
    MatButtonToggleModule,
  ],
  entryComponents: [ ]
})
export class ApiTestModule {}
