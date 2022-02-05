import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, from, Observable, pipe } from 'rxjs';
import { concatMap, map, take, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';


export interface ApiTest  {
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
export class ApiTestService {

  itemCollection: any;
  sondage$: any;
  url: string = "https://www.donneesquebec.ca/recherche/api/3/action/datastore_search?limit=1000&resource_id=e84bbc32-06d5-4030-afd4-77d831a9e8fc"
  testObs:BehaviorSubject<any>;
  colNames: any;
  dataObs:BehaviorSubject<any>;
  colNames_stat:BehaviorSubject<any>;
  records: any;
  datasetNamesObs: BehaviorSubject<any>;
  ressourcesObs: BehaviorSubject<any>;

  constructor(
    private afs: AngularFirestore,
    private http: HttpClient
    ) { 
      this.dataObs = new BehaviorSubject<any>({})
      this.colNames_stat = new BehaviorSubject<any>({})
      this.testObs = new BehaviorSubject<any>({})

      this.datasetNamesObs = new BehaviorSubject<any>({})

      this.ressourcesObs = new BehaviorSubject<any>({})

      this.testObs.subscribe((data=>{
        console.log("testObs")
        if(Object.keys(data).length === 0)
        {}
        else{
          this.records = data.result.records
          console.log("records")
          console.log(this.records)

          this.colNames = data.result.fields.map((x)=>{

            return x.id

          })
        }

      }))
      //this.getsondage()

  }

  field_click(id){

    console.log("service")
    console.log(this.records)
    

   let selection =  this.records.map((data)=>{

      return data[id]

    })
    console.log("selection")
    console.log(selection)

    var unique = selection.filter(this.onlyUnique);
    console.log("unique")
    console.log(unique)
    let result = unique.map((data)=>{

      let n = selection.filter((data2)=>{
        return data == data2
      }).length

      return [data,(n/selection.length)] 

    })

    this.dataObs.next(result)
    this.colNames_stat.next([id,'Percentage'])
  }
  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }
  getsondage = ()=>{

    return this.afs.collection("apiTest")
            .valueChanges()
            


  }

  create_Id = ()=>{

    return this.afs.createId()
  }
  sendRequete_data(url){
    this.url = url
    return this.http.get<any>(this.url).pipe(tap((data)=>{

      this.testObs.next(data)


    }));

  }

  sendRequete_meta(url){
    
    return this.http.get<any>(url).pipe(tap((data)=>{

      this.datasetNamesObs.next(data)


    }));

  }

  getRessource(url){

console.log(url)

    return this.http.get<any>(url).pipe(tap((data)=>{

      this.ressourcesObs.next(data)


    }));

  }

  deleteMessage(messageid:string) {
    console.log(messageid)
    return from(this.afs.doc(`apiTest/${messageid}`).delete());
}

updateMessage(apiTestid:string, changes: Partial<ApiTest>):Observable<any> {
    return from(this.afs.doc(`apiTest/${apiTestid}`).update(changes));
}

createMessage(newMessage: Partial<ApiTest>, messageid:string) {
    return this.afs.collection("apiTest",
            ref => ref.orderBy("seqNo", "desc").limit(1))
        .get()
        .pipe(
            concatMap(result => {
console.log("inside createMessage2")

                const messages = convertSnaps<ApiTest>(result);


                const lastCourseSeqNo = messages[0]?.seqNo ?? 0;

                const message = {
                    ...newMessage,
                    seqNo: lastCourseSeqNo + 1,
                    id_firestore:messageid
                }

                let save$: Observable<any>;

                save$ = from(this.afs.doc(`apiTest/${messageid}`).set(message));

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
