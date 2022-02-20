import { TestBed } from '@angular/core/testing';

import { TresorService } from './tresor.service';

describe('DepensesService', () => {
  let service: TresorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TresorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
