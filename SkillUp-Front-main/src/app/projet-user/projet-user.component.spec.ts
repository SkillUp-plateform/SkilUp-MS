import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjetUserComponent } from './projet-user.component';

describe('ProjetUserComponent', () => {
  let component: ProjetUserComponent;
  let fixture: ComponentFixture<ProjetUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjetUserComponent]
    });
    fixture = TestBed.createComponent(ProjetUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
