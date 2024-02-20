import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentMobileFailureComponent } from './payment-mobile-failure.component';

describe('PaymentMobileFailureComponent', () => {
  let component: PaymentMobileFailureComponent;
  let fixture: ComponentFixture<PaymentMobileFailureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentMobileFailureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentMobileFailureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
