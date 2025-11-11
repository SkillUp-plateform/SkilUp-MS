import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetionProjectComponent } from './getion-project.component';

describe('GetionProjectComponent', () => {
  let component: GetionProjectComponent;
  let fixture: ComponentFixture<GetionProjectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GetionProjectComponent]
    });
    fixture = TestBed.createComponent(GetionProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
