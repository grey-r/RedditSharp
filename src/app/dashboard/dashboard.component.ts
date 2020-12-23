import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

  constructor() { }

  sampleContent = [
    {title:"Sample Title", type:"link", image:"asdf.png"},
    {title:"Sample Title 2", type:"text", content:"asdfqwerty"}
  ];

  ngOnInit(): void {
  }

}
