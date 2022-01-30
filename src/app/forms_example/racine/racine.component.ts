import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatInput } from '@angular/material/input';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FormsExampleService } from '../forms_example.service';

@Component({
  selector: 'app-racine',
  templateUrl: './racine.component.html',
  styleUrls: ['./racine.component.scss']
})
export class RacineComponent implements OnInit {
  items: any
  id: string;

  model = {
    radio: null,
  };

  name = new FormControl('');
  
  constructor(private FormsExampleService:FormsExampleService) {


    
    
   }

  ngOnInit(): void {

    this.id = this.FormsExampleService.create_Id()
    this.FormsExampleService.getItems().pipe().subscribe((data)=>{
      console.log("data")
      console.log(data)
      this.items = data}
      )
  }


add(item:string){

  console.log(item)

  this.id = this.FormsExampleService.create_Id()

  this.FormsExampleService.createMessage({type:"message",message:item},this.id).subscribe()




}


delete(id){

  this.FormsExampleService.deleteMessage(id).subscribe()

}

upDateName() {
  this.name.setValue('Kings');
}





}
