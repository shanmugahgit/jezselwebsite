import { Component, OnInit } from '@angular/core';
import { HttpRequestService } from 'src/app/services/http-request/http-request.service';

@Component({
  selector: 'app-garanties',
  templateUrl: './garanties.component.html',
  styleUrls: ['./garanties.component.css']
})
export class GarantiesComponent implements OnInit {

  title: any = '';
  content: any = '';
  constructor(private http: HttpRequestService) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(){
    this.http.get('certificate').subscribe(
      (response: any)=>{
        if(response){
          this.title = response.title;
          this.content = response.content;
        }
      }
    )
  }

}
