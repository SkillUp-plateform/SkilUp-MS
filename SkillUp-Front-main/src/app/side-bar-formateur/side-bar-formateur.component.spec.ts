import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideBarFormateurComponent } from './side-bar-formateur.component';

describe('SideBarFormateurComponent', () => {
  let component: SideBarFormateurComponent;
  let fixture: ComponentFixture<SideBarFormateurComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SideBarFormateurComponent]
    });
    fixture = TestBed.createComponent(SideBarFormateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
