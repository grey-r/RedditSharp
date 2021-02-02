import { Component, Input, OnChanges, OnInit } from "@angular/core";
import { Post } from "../post";
import { PostInfoService } from "../post-info.service";

@Component({
  selector: "app-post-vote",
  templateUrl: "./post-vote.component.html",
  styleUrls: ["./post-vote.component.css"]
})
export class PostVoteComponent implements OnInit, OnChanges {
  @Input("post") post!: Post; // tslint:disable-line: no-input-rename

  constructor(private postInfo: PostInfoService) {}

  ngOnInit(): void {
    this.checkPost();
  }

  ngOnChanges(): void {
    this.checkPost();
  }

  checkPost(): void {
    if (this.post === null) {
      throw new Error("Attribute 'post' is required");
    }
  }

  vote(p: Post, dir: number): void {
    this.postInfo.vote(p, dir);
  }
}
