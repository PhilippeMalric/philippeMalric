import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable, pipe } from 'rxjs';
import { concatMap, map, take } from 'rxjs/operators';

export interface Tresor  {
  id_firestore:string,
  seqNo:number,
  type:string,
  message:string,
  auteur:string
  //prix:number,
  deleted:boolean,
  date:string
} 

function convertSnaps<T>(results)  {
  return <T[]> results.docs.map(snap => {
      return {
          id: snap.id,
          ...<any>snap.data()
      }
  })

}

@Injectable({
  providedIn: 'root'
})
export class TresorService {
  itemCollection: any;
  items$: any;

  constructor(private afs: AngularFirestore) { 
 
    this.getItems()

  }

  
  getItems = ()=>{

    return this.afs.collection("tresor")
            .valueChanges()
            


  }

  create_Id = ()=>{

    return this.afs.createId()
  }

  


  deleteMessage(messageid:string) {
    console.log(messageid)
    return from(this.afs.doc(`tresor/${messageid}`).delete());
}

falsedeleteMessage(messageid:string,changes: Partial<Tresor>) {
  console.log(messageid)
  changes.deleted = true
  return from(this.afs.doc(`tresor/${messageid}`).update(changes));
}

updateMessage(messageid:string, changes: Partial<Tresor>):Observable<any> {
    return from(this.afs.doc(`tresor/${messageid}`).update(changes));
}

createMessage(newMessage: Partial<Tresor>, messageid:string) {
  console.log("createMessage",newMessage,messageid)
    return this.afs.collection("tresor",
            ref => ref.orderBy("seqNo", "desc").limit(1))
        .get()
        .pipe(
            concatMap(result => {
console.log("inside createMessage2")

                const messages = convertSnaps<Tresor>(result);


                const lastCourseSeqNo = messages[0]?.seqNo ?? 0;

                const message = {
                    ...newMessage,
                    seqNo: lastCourseSeqNo + 1,
                    id_firestore:messageid
                }
                
                console.log(message)

                let save$: Observable<any>;

                save$ = from(this.afs.doc(`tresor/${messageid}`).set(message));

                return save$
                    .pipe(
                        map(res => {
                            return {
                                id: messageid ?? res.id,
                                ...message
                            }
                        })
                    );


            })
        )
}


}
