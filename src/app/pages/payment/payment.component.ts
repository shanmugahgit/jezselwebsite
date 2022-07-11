import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage/storage.service';
import { HttpRequestService } from 'src/app/services/http-request/http-request.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  input: any;
  order: any;
  pName: any = '';
  constructor(private route: ActivatedRoute, private storage: StorageService, private http: HttpRequestService, private router: Router) {
    if (!this.storage.getToken()) {
      localStorage.setItem('redirect', this.router.url);
      this.router.navigateByUrl('/login');
    } else {
      const oid: any = this.route.snapshot.queryParamMap.get('oud');
      const decode = atob(oid);
        this.input = decode && JSON.parse(decode) || {};
      // this.route.params.subscribe(params => {
      //   const data = params['data'];
      //   const decode = atob(data);
      //   this.input = decode && JSON.parse(decode) || {};
      // });
    }
  }

  ngOnInit(): void {
    
    this.http.post('order/get', { id: this.input }).subscribe(
      (body: any) => {
        this.order = body;
        this.order && this.order.Orderhistories.forEach((elm: any) => {
          if (!elm.extra_id) {
            if (!this.pName) {
              this.pName += elm.name + " - " + elm.type;
            } else {
              this.pName += ", " + elm.name + " - " + elm.type;
            }
          }
        });
      })
  }
  payNow() {
    localStorage.removeItem('redirect');
    let prop = { id: this.input, total:this.order.total, pname: this.pName}
    this.http.post('payment/ideal', prop).subscribe(
      (body: any) => {
        let reference:any = { id: this.input };
        reference.paymentchargeid = body && body.paymentchargeid || null;
        window.location.href = body.url
        localStorage.setItem('odere',JSON.stringify(reference));
        this.storage.clearProducts();
        // this.dataLists.length = 0;
      })
  }

}
