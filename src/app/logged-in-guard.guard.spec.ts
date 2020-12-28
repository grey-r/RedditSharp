import { TestBed } from '@angular/core/testing';

import { LoggedInGuardGuard } from './logged-in-guard.guard';

describe('LoggedInGuardGuard', () => {
  let guard: LoggedInGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(LoggedInGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
