import { Injectable } from "@angular/core";
import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors
} from "@angular/forms";
import { Observable, of } from "rxjs";
import {
  catchError,
  debounceTime,
  map,
  startWith,
  switchMap,
  take
} from "rxjs/operators";
import { RedditFeedService } from "../reddit-feed.service";

function isEmpty(value: any): boolean {
  return value === null || value.length === 0;
}

@Injectable({
  providedIn: "root"
})
export class SubredditValidatorService {
  constructor(private rfs: RedditFeedService) {}
  getValidator(): AsyncValidatorFn {
    let that = this;
    return (
      control: AbstractControl
    ):
      | Promise<ValidationErrors | null>
      | Observable<ValidationErrors | null> => {
      if (isEmpty(control.value)) {
        return of(null);
      } else {
        return control.valueChanges.pipe(
          startWith(""),
          debounceTime(200),
          take(1),
          switchMap((x: any) => {
            let s = <string>x;
            return that.rfs.fetchPosts(s).pipe(
              catchError((x: any) => {
                return of({
                  error: "Subreddit does not exist"
                });
              }),
              take(1),
              map((data: any) => {
                let subError: string | null = null;
                if (data.error) {
                  subError = data.error;
                }
                return subError ? { sub: subError } : null;
              })
            );
          })
        );
      }
    };
  }
}
