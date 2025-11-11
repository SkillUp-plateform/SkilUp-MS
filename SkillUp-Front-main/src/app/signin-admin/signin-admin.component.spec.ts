import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SigninAdminComponent } from './signin-admin.component';

describe('SigninAdminComponent', () => {
  let component: SigninAdminComponent;
  let fixture: ComponentFixture<SigninAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SigninAdminComponent]
    });
    fixture = TestBed.createComponent(SigninAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
