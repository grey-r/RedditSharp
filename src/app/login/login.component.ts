import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { OauthService } from '../reddit/oauth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private oauth:OauthService) { }

  ngOnInit(): void {
    this.oauth.logIn();
  }

}
