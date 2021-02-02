import { Injectable, OnDestroy } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { takeUntil } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class DarkModeService implements OnDestroy {
  darkMode$: BehaviorSubject<boolean>;
  darkQuery: Observable<BreakpointState>;
  private _darkDefault: boolean = true;
  private _darkMode: boolean | null = null;

  ngUnsubscribe = new Subject<void>();

  public get darkDefault(): boolean {
    return this._darkDefault;
  }

  public get darkMode(): boolean {
    if (this._darkMode != null) return this._darkMode;
    return this.darkDefault;
  }

  public set darkDefault(x: boolean) {
    if (this._darkMode == null) {
      this.darkMode$.next(x);
    }
    this._darkDefault = x;
  }

  public set darkMode(x: boolean) {
    this._darkMode = x;
    localStorage.setItem("dark", this._darkMode.toString());
    this.darkMode$.next(this._darkMode);
  }

  public toggleDark(): void {
    this.darkMode = !this.darkMode;
  }

  constructor(breakpointObserver: BreakpointObserver) {
    this.darkQuery = breakpointObserver.observe([
      "(prefers-color-scheme: dark)"
    ]);

    let storedDark = localStorage.getItem("dark");
    this._darkMode = storedDark ? storedDark === "true" : null;

    this.darkMode$ = new BehaviorSubject<boolean>(this.darkMode);
    this.darkQuery
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((x: BreakpointState) => {
        if (x) {
          this.darkDefault = x.matches;
        }
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
