import { BreakpointState, MediaMatcher } from "@angular/cdk/layout";
import { OverlayContainer } from "@angular/cdk/overlay";
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSidenav } from "@angular/material/sidenav";
import {
  ActivatedRoute,
  Event as RouterEvent,
  NavigationEnd,
  Router
} from "@angular/router";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { filter, takeUntil } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { DarkModeService } from "./dark-mode.service";
import { MobileService } from "./mobile.service";
import { MeService } from "./reddit/me.service";
import { OauthService } from "./reddit/oauth.service";
import { FilterModes, SortModes, SortService } from "./reddit/sort.service";
import { Subreddit } from "./reddit/subreddit";
import { SubredditModalComponent } from "./view/subreddit-modal/subreddit-modal.component";

/** @title Responsive sidenav */
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnDestroy, OnInit, AfterViewInit {
  @ViewChild("scrollme") content!: ElementRef;
  @ViewChild("snav") snav!: MatSidenav;

  mobileQuery: Observable<BreakpointState>;
  ngUnsubscribe = new Subject<void>();

  private _navSubreddits: Link[] = [];
  private _subredditLink$ = new BehaviorSubject<Link[]>(this._navSubreddits);

  public set navSubreddits(x: Link[]) {
    this._navSubreddits = x;
    this._subredditLink$.next(x);
  }

  public get navSubreddits() {
    return this._navSubreddits;
  }

  public get subredditLink$(): Observable<Link[]> {
    return this._subredditLink$.asObservable();
  }

  public get darkMode$() {
    return this.dark.darkMode$;
  }

  public get darkMode() {
    return this.dark.darkMode;
  }

  public set darkMode(dark: boolean) {
    this.dark.darkMode = dark;
  }

  public toggleDark(): void {
    this.dark.toggleDark();
  }

  passCheck(c: Checkable): boolean {
    return c.check();
  }

  navOptions = [
    {
      text: "Dashboard",
      url: "dashboard",
      check: () => {
        return true;
      }
    },
    {
      text: "Go to Subreddit",
      check: () => {
        return true;
      },
      click: () => {
        let dialogRef = this.dialog.open(SubredditModalComponent, {
          data: {}
        });
      }
    },
    {
      text: "Log In",
      url: "login",
      check: () => {
        return !this.oauth.getLoggedIn();
      }
    },
    {
      text: "Log Out",
      url: "logout",
      check: () => {
        return this.oauth.getLoggedIn();
      }
    }
  ];

  SortModes = SortModes;
  FilterModes = FilterModes;

  public get sortMode(): SortModes {
    return this.sortService.sortMode;
  }

  public get filterMode(): FilterModes {
    return this.sortService.filterMode;
  }

  sortOptions = [
    { mode: SortModes.Best, text: "Best", icon: "star_rate" },
    { mode: SortModes.Hot, text: "Hot", icon: "local_fire_department" },
    { mode: SortModes.New, text: "New", icon: "schedule" },
    {
      mode: SortModes.Top,
      text: "Top",
      icon: "bar_chart",
      topfilter: true
    },
    { mode: SortModes.Rising, text: "Rising", icon: "trending_up" }
  ];

  filterOptions = [
    { mode: FilterModes.Hour, text: "Now", icon: null },
    { mode: FilterModes.Day, text: "Today", icon: null },
    { mode: FilterModes.Week, text: "This Week", icon: null },
    { mode: FilterModes.Month, text: "This Month", icon: null },
    { mode: FilterModes.Year, text: "This Year", icon: null },
    { mode: FilterModes.All, text: "All Time", icon: null }
  ];

  constructor(
    private sortService: SortService,
    private mobileService: MobileService,
    private cd: ChangeDetectorRef,
    private media: MediaMatcher,
    private oauth: OauthService,
    private me: MeService,
    private router: Router,
    private route: ActivatedRoute,
    private dark: DarkModeService,
    private overlayContainer: OverlayContainer,
    private dialog: MatDialog
  ) {
    this.mobileQuery = this.mobileService.mobileQuery;
    this.darkMode$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((dark: boolean) => {
        let overlay = overlayContainer.getContainerElement();
        if (dark && !overlay.classList.contains("dark-theme")) {
          overlay.classList.add("dark-theme");
        }
        if (!dark && overlay.classList.contains("dark-theme")) {
          overlay.classList.remove("dark-theme");
        }
      });
  }

  ngAfterViewInit(): void {
    this.router.events
      .pipe(
        filter((e: RouterEvent) => {
          return e instanceof NavigationEnd;
        })
      )
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        if (this.snav && this.mobileService.mobile) this.snav.close();
        const content = document.querySelector(".mat-sidenav-content");
        if (content) content.scrollTop = 0;
      });
  }

  ngOnInit(): void {
    this.oauth
      .isReady()
      .pipe(takeUntil(this.ngUnsubscribe))
      .pipe(
        filter((isReady: boolean) => {
          return isReady;
        })
      )
      .subscribe((isReady: boolean) => {
        if (!environment.production) {
          console.log(isReady);
        }
        this.cd.markForCheck();
        this.fetchSubreddits();
      });
  }

  fetchSubreddits(): void {
    let tempSubs: Link[] = [];
    this.me.getSubreddits().subscribe(
      (data: Subreddit) => {
        let x = {
          text: data.name,
          url: data.name.toLowerCase()
        };
        tempSubs.push(x);
      },
      (err) => {
        if (!environment.production) {
          console.log(err);
        }
      },
      () => {
        tempSubs.sort((a, b) => a.text.localeCompare(b.text));
        this.navSubreddits = tempSubs;
      }
    );
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  setFeedMode(
    sortMode: SortModes,
    filterMode: FilterModes | null = null
  ): void {
    this.sortService.setSortMode(sortMode, filterMode);
  }

  addPost(): void {
    if (!this.oauth.getLoggedIn()) {
      this.router.navigate(["/login"]);
      return;
    }
    if (this.route.children.length <= 0) {
      return;
    }
    let that = this;
    this.oauth
      .isReady()
      .pipe(takeUntil(this.ngUnsubscribe))
      .pipe(
        filter((isReady: boolean) => {
          return isReady;
        })
      )
      .subscribe((isReady: boolean) => {
        let childRoute = that.route.children[0];
        let sub: string | null = childRoute.snapshot.paramMap.get("subreddit");
        if (!sub) {
          that.router.navigate(["/post"]);
        } else {
          that.router.navigate(["/r", sub, "post"]);
        }
      });
  }

  shouldShowPostFAB(): boolean {
    return (
      (this.router.url.startsWith("/r/") &&
        !this.router.url.endsWith("/post")) ||
      this.router.url === "/dashboard"
    );
  }

  clickNav(navSelector: any) {
    if (navSelector.click) {
      navSelector.click();
    }
  }

  shouldRun = [/(^|\.)plnkr\.co$/, /(^|\.)stackblitz\.io$/].some((h) =>
    h.test(window.location.host)
  );
}

interface Link {
  text: string;
  url: string;
}
interface Checkable {
  check(): boolean;
}
