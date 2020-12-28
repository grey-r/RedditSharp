import { Injectable, NgZone } from '@angular/core';
import { map, catchError } from "rxjs/operators";
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})

export class UserInfoService {
  private _loading:boolean = false;
  userQueue:User[] = [];

  constructor(private http:HttpClient, private ngZone: NgZone) { }

  public populateInfo(u:User) {
    this.userQueue.push(u);
    if (this.userQueue.length==1 && !this._loading)
      this.performNextRequest();
  }
  private performNextRequest() {
    this._loading=true;
    let u:User = <User>this.userQueue.shift();
    this.http.jsonp(`https://reddit.com/user/${u.name}/about.json?`,"jsonp").subscribe( (results: any) => {
        console.log(results);
        this.ngZone.run( () => {
          if (results.data.snoovatar_size)
            u.avatarUrl=results.data.snoovatar_img;
          else
            u.avatarUrl="https://www.redditinc.com/assets/images/site/reddit-logo.png"
        });
        if (this.userQueue.length>0)
          this.performNextRequest()
        else
          this._loading=false;
    }, (err: any) => {
      if (this.userQueue.length>0)
        this.performNextRequest()
      u.avatarUrl="https://www.redditinc.com/assets/images/site/reddit-logo.png"
    });
  }
}