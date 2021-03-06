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
  }

  ngOnInit(): void {
    this.myFormGroup = new FormGroup({
      password: new FormControl('', Validators.required),
      confirmpassword: new FormControl('', Validators.required)
    })
  }

  save() {
    if(!this.myFormGroup.value.password || !this.myFormGroup.value.confirmpassword) {
      this.http.errorMessage("Required password and confirm password");
    }
    else if (this.myFormGroup.value.password != this.myFormGroup.value.confirmpassword) {
      this.http.errorMessage("Password and confirm password mismatch");
    } else {
      this.myFormGroup.value['id'] = this.userDetails.id;
      this.myFormGroup.value['reset_password'] = 1;
      this.myFormGroup.value['newpassword'] = this.myFormGroup.value.password;
      this.http.post('user/update', this.myFormGroup.value).subscribe(
        (response: any) => {
          this.http.successMessage("Password reset Successfully");
          this.storage.clearUser();
          setTimeout(()=>{
            this.router.navigateByUrl('/login');
            location.reload();
          },200);
        },
        (error: any) => {
          this.http.exceptionHandling(error);
        }
      )
    }
  }

}
