import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormateurContactComponent } from './formateur-contact.component';

describe('FormateurContactComponent', () => {
  let component: FormateurContactComponent;
  let fixture: ComponentFixture<FormateurContactComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormateurContactComponent]
    });
    fixture = TestBed.createComponent(FormateurContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
