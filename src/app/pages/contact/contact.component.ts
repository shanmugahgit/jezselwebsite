import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpRequestService } from 'src/app/services/http-request/http-request.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  contactDetails: any = {};
  myFormGroup: any;
  constructor(private http: HttpRequestService) { }

  ngOnInit(): void {
    this.myFormGroup = new FormGroup({
      name: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      subject: new FormControl('', Validators.required),
      message: new FormControl('', Validators.required)
    })
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

  save(){
    this.http.post('enquiry/create', this.myFormGroup.value).subscribe(
      (response: any)=>{
        this.http.successMessage("Het bericht is succesvol verzonden.");
        this.myFormGroup.reset();
      }
    )
  }

}
