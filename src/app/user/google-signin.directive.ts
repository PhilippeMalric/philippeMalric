import { Directive, HostListener } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { UserService } from './user.service';

@Directive({
  selector: '[appGoogleSignin]'
})
export class GoogleSigninDirective {
  constructor(private afAuth: AngularFireAuth, private userService:UserService) {}

  @HostListener('click')
  onclick() {
    this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then((data)=>{
      console.log(data)
      let name1 = data.user.email.split("@")[0]
      if(name1=="malric.philippe"){

        name1 = "Philippe"

      }
      this.userService.userName.next(name1);
    })
  }
}
