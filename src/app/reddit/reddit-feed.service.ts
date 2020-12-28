import { Injectable, NgZone } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {Post, PostType} from '../reddit/post';
import {User} from '../reddit/user';
import { UserInfoService } from './user-info.service';
import { first, map, flatMap } from 'rxjs/operators';
import { OauthService } from './oauth.service';

@Injectable({
  providedIn: 'root'
})
export class RedditFeedService {
  private _subreddit:string|null=null;
  private _loading:boolean=false;
  private _lastID:string|null=null;
  private _lastType:string|null=null;
  //client: HttpClient;
  constructor(private httpClient: HttpClient, private ngZone:NgZone, private oauth:OauthService, private authorInfo:UserInfoService) {
  }

  private htmlDecode(input:string) {
    var doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent;
  }

  fetchPosts(subreddit:String|null=null, after:String|null=null, limit=25): Observable<Post> {
    this._loading = true;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `bearer ${this.oauth.getToken()}`
      }),
    };

    const dataToPost = (child:any) => {
      console.log(child.data);
      let post:Post = new Post(child.data.id,child.kind);
      post.title=child.data.title;
      if (child.data.selftext && child.data.selftext.length>0) {
        post.text=this.htmlDecode(child.data.selftext);
      }
      if (child.data.author) {
        let author:User = new User(child.data.author);
        this.authorInfo.populateInfo(author);
        post.author=author;
      }
      if (child.data.ups) {
        if (child.data.upvote_ratio) {
          post.setVotes(child.data.ups,child.data.upvote_ratio);
        } else {
          post.upvotes = child.data.ups;
          post.downvotes = child.data.downs;
        }
      }
      if (child.data.url && child.data.url.length>0) {
        post.url = this.htmlDecode(child.data.url);
      }
      if (child.data.post_hint==="image" && child.data.url) {
        post.imageUrl = this.htmlDecode(child.data.url);
      }
      if (child.data.preview && child.data.preview.images ) {
        let imgAr = child.data.preview.images;
        let im = imgAr[0];
        if (im && im.source && im.source.url) {
          post.previewUrl = this.htmlDecode(im.source.url);
        }
      }
      if (child.data.thumbnail)
        post.thumbnailUrl = this.htmlDecode(child.data.thumbnail);
      //console.log(child.data.media_embed.content);
      if (child.data.media_embed && child.data.media_embed.content)
        post.mediaEmbed = this.htmlDecode(child.data.media_embed.content);
      if (child.data.secure_media && child.data.secure_media.reddit_video) {
        let v = child.data.secure_media.reddit_video;
        post.videoUrl = v.fallback_url;
      }
      //Potentially use https://css-tricks.com/fluid-width-video/
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
    ref.subscribe( (x) => {
      this._loading = false;
    })

    return ref;
  }

  public get loading():boolean {
    return this._loading;
  }
}
