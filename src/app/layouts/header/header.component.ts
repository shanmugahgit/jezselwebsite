import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { HttpRequestService } from 'src/app/services/http-request/http-request.service';
import { StorageService } from 'src/app/services/storage/storage.service';
declare var $: any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  userDetails: any = {};
  contactDetails: any = {};
  constructor(private storage: StorageService, private router: Router, private http: HttpRequestService) {
    this.userDetails = this.storage.getUserDetails() ? this.storage.getUserDetails() : {};
    // if(this.userDetails && !this.userDetails.reset_password) {
    if (this.userDetails && this.userDetails.firstname && !this.userDetails.reset_password) {
      this.router.navigateByUrl('/set-password');
    }

  }

  ngOnInit(): void {
    this.loadData()
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        $(".navbar-collapse").removeClass("show");
      }
    });
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

  logout() {
    this.storage.clearUser();
    this.router.navigate(['/login']);
    this.userDetails = {};
  }

  navigateProfile() {
    this.router.navigate(['/profile']);
  }

}
