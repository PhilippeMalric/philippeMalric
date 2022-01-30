import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable, pipe } from 'rxjs';
import { concatMap, map, take } from 'rxjs/operators';

interface Message  {
  id_firestore:string,
  seqNo:number,
  type:string,
  message:string,
  auteur:string
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
export class EpicerieService {
  itemCollection: any;
  items$: any;

  constructor(private afs: AngularFirestore) { 
 
    this.getItems()

  }

  
  getItems = ()=>{

    return this.afs.collection("epicerie")
            .valueChanges()
            


  }

  create_Id = ()=>{

    return this.afs.createId()
  }

  


  deleteMessage(messageid:string) {
    console.log(messageid)
    return from(this.afs.doc(`epicerie/${messageid}`).delete());
}

updateMessage(messageid:string, changes: Partial<Message>):Observable<any> {
    return from(this.afs.doc(`epicerie/${messageid}`).update(changes));
}

createMessage(newMessage: Partial<Message>, messageid:string) {
    return this.afs.collection("epicerie",
            ref => ref.orderBy("seqNo", "desc").limit(1))
        .get()
        .pipe(
            concatMap(result => {
console.log("inside createMessage2 epicerie")

                const messages = convertSnaps<Message>(result);


                const lastCourseSeqNo = messages[0]?.seqNo ?? 0;

                const message = {
                    ...newMessage,
                    seqNo: lastCourseSeqNo + 1,
                    id_firestore:messageid
                }

                let save$: Observable<any>;

                save$ = from(this.afs.doc(`epicerie/${messageid}`).set(message));

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
