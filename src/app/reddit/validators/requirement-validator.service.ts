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
  assignError(component:AbstractControl, key:string, value:string):ValidationErrors {
    let errs = component.errors;
    if (!errs) {
      errs = {};
    }
    errs[key] = value;
    component.setErrors(errs);
    return {key:value};
  }
  checkPostRequirements(postTitleComponent:AbstractControl, data:any): ValidationErrors|null {
    let title = postTitleComponent.value;
    if (data) {
      if (data.title_text_min_length && title.length<data.title_text_min_length) {
        return this.assignError(postTitleComponent,"minlength",`Too short -- must be ${data.title_text_min_length} or longer.`);
      }
      if (data.title_text_max_length && title.length>data.title_text_max_length) {
        return this.assignError(postTitleComponent,"minlength",`Too long -- must be ${data.title_text_max_length} or shorter.`);
      }
    }
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
                      if (data.error) {
                        let err = data.error;
                        let errs = subreddit.errors;
                        if (!errs) {
                          errs = {};
                        }
                        errs["sub"] = err;
                        subreddit.setErrors(errs);
                        return {"sub":err};
                      }
                      if (title) {
                        return that.checkPostRequirements(title,data);
                      }
                      return null;
                  }));
              }));
        }
    }
  }
}