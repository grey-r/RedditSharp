import { Post } from './post';
import { RedditFeedService } from './reddit-feed.service';
import { first } from 'rxjs/operators';

export class RedditFeed {
    private _posts:Post[] = [];
    private _subreddit:string|null=null;
    private _loading:boolean=false;

    constructor(private redditFeedService: RedditFeedService) {
    }

    public get posts():Post[] {
        return this._posts;
    }

    public set posts(ps:Post[]) {
        this._posts = ps;
    }

    public get subreddit():string|null {
        return this._subreddit;
    }

    public get loading(): boolean {
        return this._loading;
    }

    public set subreddit( s:string|null ) {
        this._posts = [];
        this._subreddit=s;
    }

    fetchMore():void {
        this._loading=true;
        let after:string|null=null;
        if (this.posts.length>0) {
            let post = this.posts[this.posts.length-1]
            after=post.type+"_"+post.id;
        }
        //console.log(after);
        this.redditFeedService.getRedditSchema(this.subreddit,after).pipe(first()).subscribe((results: Post[]) => {
            let newPosts = results.filter( (p:Post) => {
              return !this.posts.includes(p);
            });
            //console.log(newPosts);
            this.posts = this.posts.concat(newPosts);
            this._loading=false;
        });
    }
}
