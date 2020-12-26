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

  navOptions = [
    {text: "Dashboard",url:"dashboard"},
    {text:"Log In",url:"login"},
    {text:"Log Out",url:"logout"}
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

  shouldRun = [/(^|\.)plnkr\.co$/, /(^|\.)stackblitz\.io$/].some(h => h.test(window.location.host));
}
