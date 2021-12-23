import { Component } from '@angular/core';
import { FirstoreService } from '../services/firstore.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {
items: any;

    constructor(private firstoreService:FirstoreService){

      this.items = this.firstoreService.items

    }


}
