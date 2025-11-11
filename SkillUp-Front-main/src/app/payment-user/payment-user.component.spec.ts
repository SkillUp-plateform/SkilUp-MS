import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentUserComponent } from './payment-user.component';

describe('PaymentUserComponent', () => {
  let component: PaymentUserComponent;
  let fixture: ComponentFixture<PaymentUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentUserComponent]
    });
    fixture = TestBed.createComponent(PaymentUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
