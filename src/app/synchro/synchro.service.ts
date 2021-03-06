import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable, pipe } from 'rxjs';
import { concatMap, map, take } from 'rxjs/operators';

export interface Synchro  {
  id_firestore:string,
  time:number
  time2:number
  seqNo:number,
  type:string,
  message:string,
  auteur:string
  seconde:number,
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
export class SynchroService {
  itemCollection: any;
  items$: any;
  my_diff_max: number;


  constructor(private afs: AngularFirestore) {

    this.getItems()

  }


  getItems = ():any=>{

    return this.afs.collection("synchro")
            .valueChanges()



  }

  create_Id = ()=>{

    return this.afs.createId()
  }


  deleteAllMessage(ids:string[]) {
    console.log("deleted All" ,ids)
    const batch = this.afs.firestore.batch()

    for(let id of ids){
      const myRef = this.afs.doc(`synchro/${id}`).ref
      console.log("REf : ",myRef);

      batch.delete(myRef)
    }
    return from(batch.commit())
}

  deleteMessage(messageid:string) {
    console.log("deleted" ,messageid)
    return from(this.afs.doc(`synchro/${messageid}`).delete());
}

falsedeleteMessage(messageid:string,changes: Partial<Synchro>) {
  console.log(messageid)
  changes.deleted = true
  return from(this.afs.doc(`synchro/${messageid}`).update(changes));
}

updateMessage(messageid:string, changes: Partial<Synchro>):Observable<any> {
    return from(this.afs.doc(`synchro/${messageid}`).update(changes));
}

createMessage(newMessage: Partial<Synchro>, messageid:string) {
  console.log("createMessage",newMessage,messageid)
    return this.afs.collection("synchro", ref => ref.orderBy("seqNo", "desc"))
        .get()
        .pipe(
            concatMap(result => {
                console.log("inside ping")



                const messages = convertSnaps<Synchro>(result);

                let lastCourseSeqNo = messages[0]?.seqNo ?? 0;

                if(newMessage.type == "ping1"){

                  console.log("ping1")
                  lastCourseSeqNo =  0;


                }

                let date_now = Date.now()

                if(newMessage.time2 != -1){
                  newMessage.message = "" +(date_now - newMessage.time2)
                }else{
                  newMessage.message = "PING!"
                }

                if(newMessage.type == "game"){
                  newMessage.message = ""+newMessage.time2
                }

                const message = {
                    ...newMessage,
                    time: date_now,
                    seqNo: lastCourseSeqNo + 1,
                    id_firestore:messageid
                }

                console.log(message)

                let save$: Observable<any>;

                save$ = from(this.afs.doc(`synchro/${messageid}`).set(message));

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
get_time(){

  if(this.my_diff_max){
    return( Date.now() + this.my_diff_max)
  }else{
    return(Date.now())
  }

}

}
