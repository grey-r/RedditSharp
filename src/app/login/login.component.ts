import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    let state:string = Math.random().toString().replace(".","");
    localStorage.setItem('state', state);
    window.location.href = `https://www.reddit.com/api/v1/authorize?client_id=${environment.clientId}&response_type=code&state=${encodeURIComponent(state)}&redirect_uri=${encodeURIComponent(environment.redirectUrl)}&scope=${encodeURIComponent(environment.scope)}&duration=permanent`;
  }

}
