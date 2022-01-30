import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userName:BehaviorSubject<string>

  constructor(private afAuth: AngularFireAuth) {

    this.userName = new BehaviorSubject("X")
    this.userName.subscribe((data)=>{

      console.log("userName",data)

    })

    this.afAuth.onAuthStateChanged((data)=>{
      if(data){
          console.log(data)
          let name1 = data.email.split("@")[0]
          if(name1=="malric.philippe"){

            name1 = "Philippe"

          }
          let nameT = data.email.split("@")[0]
          if(nameT=="mpier92"){
      
            name1 = "Marie-Pier"

          }
          this.userName.next(name1);
        }
    })

   

  }

}
