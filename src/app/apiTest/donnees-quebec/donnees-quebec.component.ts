import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatInput } from '@angular/material/input';

import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { ApiTest, ApiTestService } from '../apiTest.service';


@Component({
  selector: 'app-donnees-quebec',
  templateUrl: './donnees-quebec.component.html',
  styleUrls: ['./donnees-quebec.component.scss']
})
export class DonneesQuebecComponent implements OnInit {

  @ViewChild("i1") i1: ElementRef;
  @ViewChild("i2") i2: ElementRef;
  urlTemplate: string = "https://www.donneesquebec.ca/recherche/api/3/action/package_show?id="

  private data = [
    {cat:"pour",votes:10},
    {cat:"contre",votes:5}
  ];




  url_meta: string = "https://www.donneesquebec.ca/recherche/api/action/package_list"
  package_list: any;
  url: any = "";
  resources: any;
  url2: any;
  urlTemplate2 = "https://www.donneesquebec.ca/recherche/api/3/action/datastore_search?limit=1000&resource_id=";



  constructor(private apiTestService:ApiTestService) {
 
    this.send()

    this.apiTestService.datasetNamesObs.subscribe((data)=>{
      console.log("datasetNames")
      console.log(data)
      if(Object.keys(data).length === 0)
      {}
      else{
        this.package_list =  data
      }

    })

    this.apiTestService.ressourcesObs.subscribe((data)=>{
      console.log("ressourcesObs")
      console.log(data)
      if(Object.keys(data).length === 0)
      {}
      else{
        this.resources = data.result.resources.filter((data)=>{
          return data.resource_type == "donnees" && data.format == "CSV" &&data.size != 0
        })
        console.log("ressources : ",this.resources)
      }

    })

    
   }


  ngOnInit(): void {

  }


  send(){
    
    this.apiTestService.sendRequete_meta(this.url_meta).pipe(take(1)).subscribe((data)=>{
      console.log("sendRequete_meta")
      console.log(data)
      this.package_list = data.result
    })
  }

  create_url(id){

    this.url = this.urlTemplate + id
    this.apiTestService.getRessource(this.url).pipe(take(1)).subscribe((data)=>{

      console.log("getRessource")
      console.log(data)

    })
  }
  
  create_url_ressource(id){

    this.url2 = this.urlTemplate2 + id
   
  }
  

  delete(id){

    this.apiTestService.deleteMessage(id).subscribe()

  }

}
