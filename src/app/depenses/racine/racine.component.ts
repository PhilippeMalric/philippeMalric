import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormControl } from '@angular/forms';
import { MatInput } from '@angular/material/input';

import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { UserService } from 'src/app/user/user.service';
import { DepensesService } from '../depenses.service';

@Component({
  selector: 'app-racine',
  templateUrl: './racine.component.html',
  styleUrls: ['./racine.component.scss']
})
export class RacineComponent implements OnInit {
  items: any
  id: string;
  prix = new FormControl();
  message = new FormControl('');
  
  constructor(private DepensesService:DepensesService,
              private afAuth: AngularFireAuth,
              private userService:UserService
    ) {


    
    
   }

  ngOnInit(): void {

    this.id = this.DepensesService.create_Id()
    this.DepensesService.getItems().pipe().subscribe((data)=>{
      console.log("data")
      console.log(data)
      this.items = data}
      )
  }


add(){

  this.id = this.DepensesService.create_Id()
  this.userService.userName.pipe(take(1)).subscribe((data)=>{
    console.log(data)
    this.DepensesService.createMessage(
      {auteur:data,
        type:"message",
        message:this.message.value,
        prix:this.prix.value
      },this.id).subscribe()
    
  })




}


delete(id){

  this.DepensesService.deleteMessage(id).subscribe()

}

}
