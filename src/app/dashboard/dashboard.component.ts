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
    redditFeedService.getRedditSchema().subscribe((results: Post[]) => { this.samplePosts=results;  });
  }

  ngOnInit(): void {

  }

}