import { Component, OnInit } from '@angular/core';
import {Post, PostType} from '../reddit/post'
import {RedditFeedService} from '../reddit/reddit-feed.service'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

  samplePosts:Post[] = [
  ];

  constructor(private redditFeedService: RedditFeedService) {
    redditFeedService.getRedditSchema().subscribe((results: Post[]) => {
        let newPosts = results.filter( (p:Post) => {
          return !this.samplePosts.find( inner=> {
            return inner.id==p.id;
          });
        });
        this.samplePosts = this.samplePosts.concat(newPosts);
    });
  }

  ngOnInit(): void {

  }

}