import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';
import { ApiTest, ApiTestService } from '../apiTest.service';

@Component({
  selector: 'app-viz-google-chart',
  templateUrl: './viz_google_chart.component.html',
  styleUrls: ['./viz_google_chart.component.scss']
})
export class VizGoogleChartComponent implements OnInit {



  @Input() data1 : ApiTest


  title = 'Browser market shares at a specific website, 2014';
   type = 'PieChart';
      data = [
      ['Firefox', 45.0],
      ['IE', 26.8],
      ['Chrome', 12.8],
      ['Safari', 8.5],
      ['Opera', 6.2],
      ['Others', 0.7] 
   ];
   columnNames = ['Browser', 'Percentage'];
   options = {    
   };
   width = 550;
   height = 400;


  constructor(private eltRef:ElementRef,private apiTestService:ApiTestService) {

   combineLatest([this.apiTestService.dataObs, this.apiTestService.colNames_stat]).subscribe((data)=>{
    if(Object.keys(data[0]).length === 0){

    }else{

      console.log("combineLatest")
      console.log(data)
       console.log(data[0])
       console.log(data[1])
       this.columnNames = data[1]
       this.data = data[0]
    }
    
   })
   }

  ngOnInit(): void {
   

  }





}
