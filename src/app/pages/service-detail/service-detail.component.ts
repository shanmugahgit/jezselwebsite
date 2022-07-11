import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommunicationService } from 'src/app/services/communication/communication.service';
import { HttpRequestService } from 'src/app/services/http-request/http-request.service';

@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.css']
})
export class ServiceDetailComponent implements OnInit {

  serviceDetails: any = null;
  similarProducts: any = [];
  productImages: any = [];
  constructor(private http: HttpRequestService, private route: ActivatedRoute, private communication: CommunicationService) { 

  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if(params['route']){
        this.loadData(params['route']);
      }      
    })
    
  }

  loadData(route: any) {
    this.http.get('product/' + route).subscribe(
      (response: any) => {
        if(response){
          this.serviceDetails = response;
          this.productImages = this.serviceDetails.Productimages;
          this.loadSimilarProducts(this.serviceDetails.type, this.serviceDetails.id)
        }        
      },
      (error: any) => {
        this.http.exceptionHandling(error);
      }
    )
  }

  loadSimilarProducts(type: any, id: any){
    this.http.get('product/similar/' + type + '/' + id).subscribe(
      (response: any) => {
        this.similarProducts = response;
      },
      (error: any) => {
        this.http.exceptionHandling(error);
      }
    )
  }

  bookNow(product: any){
    this.communication.openProductModal.emit(product)
  }

}
