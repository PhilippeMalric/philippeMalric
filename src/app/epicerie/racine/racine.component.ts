import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatInput } from '@angular/material/input';

import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { UserService } from 'src/app/user/user.service';
import { EpicerieService } from '../epicerie.service';

@Component({
  selector: 'app-racine',
  templateUrl: './racine.component.html',
  styleUrls: ['./racine.component.scss']
})
export class RacineEpicerieComponent implements OnInit {
  items: any
  id: string;

  constructor(private epicerieService:EpicerieService,
              private afAuth: AngularFireAuth,
              private userService:UserService
    ) {


    
    
   }

  ngOnInit(): void {

    this.id = this.epicerieService.create_Id()
    this.epicerieService.getItems().pipe().subscribe((data)=>{
      console.log("data")
      console.log(data)
      this.items = data}
      )
  }


add(item:string){

  console.log(item)

  this.id = this.epicerieService.create_Id()
  this.afAuth.authState.pipe(take(1)).subscribe((auteur)=>{
    let name1 =""
    if(auteur.displayName){
      name1 = auteur.displayName
    }else{
      name1 = auteur.email.split("@")[0]
    }
    this.userService.userName.pipe(take(1)).subscribe((data)=>{
      this.epicerieService.createMessage({auteur:data,type:"message",message:item},this.id).subscribe()
    })
  })




}


delete(id){

  this.epicerieService.deleteMessage(id).subscribe()

}

}
