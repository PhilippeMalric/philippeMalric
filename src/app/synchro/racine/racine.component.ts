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
import { merge } from 'd3';

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
  auteurs: any;
  itemsReelDiff: any;
  diffBy_auteur: any;
  offsetBy_auteur: any;
  itemsB: any;
  pings3: any;
  pings3_diff_time: number;
  pings10: any;
  pings10_diff_time: number;
  array_time_diff: number[];
  ready: boolean;
  gameStartedByMe: boolean;
  ping1_auteur: any;
  gameOn: any;
  offset: any;
  gameCards: any;
  gagnant: any;
  gagnantShow: any;


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
        this.userService.userName.subscribe((auteur)=>{
          this.auteur = auteur
        })
   }




  ngOnInit(): void {
    this.gagnant = ""
    this.pings3_diff_time = 0
    this.pings3 = []
    this.gameCards = []
    this.compteur = 0
    this.n = 4
    this.synchroService.getItems().pipe().subscribe((data:Synchro[])=>{
      //console.log("data")
      //console.log(data)
      this.items = data.sort((a,b)=>{return (a.time - b.time)})
      //console.log("compteur",this.compteur)
      //console.log("ping"+(this.compteur + 1))

      this.resetIfempty()

      this.prochainPing()

      this.createAuteurs()
      this.reelPing3up()

      let tabPing2 = this.items.filter((data:Synchro)=>{
        return data.type == "ping2"
      })

      //console.log("ok : tabPing2")


      //console.log(this.auteurs,tabPing2)


      // Pour ??viter des erreurs
      if(this.items.length > 1){

        console.log("-----------",this.items);


        this.createOffset_by_auteur()
        this.createBalanced_ping()
        this.createDiff_between_ping()

        this.ping1_auteur = this.items.filter((data:Synchro)=>{
          return data.type == "ping1" && data.auteur == this.auteur
        })
        if(this.ping1_auteur.length > 0 && this.ready && !this.gameStartedByMe){
          this.startGame()
        }

        this.gameOn = this.items.filter((data:Synchro)=>{
          return data.type == "set"
        })

        if(this.gameOn.length == 1 && this.ready){
          console.log("####### gameOn",this.gameOn);
          console.log("offset",this.offset,this.gameOn[0].time2 - Date.now());


          let time_to_wait = (this.gameOn[0].time2 - Date.now() ) + this.offset
          console.log("time_to_wait",time_to_wait);
          setTimeout((data)=>{
            this.wait = false
          },time_to_wait)
        }
        this.gameCards = this.items.filter((data:Synchro)=>{
          return data.type == "game"
        })

        if(this.gameCards.length > 0){

          this.gagnant = this.gameCards.sort((a,b)=> a.time2 - b.time2)
                              .map((data:Synchro)=>{return data.auteur})[0]

          setTimeout(() => {
            this.gagnantShow = true
          }, 500);

        }



      }
    })
  }

  onlyUnique = function(value, index, self) {
    return self.indexOf(value) === index;
  }

 deleteAll = ()=>{
  this.compteur = 0
  let ids = this.items.map((item)=>{return item.id_firestore})
  this.synchroService.deleteAllMessage(ids)
 }


