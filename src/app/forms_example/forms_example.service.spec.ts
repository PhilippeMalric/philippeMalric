import { TestBed } from '@angular/core/testing';

import { FormsExampleService } from './forms_example.service';

describe('FormsExampleService', () => {
  let service: FormsExampleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormsExampleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
