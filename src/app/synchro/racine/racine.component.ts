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
  items: any
  id: string;
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

  constructor(private synchroService:SynchroService,
              private afAuth: AngularFireAuth,
              private userService:UserService,
              private observableMedia:  MediaObserver
    ) {
        this.secondes = 2

    
    
   }

  ngOnInit(): void {

    this.id = this.synchroService.create_Id()
    this.synchroService.getItems().pipe().subscribe((data:Synchro[])=>{
      console.log("data")
      console.log(data)
      let data2 = data.sort(this.compareNombres)
      //this.items2 = data
      this.items = data2.filter((e:any)=>{
        return !e.deleted
      }).map((data)=>{
        let fontsize = "48px"
        if(data['message'].length > 20){
          fontsize = "24px"
        }
        if(data['message'].length > 40){
          fontsize = "12px"
        }

        data['fontsize']=fontsize
        return data
      })

      this.items2 = this.items.filter((e:Synchro)=>{
        return e.type == "set"
      })
      console.log("time")
      if(this.items2.length > 0){
        if( this.lastTime ){
          if(this.lastTime != this.items2[0].time){
           this.lastTime = this.items2[0].time
           this.checkNewGame()
          }
         }else{
           this.lastTime = this.items2[0].time
           this.checkNewGame()
         }
      }

      this.items3 = this.items.filter((e:Synchro)=>{
        return e.type == "game"
      }).sort((a,b)=>{
        return (Number(a.message) < Number(b.message) ? -1 : 1) 
      })
      
      if(this.items3.length > 0){
        this.iswinner = true
        this.winner = this.items3[0].auteur
        this.time = this.items3[0].message
      }else{
        this.iswinner = false
      }
      console.log("items3",this.items3)

      console.log("lastTime",this.items2,this.lastTime)


    }
      )
  }

  checkNewGame = ()=>{
    let now2 = Date.now() 
    this.diff = now2 - this.lastTime
    this.mili = this.items2[0].seconde * 1000
    this.lastGameSeconde = this.items2[0].seconde
    if(this.diff < (this.mili) ){
      this.time_to_wait = (Number(this.lastGameSeconde) * 1000) - this.diff
      this.wait = true
      setTimeout(() => {
        this.wait =  false
      }, this.time_to_wait)
      
      
    }else{this.wait =  false}

  } 


  

  add(){

    this.id = this.synchroService.create_Id()
    this.userService.userName.pipe(take(1)).subscribe((data)=>{
      console.log(data)
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();

      let today2 = yyyy  + '-' + mm + '-' + dd;
      this.synchroService.createMessage(
        {auteur:data,
          type:"game",
          message: ""+(Date.now() - (this.mili + this.lastTime )),
          seconde:this.secondes,
          date:today2
        },this.id).subscribe()
      
    })




  }
  set(){

    this.id = this.synchroService.create_Id()
    this.userService.userName.pipe(take(1)).subscribe((data)=>{
      console.log(data)
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();

      let today2 = yyyy  + '-' + mm + '-' + dd;
      this.synchroService.createMessage(
        {auteur:data,
          type:"set",
          message:this.message.value,
          seconde:this.secondes,
          date:today2
        },this.id).subscribe()
      
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

}
