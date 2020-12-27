import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export const EXPIRATION_DELAY:number = 60*60; //one hour = 60 seconds * 60 minutes
export const EXPIRATION_PADDING:number = 60*5;

@Injectable({
  providedIn: 'root'
})

export class OauthService {

  constructor(private http:HttpClient) {
    //window['oauth']=this;
  }

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
  
  validateLogIn(state:string|null, code:string|null, callback: ( (x:string)=>void ) | null = null) {
    if (!state) {
      alert("no state");
      return;//We also need to display an error, probably. Later though. Somebody tried to MITM
    }
    if (state != this.getState()) {
      alert("state mismatch");
      return;//We also need to display an error, probably. Later though. Somebody tried to MITM
    }
    if (code) {
      if (callback)
        callback(code);
    }
  }

  setToken(token:string, delay:number=EXPIRATION_DELAY) {
    localStorage.setItem("token",token);
    localStorage.setItem("tokenExpiration", ( Date.now() + delay*1000 ).toString() );
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

  public fetchToken(code:string):Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(environment.clientId + ':'),
      }),
    };
  
    const grantType = environment.authorizationType;
    const redirectUri = environment.redirectUrl;
    const postdata = `grant_type=${grantType}&code=${code}&redirect_uri=${redirectUri}`;
  
    return this.http.post(environment.tokenEndpoint, postdata, httpOptions).pipe(map( (res:any) => {
      if (res.error)
        return <AuthenticationError> res;
      else
        return <AuthenticationResult> res;
    }));
  }

  refresh():void {
    /*
    let body = JSON.stringify({grant_type:"refresh_token",refresh_token:this.getRefreshToken()});
    this.httpOptions.headers.set("Authorization", "Bearer " + this.getToken());
    this.http.post(`/api/access_token`,body,this.httpOptions).toPromise().then( (o) => {
      console.log(o); //test via ng.getComponent(document.querySelector('app-root')).oauth.refresh();
    })
    */
  }
}

export interface AuthenticationError {
  error: string;
}

export interface AuthenticationResult {
  access_token: string;
  refresh_token: string | null;
  expires_in: number;
  scope: string;
  token_type: string;
}