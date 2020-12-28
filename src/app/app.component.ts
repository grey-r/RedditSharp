import {MediaMatcher} from '@angular/cdk/layout';
import {ChangeDetectorRef, Component, OnDestroy, ViewChild, ViewChildren, ElementRef, AfterViewInit, OnInit} from '@angular/core';
import { OauthService } from './reddit/oauth.service';
import { MeService } from './reddit/me.service';
import { Subreddit } from './reddit/subreddit';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import {Event as RouterEvent} from '@angular/router';

/** @title Responsive sidenav */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnDestroy, OnInit, AfterViewInit {
  @ViewChild("scrollme") content!:ElementRef;

  mobileQuery: MediaQueryList;

  passCheck(c:Checkable):boolean {
    console.log(c);
    return c.check();
  }

  navOptions = [
    {text: "Dashboard",url:"dashboard", check: ()=>{return true;}},
    {text:"Log In",url:"login",  check: ()=>{return !this.oauth.getLoggedIn();}},
    {text:"Log Out",url:"logout", check: ()=>{return this.oauth.getLoggedIn();}}
  ]

  navSubreddits:Link[] = [];
  private _mobileQueryListener: () => void;

  constructor(private changeDetectorRef: ChangeDetectorRef, private media: MediaMatcher, private oauth:OauthService, private me: MeService, private router:Router) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngAfterViewInit(): void {
    this.router.events
          .pipe(filter(  (e:RouterEvent) => {return e instanceof NavigationEnd} ))
          .subscribe(() => {
            const content = document.querySelector('.mat-sidenav-content'); 
            if (content)
              content.scrollTop=0;
          });
  }

  ngOnInit(): void {
    if (this.oauth.getLoggedIn() && this.oauth.shouldRefresh())
      this.oauth.refresh();
    this.me.getSubreddits().subscribe ( (data:Subreddit) => {
      let x = {
        text:data.name,
        url:data.name.toLowerCase()
      };
      this.navSubreddits.push(x);
      this.navSubreddits.sort((a, b) => a.text.localeCompare(b.text));
    });
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
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