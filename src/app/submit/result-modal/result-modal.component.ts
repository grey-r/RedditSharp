import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { DarkModeService } from "src/app/dark-mode.service";

@Component({
  selector: "app-result-modal",
  templateUrl: "./result-modal.component.html",
  styleUrls: ["./result-modal.component.css"]
})
export class ResultModalComponent implements OnInit, OnDestroy {
  data: any;

  ngUnsubscribe = new Subject<void>();

  public get darkMode$() {
    return this.dark.darkMode$;
  }

  constructor(
    public dialogRef: MatDialogRef<ResultModalComponent>,
    private dark: DarkModeService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public inputData: any
  ) {
    this.data = inputData;
    document.getElementById("dialContent")?.scrollIntoView();
    this.dark.darkMode$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((isDark: boolean) => {
        if (isDark) dialogRef.addPanelClass("dark-theme");
        else dialogRef.removePanelClass("dark-theme");
      });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  return(): void {
    if (this.data.returnLink) {
      this.router.navigate(this.data.returnLink);
      this.closeDialog();
    }
  }

  getReturnString(): string {
    if (!this.data.subreddit) {
      return "Dashboard";
    } else {
      return "/r/" + this.data.subreddit;
    }
  }

  redditToRouter(redditUrl: string): string[] {
    if (redditUrl.endsWith("/")) {
      redditUrl = redditUrl.substr(0, redditUrl.length - 1);
    }
    let x: string[] = redditUrl.slice(redditUrl.search("/r/")).split("/");
    if (x.length > 0) {
      x[0] = "/" + x[0];
      let lastString = x[x.length - 1];
    }
    return x;
  }
}
