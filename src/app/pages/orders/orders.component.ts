import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpRequestService } from 'src/app/services/http-request/http-request.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  dataLists: any = [];
  modalRef?: BsModalRef;
  @ViewChild('template') template: any;
  selectedProduct: any;
  constructor(private http: HttpRequestService, private modalService: BsModalService) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    let params = {
      frontend: 1
    }
    this.http.post('orders', params).subscribe(
      (response: any) => {
        if (response && response.data && Array.isArray(response.data) && (response.data.length > 0)) {
          response.data.forEach((element: any) => {
            let services: any = [];
            element.Orderhistories.forEach((element2: any) => {
              services.push(element2.type);
            });
            element.services = services.join(',');
            let fromDate: any = new Date(element.createdAt);
            let toDate: any = new Date();
            let diffTime: any = Math.abs(toDate - fromDate);
            let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            element.interestAmount = 0;
            if (diffDays) {
              let months: any = (diffDays / 30);
              element.interestAmount = ((element.total / 100) * (parseInt(months) * 4.79)).toFixed(2);
            }
          });
          this.dataLists = response.data;
        }
      }
    )
  }

  viewDetails(data: any) {
    this.selectedProduct = data;
    this.modalRef = this.modalService.show(this.template, {
      backdrop: 'static',
      keyboard: false,
      class: 'modal-xl'
    });
  }
}