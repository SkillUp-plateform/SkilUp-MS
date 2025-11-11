import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SigninFormateurComponent } from './signin-formateur.component';

describe('SigninFormateurComponent', () => {
  let component: SigninFormateurComponent;
  let fixture: ComponentFixture<SigninFormateurComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SigninFormateurComponent]
    });
    fixture = TestBed.createComponent(SigninFormateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
