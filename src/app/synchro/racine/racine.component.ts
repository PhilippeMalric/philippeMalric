import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormControl } from '@angular/forms';
import { MatInput } from '@angular/material/input';

import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { UserService } from 'src/app/user/user.service';
import { SynchroService,  Synchro } from '../synchro.service';

import * as saveAs from 'file-saver';
import { MatGridList } from '@angular/material/grid-list';
import { MediaChange, MediaObserver } from '@angular/flex-layout';

@Component({
  selector: 'app-racine',
  templateUrl: './racine.component.html',
  styleUrls: ['./racine.component.scss']
})
export class RacineComponent implements OnInit {

  secondes:number
  items: any;
  newid: string;
  lastGameSeconde : any
  message = new FormControl('');
  items2: Synchro[];

  @ViewChild('grid') grid: MatGridList;

  lastTime: number;
  wait: any;
  diff: number;
  mili: number;
  time_to_wait: number;
  items3: any;
  winner: any;
  time: any;
  iswinner: boolean;
  items4: any;
  today2: string;
  sync_launch: any;
  mySync: any;
  max_time: number;
  min_time: number;
  diff_min_max: number;
  id: string;
  my_diff_max: number;
  items5: any;
  items6: any;
  items7: any;
  items8: any;


  constructor(private synchroService:SynchroService,
              private afAuth: AngularFireAuth,
              private userService:UserService,
              private observableMedia:  MediaObserver
    ) {
        this.secondes = 2
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        this.today2 = yyyy  + '-' + mm + '-' + dd;

        this.sync_launch = false
   }



  ngOnInit(): void {

    this.newid = this.synchroService.create_Id()
    this.synchroService.getItems().pipe().subscribe((data:Synchro[])=>{
      console.log("data")
      console.log(data)
      let data2 = data.sort(this.compareNombres)
      //this.items2 = data
      this.items = data2.filter((e:any)=>{
        return !e.deleted
      }).map(this.changeFont_size)

      this.items2 = this.items.filter((e:Synchro)=>{
        return e.type == "set1"
      })
      this.items8 = this.items.filter((e:Synchro)=>{
        return e.type == "set"
      })
      console.log("time")

      //devrait toujours passer ...

      if(this.items2.length > 0){

        this.userService.userName.pipe(take(1)).subscribe((data)=>{
          //obtenir mon sync si présent
          this.mySync = this.items.filter((e:Synchro)=>{
            return e.type == "sync" && e.auteur == data
          })
          console.log("mySync",this.mySync)

          this.sync_launch = (this.mySync.length) > 0
          if(!this.sync_launch ){


            if(this.items.length == 1){// pour ne pas avoir de redo

              console.log("sync",this.items)
              this.newid = this.synchroService.create_Id()
              this.synchroService.createMessage(
                      { auteur:data,
                        type:"sync",
                        time: Date.now(),
                        seconde:this.secondes,
                        date:this.today2
                      },this.newid).subscribe()
            }
          }else{
            let times = this.items.filter((e:Synchro)=>{
              return e.type == "sync"
            }).map((e=>e.time))

            this.max_time = Math.max(...times)
            this.min_time = Math.min(...times)
            this.diff_min_max = this.max_time - this.min_time
            console.log("time",times,this.max_time,this.min_time,this.mySync[0].time)
            this.synchroService.my_diff_max = this.max_time - this.mySync[0].time
            this.my_diff_max = this.synchroService.my_diff_max


            this.items5 = this.items.filter((e:Synchro)=>{
              return e.type == "set1" && e.auteur == data
            })
            this.items7 = this.items.filter((e:Synchro)=>{
              return e.type == "set" && e.auteur == data
            })

           if(this.items5.length > 0 && (!(this.items7.length > 0))){

              console.log(this.items)
              console.log("items5",this.items5)
              console.log("items7", this.items7)
              console.log("sync",this.items)
            this.newid = this.synchroService.create_Id()
           this.synchroService.createMessage(
              {auteur:data,
                type:"set",
                message:this.message.value,
                seconde:this.secondes,
                date:this.today2
              },this.newid).subscribe()
           }

          }
        })

        this.items6 = this.items.filter((e:Synchro)=>{
          return e.type == "set"
        })
        if(this.items6.length > 0){
          if( this.lastTime ){
            if(this.lastTime != this.items6[0].time){
             this.lastTime = this.items6[0].time
             this.checkNewGame()
            }
           }else{
             this.lastTime = this.items6[0].time
             this.checkNewGame()
           }
        }

      }

      this.items3 = this.items.filter((e:Synchro)=>{
        return e.type == "game"
      }).sort((a,b)=>{
        return (Number(a.message) < Number(b.message) ? -1 : 1)
      })

      if(this.items3.length > 0){
        setTimeout(()=>{

          this.iswinner = true

        },2000)

        this.winner = this.items3[0].auteur
        this.time = this.items3[0].message
      }else{
        this.iswinner = false
      }

      console.log("items3",this.items3)

      console.log("lastTime",this.items2,this.lastTime)

      this.items4 = this.items.filter((e:Synchro)=>{
        return e.type == "sync"
      }).sort((a,b)=>{
        return (Number(a.message) < Number(b.message) ? -1 : 1)
      })

    }
      )
  }



