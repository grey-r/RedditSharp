import {MediaMatcher} from '@angular/cdk/layout';
import {ChangeDetectorRef, Component, OnDestroy, ViewChild, ViewChildren, ElementRef, AfterViewInit} from '@angular/core';

/** @title Responsive sidenav */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnDestroy {
  mobileQuery: MediaQueryList;

  passCheck(c:Checkable):boolean {
    console.log(c);
    return c.check();
  }

  navOptions = [
    {text: "Dashboard",url:"dashboard", check: ()=>{return true;}},
    {text:"Log In",url:"login",  check: ()=>{return !this.loggedIn();}},
    {text:"Log Out",url:"logout", check: ()=>{return this.loggedIn();}}
  ]

  navSubreddits = [
    {text:"AskReddit",url:"askreddit"}
  ]
  private _mobileQueryListener: () => void;

  constructor(private changeDetectorRef: ChangeDetectorRef, private media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  loggedIn():boolean {
    if (localStorage.getItem("token"))
      return true;
    return false;
  }

  shouldRun = [/(^|\.)plnkr\.co$/, /(^|\.)stackblitz\.io$/].some(h => h.test(window.location.host));
}

interface Checkable {
  check():boolean;
}