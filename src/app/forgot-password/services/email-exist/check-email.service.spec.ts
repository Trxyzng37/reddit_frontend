import { TestBed } from '@angular/core/testing';

import { EmailExistService } from './check-email.service';

describe('CheckEmailService', () => {
  let service: EmailExistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmailExistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
