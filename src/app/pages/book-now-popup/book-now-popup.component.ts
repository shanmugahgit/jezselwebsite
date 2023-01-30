import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CommunicationService } from 'src/app/services/communication/communication.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { slots } from '../home/slots.model';
import { HttpRequestService } from 'src/app/services/http-request/http-request.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { Router } from '@angular/router';
import { Rent, RentDiscount, Staffing, StaffingDiscount, Transport, TransportDiscount } from '../home/pricePercentage';
declare var $: any;
import * as moment from 'moment'
@Component({
  selector: 'app-book-now-popup',
  templateUrl: './book-now-popup.component.html',
  styleUrls: ['./book-now-popup.component.css']
})
export class BookNowPopupComponent implements OnInit {

  modalRef?: BsModalRef;
  @ViewChild('template') template: any;
  selectedProduct: any = {};
  public slots = slots;
  public locations: any = [];
  public showSelectLocation: boolean = false;
  calculated: boolean = false;
  public rentPercentage = Rent;
  public staffingPercentage = Staffing;
  public transportPercentage = Transport;
  public rentPercentageDiscount = RentDiscount;
  public staffingPercentageDiscount = StaffingDiscount;
  public transportPercentageDiscount = TransportDiscount;
  productPrice: any = 0;
  alreadyBooked: boolean = false;
  formGroup: FormGroup = new FormGroup({
    location: new FormControl('', Validators.required),
    locationid: new FormControl('', Validators.required),
    checkindate: new FormControl('', Validators.required),
    checkoutdate: new FormControl('', Validators.required),
    checkintime: new FormControl('', Validators.required),
    checkouttime: new FormControl('', Validators.required),
  })
  notavailable: boolean = false;
  constructor(private modalService: BsModalService, private communication: CommunicationService, private http: HttpRequestService, private storage: StorageService, private router: Router) { }

  ngOnInit(): void {
    this.communication.openProductModal.subscribe((response) => {
      this.selectedProduct = JSON.parse(JSON.stringify(response));
      this.productPrice = JSON.parse(JSON.stringify(response.priceperhr));
      this.modalRef?.hide();
      this.calculated = false;
      this.alreadyBooked = false;
      if (localStorage.getItem('search')) {
        let searchData: any = localStorage.getItem('search');
        this.formGroup.patchValue(JSON.parse(searchData));
        $("#popupcheckindate").val(JSON.parse(searchData).checkindate);
        $("#popuocheckoutdate").val(JSON.parse(searchData).checkoutdate);
      }
      this.openModal();
      this.getLocations(true);
    })
    this.getLocations(false);
  }

  ngAfterViewInit() {

  }

