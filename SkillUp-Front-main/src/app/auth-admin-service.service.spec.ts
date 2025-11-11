import { TestBed } from '@angular/core/testing';

import { AuthAdminServiceService } from './auth-admin-service.service';

describe('AuthAdminServiceService', () => {
  let service: AuthAdminServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthAdminServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