  checkNewGame = ()=>{
    let now2 = this.synchroService.get_time()
    this.diff = now2 - this.lastTime
    this.mili = this.items2[0].seconde * 1000
    this.lastGameSeconde = this.items2[0].seconde

    console.log("Time to get set",this.diff )

    if(this.diff < (this.mili) ){
      this.time_to_wait = (Number(this.lastGameSeconde) * 1000) - this.diff
      this.wait = true
      setTimeout(() => {
        this.wait =  false
      }, this.time_to_wait)


    }else{this.wait =  false}

  }




  add(){

    this.newid = this.synchroService.create_Id()
    this.userService.userName.pipe(take(1)).subscribe((data)=>{
      console.log(data)
      console.log("add")
      this.synchroService.createMessage(
        {auteur:data,
          type:"game",
          message: ""+(this.synchroService.get_time() - (this.mili + this.lastTime )),
          seconde:this.secondes,
          date:this.today2
        },this.newid).subscribe()

    })




  }
  set(){

    this.newid = this.synchroService.create_Id()
    this.userService.userName.pipe(take(1)).subscribe((data)=>{
      console.log(data)
      console.log("set")
      this.synchroService.createMessage(
        {auteur:data,
          type:"set1",
          message:this.message.value,
          seconde:this.secondes,
          date:this.today2
        },this.newid).subscribe()

    })




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
        console.log(text)
          return text.toString()
      }).join(';')}) ;

      csv.unshift(header.join(';'));
      let csvArray = csv.join('\r\n');

      var blob = new Blob([csvArray], {type: 'text/csv' })
      saveAs.saveAs(blob, "myFile.csv");

  }


  uploadListener($event: any): void {

    this.importFile($event)

  }

  importFile($event: any) {

    // Select the files from the event
    const files = $event.srcElement.files;

    console.log(files);
    if(files && files.length > 0) {
      let file : File = files.item(0);
        console.log(file.name);
        console.log(file.size);
        console.log(file.type);
        let reader: FileReader = new FileReader();
        reader.readAsText(file);
        reader.onload = (e) => {
            let csv: string = reader.result as string;
            let array_imported = this.CSVToArray(csv,";")
            console.log(array_imported);
            let newArray = []
            for(let e of array_imported.slice(1,array_imported.length)){
              this.id = this.synchroService.create_Id()
              let newObj = {}
              for(let i in e){
                newObj[array_imported[0][i]] = e[i]
              }
              if(!newObj["date"]){
                newObj["date"] = "202?-??-??"
              }

              newObj["deleted"] = false
              newObj["id_firestore"] = this.id
              this.synchroService.createMessage(
                newObj,this.id).subscribe()
              newArray.push(newObj)
            }

            console.log(newArray)


        }
      }
  }

  compareNombres(a, b) {
    return b.seqNo - a.seqNo;
  }

  CSVToArray( strData, strDelimiter ){
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (strDelimiter || ",");

    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp(
        (
            // Delimiters.
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

            // Quoted fields.
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

            // Standard fields.
            "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ),
        "gi"
        );


    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [[]];

    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;


    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec( strData )){

        // Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[ 1 ];

        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (
            strMatchedDelimiter.length &&
            strMatchedDelimiter !== strDelimiter
            ){

            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push( [] );

        }

        var strMatchedValue;

        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[ 2 ]){

            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            strMatchedValue = arrMatches[ 2 ].replace(
                new RegExp( "\"\"", "g" ),
                "\""
                );

        } else {

            // We found a non-quoted value.
            strMatchedValue = arrMatches[ 3 ];

        }


        // Now that we have our value string, let's add
        // it to the data array.
        arrData[ arrData.length - 1 ].push( strMatchedValue );
    }

    // Return the parsed data.
    return( arrData );
  }
  changeFont_size = (data)=>{
    let fontsize = "48px"
    if("message" in Object.keys(data)){
      if(data['message'].length > 20){
        fontsize = "24px"
      }
      if(data['message'].length > 40){
        fontsize = "12px"
      }
    }

    data['fontsize']=fontsize
    return data
  }
}