changeName = ()=>{
  this.auteur = "Test1"
}


  add(){

    this.newid = this.synchroService.create_Id()

    let timeClick = Date.now() - this.offset
    console.log("now",Date.now());
    //console.log("add")
    this.synchroService.createMessage(
      {auteur:this.auteur,
        type:"game",
        time2:timeClick,
        message: "",
        seconde:this.secondes,
        date:this.today2
      },this.newid).subscribe()
  }


  set(){

    this.newid = this.synchroService.create_Id()
    let mili = this.secondes *1000
    let timeClick = Date.now() + mili
    console.log("now",Date.now());

    console.log("!!!!!!!!!!!!set - secondes",this.secondes,mili,timeClick)
    this.synchroService.createMessage(
      {auteur:this.auteur,
        type:"set",
        time2:timeClick,
        message:"",
        seconde:this.secondes,
        date:this.today2
      },this.newid).subscribe()

  }

  ping1(){

    this.newid = this.synchroService.create_Id()
    this.userService.userName.pipe(take(1)).subscribe((data)=>{
      //console.log(data)
      //console.log("set")
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

  startGame(): void {
    this.gameStartedByMe = true
    this.set()
  }

  createDiff_between_ping(): void {
    if(this.itemsB.length > 3){

      this.array_time_diff = [...Array(2).keys()].map(n=>{

        let tab = this.itemsB.filter(data2=>{
          return data2.type == "ping"+(n+3)
        })
        //console.log((n+3),tab)
        let diff = 0
        if(tab.length > 1){
          diff = tab[0].time - tab[1].time
        }

        return diff
      })
      //console.log("array_time_diff",this.array_time_diff)

      this.pings3 = this.itemsB.filter((data)=>{
        return data.type == "ping3"
      })
      if(this.pings3.length > 1){
        this.pings3_diff_time =  this.pings3[0].time - this.pings3[1].time
      }
      this.pings10 = this.itemsB.filter((data)=>{
        return data.type == "ping10"
      })
      if(this.pings10.length > 1){
        this.pings10_diff_time =  this.pings10[0].time - this.pings10[1].time
      }
    }
   }

   createBalanced_ping(): void {

    let itemsB_by_auteur = this.auteurs.map((auteur)=>{
      let itemsReelDiff_by_auteur_balanced = this.itemsReelDiff.filter(data=>{

          return data.auteur == auteur

        }).map(data=>{

          let time_balanced = (Number(data.time) - this.offset)
          console.log(data,data.message,this.offset,time_balanced)
          data.time = time_balanced
          return data

        })
        return itemsReelDiff_by_auteur_balanced
      })

      //console.log("ok : itemsB_by_auteur",itemsB_by_auteur)
      this.itemsB = [].concat.apply([], itemsB_by_auteur).sort((a,b)=>{return (a.time - b.time)});
      //console.log("ok : itemsB",this.itemsB )

  }

   createOffset_by_auteur(): void {
   // if(){
    let tab_erreur = false
      this.offsetBy_auteur = this.auteurs.map((auteur)=>{

        let tab = this.items.filter((data:Synchro)=>{
          return data.type == "ping2" && data.auteur == auteur
        })

        let offset = 0

        if(tab.length > 0){
          offset = Number(tab[0].message)
        }else{
          tab_erreur = true
        }

        return {auteur,offset}
      })

      if(tab_erreur){
        this.offsetBy_auteur = []
      }


      let offset_current_auteur = this.offsetBy_auteur.filter((data2:Synchro)=>{
        return data2.auteur == this.auteur
      })

      if(offset_current_auteur.length > 0){
          //console.log("offset_current_auteur",offset_current_auteur)
          this.offset =  offset_current_auteur[0].offset

          this.ready = true
          //console.log("ok : offsetBy_auteur",this.offsetBy_auteur)
      }
   // }


   }

   createAuteurs(): void {

    //console.log("ok : auteur")
    this.auteurs = this.items.map((data:Synchro)=>{
      return data.auteur
    }).filter(this.onlyUnique);



   }

   reelPing3up(): void {


    //console.log("ok : itemsReelDiff")

    this.itemsReelDiff = this.items.filter((data:Synchro)=>{
      return data.type != "ping1" && data.type != "ping2" && data.type.substring(0, 4) == "ping"
    })
console.log("itemsReelDiff",this.itemsReelDiff);

    this.diffBy_auteur = this.auteurs.map((auteur)=>{

      let tab = this.itemsReelDiff.filter((data:Synchro)=>{

        return data.auteur == auteur

      }).map((data:Synchro)=>{
        return Number(data.message)
      })

      let sum = tab.reduce((a, b) => a + b, 0)

      return {mean:(sum / tab.length) || 0, auteur};
    })


   }

   prochainPing(): void {
    this.pingx_items = this.items.filter((data)=>{

      let boot_condition = (this.compteur == 0 && data.type == "ping1")
      let after_boot_condition = data.type == ("ping"+(this.compteur + 1)) && data.auteur == this.auteur
      //console.log((boot_condition || after_boot_condition),boot_condition,after_boot_condition)
      return (boot_condition || after_boot_condition)
    })

    this.pingx2_items = this.items.filter((data)=>{
      return  data.type == ("ping"+(this.compteur + 2)) && data.auteur == this.auteur
    })

    //console.log("pingx2_items", this.pingx2_items)

    //console.log("pingx_items",this.pingx_items)
    if( this.pingx_items.length > 0 && !(this.pingx2_items.length > 0)){
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
    }


   }

   resetIfempty(): void {
    if(this.items.length == 0){
      this.compteur = 0
      this.itemsB = []
      this.ready = false
      this.gameStartedByMe = false
      this.wait = true
      this.gagnant = ""
      this.gagnantShow = false
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
