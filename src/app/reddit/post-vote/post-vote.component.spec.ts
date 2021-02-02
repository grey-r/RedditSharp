import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PostVoteComponent } from "./post-vote.component";

describe("PostVoteComponent", () => {
  let component: PostVoteComponent;
  let fixture: ComponentFixture<PostVoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PostVoteComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostVoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
