import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormationForComponent } from './formation-for.component';

describe('FormationForComponent', () => {
  let component: FormationForComponent;
  let fixture: ComponentFixture<FormationForComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormationForComponent]
    });
    fixture = TestBed.createComponent(FormationForComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
