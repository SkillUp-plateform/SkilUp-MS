import { TestBed } from '@angular/core/testing';

import { AuthFormateurServiceService } from './auth-formateur-service.service';

describe('AuthFormateurServiceService', () => {
  let service: AuthFormateurServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthFormateurServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
