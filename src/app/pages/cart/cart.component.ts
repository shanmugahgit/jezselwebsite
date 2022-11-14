import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage/storage.service';
import { HttpRequestService } from 'src/app/services/http-request/http-request.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  dataLists: any = [];
  total: any = 0;
  cancelRentingData: any = [
    {
      id: 1,
      label: "U kunt uw bestelling tot 48 uur voor het ophaaldatum/tijd annuleren. Een knop is zichtbaar op de boeking pagina.",
      hours: 48,
      price: "0.00",
      days: 2,
      selected: false
    },
    {
      id: 2,
      label: "U kunt uw bestelling tot 24 uur voor het ophaaldatum/tijd annuleren. Een knop is zichtbaar op de boeking pagina.",
      hours: 24,
      price: "10",
      days: 1,
      selected: false
    }
  ];
  cancelStaffingData: any = [
    {
      id: 1,
      label: "Annuleren is niet mogelijk",
      hours: 0,
      price: "0.00",
      days: 0,
      selected: false
    },
    {
      id: 2,
      label: "U kunt uw bestelling tot 48 uur voor het ophaaldatum/tijd annuleren. Een knop is zichtbaar op de boeking pagina.",
      hours: 48,
      price: "25.00",
      days: 2,
      selected: false
    },
    {
      id: 3,
      label: "U kunt uw bestelling tot 24 uur voor het ophaaldatum/tijd annuleren. Een knop is zichtbaar op de boeking pagina.",
      hours: 24,
      price: "50.00",
      days: 1,
      selected: false
    }
  ];
  cancelTransportData: any = [
    {
      id: 1,
      label: "Annuleren is niet mogelijk",
      hours: 0,
      price: "0.00",
      days: 0,
      selected: false
    },
    {
      id: 2,
      label: "U kunt uw bestelling tot 48 uur voor het ophaaldatum/tijd annuleren. Een knop is zichtbaar op de boeking pagina.",
      hours: 48,
      price: "100.00",
      days: 2,
      selected: false
    },
    {
      id: 3,
      label: "U kunt uw bestelling tot 24 uur voor het ophaaldatum/tijd annuleren. Een knop is zichtbaar op de boeking pagina.",
      hours: 24,
      price: "250.00",
      days: 1,
      selected: false
    }
  ];
  constructor(private storage: StorageService, private http: HttpRequestService, private router: Router) {
    this.dataLists = this.storage.getProducts() ? this.storage.getProducts() : [];
    this.dataLists.forEach((element: any) => {
      if (element.type == 'Rent') {
        element.cancelLists = JSON.parse(JSON.stringify(this.cancelRentingData));
      }
      if (element.type == 'Staffing') {
        element.cancelLists = JSON.parse(JSON.stringify(this.cancelStaffingData));
      }
      if (element.type == 'Transport') {
        element.cancelLists = JSON.parse(JSON.stringify(this.cancelTransportData));
      }
      if (element.cancelData) {
        element.cancelLists.forEach((element2: any) => {
          if (element2.id == element.cancelData.id) {
            element2.selected = true;
          }
        });
      }
    });
    // this.dataLists.forEach((element: any) => {
    //   element.Extras[0].isGroup = true;
    //   element.Extras[1].isGroup = true;
    // });    
    this.updatedDisable();
  }

  updatedDisable() {
    this.dataLists.forEach((element: any) => {
      if (element.Extras) {
        let isExist = element.Extras.find((element2: any) => (element2.isGroup && element2.checked));
        if (isExist) {
          element.Extras.forEach((element2: any) => {
            if (element2.isGroup && element2.checked) {
              element2.isDisabled = false;
            }
            else if (element2.isGroup) {
              element2.isDisabled = true;
            }
          });
        }
        else {
          element.Extras.forEach((element2: any) => {
            if (element2.isGroup) {
              element2.isDisabled = false;
            }
          });
        }
      }
    });
  }

  ngOnInit(): void {
    this.makeTotal();
  }

  makeTotal() {
    this.total = this.dataLists.reduce((a: any, b: any) => +a + +b.advancePayment, 0);
    this.total = this.total.toFixed(2);
    // this.dataLists.forEach((element:any) => {
    //   this.total += element['Extras'].reduce(function(sum:any, record:any) {
    //     return (!record.checked) ? sum : + sum + +record.price;
    //    }, 0);
    // });
  }

  delete(index: any) {
    this.dataLists = this.dataLists.filter((element: any, ind: any) => (index != ind));
    this.storage.clearSingleProduct(this.dataLists);
    this.makeTotal();
  }

  addExtra(event: any, extraObj: any, index: any) {
    if (event.currentTarget.checked) {
      extraObj.checked = true;
      // this.total += + + extraObj.price;
    } else {
      extraObj.checked = false;
      // this.total = this.total - extraObj.price;
    }
    this.dataLists.forEach((element: any, ind: any) => {
      if (index == ind) {
        element.Extras.forEach((element2: any) => {
          element.cancelLists.forEach((element3: any) => {
            if (element2.price == element3.price) {
              element3.selected = element2.checked
            }
          });
          let findSelectedCancel = element.cancelLists.find((element3: any) => (element3.selected));
          if (findSelectedCancel) {
            element.cancelData = element.cancelLists.find((element4: any) => (element4.id == findSelectedCancel.id));
          }
        });
      }
    })
    this.storage.clearSingleProduct(this.dataLists);
    this.updatedDisable();
  }

  updateProducts(event: any, index: any, id: any) {
    this.dataLists.forEach((element: any, ind: any) => {
      if (index == ind) {
        element.cancelData = element.cancelLists.find((element2: any) => (element2.id == id));
        element.cancelLists.forEach((element2: any) => {
          if (element2.id == id) {
            element2.selected = true;
          }
          else {
            element2.selected = false;
          }
        });
      }
    });
    this.dataLists.forEach((element: any, ind: any) => {
      if (index == ind) {
        element.Extras.forEach((element2: any) => {
          element.cancelLists.forEach((element3: any) => {
            if (element2.price == element3.price) {
              element2.checked = element3.selected
            }
          });
        });
      }
    })
    this.storage.clearSingleProduct(this.dataLists);
    this.updatedDisable();
  }

  proceed() {
    localStorage.setItem('fromCart', JSON.stringify(true));
    this.router.navigateByUrl('/booking');
  }

  disabledExtras(currentExtras: any, extrasLists: any) {
    let result = false;
    if (currentExtras.isGroup) {
      let findExist = extrasLists.find((element: any) => (!element.checked && element.isGroup));
      if (findExist) {
        result = true;
      }
    }
    return result;
  }

  getAdvancePayment(amount: any) {
    return (amount) ? amount.toFixed(2) : amount;
  }
}
