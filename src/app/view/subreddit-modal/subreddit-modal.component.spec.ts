import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SubredditModalComponent } from "./subreddit-modal.component";

describe("SubredditModalComponent", () => {
  let component: SubredditModalComponent;
  let fixture: ComponentFixture<SubredditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubredditModalComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubredditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
