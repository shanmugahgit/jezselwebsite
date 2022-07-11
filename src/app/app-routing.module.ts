import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './services/auth-guard/auth-guard.service';
import { HomeComponent } from './pages/home/home.component';
import { ContactComponent } from './pages/contact/contact.component';
import { FaqComponent } from './pages/faq/faq.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { LocationsComponent } from './pages/locations/locations.component';
import { ServicesComponent } from './pages/services/services.component';
import { ServiceDetailComponent } from './pages/service-detail/service-detail.component';
import { ForgetPasswordComponent } from './pages/account/forget-password/forget-password.component';
import { RegisterComponent } from './pages/account/register/register.component';
import { LoginComponent } from './pages/account/login/login.component';
import { BookingComponent } from './pages/booking/booking.component';
import { CartComponent } from './pages/cart/cart.component';
import { ChangePasswordComponent } from './pages/account/change-password/change-password.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { PaymentSuccessComponent } from './pages/payment-success/payment-success.component';
import { PaymentFailureComponent } from './pages/payment-failure/payment-failure.component';
import { ProfileComponent } from './pages/account/profile/profile.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { GarantiesComponent } from './pages/garanties/garanties.component';
import { SetpasswordComponent } from './pages/setpassword/setpassword.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forget-password', component: ForgetPasswordComponent },
  { path: 'set-password', component: SetpasswordComponent },
  { path: 'home', component: HomeComponent },
  { path: 'services/:service', component: ServicesComponent },
  { path: 'service-detail/:route', component: ServiceDetailComponent },
  { path: 'locations', component: LocationsComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'booking', component: BookingComponent, canActivate: [AuthGuardService] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuardService] },
  { path: 'cart', component: CartComponent },
  { path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthGuardService] },
  { path: 'my-orders', component: OrdersComponent, canActivate: [AuthGuardService] },
  { path: 'payment', component: PaymentComponent},
  { path: 'garanties', component: GarantiesComponent},
  { path: 'payment-success', component: PaymentSuccessComponent, canActivate: [AuthGuardService] },
  { path: 'payment-failure', component: PaymentFailureComponent, canActivate: [AuthGuardService] },
  { path: '**', component: HomeComponent }
];


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})
  ]
})
export class AppRoutingModule { }
