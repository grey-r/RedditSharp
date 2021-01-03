import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DarkModeService } from 'src/app/dark-mode.service';
import { PostInfoService } from 'src/app/reddit/post-info.service';

@Component({
  selector: 'app-result-modal',
  templateUrl: './result-modal.component.html',
  styleUrls: ['./result-modal.component.css']
})
export class ResultModalComponent implements OnInit, OnDestroy {
  data: any;

  ngUnsubscribe = new Subject<void>();

  public get darkMode$() {
    return this.dark.darkMode$;
  }

  constructor(public dialogRef: MatDialogRef<ResultModalComponent>, private dark:DarkModeService, private pi:PostInfoService,
    @Inject(MAT_DIALOG_DATA) public inputData: any) {
      this.data = inputData;
      document.getElementById("dialContent")?.scrollIntoView();
      this.dark.darkMode$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe( (isDark:boolean) => {
        if (isDark)
          dialogRef.addPanelClass("dark-theme");
        else
          dialogRef.removePanelClass("dark-theme");
      })
    }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  closeDialog():void {
    this.dialogRef.close();
  }

}
