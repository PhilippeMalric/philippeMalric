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
  today2: string;
  ping1_sent: boolean;
  ping1_items: any;
  response_ping1_items: any;
  compteur: number;
  n: number;
  pingx_items: any;
  pingx2_items: any;
  auteur: string;


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
        this.userService.userName.pipe(take(1)).subscribe((auteur)=>{
          this.auteur = auteur
        })
   }



  ngOnInit(): void {

    this.compteur = 0
    this.n = 10
    this.synchroService.getItems().pipe().subscribe((data:Synchro[])=>{
      console.log("data")
      console.log(data)
      this.items = data.sort((a,b)=>{return (a.time - b.time)})
      console.log("compteur",this.compteur)
      console.log("ping"+(this.compteur + 1))
      this.pingx_items = this.items.filter((data)=>{

        let boot_condition = this.compteur == 0 && data.type == "ping1"
        let after_boot_condition = data.type == ("ping"+(this.compteur + 1)) && data.auteur == this.auteur

        return boot_condition || after_boot_condition
      })
      console.log("pingx_items",this.pingx_items)
      if( this.pingx_items.length > 0){
        this.compteur += 1

        if(this.compteur < this.n){

          this.newid = this.synchroService.create_Id()

            this.synchroService.createMessage(
              {auteur:this.auteur,
                type:"ping"+(this.compteur + 1),
                time2:this.pingx_items[0].time,
                message: "" ,
                seconde:this.secondes,
                date:this.today2
              },this.newid).subscribe()

        }
      }else{
        this.compteur = 0
      }



    })



/*     this.newid = this.synchroService.create_Id()
    this.synchroService.getItems().pipe().subscribe((data:Synchro[])=>{
      console.log("data")
      console.log(data)
      this.items = data
      if(this.items.length == 0){
        this.ping1_sent = false
      }else{
       this.ping1_items = this.items.filter((data)=>{
          return data.type == "ping1"
        })
        console.log(this.ping1_sent,this.ping1_items.length > 0)
        if( this.ping1_items.length > 0){
          this.response_ping1_items = this.items.filter((data)=>{
            return data.type == "response_to_ping1"
          })
          if(this.ping1_sent && this.response_ping1_items.length > 0){
            let diff =    this.response_ping1_items[0].time - this.ping1_items[0].time
            console.log("diff",diff)
          }else{
            this.newid = this.synchroService.create_Id()
            this.userService.userName.pipe(take(1)).subscribe((auteur)=>{

            this.synchroService.createMessage(
              {auteur:auteur,
                type:"response_to_ping1",
                message: ""+ Date.now(),
                seconde:this.secondes,
                date:this.today2
              },this.newid).subscribe()



            })
            this.ping1_sent = true
          }
        }
      }
    }) */
  }



 deleteAll = ()=>{
  this.compteur = 0
  this.items.map((item)=>{
    this.synchroService.deleteMessage(item.id_firestore)
  })

 }



  add(){

    this.newid = this.synchroService.create_Id()
    this.userService.userName.pipe(take(1)).subscribe((data)=>{
      console.log(data)
      console.log("add")
      this.synchroService.createMessage(
        {auteur:data,
          type:"game",
          time2:-1,
          message: ""+ Date.now(),
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
          type:"ping1",
          time2:-1,
          message:""+ Date.now(),
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
              this.newid = this.synchroService.create_Id()
              let newObj = {}
              for(let i in e){
                newObj[array_imported[0][i]] = e[i]
              }
              if(!newObj["date"]){
                newObj["date"] = "202?-??-??"
              }

              newObj["deleted"] = false
              newObj["id_firestore"] = this.newid
              this.synchroService.createMessage(
                newObj,this.newid).subscribe()
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
