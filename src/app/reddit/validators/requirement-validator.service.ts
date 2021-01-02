import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { merge, Observable, of } from 'rxjs';
import { catchError, debounceTime, map, startWith, switchMap, take } from 'rxjs/operators';
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
  checkPostRequirements(postTitleComponent:AbstractControl|null,postBodyComponent:AbstractControl|null, data:any): ValidationErrors|null {
    if (postTitleComponent) {
      let title = <string>postTitleComponent.value;
      if (data) {
        if (data.title_text_min_length && title.length<data.title_text_min_length) {
          return this.assignError(postTitleComponent,"minlength",`Too short -- must be ${data.title_text_min_length} or longer.`);
        }
        if (data.title_text_max_length && title.length>data.title_text_max_length) {
          return this.assignError(postTitleComponent,"minlength",`Too long -- must be ${data.title_text_max_length} or shorter.`);
        }
        if (data.title_blacklisted_strings) {
          for (let i=0; i<data.title_blacklisted_strings.length; i++) {
            let word = <string>data.title_blacklisted_strings[i];
            if (title.search(word)!=-1) {
              return this.assignError(postTitleComponent,"blacklist",`Contains blacklisted word -- ${word}.`);
            }
          }
        }
        if (data.title_required_strings) {
          for (let i=0; i<data.title_required_strings.length; i++) {
            let word = <string>data.title_required_strings[i];
            if (title.search(word)==-1) {
              return this.assignError(postTitleComponent,"whitelist",`Lacks whitelisted word -- ${word}.`);
            }
          }
        }
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
        const body = group.get("Text");
        if ( !subreddit || isEmpty(subreddit.value)) {
            return of(null);
        } 
        else
        {
          let changes = subreddit.valueChanges;
          if (title) {
            changes = merge(changes,title.valueChanges);
          }
          if (body) {
            changes = merge(changes, body.valueChanges)
          }
          return subreddit.valueChanges.pipe(
            startWith(""),
            debounceTime(200),
            take(1),
            switchMap( (x:any) => {
                let s = subreddit.value;
                return that.http.get(`https://oauth.reddit.com/api/v1/${s}/post_requirements.json`,httpOptions).pipe(
                  catchError( (x:any) => {
                    return of({"error":"Subreddit does not exist"});
                  }),
                  take(1),
                  map ( (data:any) => {
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
                      return that.checkPostRequirements(title,body,data);
                    }
                    return null;
                  }));
            }));
        }
    }
  }
}