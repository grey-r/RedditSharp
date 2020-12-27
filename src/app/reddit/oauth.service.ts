import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

export const EXPIRATION_DELAY:number = 60*60; //one hour
export const EXPIRATION_PADDING:number = 60*5;

@Injectable({
  providedIn: 'root'
})

export class OauthService {

  constructor() { }

  logIn(perm:boolean = true):void {
    let state:string = Math.random().toString().replace(".","");
    localStorage.setItem('state', state);
    window.location.href = `https://www.reddit.com/api/v1/authorize?client_id=${environment.clientId}&response_type=code&state=${encodeURIComponent(state)}&redirect_uri=${encodeURIComponent(environment.redirectUrl)}&scope=${encodeURIComponent(environment.scope)}&duration=${perm?"permanent":"temporary"}`;
  }

  logOut(redirect:string|null = "/"):void {
    localStorage.removeItem("token");
    if (redirect)
      window.location.href=redirect;
  }
  
  validateLogIn(state:string|null, token:string|null, redirect:string|null="/") {
    if (!state) {
      alert("no state");
      return;//We also need to display an error, probably. Later though. Somebody tried to MITM
    }
    if (state != this.getState()) {
      alert("state mismatch");
      return;//We also need to display an error, probably. Later though. Somebody tried to MITM
    }
    if (token) {
      this.setToken(token);
      if (redirect)
        window.location.href=redirect;
    }
  }

  setToken(token:string) {
    localStorage.setItem("token",token);
    localStorage.setItem("tokenExpiration", ( Date.now() + EXPIRATION_DELAY ).toString() );
  }

  setRefreshToken(token:string) {
    localStorage.setItem("refreshToken",token);
  }

  getState():string|null {
    return localStorage.getItem("state");
  }

  getToken():string|null {
    return localStorage.getItem("token");
  }

  getRefreshToken():string|null {
    return localStorage.getItem("refreshToken");
  }

  getTokenExpiration():string|null {
    return localStorage.getItem("tokenExpiration");
  }

  getLoggedIn():boolean {
    if (this.getToken()) {
      return true;
    }
    return false;
  }

  shouldRefresh():boolean {
    let exp:string|null = this.getTokenExpiration();
    if (!exp)
      return false;
    return Date.now() > parseInt( exp ) - EXPIRATION_PADDING;
  }
}
