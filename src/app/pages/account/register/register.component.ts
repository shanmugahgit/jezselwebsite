import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpRequestService } from 'src/app/services/http-request/http-request.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  myFormGroup: any;
  constructor(private http: HttpRequestService, private router: Router, private storage: StorageService) { 
    if(this.storage.getToken()){
      this.router.navigate(['/home']);
    }
  }

  ngOnInit(): void {
    this.myFormGroup = new FormGroup({
      firstname: new FormControl('', Validators.required),
      insertion: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      newsletter: new FormControl('', Validators.required)
    })
  }

  register(){
    this.http.postAuth('signup-user', this.myFormGroup.value).subscribe(
      (response: any)=>{
        this.http.successMessage("Registered Successfully");
        this.myFormGroup.reset();
        this.router.navigate(['/login']);
      },
      (error: any)=>{
        this.http.exceptionHandling(error);
      }
    )
  }

}
