import { Injectable } from '@angular/core';
import { map } from "rxjs/operators";
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})

export class UserInfoService {
  userQueue:User[] = [];

  constructor(private http:HttpClient) { }

  public async populateInfo(u:User) {
    this.userQueue.push(u);
    if (this.userQueue.length==1)
      this.performNextRequest();
  }
  private performNextRequest() {
    let u:User = <User>this.userQueue.shift();
    this.http.jsonp(`https://reddit.com/user/${u.name}/about.json?`,"jsonp").toPromise().then((results: any) => {
        console.log(results);
        if (results.data.snoovatar_size)
          u.avatarUrl=results.data.snoovatar_img;
        if (this.userQueue.length>0)
          this.performNextRequest()
    });
  }
}