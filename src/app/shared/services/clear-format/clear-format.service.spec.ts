import { TestBed } from '@angular/core/testing';

import { ClearFormatService } from './clear-format.service';

describe('ClearFormatService', () => {
  let service: ClearFormatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClearFormatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
