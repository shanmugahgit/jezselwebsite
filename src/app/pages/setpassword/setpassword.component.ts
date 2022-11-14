import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpRequestService } from 'src/app/services/http-request/http-request.service';
import { StorageService } from 'src/app/services/storage/storage.service';
@Component({
  selector: 'app-setpassword',
  templateUrl: './setpassword.component.html',
  styleUrls: ['./setpassword.component.css']
})
export class SetpasswordComponent implements OnInit {
  myFormGroup: any;
  userDetails: any = {};
  constructor(private http: HttpRequestService, private router: Router, private storage: StorageService) {
    this.userDetails = this.storage.getUserDetails() ? this.storage.getUserDetails() : {};
    if(!this.userDetails || !this.userDetails.id){
      this.router.navigateByUrl('/login');
    }
  }

  ngOnInit(): void {
    this.myFormGroup = new FormGroup({
      password: new FormControl('', Validators.required),
      confirmpassword: new FormControl('', Validators.required)
    })
  }

  save() {
    if (!this.myFormGroup.value.password || !this.myFormGroup.value.confirmpassword) {
      this.http.errorMessage("Vereist wachtwoord en bevestig wachtwoord");
    }
    else if (this.myFormGroup.value.password != this.myFormGroup.value.confirmpassword) {
      this.http.errorMessage("Uw wachtwoord en bevestigd wachtwoord komen niet overeen");
    }
    else if (!this.userDetails || !this.userDetails.id) {
      this.storage.clearUser();
      this.router.navigateByUrl('/login');
    }
    else {

      if (!this.myFormGroup.value.password) {
        this.http.errorMessage("Vul a.u.b. uw wachtwoord in");
      }
      else if ((/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/.test(this.myFormGroup.value.password)) && (/^[A-Z]/.test(this.myFormGroup.value.password))) {
        this.myFormGroup.value['id'] = this.userDetails.id;
        this.myFormGroup.value['reset_password'] = 1;
        this.myFormGroup.value['newpassword'] = this.myFormGroup.value.password;
        this.http.post('user/update', this.myFormGroup.value).subscribe(
          (response: any) => {
            this.http.successMessage("Wachtwoord succesvol gereset");
            this.storage.clearUser();
            setTimeout(() => {
              this.router.navigateByUrl('/login');
              location.reload();
            }, 200);
          },
          (error: any) => {
            this.http.exceptionHandling(error);
          }
        )
      }
      else {
        this.http.errorMessage("Een wachtwoord moet alfanumeriek zijn. De eerste letter van het wachtwoord moet een hoofdletter zijn. Het wachtwoord moet een speciaal teken bevatten (@, $, !, &, enz.). Het wachtwoord moet langer zijn dan 8 tekens.");
      }
    }
  }

}
