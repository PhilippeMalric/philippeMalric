import { TestBed } from '@angular/core/testing';

import {  ApiTestService } from './apiTest.service';

describe('SondageService', () => {
  let service: ApiTestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiTestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
