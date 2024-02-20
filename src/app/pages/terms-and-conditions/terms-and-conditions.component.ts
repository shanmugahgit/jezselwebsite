import { Component, OnInit } from '@angular/core';
import { HttpRequestService } from 'src/app/services/http-request/http-request.service';

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.css']
})
export class TermsAndConditionsComponent implements OnInit {

  termsAndConditions: any = '';
  constructor(private http: HttpRequestService) { 
    this.loadTermsData();
  }

  ngOnInit(): void {
  }

  loadTermsData() {
    this.http.get('terms-and-condition').subscribe(
      (response: any) => {
        if (response) {
          this.termsAndConditions = response.content;
        }
      }
    )
  }

}
