import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookNowPopupComponent } from './book-now-popup.component';

describe('BookNowPopupComponent', () => {
  let component: BookNowPopupComponent;
  let fixture: ComponentFixture<BookNowPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookNowPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookNowPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
