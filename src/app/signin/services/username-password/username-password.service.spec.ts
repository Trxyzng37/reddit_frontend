import { TestBed } from '@angular/core/testing';

import { UsernamePasswordService } from './username-password.service';

describe('UsernamePasswordService', () => {
  let service: UsernamePasswordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsernamePasswordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
