import { TestBed } from '@angular/core/testing';

import { ImageFormateurService } from './image-formateur.service';

describe('ImageFormateurService', () => {
  let service: ImageFormateurService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageFormateurService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
