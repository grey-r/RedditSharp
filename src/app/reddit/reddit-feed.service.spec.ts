import { TestBed } from "@angular/core/testing";

import { RedditFeedService } from "./reddit-feed.service";

describe("RedditFeedService", () => {
  let service: RedditFeedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RedditFeedService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
