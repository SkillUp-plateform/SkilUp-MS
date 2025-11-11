import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupForComponent } from './signup-for.component';

describe('SignupForComponent', () => {
  let component: SignupForComponent;
  let fixture: ComponentFixture<SignupForComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SignupForComponent]
    });
    fixture = TestBed.createComponent(SignupForComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
