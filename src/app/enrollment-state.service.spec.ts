import { TestBed } from '@angular/core/testing';

import { EnrollmentStateService } from './enrollment-state.service';

describe('EnrollmentStateService', () => {
  let service: EnrollmentStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnrollmentStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
