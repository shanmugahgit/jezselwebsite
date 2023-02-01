import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommunicationService } from 'src/app/services/communication/communication.service';
import { HttpRequestService } from 'src/app/services/http-request/http-request.service';
declare var $: any;
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
      if (params['route']) {
        this.loadData(params['route']);
      }
    })

  }

  loadCarousel() {
    setTimeout(() => {
      $('.service-detailed-owc.owl-carousel').owlCarousel({ 
        items: 1,
        margin: 50,
        lazyLoad: true,
        dots: false,
        nav: true,
        autoPlay: true,
        autoPlayTimeout: 1500,
        navText : ["<i class='zmdi zmdi-chevron-left'></i>","<i class='zmdi zmdi-chevron-right'></i>"], 
        responsive: {
          0: {
            items: 1,
          },
          600: {
            items: 2,
          },
          1000: {
            items: 3,
          }
        }
      });
    })

  }
  

  loadData(route: any) {
    this.http.get('productfind/' + route).subscribe(
      (response: any) => {
        if (response) {
          this.serviceDetails = response;
          this.productImages = this.serviceDetails.Productimages;
          this.loadSimilarProducts(this.serviceDetails.type, this.serviceDetails.id);
          this.loadCarousel();
        }
      },
      (error: any) => {
        this.http.exceptionHandling(error);
      }
    )
  }

  loadSimilarProducts(type: any, id: any) {
    this.http.get('product/similar/' + type + '/' + id).subscribe(
      (response: any) => {
        this.similarProducts = response;
      },
      (error: any) => {
        this.http.exceptionHandling(error);
      }
    )
  }

  bookNow(product: any) {
    this.communication.openProductModal.emit(product)
  }

  getType(type: any){
    let result = '';
    if(type == 'Rent'){
      result = 'Verhuur';
    }
    else if(type == 'Staffing'){
      result = 'Uitzend';
    }
    else if(type == 'Transport'){
      result = 'Transport';
    }
    return result;
  }

}
