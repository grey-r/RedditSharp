import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DarkModeService } from 'src/app/dark-mode.service';
import { SubredditValidatorService } from 'src/app/reddit/validators/subreddit-validator.service';

@Component({
  selector: 'app-subreddit-modal',
  templateUrl: './subreddit-modal.component.html',
  styleUrls: ['./subreddit-modal.component.css']
})
export class SubredditModalComponent implements OnInit, OnDestroy {
  @ViewChild('myForm') ngForm!: NgForm;
  data: any;
  subreddit:string = "";
  formGroup:FormGroup;

  ngUnsubscribe = new Subject<void>();

  public get darkMode$() {
    return this.dark.darkMode$;
  }

  constructor(public dialogRef: MatDialogRef<SubredditModalComponent>, private dark:DarkModeService, private router:Router, private formBuilder:FormBuilder, private subVal:SubredditValidatorService,
    @Inject(MAT_DIALOG_DATA) public inputData: any) {
      this.data = inputData;
      this.formGroup = this.formBuilder.group({
        subreddit: ["", Validators.compose([Validators.required]), subVal.getValidator()]
      });
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

  navigate():void {
    this.ngForm.onSubmit(new Event("submit"));
    /*
    this.formGroup.updateValueAndValidity();
    if (this.formGroup.errors && this.formGroup.errors.length>0) {
      return;
    }
    this.closeDialog();
    */
  }

  onSubmit():void {
    let subCtl = this.formGroup.get("subreddit");
    if (!subCtl)
      return;
    let sub = <string>subCtl.value;
    if (sub.startsWith("/r/")) {
      sub = sub.slice(3);
    }
    this.router.navigate(["/r",sub]);
    this.closeDialog();
  }

  getErrorMessage(fg:FormGroup,controlName:string):string {
    let c = fg.get(controlName);
    if (!c) {
      return "Invalid control";
    }
    if (c.hasError("required")) {
      return "Required."
    }
    if (c.hasError("minlength")) {
      return "Too short."
    }
    if (c.hasError("maxlength")) {
      return "Too long."
    }
    if (c.hasError("blacklist")) {
      return c.getError("blacklist");
    }
    if (c.hasError("whitelist")) {
      return c.getError("whitelist");
    }
    if (c.hasError("invalidText")) {
      return "Contains invalid characters";
    }
    if (c.hasError("email")) {
      return "Not a valid EMail";
    }
    if (c.hasError("url")) {
      return "Not a valid URL";
    }
    if (c.hasError("sub")) {
      return c.getError("sub");
    }
    return "Generic error.";
  }

}
