import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentMobileSuccessComponent } from './payment-mobile-success.component';

describe('PaymentMobileSuccessComponent', () => {
  let component: PaymentMobileSuccessComponent;
  let fixture: ComponentFixture<PaymentMobileSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentMobileSuccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentMobileSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
