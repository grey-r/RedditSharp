import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { OauthService } from '../reddit/oauth.service';

@Component({
  selector: 'app-authenticate',
  templateUrl: './authenticate.component.html',
  styleUrls: ['./authenticate.component.css']
})
export class AuthenticateComponent implements OnInit {

  constructor(private route:ActivatedRoute, private oauth:OauthService) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe( (params:Params) => {
      let routeState:string|null = params.state;
      let token:string|null = params.code;
      this.oauth.validateLogIn(routeState,token);
    });
  }

}
