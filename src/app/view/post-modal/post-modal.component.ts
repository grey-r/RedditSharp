import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DarkModeService } from 'src/app/dark-mode.service';
import { Post } from 'src/app/reddit/post';
import { PostInfoService } from 'src/app/reddit/post-info.service';

export interface DialogData {
  post: Post;
}

@Component({
  selector: 'app-post-modal',
  templateUrl: './post-modal.component.html',
  styleUrls: ['./post-modal.component.css']
})
export class PostModalComponent implements OnInit, OnDestroy {

  private get _loading():boolean {
    return this.loading$.getValue();
  }

  private set _loading(x:boolean) {
    this.loading$.next(x);
  }

  public get loading():boolean {
    return this._loading;
  }

  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  post:Post;

  ngUnsubscribe = new Subject<void>();

  public get darkMode$() {
    return this.dark.darkMode$;
  }

  constructor(public dialogRef: MatDialogRef<PostModalComponent>, private dark:DarkModeService, private pi:PostInfoService,
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
    this._loading=true;
    this.pi.fetchComments(this.post).subscribe( () => {
      this._loading=false;
    })
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
