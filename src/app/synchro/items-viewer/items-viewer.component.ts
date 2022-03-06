import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { MatGridList } from '@angular/material/grid-list';
import { tap } from 'rxjs/operators';
import { Synchro, SynchroService } from '../synchro.service';


@Component({
  selector: 'app-items-viewer',
  templateUrl: './items-viewer.component.html',
  styleUrls: ['./items-viewer.component.scss']
})
export class ItemsViewerComponent implements OnInit {


  @Input() items : any

  gridByBreakpoint = { xl: 8, lg: 6, md: 4, sm: 2, xs: 1 } 
  @ViewChild('grid') grid: MatGridList; 
  

  constructor(
    private synchroService:SynchroService,
    private observableMedia:  MediaObserver) { }

  ngOnInit(): void {
  }

  ngAfterContentInit() { 
    this.observableMedia.asObservable().pipe(
    tap(change => {
      console.log(change);
      this.grid.cols = this.gridByBreakpoint[change[0].mqAlias];
    })).subscribe()
  }

  delete(e:Synchro){

    this.synchroService.deleteMessage(e.id_firestore).subscribe()

  }

  delete2(e:Synchro){

    this.synchroService.falsedeleteMessage(e.id_firestore,e).subscribe()

  }


  
}
