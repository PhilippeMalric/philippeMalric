import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable, pipe } from 'rxjs';
import { concatMap, map, take } from 'rxjs/operators';

export interface Sondage  {
  id_firestore:string,
  seqNo:number,
  type:string,
  title:string,
  pour:number,
  contre:number
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
export class SondageService {
  itemCollection: any;
  sondage$: any;

  constructor(private afs: AngularFirestore) { 
 
    this.getsondage()

  }

  
  getsondage = ()=>{

    return this.afs.collection("sondage")
            .valueChanges()
            


  }

  create_Id = ()=>{

    return this.afs.createId()
  }

  


  deleteMessage(messageid:string) {
    console.log(messageid)
    return from(this.afs.doc(`sondage/${messageid}`).delete());
}

updateMessage(sondageid:string, changes: Partial<Sondage>):Observable<any> {
    return from(this.afs.doc(`sondage/${sondageid}`).update(changes));
}

createMessage(newMessage: Partial<Sondage>, messageid:string) {
    return this.afs.collection("sondage",
            ref => ref.orderBy("seqNo", "desc").limit(1))
        .get()
        .pipe(
            concatMap(result => {
console.log("inside createMessage2")

                const messages = convertSnaps<Sondage>(result);


                const lastCourseSeqNo = messages[0]?.seqNo ?? 0;

                const message = {
                    ...newMessage,
                    seqNo: lastCourseSeqNo + 1,
                    id_firestore:messageid
                }

                let save$: Observable<any>;

                save$ = from(this.afs.doc(`sondage/${messageid}`).set(message));

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