  openModal() {
    this.modalRef = this.modalService.show(this.template, {
      backdrop: 'static',
      keyboard: false,
      class: 'modal-xl'
    });
    setTimeout(() => {
      $("#popupcheckindate").datepicker({
        dateFormat: "dd-mm-yy",
        minDate: 0,
        duration: "fast",
        container: '#myModalId'
      }).change((ev: any) => {
        this.formGroup.patchValue({ checkindate: ev.target.value, checkoutdate: ev.target.value });
        this.calculated = false;
        $("#popuocheckoutdate").datepicker("option", "minDate", ev.target.value);
        $("#popuocheckoutdate").val(ev.target.value);
      });
      $("#popuocheckoutdate").datepicker({
        dateFormat: "dd-mm-yy",
        minDate: 0,
        duration: "fast",
        container: '#myModalId'
      }).change((ev: any) => {
        this.formGroup.patchValue({ checkoutdate: ev.target.value });
        this.calculated = false;
      });
      if (localStorage.getItem('search')) {
        let searchData: any = localStorage.getItem('search');
        $("#popupcheckindate").val(JSON.parse(searchData).checkindate);
        $("#popuocheckoutdate").val(JSON.parse(searchData).checkoutdate);
      }
      $("#popupcheckindate").datepicker("option", "monthNames", ["Jan", "Feb", "Mrt", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"]);
      $("#popupcheckindate").datepicker("option", "dayNamesMin", ["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"]);

      $("#popuocheckoutdate").datepicker("option", "monthNames", ["Jan", "Feb", "Mrt", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"]);
      $("#popuocheckoutdate").datepicker("option", "dayNamesMin", ["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"]);
    })
    $(".datesos").on("click", function (ev: any) {
      var offsetModal = $('#myModalId').offset().top;
      var offsetInput = $(ev.target).offset().top;
      var inputHeight = $(ev.target).height();
      var customPadding = 17; //custom modal padding (bootstrap modal)! 
      var topDatepicker = (offsetInput + inputHeight + customPadding) - offsetModal;
      // setTimeout(()=>{
        $("#ui-datepicker-div").css({ top: topDatepicker });
      // })
      
    });
  }

  getLocations(subsc: boolean) {
    this.http.get('filter/locations').subscribe(
      (response: any) => {
        this.locations = response;
        if (subsc) {
          let findLocation = this.locations.find((el: any) => (el.id == this.selectedProduct.location_id))
          if (findLocation) {
            let obj = {
              location: findLocation.name,
              locationid: findLocation.id
            }
            this.formGroup.patchValue(obj);
          }
        }
      }, (error: any) => {
        this.http.exceptionHandling(error);
      }
    )
  }

  showLocationData() {
    this.showSelectLocation = true;

  }

  selectedLocation(loc: any) {
    this.showSelectLocation = false;
    this.formGroup.patchValue({
      location: loc.name,
      locationid: loc.id
    });
    this.calculated = false;
  }

  onClickedOutside(ev: any) {
    this.showSelectLocation = false;
  }

  search() {
    this.calculated = false;
    let checkintimeIndex = slots.indexOf(this.formGroup.value.checkintime);
    let checkouttimeIndex = slots.indexOf(this.formGroup.value.checkouttime);
    if ((this.formGroup.value.checkindate == this.formGroup.value.checkoutdate)) {
      let findDifference = checkouttimeIndex - checkintimeIndex;
      if (findDifference > 3 && this.selectedProduct.type == 'Rent') {
        this.searchResult();
      }
      else if (findDifference > 31 && this.selectedProduct.type == 'Staffing') {
        this.searchResult();
      }
      else if (findDifference > 15 && this.selectedProduct.type == 'Transport') {
        this.searchResult();
      }
      else {
        let message = '';
        if (this.selectedProduct.type == 'Rent') {
          message = 'Selecteer alstublieft minimaal een uur.';
        }
        else if (this.selectedProduct.type == 'Staffing') {
          message = 'Selecteer alstublieft minimaal acht uur.';
        }
        else if (this.selectedProduct.type == 'Transport') {
          message = 'Selecteer alstublieft minimaal vier uur.';
        }
        this.http.errorMessage(message);
      }
    }
    else {
      this.searchResult();
    }
  }

  searchResult() {
    let checkindate = this.formGroup.value.checkindate.split("-").reverse().join("-")
    // let checkoutdate = this.formGroup.value.checkoutdate.split("-").reverse().join("-")
    const fromDate: any = new Date();
    const toDate: any = new Date(checkindate);
    const diffTime: any = Math.abs(toDate - fromDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    this.notavailable = false;
    this.alreadyBooked = false;
    localStorage.setItem('search', JSON.stringify(this.formGroup.value));
    if (this.selectedProduct.availabledays && (diffDays < this.selectedProduct.availabledays)) {
      this.notavailable = true;
    }
    else {
      let parmas: any = {
        product_id: this.selectedProduct.id,
        type: this.selectedProduct.type,
      };
      let mergedParams = { ...parmas, ...this.formGroup.value };
      this.http.post('order/availability', mergedParams).subscribe(
        (response: any) => {
          if (!response.booked || (response.booked == false)) {
            this.calulateTotalAmount()
          }
          else {
            this.alreadyBooked = true;
          }
        }, (error: any) => {
          this.http.exceptionHandling(error);
        }
      )
      // localStorage.setItem('search', JSON.stringify(this.formGroup.value));
      // this.router.navigateByUrl('services/' + this.formGroup.value.type);
    }
  }

  calulateTotalAmount() {
    let checkindate = this.formGroup.value.checkindate.split("-").reverse().join("-")
    const fromDate: any = new Date();
    const toDate: any = new Date(checkindate);
    const diffTime: any = Math.abs(toDate - fromDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const amount: any = this.productPrice;
    let finalAmount: any = 0;
    if (diffDays < 10) {
      const nod = 10 - diffDays;
      if (this.selectedProduct.type == 'Rent') {
        finalAmount = ((amount * (1 + (10 * this.rentPercentage[0]))) * (1 + (10 * this.rentPercentage[1]))) * (1 + (nod * this.rentPercentage[2]));
      }
      else if (this.selectedProduct.type == 'Staffing') {
        finalAmount = ((amount * (1 + (10 * this.staffingPercentage[0]))) * (1 + (10 * this.staffingPercentage[1]))) * (1 + (nod * this.staffingPercentage[2]));
      }
      else {
        finalAmount = ((amount * (1 + (10 * this.transportPercentage[0]))) * (1 + (10 * this.transportPercentage[1]))) * (1 + (nod * this.transportPercentage[2]));
      }
    }
    else if (diffDays < 20) {
      const nod = 20 - diffDays;
      if (this.selectedProduct.type == 'Rent') {
        finalAmount = (amount * (1 + (10 * this.rentPercentage[0]))) * (1 + (nod * this.rentPercentage[1]));
      }
      else if (this.selectedProduct.type == 'Staffing') {
        finalAmount = (amount * (1 + (10 * this.staffingPercentage[0]))) * (1 + (nod * this.staffingPercentage[1]));
      }
      else {
        finalAmount = (amount * (1 + (10 * this.transportPercentage[0]))) * (1 + (nod * this.transportPercentage[1]));
      }
    }
    else if (diffDays < 30) {
      const nod = 30 - diffDays;
      if (this.selectedProduct.type == 'Rent') {
        finalAmount = amount * (1 + (nod * this.rentPercentage[0]));
      }
      else if (this.selectedProduct.type == 'Staffing') {
        finalAmount = amount * (1 + (nod * this.staffingPercentage[0]));
      }
      else {
        finalAmount = amount * (1 + (nod * this.transportPercentage[0]));
      }
    } else {
      finalAmount = amount;
    }

    let startdate = this.formGroup.value.checkindate.split("-").reverse().join("-")
    let enddate = this.formGroup.value.checkoutdate.split("-").reverse().join("-")
    const fromDate2: any = new Date(startdate);
    const toDate2: any = new Date(enddate);
    const diffTime2: any = Math.abs(toDate2 - fromDate2);
    const diffDays2 = Math.ceil(diffTime2 / (1000 * 60 * 60 * 24));

    if (diffDays2 <= 10 && diffDays2 > 5) {
      if (this.selectedProduct.type == 'Rent') {
        finalAmount = finalAmount / (1 + this.rentPercentageDiscount[3]);
      }
      else if (this.selectedProduct.type == 'Staffing') {
        finalAmount = finalAmount / (1 + this.staffingPercentageDiscount[3]);
      }
      else {
        finalAmount = finalAmount / (1 + this.transportPercentageDiscount[3]);
      }
    }
    else if (diffDays2 <= 20 && diffDays2 > 10) {
      if (this.selectedProduct.type == 'Rent') {
        finalAmount = finalAmount / (1 + this.rentPercentageDiscount[2]);
      }
      else if (this.selectedProduct.type == 'Staffing') {
        finalAmount = finalAmount / (1 + this.staffingPercentageDiscount[2]);
      }
      else {
        finalAmount = finalAmount / (1 + this.transportPercentageDiscount[2]);
      }
    }
    else if (diffDays2 <= 30 && diffDays2 > 20) {
      if (this.selectedProduct.type == 'Rent') {
        finalAmount = finalAmount / (1 + this.rentPercentageDiscount[1]);
      }
      else if (this.selectedProduct.type == 'Staffing') {
        finalAmount = finalAmount / (1 + this.staffingPercentageDiscount[1]);
      }
      else {
        finalAmount = finalAmount / (1 + this.transportPercentageDiscount[1]);
      }
    }
    else if (diffDays2 > 30) {
      if (this.selectedProduct.type == 'Rent') {
        finalAmount = finalAmount / (1 + this.rentPercentageDiscount[0]);
      }
      else if (this.selectedProduct.type == 'Staffing') {
        finalAmount = finalAmount / (1 + this.staffingPercentageDiscount[0]);
      }
      else {
        finalAmount = finalAmount / (1 + this.transportPercentageDiscount[0]);
      }
    }
    this.selectedProduct.priceperhr = parseFloat(finalAmount).toFixed(2);
    this.calculated = true;
  }

  bookNow(product: any) {
    this.modalRef?.hide();
    let hours = 24;
    if (this.selectedProduct.type == 'Rent') {
      hours = 24;
    }
    else {
      hours = 8;
    }
    product['advancePayment'] = product.priceperhr * hours;
    this.storage.setProducts(product);
    this.router.navigate(['/cart']);
  }

  changeCheckin() {
    let obj = { checkouttime: '' };
    this.formGroup.patchValue(obj);
  }

  checkoutDisabled(slot: any) {
    let result = false;
    let checkintimeIndex = slots.indexOf(this.formGroup.value.checkintime);
    let checkouttimeIndex = slots.indexOf(slot);
    if ((this.formGroup.value.checkindate == this.formGroup.value.checkoutdate) && (checkintimeIndex >= checkouttimeIndex)) {
      result = true;
    }
    if (this.formGroup.value.checkoutdate) {
      let date = new Date();
      let currentHours = date.getHours();
      let currentMinutes = date.getMinutes();
      let splitSlot = slot.split(":");
      let slotHours = splitSlot[0];
      let slotMinutes = splitSlot[1];
      let todayDate = new Date().toISOString().split('T')[0];
      let updatedCurrentDate: any = todayDate.split("-");
      updatedCurrentDate = updatedCurrentDate.reverse().join('-');
      // if((this.formGroup.value.checkoutdate == updatedCurrentDate) &&(currentHours >= slotHours) && (currentMinutes >= slotMinutes)){
      //   result = true;
      // }
      if ((this.formGroup.value.checkoutdate == updatedCurrentDate) && (currentHours > slotHours)) {
        result = true;
      }
      else if ((this.formGroup.value.checkoutdate == updatedCurrentDate) && (currentHours == slotHours) && (currentMinutes >= slotMinutes)) {
        result = true;
      }
    }
    return result;
  }

  checkinDisabled(slot: any) {
    let result = false;
    if (this.formGroup.value.checkindate) {
      let date = new Date();
      let currentHours = date.getHours();
      let currentMinutes = date.getMinutes();
      let splitSlot = slot.split(":");
      let slotHours = splitSlot[0];
      let slotMinutes = splitSlot[1];
      let todayDate = new Date().toISOString().split('T')[0];
      let updatedCurrentDate: any = todayDate.split("-");
      updatedCurrentDate = updatedCurrentDate.reverse().join('-');
      // if((this.formGroup.value.checkindate == updatedCurrentDate) &&(currentHours >= slotHours) && (currentMinutes >= slotMinutes)){
      //   result = true;
      // }
      if ((this.formGroup.value.checkindate == updatedCurrentDate) && (currentHours > slotHours)) {
        result = true;
      }
      else if ((this.formGroup.value.checkindate == updatedCurrentDate) && (currentHours == slotHours) && (currentMinutes >= slotMinutes)) {
        result = true;
      }
    }

    return result;
  }

}
