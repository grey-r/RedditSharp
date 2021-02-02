import { TestBed } from "@angular/core/testing";

import { PostInfoService } from "./post-info.service";

describe("PostInfoService", () => {
  let service: PostInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostInfoService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
