import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Post, PostType } from '../post';

@Component({
  selector: 'app-post-subtitle',
  templateUrl: './post-subtitle.component.html',
  styleUrls: ['./post-subtitle.component.css']
})
export class PostSubtitleComponent implements OnInit, OnChanges {
  linkType: PostType = PostType.Listing;
  @Input('post') post!: Post; // tslint:disable-line: no-input-rename

  constructor() { }

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

}
