import { Component, OnInit } from '@angular/core';
import { HttpRequestService } from 'src/app/services/http-request/http-request.service';
import { StorageService } from 'src/app/services/storage/storage.service';
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
  email: any = '';
  userDetails: any = {};
  constructor(private http: HttpRequestService, private storage: StorageService) {
    this.userDetails = this.storage.getUserDetails() ? this.storage.getUserDetails() : {};
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.http.get('contactus').subscribe(
      (response: any) => {
        if (response && Array.isArray(response) && (response.length > 0)) {
          this.contactDetails = response[0];
        }
      }
    )
  }

  ngAfterViewInit() {
    setTimeout(() => {



      $(document).ready(function () {
        $('#jezsel-ftmenu-show').click(function () {
          $('.jezsel-ftmenu').toggle("fadein");
        });
      });






    }, 200)
  }

  save() {
    if (!this.email) {
      this.http.errorMessage("Voer uw e-mailadres in")
    }
    else {
      this.http.post('subscribe/email', { email: this.email }).subscribe(
        (response: any) => {
          this.http.successMessage("Geabonneerd.");
          this.email = '';
        }
      )
    }
  }

}
