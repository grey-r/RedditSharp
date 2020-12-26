import { Post } from './post';
import { RedditFeedService } from './reddit-feed.service';
import { first } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

export class RedditFeed {
    private _postAr:Post[] = [];
    private _post$:Subject<Post[]> = new Subject();
    private _subreddit:string|null=null;
    private _loading:boolean=false;
    private _lastID:string|null=null;
    private _lastType:string|null=null;

    constructor(private redditFeedService: RedditFeedService) {
    }

    public get post$():Observable<Post[]> {
        return this._post$;
    }

    public get subreddit():string|null {
        return this._subreddit;
    }

    public get loading(): boolean {
        return this._loading;
    }

    public set subreddit( s:string|null ) {
        this._subreddit=s;
    }

    fetchMore():void {
        this._loading=true;
        let after:string|null=null;
        if (this._lastType && this._lastID) {
            after=this._lastType+"_"+this._lastID;
        }
        //console.log(after);
        this.redditFeedService.getRedditSchema(this.subreddit,after).pipe(first()).subscribe((results: Post[]) => {
            this._lastID = results[results.length-1].id;
            this._lastType = results[results.length-1].type;
            this._postAr = this._postAr.concat(results)
            this._post$.next(this._postAr);
            this._loading=false;
        });
    }
}
