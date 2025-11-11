import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeFormateurComponent } from './home-formateur.component';

describe('HomeFormateurComponent', () => {
  let component: HomeFormateurComponent;
  let fixture: ComponentFixture<HomeFormateurComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomeFormateurComponent]
    });
    fixture = TestBed.createComponent(HomeFormateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
