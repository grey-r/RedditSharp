import { Injectable } from '@angular/core';
import { map } from "rxjs/operators";
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})

export class UserInfoService {

  constructor(private http:HttpClient) { }

  public async populateInfo(u:User) {
    this.http.jsonp(`https://reddit.com/user/${u.name}/about.json?`,"jsonp").toPromise().then((results: any) => {
        console.log(results);
    });
}
}