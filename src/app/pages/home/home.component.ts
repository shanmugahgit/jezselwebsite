import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpRequestService } from 'src/app/services/http-request/http-request.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { CommunicationService } from 'src/app/services/communication/communication.service';
declare var $: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private http: HttpRequestService, private router: Router, private storage: StorageService, private communication: CommunicationService) { }
  public rentproducts: any = [];
  public staffingproducts: any = [];
  public transportproducts: any = [];
  public faqLists: any[] = [];
  public locations: any = [];
  public advertisementLists: any = [];
  public slots = ['0:00', '0:15', '0:30', '0:45', '1:00', '1:15', '1:30', '1:45', '2:00', '2:15', '2:30', '2:45', '3:00', '3:15', '3:30', '3:45', '4:00', '4:15', '4:30', '4:45', '5:00', '5:15', '5:30', '5:45', '6:00', '6:15', '6:30', '6:45', '7:00', '7:15', '7:30', '7:45', '8:00', '8:15', '8:30', '8:45', '9:00', '9:15', '9:30', '9:45', '10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45', '12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30', '15:45', '16:00', '16:15', '16:30', '16:45', '17:00', '17:15', '17:30', '17:45', '18:00', '18:15', '18:30', '18:45', '19:00', '19:15', '19:30', '19:45', '20:00', '20:15', '20:30', '20:45', '21:00', '21:15', '21:30', '21:45', '22:00', '22:15', '22:30', '22:45', '23:00', '23:15', '23:30', '23:45'];
  public showSelectLocation: boolean = false;
  formGroup: FormGroup = new FormGroup({
    location: new FormControl('', Validators.required),
    locationid: new FormControl('', Validators.required),
    type: new FormControl('rent', Validators.required),
    checkindate: new FormControl('', Validators.required),
    checkoutdate: new FormControl('', Validators.required),
    checkintime: new FormControl('', Validators.required),
    checkouttime: new FormControl('', Validators.required),
  })
  ngOnInit(): void {
    this.getProducts();
    this.getLocations();
    this.loadDatePicker();
    this.getFaq();
  }

  selectedAccordion: any;

  ngAfterViewInit() {
    this.loadDatePicker();
    $(function () {
      $('.accordion').find('.accordion-title').on('click', function (ev: any) {
        // debugger
        // Adds Active Class
        let target = ev.target;
        if (ev.target.className.indexOf('fa') > -1) {
          target = ev.target.parentElement;
        }
        $(target).toggleClass('active');
        // Expand or Collapse This Panel
        $(target).next().slideToggle('fast');
        // Hide The Other Panels
        $('.accordion-content').not($(target).next()).slideUp('fast');
        // Removes Active Class From Other Titles
        $('.accordion-title').not($(target)).removeClass('active');
      });
    });
  }

  loadAdvertismentCarousel() {
    setTimeout(() => {
      $('.hm-advertisement-owc.owl-carousel').owlCarousel({  
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
            items: 1,
          },
          1000: {
            items: 1,
          }
        }
      });
    })

  }
  

  

  loadRentCarousel() {
    setTimeout(() => {
      $(document).ready(function () {
        var owl = $('.rent.owl-carousel');
        owl.owlCarousel({
          items: 4,
          //loop: true,
          margin: 10,
          dots: false,
          responsiveClass: true,
          autoplay: true,
          autoplayTimeout: 4000,
          autoplayHoverPause: true,
          responsive: {
            0: {
              items: 1,
              //nav: true
            },
            800: {
              items: 3,
              //nav: false
            },
            1300: {
              items: 3,
              //nav: true,
              loop: false,
            },
            1600: {
              items: 3,
              //nav: true,
              loop: false,
              margin: 20
            }
          }


        });

        // Custom Button
        $('.customNextBtnRent').click(function () {
          owl.trigger('next.owl.carousel');
        });
        $('.customPreviousBtnRent').click(function () {
          owl.trigger('prev.owl.carousel');
        });

      });
    });
  }

  loadStaffingCarousel() {
    setTimeout(() => {
      $(document).ready(function () {
        var owl = $('.staffing.owl-carousel');
        owl.owlCarousel({
          items: 4,
          //loop: true,
          margin: 10,
          dots: false,
          responsiveClass: true,
          autoplay: true,
          autoplayTimeout: 4000,
          autoplayHoverPause: true,

          responsive: {
            0: {
              items: 1,
              //nav: true
            },
            800: {
              items: 3,
              //nav: false
            },
            1300: {
              items: 3,
              //nav: true,
              loop: false,
            },
            1600: {
              items: 3,
              //nav: true,
              loop: false,
              margin: 20
            }
          }


        });

        // Custom Button
        $('.customNextBtnStaffing').click(function () {
          owl.trigger('next.owl.carousel');
        });
        $('.customPreviousBtnStaffing').click(function () {
          owl.trigger('prev.owl.carousel');
        });

      });



    });
  }

  loadTransportCarousel() {
    setTimeout(() => {
      $(document).ready(function () {
        var owl = $('.transport.owl-carousel');
        owl.owlCarousel({
          items: 4,
          // loop: true,
          margin: 10,
          dots: false,
          responsiveClass: true,
          autoplay: true,
          autoplayTimeout: 4000,
          autoplayHoverPause: true,
          responsive: {
            0: {
              items: 1,
              //nav: true
            },
            800: {
              items: 3,
              //nav: false
            },
            1300: {
              items: 3,
              //nav: true,
              loop: false,
            },
            1600: {
              items: 3,
              //nav: true,
              loop: false,
              margin: 20
            }
          }


        });

        // Custom Button
        $('.customNextBtnTransport').click(function () {
          owl.trigger('next.owl.carousel');
        });
        $('.customPreviousBtnTransport').click(function () {
          owl.trigger('prev.owl.carousel');
        });

      });
    });
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
      $("#datepicker").datepicker({
        altField: "#alternate",
    });

    $("#datepicker").datepicker("option", "monthNames", ["Jan", "Feb", "Mrt", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"]);
    $("#datepicker").datepicker("option", "dayNamesMin",["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"]);
    
    $("#datepicker-out").datepicker("option", "monthNames", ["Jan", "Feb", "Mrt", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"]);
    $("#datepicker-out").datepicker("option", "dayNamesMin",["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"]);
    })
  }

  getProducts() {
    this.http.post('products', { limit: 6, type: 'Rent' }).subscribe(
      (response: any) => {
        this.rentproducts = response && response.data;
        this.loadRentCarousel();
      }, (error: any) => {
        this.http.exceptionHandling(error);
      }
    )
    this.http.post('products', { limit: 6, type: 'Staffing' }).subscribe(
      (response: any) => {
        this.staffingproducts = response && response.data;
        this.loadStaffingCarousel();
      }, (error: any) => {
        this.http.exceptionHandling(error);
      }
    )
    this.http.post('products', { limit: 6, type: 'Transport' }).subscribe(
      (response: any) => {
        this.transportproducts = response && response.data;
        this.loadTransportCarousel();
      }, (error: any) => {
        this.http.exceptionHandling(error);
      }
    )
    this.http.get('advertisement').subscribe(
      (response: any) => {
        this.advertisementLists = response;
        this.loadAdvertismentCarousel();
      }, (error: any) => {
        this.http.exceptionHandling(error);
      }
    )
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

  getFaq() {
    this.http.get('faqs').subscribe(
      (response: any) => {
        this.faqLists = response;
        if (this.faqLists.length > 0) {
          this.selectedAccordion = this.faqLists[0].id;
        }
      }
    )
  }
  showLocationData() {
    this.showSelectLocation = true;
  }

  onClickedOutside(ev: any) {
    this.showSelectLocation = false;
  }

  onClickedAccordion(id: any) {
    this.selectedAccordion = id;
  }

  search() {
    let checkintimeIndex = this.slots.indexOf(this.formGroup.value.checkintime);
    let checkouttimeIndex = this.slots.indexOf(this.formGroup.value.checkouttime);
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
    this.router.navigateByUrl('services/' + this.formGroup.value.type + '?page=home');
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
    this.communication.openProductModal.emit(product)
  }

  changeCheckin() {
    let obj = { checkouttime: '' };
    this.formGroup.patchValue(obj);
  }

  // checkoutDisabled(slot: any){
  //   let result = false;
  //   let checkintimeIndex = this.slots.indexOf(this.formGroup.value.checkintime);
  //   let checkouttimeIndex = this.slots.indexOf(slot);
  //   if((this.formGroup.value.checkindate == this.formGroup.value.checkoutdate) && (checkintimeIndex >= checkouttimeIndex)){
  //     result = true;
  //   }
  //   return result;
  // }

  checkoutDisabled(slot: any) {
    let result = false;
    let checkintimeIndex = this.slots.indexOf(this.formGroup.value.checkintime);
    let checkouttimeIndex = this.slots.indexOf(slot);
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
