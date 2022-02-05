import { TestBed } from '@angular/core/testing';

import { Depenses2Service } from './depenses2.service';

describe('DepensesService', () => {
  let service: Depenses2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Depenses2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
