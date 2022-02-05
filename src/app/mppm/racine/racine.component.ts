import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-racine',
  templateUrl: './racine.component.html',
  styleUrls: ['./racine.component.scss']
})
export class RacineComponent implements OnInit {

  viewOn = false
  constructor() { }

  ngOnInit(): void {
  }

  clickVideo(){
    this.viewOn=true;
  }
}
