import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatInput } from '@angular/material/input';

import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { UserService } from 'src/app/user/user.service';
import { CommunicationService } from '../communication.service';

@Component({
  selector: 'app-racine',
  templateUrl: './racine.component.html',
  styleUrls: ['./racine.component.scss']
})
export class RacineComponent implements OnInit {
  items: any
  id: string;

  constructor(private communicationService:CommunicationService,
              private afAuth: AngularFireAuth,
              private userService:UserService
    ) {


    
    
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
  this.userService.userName.pipe(take(1)).subscribe((data)=>{
    console.log(data)
    this.communicationService.createMessage({auteur:data,type:"message",message:item},this.id).subscribe()
    
  })




}


delete(id){

  this.communicationService.deleteMessage(id).subscribe()

}

}
