import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlreadyVerfiedComponent } from './already-verfied.component';

describe('AlreadyVerfiedComponent', () => {
  let component: AlreadyVerfiedComponent;
  let fixture: ComponentFixture<AlreadyVerfiedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlreadyVerfiedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlreadyVerfiedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
