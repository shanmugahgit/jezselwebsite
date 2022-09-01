import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage/storage.service';
import { HttpRequestService } from 'src/app/services/http-request/http-request.service';

@Component({
  selector: 'app-payment-failure',
  templateUrl: './payment-failure.component.html',
  styleUrls: ['./payment-failure.component.css']
})
export class PaymentFailureComponent implements OnInit {

  input: any;
  constructor(private storage: StorageService, private http: HttpRequestService, private router: Router) {
    let odere = localStorage.getItem('odere');
    this.input = odere && JSON.parse(odere) || null;
  }


  ngOnInit(): void {
    this.input.status = 2;
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
