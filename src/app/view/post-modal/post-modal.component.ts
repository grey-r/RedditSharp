import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Post } from 'src/app/reddit/post';
import { DarkModeService } from 'src/app/dark-mode.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export interface DialogData {
  post: Post;
}

@Component({
  selector: 'app-post-modal',
  templateUrl: './post-modal.component.html',
  styleUrls: ['./post-modal.component.css']
})
export class PostModalComponent implements OnInit, OnDestroy {

  post:Post;

  ngUnsubscribe = new Subject<void>();

  public get darkMode$() {
    return this.dark.darkMode$;
  }

  constructor(public dialogRef: MatDialogRef<PostModalComponent>, private dark:DarkModeService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      this.post=data.post;
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

}
