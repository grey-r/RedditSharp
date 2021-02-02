import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output
} from "@angular/core";
import { Post } from "../post";
import { PostInfoService } from "../post-info.service";

@Component({
  selector: "app-post-footer",
  templateUrl: "./post-footer.component.html",
  styleUrls: ["./post-footer.component.css"]
})
export class PostFooterComponent implements OnInit, OnChanges {
  @Input("post") post!: Post; // tslint:disable-line: no-input-rename
  @Output() onComment: EventEmitter<Post> = new EventEmitter();
  @Output() onClose: EventEmitter<any> = new EventEmitter();
  showClose: boolean = false;
  showComments: boolean = false;

  constructor(private postInfo: PostInfoService) {}

  ngOnInit(): void {
    this.checkPost();
  }

  ngOnChanges(): void {
    this.checkPost();
  }

  checkPost(): void {
    this.showClose = this.onClose.observers.length > 0;
    this.showComments = this.onComment.observers.length > 0;
    if (this.post === null) {
      throw new Error("Attribute 'post' is required");
    }
  }

  vote(p: Post, dir: number): void {
    this.postInfo.vote(p, dir);
  }

  viewPost(p: Post): void {
    this.onComment.next(p);
  }

  closePost(): void {
    this.onClose.next(null);
  }
}
