import { TestBed } from '@angular/core/testing';

import { FirstoreService } from './firstore.service';

describe('FirstoreService', () => {
  let service: FirstoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirstoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
