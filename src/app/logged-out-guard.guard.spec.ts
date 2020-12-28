import { TestBed } from '@angular/core/testing';

import { LoggedOutGuardGuard } from './logged-out-guard.guard';

describe('LoggedOutGuardGuard', () => {
  let guard: LoggedOutGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(LoggedOutGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
