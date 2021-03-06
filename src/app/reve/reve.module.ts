import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
;
import { DragDropModule } from '@angular/cdk/drag-drop';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ReveRoutingModule } from './reve-routing.module';
import { RacineReveComponent } from './racine/racine.component';

import {MatInputModule} from '@angular/material/input';
import {MatGridListModule} from '@angular/material/grid-list';


@NgModule({
  declarations: [

    RacineReveComponent 
    
  ],
  imports: [
    MatGridListModule,
    MatInputModule,
    CommonModule,
    RouterModule,
    SharedModule,
    ReveRoutingModule,
    FormsModule,
    DragDropModule,
    MatDialogModule,
    MatButtonToggleModule,
  ],
  entryComponents: [ ]
})
export class ReveModule {}
