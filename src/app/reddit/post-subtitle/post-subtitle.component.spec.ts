import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PostSubtitleComponent } from "./post-subtitle.component";

describe("PostSubtitleComponent", () => {
  let component: PostSubtitleComponent;
  let fixture: ComponentFixture<PostSubtitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PostSubtitleComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostSubtitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
