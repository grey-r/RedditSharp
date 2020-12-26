import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { RedditFeed } from '../reddit/reddit-feed';
import { RedditFeedService } from '../reddit/reddit-feed.service';
import { ScrollDispatcher } from '@angular/cdk/overlay';
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { PostModalComponent } from '../view/post-modal/post-modal.component';
import { Post } from '../reddit/post';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent extends RedditFeed implements OnInit,AfterViewInit,OnDestroy {
  @ViewChild("dashboardroot") content!:ElementRef;
  s!:Subscription;

  currentPosts:Post[] = [];

  constructor (private rs:RedditFeedService, private scroll:ScrollDispatcher, private cd:ChangeDetectorRef, private dialog: MatDialog) {
    super(rs);
    this.post$.subscribe( (x) => {
      this.currentPosts=x;
    });
    this.subreddit="";
    this.fetchMore();
  }
  
  ngAfterViewInit(): void {
    this.s=this.scroll.scrolled().subscribe( (e) => {
      let y:number = Math.max(window.scrollY,this.content.nativeElement.parentNode.parentNode.scrollTop);
      if (y>this.content.nativeElement.scrollHeight-window.innerHeight*2) {
        //grab more posts
        debounceTime(100);
        if (!this.loading) {
          this.fetchMore();
          this.cd.detectChanges();
        } else {
          //console.log("busy");
        }
      }
    });
  }

  ngOnInit(): void {

  }

  ngOnDestroy():void {
    this.s.unsubscribe();
  }

  openPost(post_id: number) {
    let dialogRef = this.dialog.open(PostModalComponent, {
      width: Math.round(Math.min(window.innerWidth*0.8,window.innerHeight*1)/window.innerWidth*100).toString() + "%",
      height:  "80%",
      data: { post: this.currentPosts[post_id] }
    });
    alert(Math.round(Math.min(window.innerWidth*0.8,window.innerHeight*1.5)/window.innerWidth*100).toString() + "%");
  }
}