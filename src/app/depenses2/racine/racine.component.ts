import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormControl } from '@angular/forms';
import { MatInput } from '@angular/material/input';

import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { UserService } from 'src/app/user/user.service';
import { Depenses2Service } from '../depenses2.service';

import * as saveAs from 'file-saver';

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
  
  constructor(private DepensesService:Depenses2Service,
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

downloadFile() {
  let data = this.items
    console.log(data)
    const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
    const header = Object.keys(data[0]);
    let csv = data.map(row => {return header.map(fieldName => {

      let text = JSON.stringify(row[fieldName], replacer)
      //console.log(text)
      text = (text)?text:"-"
        return text.toString().replace('"',"'")
    }).join(';')}) ;

    csv.unshift(header.join(';'));
    let csvArray = csv.join('\r\n');

    var blob = new Blob([csvArray], {type: 'text/csv' })
    saveAs.saveAs(blob, "myFile.csv");
 
}

ImportFile() {
  
 
}

}
