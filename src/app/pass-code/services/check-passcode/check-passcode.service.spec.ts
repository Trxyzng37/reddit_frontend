import { TestBed } from '@angular/core/testing';

import { CheckPasscodeService } from './check-passcode.service';

describe('CheckPasscodeService', () => {
  let service: CheckPasscodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckPasscodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
