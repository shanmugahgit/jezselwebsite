import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {NgxPaginationModule} from 'ngx-pagination';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layouts/header/header.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './pages/home/home.component';
import { LocationsComponent } from './pages/locations/locations.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { FaqComponent } from './pages/faq/faq.component';
import { ContactComponent } from './pages/contact/contact.component';
import { ServicesComponent } from './pages/services/services.component';
import { CategoryFilterPipe } from './shared/categoryfilter.pipe';
import { FilterArrayPipe } from './shared/filterarray.pipe';
import { ServiceDetailComponent } from './pages/service-detail/service-detail.component';
import { LoginComponent } from './pages/account/login/login.component';
import { RegisterComponent } from './pages/account/register/register.component';
import { ForgetPasswordComponent } from './pages/account/forget-password/forget-password.component';
import { BookingComponent } from './pages/booking/booking.component';
import { CartComponent } from './pages/cart/cart.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BookNowPopupComponent } from './pages/book-now-popup/book-now-popup.component';
import { SafePipe } from './pipes/safe.pipe';
import { ChangePasswordComponent } from './pages/account/change-password/change-password.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { PaymentSuccessComponent } from './pages/payment-success/payment-success.component';
import { PaymentFailureComponent } from './pages/payment-failure/payment-failure.component';
import { ClickOutsideModule } from 'ng-click-outside';
import { ProfileComponent } from './pages/account/profile/profile.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { GarantiesComponent } from './pages/garanties/garanties.component';
import { SetpasswordComponent } from './pages/setpassword/setpassword.component';
import { AcceptNumberOnlyDirective } from './directives/accept-number-only.directive';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    LocationsComponent,
    AboutUsComponent,
    FaqComponent,
    ContactComponent,
    ServicesComponent,
    CategoryFilterPipe,
    FilterArrayPipe,
    ServiceDetailComponent,
    LoginComponent,
    RegisterComponent,
    ForgetPasswordComponent,
    BookingComponent,
    CartComponent,
    BookNowPopupComponent,
    SafePipe,
    ChangePasswordComponent,
    OrdersComponent,
    PaymentSuccessComponent,
    PaymentFailureComponent,
    ProfileComponent,
    PaymentComponent,
    GarantiesComponent,
    SetpasswordComponent,
    AcceptNumberOnlyDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    ModalModule.forRoot(),
    ClickOutsideModule
  ],
  providers: [],
  // providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent], 
  entryComponents: [BookNowPopupComponent]
})
export class AppModule { }
