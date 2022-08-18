import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpRequestService } from 'src/app/services/http-request/http-request.service';
import { StorageService } from 'src/app/services/storage/storage.service';
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  userDetails: any = {};
  formGroup: FormGroup = new FormGroup({
    password: new FormControl('', Validators.required),
    confirmpassword: new FormControl('', Validators.required)
  });
  constructor(private http: HttpRequestService, private storage: StorageService, private router: Router) {
    this.userDetails = this.storage.getUserDetails();
  }

  ngOnInit(): void {
  }

  get formControls() {
    return this.formGroup.controls;
  }

  save() {
    if (!this.formGroup.value.password) {
      this.http.errorMessage("Please enter the password");
    }
    else if ((/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/.test(this.formGroup.value.password)) && (/^[A-Z]/.test(this.formGroup.value.password))) {
      let params = {
        email: this.userDetails.email,
        id: this.userDetails.id,
        password: this.formGroup.value.password
      }
      this.http.post('reset/changepassword', params).subscribe(
        (response: any) => {
          this.http.successMessage('Updated');
          this.formGroup.reset();
        },
        (error: any) => {
          this.http.exceptionHandling(error);
        }
      )
    }
    else {
      this.http.errorMessage("A password should be alphanumeric. First letter of the password should be capital. Password must contain a special character (@, $, !, &, etc). Password length must be greater than 8 characters.");
    }
  }

}
