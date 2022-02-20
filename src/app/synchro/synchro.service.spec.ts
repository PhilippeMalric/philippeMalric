import { TestBed } from '@angular/core/testing';

import { SynchroService } from './synchro.service';

describe('DepensesService', () => {
  let service: SynchroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SynchroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
