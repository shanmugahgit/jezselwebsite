import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage/storage.service';
import { HttpRequestService } from 'src/app/services/http-request/http-request.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @ViewChild('withdrawtemplate') withdrawtemplate: any;
  ordersdataLists: any = [];
  depositdataLists: any = [];
  withdrawdataLists: any = [];
  employeeLists: any = [];
  modalRef?: BsModalRef;
  amount: any = null;
  team_id: any = null;
  teamowner: any = null;
  choice: string = '';
  showList: boolean = true;
  teamsLists: boolean = true;
  showDeposit: boolean = true;
  showWithdraw: boolean = false;
  showDeposit1: boolean = true;
  showWithdraw1: boolean = false;
  myFormGroup: any;
  @ViewChild('template') template: any;
  selectedProduct: any;
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
    telefoonnr: new FormControl('', Validators.required)
  });

  userDetails: any = {};
  passwordformGroup: FormGroup = new FormGroup({
    password: new FormControl('', Validators.required),
    confirmpassword: new FormControl('', Validators.required)
  });
  // currentBalance: any = 0;
  currentWallet: any = 0;
  currentInterest: any = 0;
  // currentInterest: any = 0;
  // interestUsed: any = 0;
  // availableInterest: any = 0;
  extrasLists: any = [];
  showPasswordField: boolean = false;
  showAddressField: boolean = false;
  constructor(private storage: StorageService, private http: HttpRequestService, private router: Router, private modalService: BsModalService) {
    this.userDetails = this.storage.getUserDetails();
    if (this.userDetails) {
      this.loadUserData();
    }
    this.loadExtras();
  }

  logout() {
    this.storage.clearUser();
    this.router.navigate(['/login']);
    this.userDetails = {};
  }

  getTotal() {
    return (Number(this.currentWallet) + Number(this.currentInterest)).toFixed(2);
  }

  ngOnInit(): void {
    this.myFormGroup = new FormGroup({
      firstname: new FormControl('', Validators.required),
      insertion: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      phone: new FormControl('', [Validators.required, Validators.minLength(10)]),
      password: new FormControl('123', Validators.required),
      newsletter: new FormControl('', Validators.required),
      team_id: new FormControl('', Validators.required),
    })
  }

  loadExtras() {
    this.http.get('product/extras').subscribe(
      (response: any) => {
        if (response) {
          this.extrasLists = response;
        }
      },
      (error: any) => {
        this.http.exceptionHandling(error);
      }
    )
  }

  loadData() {
    this.depositdataLists = [];
    this.ordersdataLists = [];
    let params = {
      frontend: 1,
      team_id: this.team_id
    }
    this.http.post('orders', params).subscribe(
      (response: any) => {
        if (response && response.data && Array.isArray(response.data) && (response.data.length > 0)) {
          response.data.forEach((element: any) => {
            if (element.type == 'wallet')
              this.depositdataLists.push(element);
            else
              this.ordersdataLists.push(element);
            let services: any = [];
            element.Orderhistories.forEach((element2: any) => {
              services.push(element2.type);
            });
            element.services = services.join(',');
            // let fromDate: any = new Date(element.createdAt);
            // let toDate: any = new Date();
            // let diffTime: any = Math.abs(toDate - fromDate);
            // let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            // element.interestAmount = 0;
            // if (diffDays && element.amountpaid && (element.status == 1) && (element.fromwallet != 1)) {
            //   let months: any = (diffDays / 30);
            //   element.interestAmount = ((element.amountpaid / 100) * (parseInt(months) * 4.79)).toFixed(2);
            //   this.currentInterest += parseFloat(element.interestAmount);
            // }
          });
          // this.currentInterest = parseFloat(this.currentInterest);
          // this.interestUsed = parseFloat(this.interestUsed);
          // this.currentWallet = parseFloat(this.currentWallet).toFixed(2);
          // if ((this.currentInterest > this.interestUsed) || (this.currentInterest == this.interestUsed)) {
          //   this.currentBalance = this.currentWallet + (this.currentInterest - this.interestUsed);
          //   this.availableInterest = (this.currentInterest - this.interestUsed);
          // }
          // else {
          //   this.currentBalance = this.currentWallet + 0;
          //   this.availableInterest = 0;
          // }
          // if (this.availableInterest) {
          //   this.availableInterest = this.availableInterest.toFixed(2)
          // }
          // this.ordersdataLists = response.data;
        }
      }
    )
    let params2 = {
      frontend: 1,
      team_id: this.team_id
    }
    this.http.post('withdraws', params2).subscribe(
      (response: any) => {
        if (response && Array.isArray(response) && (response.length > 0)) {
          this.withdrawdataLists = response;
        }
      }
    )

  }

  loadUserData() {
    this.http.get('user/get/' + this.userDetails.id).subscribe(
      (response: any) => {
        // this.interestUsed = response['interestused'] ? response['interestused'] : 0;
        // this.currentWallet = response['wallet'] ? response['wallet'] : 0;
        if (response.team_id) {
          this.team_id = response.team_id;
        }
        if (response.teamowner) {
          this.teamowner = response.teamowner;
        }
        this.formGroup.patchValue(response);
        this.loadWallet(this.team_id ? this.team_id : '');
        this.loadData();
        this.loadTeamUsers();
        this.loadTeams();
      }
    )
  }

  loadTeams() {
    if (!this.teamowner) {
      this.http.get('teams').subscribe(
        (response: any) => {
          this.teamsLists = response;
        }
      )
    }
  }

  loadTeamUsers() {
    this.http.post('team/members', { team_id: this.team_id ? this.team_id : '' }).subscribe(
      (response: any) => {
        this.employeeLists = response;
      }
    )
  }

  loadWallet(team_id: any) {
    this.http.post('order/my-wallet', { team_id: team_id }).subscribe(
      (response: any) => {
        if (response.wallet) {
          this.currentWallet = response.wallet;
          this.currentInterest = response.interest;
          if (response.interest) {
            let interest = Number(response.interest);
            let wallet = Number(response.wallet);
            if ((interest + wallet) == 0) {
              this.currentWallet = 0;
              this.currentInterest = 0;
            }
          }
        }
      }
    )
  }

  group(arr: any, key: any) {
    return [...arr.reduce((acc: any, o: any) =>
      acc.set(o[key], (acc.get(o[key]) || []).concat(o))
      , new Map).values()];
  }

  viewDetails(data: any) {
    // this.selectedProduct = data;
    let histories: any = []
    data.Orderhistories.sort(function (a: any, b: any) {
      var keyA = new Date(a.extra_id),
        keyB = new Date(b.extra_id);
      // Compare the 2 dates
      if (keyA < keyB) return -1;
      if (keyA > keyB) return 1;
      return 0;
    });
    data.Orderhistories.forEach((element: any) => {
      let findOrder = histories.find((element2: any) => (element2.product_id == element.product_id));
      if (findOrder && element.extra_id) {
        histories.forEach((element2: any) => {
          if (element.product_id == element2.product_id) {
            if (!element2.extras) {
              element2.extras = [];
            }
            let findExtra = this.extrasLists.find((element3: any) => (element3.id == element.extra_id));
            let extraName = '';
            if (findExtra) {
              extraName = findExtra.description
            }
            element['extraName'] = extraName;
            let isExist = element2.extras.find((element3: any)=>((element.product_id == element3.product_id)&&(element.extra_id == element3.extra_id)))
            if(!isExist){
              element2.extras.push(element);
            }  
          }
        });
      }
      else {
        histories.push(element);
      }
    });
    this.selectedProduct = histories;
    this.modalRef = this.modalService.show(this.template, {
      backdrop: 'static',
      keyboard: false,
      class: 'modal-xl'
    });
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

  get passwordformControls() {
    return this.passwordformGroup.controls;
  }

  save() {
    if (!this.passwordformGroup.value.password) {
      this.http.errorMessage("Vul a.u.b. uw wachtwoord in");
    }
    else if ((/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/.test(this.passwordformGroup.value.password)) && (/^[A-Z]/.test(this.passwordformGroup.value.password))) {
      let params = {
        email: this.userDetails.email,
        id: this.userDetails.id,
        password: this.passwordformGroup.value.password
      }
      this.http.post('reset/changepassword', params).subscribe(
        (response: any) => {
          this.http.successMessage('Bijgewerkt');
          this.passwordformGroup.reset();
          this.showPasswordField = false;
        },
        (error: any) => {
          this.http.exceptionHandling(error);
        }
      )
    }
    else {
      this.http.errorMessage("Een wachtwoord moet alfanumeriek zijn. De eerste letter van het wachtwoord moet een hoofdletter zijn. Het wachtwoord moet een speciaal teken bevatten (@, $, !, &, enz.). Het wachtwoord moet langer zijn dan 8 tekens.");
    }
  }

  updateAddress() {
    if (!this.showAddressField) {
      this.showAddressField = true;
    }
    else {
      this.formGroup.value['id'] = this.userDetails.id;
      this.formGroup.value['username'] = this.userDetails.firstname;
      this.http.post('user/update', this.formGroup.value).subscribe(
        (response: any) => {
          this.http.successMessage("Succesvol bijgewerkt");
          this.showAddressField = false;
        },
        (error: any) => {
          this.http.exceptionHandling(error);
        }
      )
    }
  }

  submitChoice() {
    let order: any = {};
    order.total = this.amount;
    order.status = 3;
    order.products = [];
    order.amountpaid = this.amount;
    order.type = 'wallet';
    order.team_id = this.team_id ? this.team_id : ''

    this.http.post('order/make-order', order).subscribe(
      (order: any) => {
        let pName: any = 'Add Money to your Wallet'
        if (this.amount > 0) {
          let prop = { id: order.id, total: this.amount, pname: pName }
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
              // let wallet = Number(this.currentWallet) + Number(this.amount);
              // this.updateWallet(wallet);
              // this.loadUserData();
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

  }

  updateWallet(wallet: any) {
    let params = {
      id: this.userDetails.id,
      wallet: wallet,
    }
    this.http.post('user/update', params).subscribe(
      (response: any) => {

      });
  }

  register() {
    if (!this.teamowner) {
      let params = {
        name: this.userDetails.firstname
      }
      this.http.post('team/create', params).subscribe(
        (response: any) => {
          this.team_id = response.id;
          this.teamowner = response.isowner;
          this.registerUser(this.team_id);
        },
        (error: any) => {
          this.http.exceptionHandling(error);
        }
      )
    }
    else {
      this.registerUser(this.team_id);
    }
  }

  registerUser(team_id: any) {
    this.myFormGroup.value['team_id'] = team_id
    this.myFormGroup.value['employee'] = true;
    if (this.myFormGroup.controls.phone.errors && this.myFormGroup.controls.phone.errors.required) {
      this.http.errorMessage("Voer uw 10 cijferig telefoonnummer in");
    }
    else if (this.myFormGroup.controls.phone.errors && this.myFormGroup.controls.phone.errors.minlength) {
      this.http.errorMessage("Voer uw 10 cijferig telefoonnummer in");
    }
    else {
      this.http.postAuth('signup-user', this.myFormGroup.value).subscribe(
        (response: any) => {
          this.http.successMessage("Succesvol aangemaakt");
          this.myFormGroup.reset();
          this.showList = true;
          this.loadTeamUsers();
        },
        (error: any) => {
          this.http.exceptionHandling(error);
        }
      )
    }

  }

  updateStatus(user: any) {
    user['status'] = 0;
    user['username'] = user.firstname;
    this.http.post('user/update', user).subscribe(
      (response: any) => {
        this.http.successMessage("Succesvol verwijderd");
        this.loadTeamUsers();
      },
      (error: any) => {
        this.http.exceptionHandling(error);
      }
    )
  }

  cancelOrder(order: any) {
    this.http.post('order/cancel-order', { id: order.id, status: 0 }).subscribe(
      (response: any) => {
        this.http.successMessage("Succesvol geannuleerd");
        this.modalRef?.hide();
        this.loadData();
        location.reload();
      },
      (error: any) => {
        this.http.exceptionHandling(error);
      }
    )
  }

  openWithdrawModal() {
    this.modalRef = this.modalService.show(this.withdrawtemplate, {
      backdrop: 'static',
      keyboard: false,
      class: 'modal-lg'
    });
  }

  makeWithdraw() {
    this.http.post('withdraw/create', { user_id: this.userDetails.id, amount: this.getTotal(), team_id: this.team_id }).subscribe(
      (response: any) => {
        this.http.successMessage("Verzoek succesvol verstuurd");
        this.modalRef?.hide();
        this.loadData();
        location.reload();
      },
      (error: any) => {
        this.http.exceptionHandling(error);
      }
    )
  }

  disableWithdraw() {
    let result = false;
    let findWithdraw = this.withdrawdataLists.find((element: any) => (element.status == 3));
    if (findWithdraw) {
      result = true;
    }
    if ((this.getTotal() == '0') || (this.getTotal() == '0.00')) {
      result = true;
    }
    return result;
  }

  editPassword() {
    this.showPasswordField = true;
  }

  sendPaymentLink(data: any) {
    let params = {
      id: data.id,
      paymentLinkstatus: 2,
    }
    this.http.post('/order/update-status', params).subscribe(
      (body: any) => {
        this.http.post('send-payment-link', data).subscribe(
          (body: any) => {
            this.http.successMessage("Betalingslink verstuurd naar uw e-mail!");
            location.reload();
          })
      })

  }

  sendPayment(data: any) {
    if (data.total) {
      let order: any = {};
      order.total = data.total;
      order.status = 3;
      order.products = [];
      order.amountpaid = data.total;
      order.type = 'wallet';
      order.team_id = this.team_id ? this.team_id : ''
      this.http.post('order/make-order', order).subscribe(
        (order: any) => {
          this.http.delete('order/deleteOrder/', data.id).subscribe(
            (test: any) => {

            })
          let pName: any = 'Add Money to your Wallet'
          if (data.total > 0) {
            let prop = { id: order.id, total: data.total, pname: pName }
            this.http.post('payment/ideal', prop).subscribe(
              (body: any) => {
                let reference: any = { id: order.id };
                reference.paymentchargeid = body && body.paymentchargeid || null;
                window.location.href = body.url
                this.modalRef?.hide();
                localStorage.setItem('odere', JSON.stringify(reference));
                this.storage.clearProducts();
              })

          }
          else {
            this.modalRef?.hide();
            this.http.successMessage("Boeking succesvol geplaatst.");
            this.router.navigate(['/home']);
            this.storage.clearProducts();
          }
        });
    }
    else {
      this.http.errorMessage("Verzoek mislukt");
    }
  }

  getType(type: any) {
    let result = '';
    if (type == 'Rent') {
      result = 'Verhuur';
    }
    else if (type == 'Staffing') {
      result = 'Uitzend';
    }
    else if (type == 'Transport') {
      result = 'Transport';
    }
    return result;
  }

  isNotExpired(cancelDate: any){
    let strSplit = cancelDate.split(".")
    let cancellationDate = strSplit[0].replace(/T/g, " ")
    return (new Date(cancellationDate) < new Date) ? false : true;;
  }

}
