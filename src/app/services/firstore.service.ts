import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class FirstoreService {
  itemCollection: any;
  items: any;

  constructor(private afs: AngularFirestore) { 

   
   
  }


  getItems = ()=>{

    this.itemCollection = this.afs.collection<any>('items');
    this.items = this.itemCollection.valueChanges();


  }
}
