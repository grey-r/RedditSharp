import { Component, OnInit, AfterViewInit, ChangeDetectorRef, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { RedditFeed } from '../reddit/reddit-feed';
import { RedditFeedService } from '../reddit/reddit-feed.service';
import { ScrollDispatcher } from '@angular/cdk/overlay';
import { debounceTime, takeUntil, first, filter } from 'rxjs/operators';
import { Subscription, Observable, Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { PostModalComponent } from '../view/post-modal/post-modal.component';
import { Post } from '../reddit/post';
import { ActivatedRoute } from '@angular/router';
import { OauthService } from '../reddit/oauth.service';
import { UserInfoService } from '../reddit/user-info.service';

const scrollDelay:number = 100;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class DashboardComponent implements OnInit,AfterViewInit,OnDestroy {
  private _subreddit:string|null=null;
  private _posts:Post[] = [];
  private _loading=false;

  public set subreddit(sub:string|null) {
    this._subreddit = sub;
    this.clearPosts();
    this.fetchPosts();
    this.ui.clearQueue();
  }

  public get posts():Post[] {
    return this._posts;
  }

  public get subreddit():string|null {
    return this._subreddit;
  }

  public get loading():boolean {
    return this._loading;
  }

  ngUnsubscribe = new Subject<void>();

  constructor (private rs:RedditFeedService, private scroll:ScrollDispatcher, private cd: ChangeDetectorRef, private dialog: MatDialog, private route: ActivatedRoute, private oauth:OauthService, private ui:UserInfoService) { }
  
  ngAfterViewInit(): void {
    this.ui.clearQueue();
    const content = document.querySelector('.mat-sidenav-content'); 
    this.scroll.scrolled()
    .pipe(debounceTime(scrollDelay))
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe( (e) => {
      let y:number = Math.max(window.scrollY,content?content.scrollTop:0);
      if (content && y>content.scrollHeight-window.innerHeight*2) {
        //grab more posts
        if (!this.loading) {
          this.fetchPosts();
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
      window.scrollTo(0,0);
    });
  }

  ngOnDestroy():void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onPostClicked(event:Event) {
    let target = event.target || event.srcElement || event.currentTarget;
    if (!target)
      return;
    let el = <Element>target;
    let idAttr = el.getAttribute("data-post-index");
    while (!idAttr && el.parentElement) {
      el = el.parentElement;
      //console.log(el);
      idAttr = el.getAttribute("data-post-index");
    }
    if (!idAttr) return;

    let value:string|null = idAttr;
    if (!value) return;

    this.openPost(parseInt(value.replace("post-", ""))) ;
  }


  clearPosts():void {
    this._posts=[];
  }

  addPost(p:Post):void {
    this.posts.push(p);
    this.cd.detectChanges();
  }

  openPost(post_id: number) {
    console.log(post_id);
    let dialogRef = this.dialog.open(PostModalComponent, {
      width: Math.round(Math.min(window.innerWidth*0.8,window.innerHeight*1)/window.innerWidth*100).toString() + "%",
      //height:  "90%",
      autoFocus: false,
      panelClass: "post-modal",
      data: { post: this.posts[post_id] }
    });
  }

  fetchPosts():void {
    this._loading=true;
    if (this.oauth.getLoggedIn()) { //if logged in 
      this.oauth.isReady()
      .pipe(
        filter( (res:boolean) => {return res;}),
        first()
      )
      .subscribe( (ready:boolean) => { //wait until ready
        //fetch posts if ready
        this.rs.fetchPosts(this.subreddit, (this.posts.length>0)?(this.posts[this.posts.length-1].reference):null)
        .subscribe(
          (p:Post) => { this.addPost(p); },
          e => { alert(e); },
          () => { this._loading=false; this._posts = [...this._posts]; } );
      });
    } else {
      this.rs.fetchPosts(this.subreddit, (this.posts.length>0)?(this.posts[this.posts.length-1].reference):null)
      .subscribe(
        (p:Post) => { this.addPost(p); },
        e => { alert(e); },
        () => { this._loading=false; this._posts = [...this._posts]; } );
    }
  }

  trackById(index:number, post:Post) {
    return post.id;
  }
}