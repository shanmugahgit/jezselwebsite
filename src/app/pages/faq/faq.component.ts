import { Component, OnInit } from '@angular/core';
import { HttpRequestService } from 'src/app/services/http-request/http-request.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {

  dataLists: any = [''];
  constructor(private http: HttpRequestService) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(){
    this.http.get('faqs').subscribe(
      (response: any)=>{
        this.dataLists = response;
      }
    )
  }

}
