import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, map, merge, startWith, switchMap, take } from 'rxjs/operators';
import { OauthService } from '../oauth.service';

function isEmpty(value: any): boolean {
  return value === null || value.length === 0;
}

@Injectable({
  providedIn: 'root'
})

export class RequirementValidatorService {
  constructor (private http:HttpClient, private oauth:OauthService) {
      
  }
  checkPostRequirements(postTitle:string, data:any):string|null {
    return null;
  }
  getValidator():AsyncValidatorFn {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `bearer ${this.oauth.getToken()}`
      }),
    };

    let that = this;
    return (group: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
        const title = group.get("Title");
        const subreddit = group.get("Subreddit");
        if (!title || !subreddit || isEmpty(subreddit.value)) {
            return of(null);
        } else {
            return subreddit.valueChanges.pipe(
              startWith(""),
              merge(title.valueChanges),
              debounceTime(500),
              take(1),
              switchMap( (x:any) => {
                  let s = subreddit.value;
                  return that.http.get(`https://oauth.reddit.com/api/v1/${s}/post_requirements.json`,httpOptions).pipe(catchError( (x:any) => {
                    return of({"error":"Subreddit does not exist"});
                  }), take(1), map ( (data:any) => {
                      let err:string|null = null;
                      if (data.error) {
                        err = data.error;
                        let errs = subreddit.errors;
                        if (!errs) {
                          errs = {};
                        }
                        errs["sub"] = err;
                        subreddit.setErrors(errs);
                      }
                      else if (title) {
                        err = that.checkPostRequirements(title.value,data);
                        if (err) {
                          let errs = title.errors;
                          if (!errs) {
                            errs = {};
                          }
                          errs["sub"] = err;
                          title.setErrors(errs);
                        }
                      }
                      return err ? {"sub":err} : null
                  }));
              }));
        }
    }
  }
}