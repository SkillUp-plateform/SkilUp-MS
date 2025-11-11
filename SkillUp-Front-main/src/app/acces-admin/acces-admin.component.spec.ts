import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccesAdminComponent } from './acces-admin.component';

describe('AccesAdminComponent', () => {
  let component: AccesAdminComponent;
  let fixture: ComponentFixture<AccesAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccesAdminComponent]
    });
    fixture = TestBed.createComponent(AccesAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
