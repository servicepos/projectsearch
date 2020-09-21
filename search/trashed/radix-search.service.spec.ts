import { TestBed } from '@angular/core/testing';

import { RadixSearchService } from './radix-search.service';

describe('RadixSearchService', () => {
  let service: RadixSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RadixSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
