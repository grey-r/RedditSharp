import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OauthService } from './oauth.service';
import { map } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { Subreddit } from './subreddit';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MeService {

  constructor(private http:HttpClient, private oauth: OauthService) { }

  getInfo():void {
    if (!this.oauth.getLoggedIn())
      return;
    
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `bearer ${this.oauth.getToken()}`
      }),
    };
  
    this.http.get("https://oauth.reddit.com/api/v1/me", httpOptions).subscribe( (data) => {
      console.log(data);
    })
  }

  subredditSubject:Subject<Subreddit> = new Subject();

  getSubreddits(after:string|null=null):Observable<any> {
    if (!this.oauth.getLoggedIn())
      return this.subredditSubject;
    
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `bearer ${this.oauth.getToken()}`
      }),
    };
  
    this.http.get(`https://oauth.reddit.com/subreddits/mine/subscriber?limit=${environment.subredditLimit}${after?"&after="+after:""}`, httpOptions).subscribe( (res:any) => {
      //console.log(res.data.children);
      res.data.children.forEach( (child:any) => {
        //console.log(child);
        this.subredditSubject.next( new Subreddit(child.data.id, child.kind, child.data.display_name));
      });
      if (res.data.after) {
        this.getSubreddits(res.data.after);
      }
    })

    return this.subredditSubject;
  }
}
