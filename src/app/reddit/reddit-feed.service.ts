import { Injectable, NgZone } from '@angular/core';
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
  authorInfo:UserInfoService = new UserInfoService(this.httpClient, this.ngZone);
  //client: HttpClient;
  constructor(private httpClient: HttpClient, private ngZone:NgZone) {
  }

  private htmlDecode(input:string) {
    var doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent;
  }
  

  public getRedditSchema(subreddit:String|null=null, after:String|null=null, limit=25): Observable<Post[]> {
    let sub = new Subject<Post[]>();
    this.httpClient.jsonp(`https://reddit.com/${subreddit?"r/"+subreddit+"/":""}.json?limit=${limit}${after?"&after="+after:""}`,"jsonp").pipe(first()).subscribe((results: any) => {
      sub.next(results.data.children.map((child:any) => {
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
        return post;
      }));
    })
    return sub;
  }
}
