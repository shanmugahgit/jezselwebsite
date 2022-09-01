import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage/storage.service';
import { HttpRequestService } from 'src/app/services/http-request/http-request.service';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css']
})
export class PaymentSuccessComponent implements OnInit {
  input: any;
  constructor(private storage: StorageService, private http: HttpRequestService, private router: Router) {
    let odere = localStorage.getItem('odere');
    this.input = odere && JSON.parse(odere) || null;
  }


  ngOnInit(): void {
    this.input.status = 1;
    this.http.post('order/update-status', this.input).subscribe(
        (response: any) => {
          this.http.successMessage("Bestelling met success bijgewerkt.");
          this.storage.clearProducts();
          localStorage.removeItem('odere');
          // this.router.navigateByUrl('my-orders');
          // this.dataLists.length = 0;
        })
  }

}
