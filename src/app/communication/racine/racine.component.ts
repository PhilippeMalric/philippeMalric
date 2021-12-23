import { Component, OnInit } from '@angular/core';
import { MatInput } from '@angular/material/input';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CommunicationService } from '../communication.service';

@Component({
  selector: 'app-racine',
  templateUrl: './racine.component.html',
  styleUrls: ['./racine.component.scss']
})
export class RacineComponent implements OnInit {
  items: any
  id: string;

  constructor(private communicationService:CommunicationService) {


    
    
   }

  ngOnInit(): void {

    this.id = this.communicationService.create_Id()
    this.communicationService.getItems().pipe().subscribe((data)=>{
      console.log("data")
      console.log(data)
      this.items = data}
      )
  }


add(item:string){

  console.log(item)

  this.id = this.communicationService.create_Id()

  this.communicationService.createMessage({type:"message",message:item},this.id).subscribe()




}


delete(id){

  this.communicationService.deleteMessage(id).subscribe()

}

}
