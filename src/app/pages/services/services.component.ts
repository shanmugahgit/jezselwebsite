import { Component, OnInit, ViewChild } from '@angular/core';
import { KeyValue } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpRequestService } from 'src/app/services/http-request/http-request.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { CommunicationService } from 'src/app/services/communication/communication.service';
import { slots } from '../home/slots.model';
import { Rent, RentDiscount, Staffing, StaffingDiscount, Transport, TransportDiscount } from '../home/pricePercentage';
declare var $: any;
@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {

  public title: string;
  public products: any[] = [];
  public config: any;
  public limit: any = 20;
  public offset: any = 0;
  public filters: any;
  public filtersRaw: any = [];
  public selectedFilter: any = [];
  public locations: any = [];
  public slots = slots;
  public rentPercentage = Rent;
  public staffingPercentage = Staffing;
  public transportPercentage = Transport;
  public rentPercentageDiscount = RentDiscount;
  public staffingPercentageDiscount = StaffingDiscount;
  public transportPercentageDiscount = TransportDiscount;
  public showSelectLocation: boolean = false;
  public showVA: boolean = false;

  formGroup: FormGroup = new FormGroup({
    location: new FormControl('', Validators.required),
    locationid: new FormControl('', Validators.required),
    type: new FormControl('rent', Validators.required),
    checkindate: new FormControl('', Validators.required),
    checkoutdate: new FormControl('', Validators.required),
    checkintime: new FormControl('', Validators.required),
    checkouttime: new FormControl('', Validators.required),
  })

  @ViewChild('leftnavbar') leftnavbar: any;
  @ViewChild('productImg') productImg: any;
  userDetails: any;
  constructor(private route: ActivatedRoute, private http: HttpRequestService, private router: Router, private storage: StorageService, private communication: CommunicationService) {
    this.userDetails = this.storage.getUserDetails() ? this.storage.getUserDetails() : {};
  }

  ngOnInit(): void {
    let serachInputs = localStorage.getItem('search') && JSON.parse(localStorage.getItem('search') || '') || {};
    const fromHomePage = this.route.snapshot.queryParamMap.get('page');
    if (!fromHomePage) {
      serachInputs = null;
      localStorage.setItem('search', '');
    }
    if (serachInputs) {
      this.formGroup.patchValue(serachInputs);
      setTimeout(() => {
        $("#datepicker").val(serachInputs.checkindate);
        $("#datepicker-out").val(serachInputs.checkoutdate);
      })
    }
    this.config = {
      itemsPerPage: 10,
      currentPage: 1,
      totalItems: 100
    };
    this.getLocations();
    this.loadDatePicker();
    this.route.params.subscribe(params => {
      this.title = params['service']
      let obj = {type: this.title};
      this.formGroup.patchValue(obj);
      this.loadFilters(this.title);
      this.getProducts();
    })
  }

  ngAfterViewInit() {
    this.loadDatePicker();
  }

  loadDatePicker() {
    setTimeout(() => {
      $("#datepicker").datepicker({
        dateFormat: "dd-mm-yy",
        minDate: 0,
        duration: "fast"
      }).change((ev: any) => {
        this.formGroup.patchValue({ checkindate: ev.target.value, checkoutdate: ev.target.value });
        $("#datepicker-out").datepicker("option", "minDate", ev.target.value);
        $("#datepicker-out").val(ev.target.value);
      });
      $("#datepicker-out").datepicker({
        dateFormat: "dd-mm-yy",
        minDate: 0,
        duration: "fast"
      }).change((ev: any) => {
        this.formGroup.patchValue({ checkoutdate: ev.target.value });
      });
      $("#datepicker").datepicker("option", "monthNames", ["Jan", "Feb", "Mrt", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"]);
      $("#datepicker").datepicker("option", "dayNamesMin",["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"]);
      
      $("#datepicker-out").datepicker("option", "monthNames", ["Jan", "Feb", "Mrt", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"]);
      $("#datepicker-out").datepicker("option", "dayNamesMin",["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"]);
    })
  }

  private onCompare(_left: KeyValue<any, any>, _right: KeyValue<any, any>): number {
    return -1;
  }

  get getSlice() {
    if(this.leftnavbar && this.leftnavbar.nativeElement && this.productImg && this.productImg.nativeElement){
      let leftnavbarHeight = this.leftnavbar.nativeElement.offsetHeight;
      let productImgHeight = this.productImg.nativeElement.offsetHeight;
      let commonHeight = 39;
      let marginBottom = 25;
      let productCardHeight = productImgHeight + marginBottom;
      let rightBar: any = (leftnavbarHeight - commonHeight) / productCardHeight;
      let limit = parseInt(rightBar) * 2;
      return limit;
    }
    return 4;
  }

  getProducts() {
    let body: any = {};
    body.offset = this.offset;
    body.limit = this.limit;
    body.type = this.title;
    // body.filter = this.selectedFilter;
    let vehicle = [];
    let fuel = [];
    let transmission = [];
    let parkingspace = [];
    let storagespace = [];
    let beroep = [];
    let leeftijd = [];
    let ervaring = [];
    let nationality = [];
    let voertuig = [];
    for(let i = 0;i < this.selectedFilter.length;i++){
      if(this.selectedFilter[i].category == 'Voertuigen'){
        vehicle.push(this.selectedFilter[i].id);
      }
      if(this.selectedFilter[i].category == 'Brandstof'){
        fuel.push(this.selectedFilter[i].id);
      }
      if(this.selectedFilter[i].category == 'Transmissie'){
        transmission.push(this.selectedFilter[i].id);
      }
      if(this.selectedFilter[i].category == 'Parkeerruimte'){
        parkingspace.push(this.selectedFilter[i].id);
      }
      if(this.selectedFilter[i].category == 'Laadruimte'){
        storagespace.push(this.selectedFilter[i].id);
      }
      if(this.selectedFilter[i].category == 'Beroep'){
        beroep.push(this.selectedFilter[i].id);
      }
      if(this.selectedFilter[i].category == 'Leeftijd'){
        leeftijd.push(this.selectedFilter[i].id);
      }
      if(this.selectedFilter[i].category == 'Ervaring'){
        ervaring.push(this.selectedFilter[i].id);
      }
      if(this.selectedFilter[i].category == 'Nationality'){
        nationality.push(this.selectedFilter[i].id);
      }
      if(this.selectedFilter[i].category == 'Voertuig'){
        voertuig.push(this.selectedFilter[i].id);
      }
    }
    body.vehicle = vehicle.join();
    body.fuel = fuel.join();
    body.transmission = transmission.join();
    body.parkingspace = parkingspace.join();
    body.storagespace = storagespace.join();
    body.beroep = beroep.join();
    body.leeftijd = leeftijd.join();
    body.ervaring = ervaring.join();
    body.nationality = nationality.join();
    body.voertuig = voertuig.join();
    // body.filter = this.selectedFilter && this.selectedFilter.join();
    body.search = this.formGroup.value;
    if(this.formGroup.valid){
      this.showVA = true;
    }
    this.http.post('products', body).subscribe(
      (response: any) => {
        this.config.totalItems = response.count || 0;
        this.products = response && response.data;
        console.log(this.products);
        this.calulateTotalAmount();

      }, (error: any) => {
        this.http.exceptionHandling(error);
      }
    )
  }

  checkAvailabilityProducts() {
    let body: any = {};
    body.search = this.formGroup.value;
    if(this.formGroup.valid){
      this.showVA = true;
    }
    this.http.post('products', body).subscribe(
      (response: any) => {
        this.config.totalItems = response.count || 0;
        this.products = response && response.data;
        if(this.userDetails && this.userDetails.id){
          console.log(response.data.filter((element: any)=>(element.userid==this.userDetails.id)));
        }
        
        this.calulateTotalAmount();

      }, (error: any) => {
        this.http.exceptionHandling(error);
      }
    )
  }

  calulateTotalAmount() {
    let checkindate = this.formGroup.value.checkindate.split("-").reverse().join("-")
    const fromDate: any = new Date();
    const toDate: any = new Date(checkindate);
    const diffTime: any = Math.abs(toDate - fromDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    this.products.forEach((element: any) => {
      const amount: any = element.priceperhr;
      let finalAmount: any = 0;
      if (diffDays < 10) {
        const nod = 10 - diffDays;
        if (element.type == 'Rent') {
          finalAmount = ((amount * (1 + (10 * this.rentPercentage[0]))) * (1 + (10 * this.rentPercentage[1]))) * (1 + (nod * this.rentPercentage[2]));
        }
        else if (element.type == 'Staffing') {
          finalAmount = ((amount * (1 + (10 * this.staffingPercentage[0]))) * (1 + (10 * this.staffingPercentage[1]))) * (1 + (nod * this.staffingPercentage[2]));
        }
        else {
          finalAmount = ((amount * (1 + (10 * this.transportPercentage[0]))) * (1 + (10 * this.transportPercentage[1]))) * (1 + (nod * this.transportPercentage[2]));
        }
      }
      else if (diffDays < 20) {
        const nod = 20 - diffDays;
        if (element.type == 'Rent') {
          finalAmount = (amount * (1 + (10 * this.rentPercentage[0]))) * (1 + (nod * this.rentPercentage[1]));
        }
        else if (element.type == 'Staffing') {
          finalAmount = (amount * (1 + (10 * this.staffingPercentage[0]))) * (1 + (nod * this.staffingPercentage[1]));
        }
        else {
          finalAmount = (amount * (1 + (10 * this.transportPercentage[0]))) * (1 + (nod * this.transportPercentage[1]));
        }
      }
      else if (diffDays < 30) {
        const nod = 30 - diffDays;
        if (element.type == 'Rent') {
          finalAmount = amount * (1 + (nod * this.rentPercentage[0]));
        }
        else if (element.type == 'Staffing') {
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
        if (element.type == 'Rent') {
          finalAmount = finalAmount / (1 + this.rentPercentageDiscount[3]);
        }
        else if (element.type == 'Staffing') {
          finalAmount = finalAmount / (1 + this.staffingPercentageDiscount[3]);
        }
        else {
          finalAmount = finalAmount / (1 + this.transportPercentageDiscount[3]);
        }
      }
      else if (diffDays2 <= 20 && diffDays2 > 10) {
        if (element.type == 'Rent') {
          finalAmount = finalAmount / (1 + this.rentPercentageDiscount[2]);
        }
        else if (element.type == 'Staffing') {
          finalAmount = finalAmount / (1 + this.staffingPercentageDiscount[2]);
        }
        else {
          finalAmount = finalAmount / (1 + this.transportPercentageDiscount[2]);
        }
      }
      else if (diffDays2 <= 30 && diffDays2 > 20) {
        if (element.type == 'Rent') {
          finalAmount = finalAmount / (1 + this.rentPercentageDiscount[1]);
        }
        else if (element.type == 'Staffing') {
          finalAmount = finalAmount / (1 + this.staffingPercentageDiscount[1]);
        }
        else {
          finalAmount = finalAmount / (1 + this.transportPercentageDiscount[1]);
        }
      }
      else if (diffDays2 > 30) {
        if (element.type == 'Rent') {
          finalAmount = finalAmount / (1 + this.rentPercentageDiscount[0]);
        }
        else if (element.type == 'Staffing') {
          finalAmount = finalAmount / (1 + this.staffingPercentageDiscount[0]);
        }
        else {
          finalAmount = finalAmount / (1 + this.transportPercentageDiscount[0]);
        }
      }
      element.priceperhr = parseFloat(finalAmount).toFixed(2);
    });

  }

  pageChanged(event: any) {
    this.config.currentPage = event;
    this.offset = this.limit * (this.config.currentPage - 1);
    this.getProducts();
  }

  loadFilters(type: string) {
    const section = type.charAt(0).toUpperCase() + type.slice(1);
    this.http.get('filters/' + section).subscribe(
      (response: any) => {
        this.filtersRaw = response;
        this.filters = this.groupBy(response, 'category');
      },
      (error: any) => {
        this.http.exceptionHandling(error);
      }
    )
  }

  groupBy(xs: any, key: string) {
    return xs.reduce(function (rv: any, x: any) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

  filterRecords() {
    this.selectedFilter = [];
    this.filtersRaw.filter((x: any) => {
      if (x.checked)
        // this.selectedFilter.push(x.id);
      this.selectedFilter.push({category:x.category,id:x.id});
    });
    this.offset = 0;
    this.getProducts();
  }

  getLocations() {
    this.http.get('filter/locations').subscribe(
      (response: any) => {
        this.locations = response;
      }, (error: any) => {
        this.http.exceptionHandling(error);
      }
    )
  }
  showLocationData() {
    this.showSelectLocation = true;

  }
  search() {
    let checkintimeIndex = slots.indexOf(this.formGroup.value.checkintime);
    let checkouttimeIndex = slots.indexOf(this.formGroup.value.checkouttime);
    if ((this.formGroup.value.checkindate == this.formGroup.value.checkoutdate)) {
      let findDifference = checkouttimeIndex - checkintimeIndex;
      if (findDifference > 3 && this.formGroup.value.type.toLowerCase() == 'rent') {
        this.searchResult();
      }
      else if (findDifference > 31 && this.formGroup.value.type.toLowerCase() == 'staffing') {
        this.searchResult();
      }
      else if (findDifference > 15 && this.formGroup.value.type.toLowerCase() == 'transport') {
        this.searchResult();
      }
      else {
        let message = '';
        if (this.formGroup.value.type.toLowerCase() == 'rent') {
          message = 'Selecteer alstublieft minimaal een uur.';
        }
        else if (this.formGroup.value.type.toLowerCase() == 'staffing') {
          message = 'Selecteer alstublieft minimaal acht uur.';
        }
        else if (this.formGroup.value.type.toLowerCase() == 'transport') {
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
    localStorage.setItem('search', JSON.stringify(this.formGroup.value));
    this.router.navigateByUrl('services/' + this.formGroup.value.type);
    if (this.title == this.formGroup.value.type) {
      this.getProducts();
    }
  }
  selectedLocation(loc: any) {
    this.showSelectLocation = false;
    this.formGroup.patchValue({
      location: loc.name,
      locationid: loc.id
    });
  }
  selectSection(section: string) {
    this.formGroup.patchValue({
      type: section
    });
  }

  bookNow(product: any, event: any) {
    event.stopPropagation()
    // let leftnavbarHeight = this.leftnavbar.nativeElement.offsetHeight;
    // let productImgHeight = this.productImg.nativeElement.offsetHeight;
    // let commonHeight = 39;
    // let marginBottom = 25;
    // let productCardHeight = productImgHeight + marginBottom;
    // let rightBar: any = (leftnavbarHeight - commonHeight) / productCardHeight;
    // let limit = parseInt(rightBar) * 2;
    // debugger;
    if (localStorage.getItem('search')) {
      let parmas: any = {
        product_id: product.id,
        type: product.type,
      };
      let mergedParams = { ...parmas, ...this.formGroup.value };
      this.http.post('order/availability', mergedParams).subscribe(
        (response: any) => {
          if (!response.booked || (response.booked == false)) {
            let hours = 24;
            if (product.type == 'Rent') {
              hours = 24;
            }
            else {
              hours = 8;
            }
            product['advancePayment'] = product.priceperhr * hours;
            this.storage.setProducts(product);
            this.router.navigate(['/cart']);
          }
          else {
            this.http.errorMessage("Het " + product.name + "is al geboekt in deze periode. Gelieve een andere periode te kiezen.")
          }
        }, (error: any) => {
          this.http.exceptionHandling(error);
        }
      )
    }
    else {
      this.communication.openProductModal.emit(product)
    }
  }

  changeCheckin() {
    let obj = { checkouttime: '' };
    this.formGroup.patchValue(obj);
  }

  // checkoutDisabled(slot: any){
  //   let result = false;
  //   let checkintimeIndex = slots.indexOf(this.formGroup.value.checkintime);
  //   let checkouttimeIndex = slots.indexOf(slot);
  //   if((this.formGroup.value.checkindate == this.formGroup.value.checkoutdate) && (checkintimeIndex >= checkouttimeIndex)){
  //     result = true;
  //   }
  //   return result;
  // }

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
