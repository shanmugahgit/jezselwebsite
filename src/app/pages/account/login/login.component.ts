import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpRequestService } from 'src/app/services/http-request/http-request.service';
import { StorageService } from 'src/app/services/storage/storage.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  myFormGroup: any;
  constructor(private http: HttpRequestService, private router: Router, private storage: StorageService) { 
    if(this.storage.getToken()){
      this.router.navigate(['/home']);
    }
  }

  ngOnInit(): void {
    this.myFormGroup = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    })
  }

  login(){
    this.http.postAuth('login', this.myFormGroup.value).subscribe(
      (response: any)=>{
        this.http.successMessage("Succesvol ingelogd");
        this.myFormGroup.reset();
        this.storage.setToken(response.token);
        this.storage.setUserDetails(response);
        if(localStorage.getItem('fromCart')){
          this.router.navigate(['/booking']);
        } else if(localStorage.getItem('redirect')) {
          let redirect = localStorage.getItem('redirect') || '/';
          this.router.navigateByUrl(redirect);
        }
        else{
          this.router.navigate(['/home']);
        }        
        setTimeout(()=>{
          location.reload();
        })
      },
      (error: any)=>{
        this.http.exceptionHandling(error);
      }
    )
  }

}
