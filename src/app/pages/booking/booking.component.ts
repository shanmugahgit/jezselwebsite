import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage/storage.service';
import { HttpRequestService } from 'src/app/services/http-request/http-request.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {

  @ViewChild('template') template: any;
  @ViewChild('termstemplate') termstemplate: any;
  formGroup: FormGroup = new FormGroup({
    type: new FormControl('', Validators.required),
    bedrijfsnaam: new FormControl(''),
    kvk: new FormControl(),
    btwnr: new FormControl(''),
    vesigingstraat: new FormControl('', Validators.required),
    vesiginghuisnr: new FormControl('', Validators.required),
    vesigingpostcode: new FormControl('', Validators.required),
    vesigingplaats: new FormControl('', Validators.required),
    vesigingland: new FormControl('', Validators.required),
    factuurstraat: new FormControl('', Validators.required),
    factuurhuisnr: new FormControl('', Validators.required),
    factuurpostcode: new FormControl('', Validators.required),
    factuurplaats: new FormControl('', Validators.required),
    factuurland: new FormControl('', Validators.required),
    aanhef: new FormControl('', Validators.required),
    voornaam: new FormControl('', Validators.required),
    tussenvoegsel: new FormControl(''),
    achternaam: new FormControl('', Validators.required),
    factuuremail: new FormControl('', Validators.required),
    telefoonnr: new FormControl('', Validators.required),
    useBalance: new FormControl(true),
    termsAndConditions: new FormControl('', Validators.required),
    driverFirstName: new FormControl(''),
    driverLastName: new FormControl(''),
    driverEmail: new FormControl(''),
    driverPhone: new FormControl(''),
    driverAddress: new FormControl(''),
  });
  dataLists: any = [];
  total: any = 0;
  userDetails: any = {};
  modalRef?: BsModalRef;
  termsAndConditions: any = '';
  coupon: any = '';
  currentBalance: any = 0;
  teamowner: any = null;
  // currentWallet: any = 0;
  // currentInterest: any = 0;
  // interestUsed: any = 0;
  maxcheckoutdate: any;
  teamId: any = null;
  couponPrice: any = 0;
  couponId: any = null;
  driverLicense: any;
  submittedForm: boolean = false;
  constructor(private storage: StorageService, private http: HttpRequestService, private router: Router, private modalService: BsModalService) {
    this.dataLists = this.storage.getProducts() ? this.storage.getProducts() : [];
    this.userDetails = this.storage.getUserDetails();
    if (this.userDetails) {
      this.loadUserData();
    }
    this.loadTermsData();

    let checkoutDates: any = [];
    this.dataLists.forEach((element: any) => {
      if(element.advancePayment){
        element.advancePayment = element.advancePayment ? element.advancePayment.toFixed(2) : element.advancePayment;
      }
      if (element.search) {
        var date = element.search.checkoutdate.split("-").reverse().join("-");
        checkoutDates.push(new Date(date))
        if (element.cancelData && element.cancelData.days) {
          var date2 = element.search.checkindate.split("-").reverse().join("-");
          element.maxcanceldate = this.addDays(element.cancelData.days, date2);
          element.cancelationfee = element.cancelData.price
        }

        let utcDate = new Date(element.search.checkoutdate.split("-").reverse().join("-") + " " + element.search.checkouttime);
        let month = utcDate.getUTCMonth() + 1;
        
        var d = new Date(utcDate.getUTCFullYear() + "-" + month  +"-" + utcDate.getUTCDate() + " " + utcDate.getUTCHours() + ":" + utcDate.getUTCMinutes())
        element.search.maxcheckoutdateutc = [d.getMonth()+1,
          d.getDate(),
          d.getFullYear()].join('-')+' '+
         [d.getHours(),
          d.getMinutes()].join(':');;
      }
    });
    if (checkoutDates.length > 0) {
      var latest = new Date(Math.max.apply(null, checkoutDates));
      this.maxcheckoutdate = ((latest.getDate() > 9) ? latest.getDate() : ('0' + latest.getDate())) + '-' + ((latest.getMonth() > 8) ? (latest.getMonth() + 1) : ('0' + (latest.getMonth() + 1))) + '-' + latest.getFullYear()

    }
    let times: any = [];
    this.dataLists.forEach((element: any) => {
      if (element.search.checkoutdate == this.maxcheckoutdate) {
        times.push(element.search.checkouttime);
      }
    })
  }

  ngOnInit(): void {
    localStorage.setItem('fromCart', '');
    this.makeTotal();
  }

  addDays(days: any, oldDate: any) {
    let date: any = new Date(oldDate);
    date.setDate(date.getDate() - days);
    return ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '-' + ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '-' + date.getFullYear();
  }

  loadUserData() {
    this.http.get('user/get/' + this.userDetails.id).subscribe(
      (response: any) => {
        if (response.email) {
          response['factuuremail'] = response.email;
        }
        if (response.phone) {
          response['telefoonnr'] = response.phone;
        }
        this.teamId = response['team_id'];
        if (response.teamowner) {
          this.teamowner = response.teamowner;
        }
        this.formGroup.patchValue(response);
        this.http.post('order/my-wallet', { team_id: this.teamId ? this.teamId : null }).subscribe(
          (response: any) => {
            if (response.wallet) {
              this.currentBalance = response.wallet;
              if (response.interest) {
                let interest = Number(response.interest);
                let wallet = Number(response.wallet);
                this.currentBalance = wallet + interest;
              }
            }
          }
        )
      }
    )

  }

  // loadOrderData() {
  //   let params = {
  //     frontend: 1
  //   }
  //   this.http.post('orders', params).subscribe(
  //     (response: any) => {
  //       if (response && response.data && Array.isArray(response.data) && (response.data.length > 0)) {
  //         response.data.forEach((element: any) => {
  //           let services: any = [];
  //           element.Orderhistories.forEach((element2: any) => {
  //             services.push(element2.type);
  //           });
  //           element.services = services.join(',');
  //           let fromDate: any = new Date(element.createdAt);
  //           let toDate: any = new Date();
  //           let diffTime: any = Math.abs(toDate - fromDate);
  //           let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  //           element.interestAmount = 0;
  //           // let today = new Date();
  //           if (diffDays && element.amountpaid && (element.status == 1) && (element.fromwallet != 1)) {
  //             let months: any = (diffDays / 30);
  //             element.interestAmount = ((element.amountpaid / 100) * (parseInt(months) * 4.79)).toFixed(2);
  //             this.currentInterest += parseFloat(element.interestAmount);
  //           }
  //         });
  //       }
  //       this.currentInterest = parseFloat(this.currentInterest);
  //       this.interestUsed = parseFloat(this.interestUsed);
  //       this.currentWallet = parseFloat(this.currentWallet);
  //       if ((this.currentInterest > this.interestUsed) || (this.currentInterest == this.interestUsed)) {
  //         this.currentBalance = this.currentWallet + (this.currentInterest - this.interestUsed);
  //       }
  //       else {
  //         this.currentBalance = this.currentWallet + 0;
  //       }
  //       this.currentBalance = parseFloat(this.currentBalance).toFixed(2);
  //     }
  //   )
  // }

  loadTermsData() {
    this.http.get('terms-and-condition').subscribe(
      (response: any) => {
        if (response) {
          this.termsAndConditions = response.content;
        }
      }
    )
  }

  getWalletInterest() {
    // let wallet = this.currentWallet;
    // let interestUsed = this.interestUsed;
    let amountUsed: any = 0;
    let amountPaid: any = 0;
    this.total = parseFloat(this.total);
    if (this.formGroup.value.useBalance) {
      if ((this.total < this.currentBalance) || (this.total == this.currentBalance)) {
        amountPaid = 0;
        amountUsed = this.total;
        // if (this.total < this.currentWallet) {
        //   wallet = this.currentWallet - this.total;
        //   interestUsed = this.interestUsed;
        // }
        // else if (this.total > this.currentWallet) {
        //   wallet = 0;
        //   interestUsed += (this.interestUsed + this.currentWallet) - this.total;
        // }
      }
      else if (this.total > this.currentBalance) {
        amountPaid = (this.total - this.currentBalance);
        amountUsed = this.currentBalance;
        // wallet = amountPaid;
        // interestUsed += (this.currentBalance - this.currentWallet);
      }
    }
    else {
      // wallet+=this.total; x
      // interestUsed = this.interestUsed;
      amountPaid = this.total;
    }
    return { amountPaid: parseFloat(parseFloat(amountPaid).toFixed(2)), amountUsed: parseFloat(parseFloat(amountUsed).toFixed(2)) };
    // return { wallet: parseFloat(parseFloat(wallet).toFixed(2)), interestUsed: parseFloat(parseFloat(interestUsed).toFixed(2)), amountPaid: parseFloat(parseFloat(amountPaid).toFixed(2)) };
  }

  get f() { 
    return this.formGroup.controls; 
  }

  orderNow() {
    this.submittedForm = true;
    if(!this.formGroup.invalid){
      if (this.formGroup.value.useBalance) {
        let walletInterest = this.getWalletInterest();
        // let wallet = walletInterest.wallet;
        // let interestUsed = walletInterest.interestUsed;
        let amountPaid = walletInterest.amountPaid;
        let amountUsed = walletInterest.amountUsed;
        if (amountPaid > 0) {
          if(!this.teamId||(this.teamId&&this.teamowner)) {
            this.openModal();
          }
          else{
            this.http.errorMessage("U heeft onvoldoende saldo in de wallet om de bestelling af te ronden. Contacteer de hoofdgebruiker om het saldo op te waarderen.");
          }
        }
        else {
          this.formGroup.value['id'] = this.userDetails.id;
          this.formGroup.value['username'] = this.userDetails.firstname;
          let params = JSON.parse(JSON.stringify(this.formGroup.value));
          delete params['termsAndConditions'];
          delete params['useBalance'];
          this.http.post('user/update', params).subscribe(
            (response: any) => {
              this.formGroup.value.total = this.total
              this.formGroup.value.status = 3;
              this.formGroup.value.products = this.dataLists;
              this.formGroup.value['amountpaid'] = amountPaid;
              this.formGroup.value['fromwallet'] = amountUsed;
              // this.formGroup.value.status = 1;
              this.formGroup.value['maxcheckoutdate'] = this.maxcheckoutdate;
              this.formGroup.value['coupon_id'] = this.couponId;
              this.formGroup.value['team_id'] = this.teamId ? this.teamId : null;
              if(!amountPaid){
                this.formGroup.value.status = 1;
              }
              this.http.post('order/make-order', this.formGroup.value).subscribe(
                (order: any) => {
                  this.uploadLicense(order.id);
                  let pName: any = "";
                  order.Orderhistories.forEach((elm: any) => {
                    if (!elm.extra_id) {
                      if (!pName) {
                        pName += elm.name + " - " + elm.type;
                      } else {
                        pName += ", " + elm.name + " - " + elm.type;
                      }
                    }
                  });
                  this.modalRef?.hide();
                  this.http.successMessage("Boeking succesvol geplaatst.");
                  this.router.navigate(['/home']);
                  this.storage.clearProducts();
                  // this.updateWallet(wallet, interestUsed);
                });
            },
            (error: any) => {
              this.http.exceptionHandling(error);
            }
          )
        }
      }
      else if(!this.teamId||(this.teamId&&this.teamowner)) {
        this.openModal();
      }
      else{
        this.http.errorMessage("U heeft onvoldoende saldo in de wallet om de bestelling af te ronden. Contacteer de hoofdgebruiker om het saldo op te waarderen.");
      }
    }
    
  }

  openModal() {
    this.modalRef = this.modalService.show(this.template, {
      backdrop: 'static',
      keyboard: false,
      class: 'modal-sm'
    });
  }
  openTermsModal() {
    this.modalRef = this.modalService.show(this.termstemplate, {
      backdrop: 'static',
      keyboard: false,
      class: 'modal-xl bottom-15'
    });
  }

  bookNow() {
    // if(this.formGroup.value.useBalance){
    // }
    let walletInterest = this.getWalletInterest();
    // let wallet = walletInterest.wallet;
    // let interestUsed = walletInterest.interestUsed;
    let amountPaid = walletInterest.amountPaid;
    let amountUsed = walletInterest.amountUsed;
    this.formGroup.value['id'] = this.userDetails.id;
    this.formGroup.value['username'] = this.userDetails.firstname;
    let params = JSON.parse(JSON.stringify(this.formGroup.value));
    delete params['termsAndConditions'];
    delete params['useBalance'];
    this.http.post('user/update', params).subscribe(
      (response: any) => {
        this.formGroup.value.total = this.total
        this.formGroup.value.status = 3;
        this.formGroup.value.products = this.dataLists;
        this.formGroup.value['amountpaid'] = amountPaid;
        this.formGroup.value['fromwallet'] = amountUsed
        // this.formGroup.value.status = 1;
        this.formGroup.value['maxcheckoutdate'] = this.maxcheckoutdate;
        this.formGroup.value['coupon_id'] = this.couponId;
        this.formGroup.value['team_id'] = this.teamId ? this.teamId : null;
        if(!amountPaid){
          this.formGroup.value.status = 1;
        }
        this.http.post('order/make-order', this.formGroup.value).subscribe(
          (order: any) => {
            this.uploadLicense(order.id);
            let pName: any = "";
            order.Orderhistories.forEach((elm: any) => {
              if (!elm.extra_id) {
                if (!pName) {
                  pName += elm.name + " - " + elm.type;
                } else {
                  pName += ", " + elm.name + " - " + elm.type;
                }
              }
            });
            if (amountPaid > 0) {
              let prop = { id: order.id, total: amountPaid, pname: pName }
              this.http.post('payment/ideal', prop).subscribe(
                (body: any) => {
                  let reference: any = { id: order.id };
                  reference.paymentchargeid = body && body.paymentchargeid || null;
                  window.location.href = body.url
                  this.modalRef?.hide();
                  localStorage.setItem('odere', JSON.stringify(reference));
                  this.storage.clearProducts();
                  // this.http.successMessage("Ordered Successfully");
                  // this.router.navigate(['/home']);
                  // this.dataLists.length = 0;
                  // this.updateWallet(wallet, interestUsed);
                })
            }
            else {
              this.modalRef?.hide();
              this.http.successMessage("Boeking succesvol geplaatst.");
              this.router.navigate(['/home']);
              this.storage.clearProducts();
              // this.updateWallet(wallet, interestUsed);
            }
          });
      },
      (error: any) => {
        this.http.exceptionHandling(error);
      }
    )
  }

  // updateWallet(wallet: any, interestUsed: any) {
  //   let params = {
  //     id: this.userDetails.id,
  //     wallet: wallet,
  //     interestused: interestUsed
  //   }
  //   this.http.post('user/update', params).subscribe(
  //     (response: any) => {

  //     });
  // }

  sendPaymentLink() {
    let walletInterest = this.getWalletInterest();
    let amountPaid = walletInterest.amountPaid;
    let amountUsed = walletInterest.amountUsed;
    this.formGroup.value['id'] = this.userDetails.id;
    this.formGroup.value['username'] = this.userDetails.firstname;
    let params = JSON.parse(JSON.stringify(this.formGroup.value));
    delete params['termsAndConditions'];
    delete params['useBalance'];
    // if(!params['wallet']){
    //   params['wallet'] = this.total;
    //   params['interestused'] = 0;
    // }   
    this.http.post('user/update', params).subscribe(
      (response: any) => {
        this.formGroup.value.total = this.total
        this.formGroup.value.status = 3;
        this.formGroup.value.products = this.dataLists;
        this.formGroup.value['maxcheckoutdate'] = this.maxcheckoutdate;
        this.formGroup.value['team_id'] = this.teamId ? this.teamId : null;
        this.formGroup.value['amountpaid'] = amountPaid;
        this.formGroup.value['fromwallet'] = amountUsed
        this.formGroup.value['coupon_id'] = this.couponId;
        this.http.post('order/make-order', this.formGroup.value).subscribe(
          (response: any) => {
            this.uploadLicense(response.id);
            // this.http.successMessage("Order Successfully.");
            response.factuuremail = this.formGroup.value.factuuremail;
            this.http.post('send-payment-link', response).subscribe(
              (body: any) => {
                this.formGroup.reset();
                this.modalRef?.hide();
                this.http.successMessage("Betalingslink is verstuurd!");
                this.storage.clearProducts();
                this.router.navigate(['/home']);
                // this.dataLists.length = 0;
              })
            this.storage.clearProducts();
            // this.router.navigateByUrl('my-orders');
            // this.dataLists.length = 0;
          })
      },
      (error: any) => {
        this.http.exceptionHandling(error);
      }
    )
  }
  makeTotal() {
    this.total = this.dataLists.reduce((a: any, b: any) => +a + +b.advancePayment, 0);
    this.total = this.total.toFixed(2);
  }

  sync(event: any) {
    if (event.currentTarget.checked) {
      this.formGroup.patchValue({
        factuurstraat: this.formGroup.value.vesigingstraat,
        factuurhuisnr: this.formGroup.value.vesiginghuisnr,
        factuurpostcode: this.formGroup.value.vesigingpostcode,
        factuurplaats: this.formGroup.value.vesigingplaats,
        factuurland: this.formGroup.value.vesigingland,
      })
    } else {
      this.formGroup.patchValue({
        factuurstraat: '',
        factuurhuisnr: '',
        factuurpostcode: '',
        factuurplaats: '',
        factuurland: '',
      })
    }
  }

  getBalance() {
    let interest = 0;
    return (this.formGroup.value.wallet ? this.formGroup.value.wallet : 0) + interest;
  }

  applyCoupon() {
    this.total = parseFloat(this.total) + parseFloat(this.couponPrice);
    this.couponPrice = 0;
    this.couponId = null;
    if (this.coupon) {
      this.http.post('check-coupon-used', { code: this.coupon }).subscribe(
        (response: any) => {
          console.log(response)
          if (response && response.price) {
            this.couponPrice = response.price;
            if (response.coupon_id) {
              this.couponId = response.coupon_id;
            }
            this.total = parseFloat(this.total) - this.couponPrice;
          }
        },
        (error: any) => {
          this.http.exceptionHandling(error);
        }
      )
    }
    else {
      this.http.errorMessage("Vul a.u.b. uw kortingscode in");
    }
  }

  isEnableDriver() {
    let result = false;
    if (this.dataLists && Array.isArray(this.dataLists) && this.dataLists.length > 0) {
      let isRent = this.dataLists.find((element: any) => (element.type == 'Rent'));
      if (isRent) {
        result = true;
      }
    }

    return result;
  }

  onThumbnailChange(file: any) {
    this.driverLicense = file[0];
  }

  uploadLicense(orderId: any) {
    if (this.driverLicense && orderId) {
      let _form = new FormData();
      _form.append('id', orderId);
      _form.append('image', this.driverLicense);
      this.http.post('order/updateDriverLicense', _form).subscribe(
        (response: any) => {
        },
        (error: any) => {
          this.http.exceptionHandling(error);
        }
      )
    }
  }

  getAdvancePayment(advance: any){
    return advance ? advance.toFixed(2) : advance;
  }

}
