import { Post } from './post';
import { RedditFeedService } from './reddit-feed.service';
import { first } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

export class RedditFeed {

    constructor(private redditFeedService: RedditFeedService) {
    }

}
