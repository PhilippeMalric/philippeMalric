import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatInput } from '@angular/material/input';

import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { ApiTest, ApiTestService } from '../apiTest.service';


@Component({
  selector: 'app-racine',
  templateUrl: './racine.component.html',
  styleUrls: ['./racine.component.scss']
})
export class RacineComponent implements OnInit {

  @ViewChild("i1") i1: ElementRef;
  @ViewChild("i2") i2: ElementRef;


  private data = [
    {cat:"pour",votes:10},
    {cat:"contre",votes:5}
  ];



  items: any
  id: string;
  url: string = "https://www.donneesquebec.ca/recherche/api/3/action/datastore_search?limit=1000&resource_id=e84bbc32-06d5-4030-afd4-77d831a9e8fc"
  result: any;
  records: any = [];
  elements = [];
  fields: any = [];


  constructor(private apiTestService:ApiTestService) {
 
    this.apiTestService.testObs.subscribe((data)=>{
      console.log("data1")
      console.log(data)
      if(Object.keys(data).length === 0)
      {}
      else{
        if(data.success){

          
          let i1Value = Number(this.i1.nativeElement.value)
          let i2Value = Number(this.i2.nativeElement.value)
          console.log(this.i1.nativeElement.value)
          console.log(this.i2.nativeElement.value)

          this.result = data.result

          this.fields = this.result.fields

          this.records = this.result.records
          console.log("records")
          console.log(this.records)

          this.elements = this.result.records.slice(i1Value,i2Value).map((data)=>{

            let newObj = []

            for(let k of Object.keys(data)){
              let prop = {key:"",value:""}
              prop.key = k
              prop.value = data[k] 

              newObj.push(prop)

            }

            return newObj

          })

          console.log("elements")
          console.log(this.elements)
        }
      }
    })

    
   }

   ngAfterViewInit() {
    this.i1.nativeElement.value = 0
    this.i2.nativeElement.value = 10
  
  }

  ngOnInit(): void {

    this.id = this.apiTestService.create_Id()
    this.apiTestService.getsondage().pipe().subscribe((data)=>{
      console.log("data")
      console.log(data)
      this.items = data
      //this.data = this.items[0]  
    }
      )
  }

  field_click(id){

    this.apiTestService.field_click(id)

  }

  send(url){
    this.url = url

    this.apiTestService.sendRequete_data(this.url).pipe(take(1)).subscribe((data)=>{

      console.log(data)

    })
  }
}
