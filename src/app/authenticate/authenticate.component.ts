import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthenticationError, AuthenticationResult, OauthService } from '../reddit/oauth.service';

@Component({
  selector: 'app-authenticate',
  templateUrl: './authenticate.component.html',
  styleUrls: ['./authenticate.component.css']
})
export class AuthenticateComponent implements OnInit, OnDestroy {

  ngUnsubscribe = new Subject<void>();
  error:string|null=null;

  constructor(private route:ActivatedRoute, private oauth:OauthService) {
  }

  ngOnInit(): void {
    this.route.queryParams
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe( (params:Params) => {
      let routeState:string|null = params.state;
      let token:string|null = params.code;
      let that = this;
      this.oauth.validateLogIn(routeState,token, (code) => {
        this.oauth.fetchToken(code).subscribe( (data:AuthenticationResult|AuthenticationError) => {
          if ("error" in data) {
            data=<AuthenticationError> data;
            this.error=data.error;
            if (!environment.production) {
              console.log(`AUTH ERROR: ${data.error}`);
            }
          }
          else {
            data=<AuthenticationResult> data;
            this.oauth.setToken(data.access_token, data.expires_in);
            if (data.refresh_token)
              this.oauth.setRefreshToken(data.refresh_token);
            window.location.href="/";
          }
        });
      } );
    });
  }

  ngOnDestroy():void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
