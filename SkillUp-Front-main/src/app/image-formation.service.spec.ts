import { TestBed } from '@angular/core/testing';

import { ImageFormationService } from './image-formation.service';

describe('ImageFormationService', () => {
  let service: ImageFormationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageFormationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
