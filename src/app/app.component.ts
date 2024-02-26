import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';
  showPage: boolean = false;
  url: any = '';
  constructor(public router: Router){
    setTimeout(()=>{
      this.showPage = true;
    }, 100)
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // This block will be executed after each successful navigation
        
        
        // Your code to be executed after the router has finished loading
        // For example, you can call a function or perform some initialization
        this.url = router.url;
        console.log(this.url);
      }
    });
  }
}
