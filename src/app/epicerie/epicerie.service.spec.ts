import { TestBed } from '@angular/core/testing';

import { EpicerieService } from './epicerie.service';

describe('EpicerieService', () => {
  let service: EpicerieService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EpicerieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
