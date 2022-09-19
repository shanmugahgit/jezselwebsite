import { Component, OnInit } from '@angular/core';
import { HttpRequestService } from 'src/app/services/http-request/http-request.service';
declare var $: any;
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  contactDetails: any = {
    phone: '',
    email: '',
    address: ''
  };
  constructor(private http: HttpRequestService) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(){
    this.http.get('contactus').subscribe(
      (response: any)=>{
        if(response && Array.isArray(response) && (response.length>0)){
          this.contactDetails = response[0];
        }
      }
    )
  }

  ngAfterViewInit() {
    setTimeout(()=>{



      $(document).ready(function() {
        $('#jezsel-ftmenu-show').click(function() {
          $('.jezsel-ftmenu').toggle("fadein");
        });
      });



      


    }, 200)
  }

}
