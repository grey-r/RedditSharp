import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { first } from 'rxjs/operators';
import { OauthService } from './oauth.service';
import { Post, PostType } from './post';
import { Subreddit } from './subreddit';
import { User } from './user';
import { UserInfoService } from './user-info.service';

@Injectable({
  providedIn: 'root'
})
export class PostInfoService {

  constructor(private http: HttpClient, private ngZone:NgZone, private oauth: OauthService, private authorInfo:UserInfoService,) { }

  private htmlDecode(input:string) {
    var doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent;
  }

  private commentsFromData(p:Post, data: any):void {
    if (Array.isArray(data)) {
      for (let i=0; i<data.length; i++) {
        let listing = data[i];
        this.commentsFromData(p,listing);
      }
      return;
    }
    if (!data.data)
      return;
    if (data.kind === PostType.Listing && data.data.children) {
      for (let i=0; i<data.data.children.length; i++) {
        let childContainer = data.data.children[i];
        let child = childContainer.data;
        if (childContainer.kind === PostType.Comment) {
          let post = new Post(child.id,childContainer.kind);
          this.populatePostInfo(post,child);
          this.commentsFromData(post,child.replies);
          p.replies.push(post);
        }
      }
    }
  }

  populateLink(post:Post, json: any) {
    post.title=json.title;
    if (json.selftext && json.selftext.length>0) {
      post.text=this.htmlDecode(json.selftext);
    }
    if (json.selftext_html && json.selftext_html.length>0) {
      post.html=this.htmlDecode(json.selftext_html);
    }
    if (post.author) {
      this.authorInfo.populateInfo(post.author);
    }
    if (json.url && json.url.length>0) {
      post.url = this.htmlDecode(json.url);
    }
    if (json.post_hint==="image" && json.url) {
      post.imageUrl = this.htmlDecode(json.url);
    }
    if (json.preview && json.preview.images ) {
      let imgAr = json.preview.images;
      let im = imgAr[0];
      if (im && im.source && im.source.url) {
        post.previewUrl = this.htmlDecode(im.source.url);
      }
    }
    if (json.thumbnail)
      post.thumbnailUrl = this.htmlDecode(json.thumbnail);
    //console.log(json.media_embed.content);
    if (json.media_embed && json.media_embed.content)
      post.mediaEmbed = this.htmlDecode(json.media_embed.content);
    if (json.secure_media && json.secure_media.reddit_video) {
      let v = json.secure_media.reddit_video;
      post.videoUrl = v.fallback_url;
    }
  }

  populateComment(post:Post, json:any) {
    if (json.body && json.body.length>0) {
      post.text = json.body;
    }
    if (json.body_html && json.body_html.length>0) {
      post.html = json.body_html;
    }
  }

  populatePostInfo(post:Post, json:any) {

    if (json.author) {
      let author:User = new User(json.author);
      post.author=author;
    }

    if (json.created_utc) {
      post.utc=json.created_utc;
    }
    else if (json.created) {
      post.utc = json.created;
    }

    if (json.ups) {
      if (json.upvote_ratio) {
        post.setVotes(json.ups,json.upvote_ratio);
      } else {
        post.upvotes = json.ups;
        post.downvotes = json.downs;
      }
    }

    if (json.subreddit && json.subreddit.length > 0) {
      let id = (json.subreddit_id ?? PostType.Subreddit+"_null").replace( PostType.Subreddit+"_","");
      post.subreddit = new Subreddit(id,PostType.Subreddit,json.subreddit);
    }

    switch (post.type) {
      case PostType.Link: {
        this.populateLink(post,json);
        break;
      }
      case PostType.Comment: {
        this.populateComment(post,json);
        break;
      }
    }
  }

  fetchComments(p:Post) {
    this.http.jsonp(`https://reddit.com/${p.subreddit?"/r/"+p.subreddit:""}/comments/${p.id}/.json?`,"jsonp").pipe(first()).subscribe( (results: any) => {
      this.commentsFromData(p,results);
      console.log(p.replies);
    }, (err: any) => {
      p.replies=[];
    });
  }
}
