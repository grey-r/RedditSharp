import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class MobileService {
  mobileQuery: Observable<BreakpointState>;
  ngUnsubscribe = new Subject<void>();
  mobile: boolean = false;

  constructor(breakpointObserver: BreakpointObserver) {
    this.mobileQuery = breakpointObserver.observe(["(max-width: 600px)"]);
    this.mobileQuery
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((x: BreakpointState) => {
        this.mobile = x.matches;
      });
  }
}
