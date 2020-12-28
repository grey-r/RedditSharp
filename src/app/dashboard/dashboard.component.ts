import { Component, OnInit, AfterViewInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { RedditFeed } from '../reddit/reddit-feed';
import { RedditFeedService } from '../reddit/reddit-feed.service';
import { ScrollDispatcher } from '@angular/cdk/overlay';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Subscription, Observable, Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { PostModalComponent } from '../view/post-modal/post-modal.component';
import { Post } from '../reddit/post';
import { ActivatedRoute } from '@angular/router';

const scrollDelay:number = 100;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent extends RedditFeed implements OnInit,AfterViewInit,OnDestroy {
  ngUnsubscribe = new Subject<void>();

  currentPosts:Post[] = [];

  constructor (private rs:RedditFeedService, private scroll:ScrollDispatcher, private cd:ChangeDetectorRef, private dialog: MatDialog, private route: ActivatedRoute) {
    super(rs);
    this.post$.subscribe( (x) => {
      this.currentPosts=x;
    });
    //this.subreddit="";
    //this.fetchMore();
  }
  
  ngAfterViewInit(): void {
    const content = document.querySelector('.mat-sidenav-content'); 
    this.scroll.scrolled()
    .pipe(debounceTime(scrollDelay))
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe( (e) => {
      let y:number = Math.max(window.scrollY,content?content.scrollTop:0);
      if (content && y>content.scrollHeight-window.innerHeight*2) {
        //grab more posts
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
    this.route.params
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe( (routeParams:any) => {
      this.subreddit = routeParams.subreddit;
      this.fetchMore();
      window.scrollTo(0,0);
    });
  }

  ngOnDestroy():void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  openPost(post_id: number) {
    let dialogRef = this.dialog.open(PostModalComponent, {
      width: Math.round(Math.min(window.innerWidth*0.8,window.innerHeight*1)/window.innerWidth*100).toString() + "%",
      //height:  "90%",
      autoFocus: false,
      panelClass: "post-modal",
      data: { post: this.currentPosts[post_id] }
    });
  }
}