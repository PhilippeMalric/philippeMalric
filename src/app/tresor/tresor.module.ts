import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
;
import { DragDropModule } from '@angular/cdk/drag-drop';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { Depenses2RoutingModule } from './tresor-routing.module';
import { RacineComponent } from './racine/racine.component';

import {MatInputModule} from '@angular/material/input';
import {MatGridListModule} from '@angular/material/grid-list';


@NgModule({
  declarations: [

    RacineComponent 
    
  ],
  imports: [
    
    ReactiveFormsModule,
    MatGridListModule,
    MatInputModule,
    CommonModule,
    RouterModule,
    SharedModule,
    Depenses2RoutingModule,
    FormsModule,
    DragDropModule,
    MatDialogModule,
    MatButtonToggleModule,
  ],
  entryComponents: [ ]
})
export class TresorModule {}
