import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, NgZone } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { map, mergeMap } from "rxjs/operators";
import { Post } from "../reddit/post";
import { SubmitFormData } from "../submit/postdata.service";
import { OauthService } from "./oauth.service";
import { PostInfoService } from "./post-info.service";
import { FilterModes, SortModes } from "./sort.service";

@Injectable({
  providedIn: "root"
})
export class RedditFeedService {
  private _subreddit: string | null = null;
  private _loading: boolean = false;
  private _lastID: string | null = null;
  private _lastType: string | null = null;
  //client: HttpClient;

  ngUnsubscribe = new Subject<void>();

  constructor(
    private httpClient: HttpClient,
    private ngZone: NgZone,
    private oauth: OauthService,
    private postInfo: PostInfoService
  ) {}

  fetchPosts(
    subreddit: String | null = null,
    after: String | null = null,
    limit: number = 25,
    sortMode: SortModes | null = null,
    filterMode: FilterModes | null = null
  ): Observable<Post> {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `bearer ${this.oauth.getToken()}`
      })
    };

    const dataToPost = (child: any) => {
      let post: Post = new Post(child.data.id, child.kind);
      this.postInfo.populatePostInfo(post, child.data);
      return post;
    };

    let ref: Observable<Post>;
    if (this.oauth.getReady()) {
      ref = this.httpClient
        .get(
          `https://oauth.reddit.com/${subreddit ? "r/" + subreddit + "/" : ""}${
            sortMode ? sortMode + "/" : ""
          }.json?limit=${limit}${after ? "&after=" + after : ""}${
            filterMode ? "&t=" + filterMode : ""
          }`,
          httpOptions
        )
        .pipe(
          mergeMap((x: any) => {
            return x.data.children;
          }),
          map(dataToPost)
        );
    } else {
      ref = this.httpClient
        .jsonp(
          `https://reddit.com/${subreddit ? "r/" + subreddit + "/" : ""}${
            sortMode ? sortMode + "/" : ""
          }.json?limit=${limit}${after ? "&after=" + after : ""}${
            filterMode ? "&t=" + filterMode : ""
          }`,
          "jsonp"
        )
        .pipe(
          mergeMap((x: any) => {
            return x.data.children;
          }),
          map(dataToPost)
        );
    }

    return ref;
  }

  submitPost(data: SubmitFormData): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `bearer ${this.oauth.getToken()}`
      })
    };
    let body = `api_type=json&kind=${data.type}&sr=${data.sr}&title=${data.title}`;
    //append on type-specific params
    if (data.text) {
      body += `&text=${data.text}`;
    }
    if (data.url) {
      body += `&url=${data.url}`;
    }
    if (data.resubmit) {
      body += `&resubmit=${data.resubmit}`;
    }
    if (data.nsfw) {
      body += `&nsfw=${data.nsfw}`;
    }
    if (data.sendreplies) {
      body += `&sendreplies=${data.sendreplies}`;
    }
    if (data.spoiler) {
      body += `&spoiler=${data.spoiler}`;
    }
    let obs = this.httpClient.post(
      "https://oauth.reddit.com/api/submit",
      body,
      httpOptions
    );
    return obs;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
