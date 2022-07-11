import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpRequestService } from 'src/app/services/http-request/http-request.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {

  myFormGroup: any;
  constructor(private http: HttpRequestService, private router: Router, private storage: StorageService) { 
    if(this.storage.getToken()){
      this.router.navigate(['/home']);
    }
  }

  ngOnInit(): void {
    this.myFormGroup = new FormGroup({
      email: new FormControl('', Validators.required)
    })
  }

  forgetPassword(){
    this.http.post('reset/password', this.myFormGroup.value).subscribe(
      (response: any)=>{
        this.http.successMessage("Password Sent to Email Successfully");
        this.myFormGroup.reset();
        this.router.navigate(['/login']);
      },
      (error: any)=>{
        if(error == 'User not found'){
          this.http.errorMessage("Email does't exists");
        }
        else{
          this.http.exceptionHandling(error);
        }        
      }
    )
  }

}
