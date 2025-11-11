import { TestBed } from '@angular/core/testing';

import { AccesCodeService } from './acces-code.service';

describe('AccesCodeService', () => {
  let service: AccesCodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccesCodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
