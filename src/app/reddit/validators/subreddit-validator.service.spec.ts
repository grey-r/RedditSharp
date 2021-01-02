import { TestBed } from '@angular/core/testing';

import { SubredditValidatorService } from './subreddit-validator.service';

describe('SubredditValidatorService', () => {
  let service: SubredditValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubredditValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
