import { TestBed } from "@angular/core/testing";

import { RequirementValidatorService } from "./requirement-validator.service";

describe("RequirementValidatorService", () => {
  let service: RequirementValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequirementValidatorService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
