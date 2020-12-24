import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {Post, PostType} from '../reddit/post';
import {User} from '../reddit/user';
import { UserInfoService } from './user-info.service';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RedditFeedService {
  authorInfo:UserInfoService = new UserInfoService(this.httpClient);
  //client: HttpClient;
  constructor(private httpClient: HttpClient) {
  }

  public getRedditSchema(subreddit:String|null=null, after:String|null=null, limit=25): Observable<Post[]> {
    let sub = new Subject<Post[]>();
    this.httpClient.jsonp(`https://reddit.com/${subreddit?"r/"+subreddit+"/":""}.json?limit=${limit}${after?"&after="+after:""}`,"jsonp").pipe(first()).subscribe((results: any) => {
      sub.next(results.data.children.map((child:any) => {
        console.log(child.data);
        let post:Post = new Post(child.data.id,child.kind);
        post.title=child.data.title;
        if (child.data.selftext) {
          post.text=child.data.selftext;
        }
        if (child.data.author) {
          let author:User = new User(child.data.author);
          this.authorInfo.populateInfo(author);
          post.author=author;
        }
        return post;
      }));
    })
    return sub;
  }
}
