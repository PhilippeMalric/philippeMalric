import { TestBed } from '@angular/core/testing';

import { ReveService } from './reve.service';

describe('ReveService', () => {
  let service: ReveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
