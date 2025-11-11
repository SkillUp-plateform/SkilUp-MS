import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionFormateurComponent } from './gestion-formateur.component';

describe('GestionFormateurComponent', () => {
  let component: GestionFormateurComponent;
  let fixture: ComponentFixture<GestionFormateurComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GestionFormateurComponent]
    });
    fixture = TestBed.createComponent(GestionFormateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
