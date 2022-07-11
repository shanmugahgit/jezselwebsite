import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';
  showPage: boolean = false;
  constructor(){
    setTimeout(()=>{
      this.showPage = true;
    }, 100)
  }
}
