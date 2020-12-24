import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {Post, PostType} from '../reddit/post';
import {User} from '../reddit/user';

@Injectable({
  providedIn: 'root'
})
export class RedditFeedService {
  //client: HttpClient;
  constructor(private httpClient: HttpClient) {
    //this.client = httpClient;
  }

  public getRedditSchema(subreddit:String|null=null, after:String|null=null): Observable<Post[]> {
    let subject: Subject<Post[]> = new Subject();
    this.httpClient.jsonp(`https://reddit.com/${subreddit?subreddit+"/":""}.json?${after?"after="+after:""}`,"jsonp").subscribe((results: any) => {
      subject.next(results.data.children.map((child:any) => {
        console.log(child.data);
        let post:Post = new Post(child.data.id,child.kind);
        post.setTitle(child.data.title);
        if (child.data.selftext) {
          post.setText(child.data.selftext);
        }
        if (child.data.author && child.data.author_fullname) {
          post.setAuthor(new User(child.data.author_fullname,child.data.author));
        }
        return post;
      }));
    })
    return subject;
  }
}
