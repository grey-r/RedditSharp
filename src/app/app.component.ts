import { BreakpointObserver, BreakpointState, MediaMatcher } from '@angular/cdk/layout';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Event as RouterEvent, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { DarkModeService } from './dark-mode.service';
import { MeService } from './reddit/me.service';
import { OauthService } from './reddit/oauth.service';
import { Subreddit } from './reddit/subreddit';

/** @title Responsive sidenav */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnDestroy, OnInit, AfterViewInit {
  @ViewChild("scrollme") content!:ElementRef;
  @ViewChild("snav") snav!:MatSidenav;

  mobileQuery: Observable<BreakpointState>;
  ngUnsubscribe = new Subject<void>();
  mobile:boolean = false;

  private _navSubreddits:Link[] = [];
  private _subredditLink$ = new BehaviorSubject<Link[]>( this._navSubreddits );

  public set navSubreddits(x:Link[]) {
    this._navSubreddits=x;
    this._subredditLink$.next(x);
  }

  public get navSubreddits() {
    return this._navSubreddits;
  }

  public get subredditLink$():Observable<Link[]> {
    return this._subredditLink$.asObservable();
  }

  public get darkMode$() {
    return this.dark.darkMode$;
  }

  public toggleDark():void {
    this.dark.toggleDark();
  }

  passCheck(c:Checkable):boolean {
    console.log(c);
    return c.check();
  }

  navOptions = [
    {text: "Dashboard",url:"dashboard", check: ()=>{return true;}},
    {text:"Log In",url:"login",  check: ()=>{return !this.oauth.getLoggedIn();}},
    {text:"Log Out",url:"logout", check: ()=>{return this.oauth.getLoggedIn();}}
  ]

  constructor(breakpointObserver: BreakpointObserver, private cd:ChangeDetectorRef, private media: MediaMatcher, private oauth:OauthService, private me: MeService, private router:Router, private dark: DarkModeService) {
    this.mobileQuery = breakpointObserver.observe(['(max-width: 600px)']);
    this.mobileQuery
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe( (x:BreakpointState) => {
      this.mobile = x.matches;
    });
  }

  ngAfterViewInit(): void {
    this.router.events
          .pipe(filter(  (e:RouterEvent) => {return e instanceof NavigationEnd} ))
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(() => {
            if (this.snav && this.mobile)
              this.snav.close();
            const content = document.querySelector('.mat-sidenav-content'); 
            if (content)
              content.scrollTop=0;
          });
  }

  ngOnInit(): void {
    this.oauth.isReady()
    .pipe(takeUntil(this.ngUnsubscribe))
    .pipe(filter( (isReady:boolean) => { return isReady; }))
    .subscribe( () => {
        this.cd.markForCheck();
        this.fetchSubreddits();
    });
  }

  fetchSubreddits():void {
    let tempSubs:Link[] = [];
    this.me.getSubreddits().subscribe( (data:Subreddit) => {
      let x = {
        text:data.name,
        url:data.name.toLowerCase()
      };
      tempSubs.push(x);
    }, (err) => {console.log(err);}, () => {
      tempSubs.sort((a, b) => a.text.localeCompare(b.text));
      this.navSubreddits=tempSubs;
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  shouldRun = [/(^|\.)plnkr\.co$/, /(^|\.)stackblitz\.io$/].some(h => h.test(window.location.host));
}

interface Link {
  text: string;
  url: string;
}
interface Checkable {
  check():boolean;
}