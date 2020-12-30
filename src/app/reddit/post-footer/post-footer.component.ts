import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Post } from '../post';
import { PostInfoService } from '../post-info.service';

@Component({
  selector: 'app-post-footer',
  templateUrl: './post-footer.component.html',
  styleUrls: ['./post-footer.component.css']
})
export class PostFooterComponent implements OnInit, OnChanges {
  @Input('post') post!: Post; // tslint:disable-line: no-input-rename
  @Input('comments') comments: boolean|null = null;
  @Output() onComment: EventEmitter<Post> = new EventEmitter();

  constructor(private postInfo: PostInfoService) { }

  ngOnInit(): void {
    this.checkPost();
  }

  ngOnChanges(): void {
    this.checkPost()
  }

  checkPost(): void {
    if(this.post === null) {
      throw new Error("Attribute 'post' is required");
   }
  }

  vote(p:Post, dir:number): void {
    this.postInfo.vote(p,dir);
  }

  viewPost(p:Post): void {
    this.onComment.next(p);
  }

}