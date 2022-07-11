import { Component, OnInit } from '@angular/core';
import { HttpRequestService } from 'src/app/services/http-request/http-request.service';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit {

  content: any = '';
  constructor(private http: HttpRequestService) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(){
    this.http.get('aboutus').subscribe(
      (response: any)=>{
        if(response){
          this.content = response.content;
        }
      }
    )
  }

}
