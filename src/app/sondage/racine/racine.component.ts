import { Component, OnInit } from '@angular/core';
import { MatInput } from '@angular/material/input';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Sondage, SondageService } from '../sondage.service';


@Component({
  selector: 'app-racine',
  templateUrl: './racine.component.html',
  styleUrls: ['./racine.component.scss']
})
export class RacineComponent implements OnInit {

  private data = [
    {cat:"pour",votes:10},
    {cat:"contre",votes:5}
  ];



  items: any
  id: string;

  constructor(private SondageService:SondageService) {


    
    
   }

  ngOnInit(): void {

    this.id = this.SondageService.create_Id()
    this.SondageService.getsondage().pipe().subscribe((data)=>{
      console.log("data")
      console.log(data)
      this.items = data
      //this.data = this.items[0]  
    }
      )

     
  }

add(item:string){
  this.id = this.SondageService.create_Id()

  console.log(item)

  this.id = this.SondageService.create_Id()

  this.SondageService.createMessage({type:"message",title:item,pour:0,contre:0},this.id).subscribe()

}

plusPour(message:Sondage){

  message.pour = message.pour + 1

  this.SondageService.updateMessage(message.id_firestore,message)
}

plusContre(message:Sondage){

  message.contre = message.contre + 1
  
  this.SondageService.updateMessage(message.id_firestore,message)
}

moinsPour(message:Sondage){

  message.pour = message.pour - 1

  this.SondageService.updateMessage(message.id_firestore,message)
}

moinsContre(message:Sondage){

  message.contre = message.contre - 1
  
  this.SondageService.updateMessage(message.id_firestore,message)
}

delete(id){

  this.SondageService.deleteMessage(id).subscribe()

}

}
