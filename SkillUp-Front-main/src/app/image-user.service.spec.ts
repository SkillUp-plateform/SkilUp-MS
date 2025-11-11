import { TestBed } from '@angular/core/testing';

import { ImageUserService } from './image-user.service';

describe('ImageUserService', () => {
  let service: ImageUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
