import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { Post } from '../reddit/post';
import { OauthService } from './oauth.service';
import { PostInfoService } from './post-info.service';

@Injectable({
  providedIn: 'root'
})
export class RedditFeedService {
  private _subreddit:string|null=null;
  private _loading:boolean=false;
  private _lastID:string|null=null;
  private _lastType:string|null=null;
  //client: HttpClient;
  constructor(private httpClient: HttpClient, private ngZone:NgZone, private oauth:OauthService, private postInfo: PostInfoService) {
  }

  fetchPosts(subreddit:String|null=null, after:String|null=null, limit=25): Observable<Post> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `bearer ${this.oauth.getToken()}`
      }),
    };

    const dataToPost = (child:any) => {
      let post:Post = new Post(child.data.id,child.kind);
      this.postInfo.populatePostInfo(post,child.data);
      return post;
    };

    let ref:Observable<Post>;
    if (this.oauth.getReady()) {
      ref = this.httpClient.get(`https://oauth.reddit.com/${subreddit?"r/"+subreddit+"/":""}.json?limit=${limit}${after?"&after="+after:""}`, httpOptions)
      .pipe(
        flatMap( (x:any) => {return x.data.children;}),
        map(dataToPost)
      );
    }
    else {
      ref = this.httpClient.jsonp(`https://reddit.com/${subreddit?"r/"+subreddit+"/":""}.json?limit=${limit}${after?"&after="+after:""}`,"jsonp")
      .pipe(
        flatMap( (x:any) => {return x.data.children;}),
        map(dataToPost)
      );
    }

    return ref;
  }
}
