import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RedditFeedService {
  //client: HttpClient;
  constructor(private httpClient: HttpClient) {
    //this.client = httpClient;
  }

  public getRedditSchema(subreddit:String|null=null, after:String|null=null): Observable<any> {
    let subject: Subject<any> = new Subject();
    this.httpClient.jsonp(`https://reddit.com/${subreddit?subreddit+"/":""}.json?${after?"after="+after:""}`,"jsonp").subscribe((results: any) => {
      subject.next(results.data.children);
    })
    return subject;
  }
}
