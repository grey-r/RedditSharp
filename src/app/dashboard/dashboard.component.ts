import { ScrollDispatcher } from "@angular/cdk/overlay";
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  NgZone,
  OnDestroy,
  OnInit
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { BehaviorSubject, merge, Subject, Subscription } from "rxjs";
import { debounceTime, first, skip, takeUntil } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { OauthService } from "../reddit/oauth.service";
import { Post, PostType } from "../reddit/post";
import { PostInfoService } from "../reddit/post-info.service";
import { RedditFeedService } from "../reddit/reddit-feed.service";
import { FilterModes, SortModes, SortService } from "../reddit/sort.service";
import { UserInfoService } from "../reddit/user-info.service";
import { PostModalComponent } from "../view/post-modal/post-modal.component";

const scrollDelay: number = 100;

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  private _subreddit: string | null = null;
  private _posts: Post[] = [];
  private _postSet: Set<string> = new Set<string>();
  private _subscription!: Subscription | null;

  public set subreddit(sub: string | null) {
    this._subreddit = sub;
    this.reload();
  }

  public get posts(): Post[] {
    return this._posts;
  }

  public get subreddit(): string | null {
    return this._subreddit;
  }

  private get _loading(): boolean {
    return this.loading$.getValue();
  }

  private set _loading(x: boolean) {
    this.loading$.next(x);
  }

  public get loading(): boolean {
    return this._loading;
  }

  public get sortMode(): SortModes {
    return this.sortService.sortMode;
  }

  public get filterMode(): FilterModes {
    return this.sortService.filterMode;
  }

  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  ngUnsubscribe = new Subject<void>();

  constructor(
    private rs: RedditFeedService,
    private scroll: ScrollDispatcher,
    private cd: ChangeDetectorRef,
    private dialog: MatDialog,
    private sortService: SortService,
    private route: ActivatedRoute,
    private oauth: OauthService,
    private ui: UserInfoService,
    private ngZone: NgZone,
    private postInfo: PostInfoService
  ) {}

  ngAfterViewInit(): void {
    this.ui.clearQueue();
    const content = document.querySelector(".mat-sidenav-content");
    this.scroll
      .scrolled()
      .pipe(debounceTime(scrollDelay))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((e) => {
        let y: number = Math.max(
          window.scrollY,
          content ? content.scrollTop : 0
        );
        if (
          content &&
          y > content.scrollHeight - window.innerHeight * 2 &&
          y > window.innerHeight
        ) {
          //grab more posts
          if (!this.loading) {
            this.ngZone.run(() => {
              this.fetchPosts();
            });
          }
        }
      });

    const sortObservable = this.sortService.sortMode$.pipe(
      takeUntil(this.ngUnsubscribe),
      skip(1)
    );

    const filterObservable = this.sortService.filterMode$.pipe(
      takeUntil(this.ngUnsubscribe),
      skip(1)
    );

    const mergedObservable = merge(sortObservable, filterObservable);
    mergedObservable.pipe(debounceTime(50)).subscribe(() => {
      this.reload();
    });
  }

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((routeParams: any) => {
        this.subreddit = routeParams.subreddit;
        let postid: string | null = routeParams.postid;
        if (routeParams.postid && this.subreddit) {
          this.openPost(new Post(routeParams.postid, PostType.Link));
        }
        window.scrollTo(0, 0);
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onPostClicked(event: Event) {
    let target = event.target || event.srcElement || event.currentTarget;
    if (!target) return;
    let el = <Element>target;
    let idAttr = el.getAttribute("data-post-index");
    while (!idAttr && el.parentElement) {
      el = el.parentElement;
      idAttr = el.getAttribute("data-post-index");
    }
    if (!idAttr) return;

    let value: string | null = idAttr;
    if (!value) return;

    this.openPost(this.posts[parseInt(value.replace("post-", ""))]);
  }

  clearPosts(): void {
    this._postSet.clear();
    this._posts = [];
    this.cd.markForCheck();
  }

  addPost(p: Post): void {
    if (!this._postSet.has(p.id)) {
      this._postSet.add(p.id);
      this.posts.push(p);
      this.cd.markForCheck();
    }
  }

  openPost(post: Post) {
    let dialogRef = this.dialog.open(PostModalComponent, {
      maxWidth: "none",
      //width: Math.round(Math.min(window.innerWidth*0.8,window.innerHeight*1)/window.innerWidth*100).toString() + "%",
      //height:  "90%",
      autoFocus: false,
      panelClass: "post-modal",
      data: { post: post }
    });
  }

  cancelFetch(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }

  fetchPosts(): void {
    this._loading = true;
    if (this.oauth.getLoggedIn()) {
      //if logged in
      this.oauth
        .isReady()
        .pipe(
          first((res: boolean) => {
            return res;
          }),
          takeUntil(this.ngUnsubscribe)
        )
        .subscribe(() => {
          //wait until ready
          //fetch posts if ready
          this._subscription = this.rs
            .fetchPosts(
              this.subreddit,
              this.posts.length > 0
                ? this.posts[this.posts.length - 1].fullname
                : null,
              25,
              this.sortMode,
              this.filterMode
            )
            .subscribe(
              (p: Post) => {
                this.addPost(p);
              },
              (e) => {
                if (!environment.production) {
                  console.log(e);
                }
              },
              () => {
                this._loading = false;
                this._posts = [...this._posts];
              }
            );
        });
    } else {
      this._subscription = this.rs
        .fetchPosts(
          this.subreddit,
          this.posts.length > 0
            ? this.posts[this.posts.length - 1].fullname
            : null,
          25,
          this.sortMode,
          this.filterMode
        )
        .subscribe(
          (p: Post) => {
            this.addPost(p);
          },
          (e) => {
            if (!environment.production) {
              console.log(e);
            }
          },
          () => {
            this._loading = false;
            this._posts = [...this._posts];
          }
        );
    }
  }

  trackById(index: number, post: Post) {
    return post.id;
  }

  public reload(): void {
    this._loading = true;
    this.cancelFetch();
    this.clearPosts();
    this.fetchPosts();
    this.ui.clearQueue();
  }
}
