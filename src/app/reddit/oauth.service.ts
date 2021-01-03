import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export const EXPIRATION_DELAY:number = 60*60; //one hour = 60 seconds * 60 minutes
export const EXPIRATION_PADDING:number = 60*5;

@Injectable({
  providedIn: 'root'
})

export class OauthService {

  private _refreshing: boolean = false;
  private _ready: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _token:string|null;

  constructor(private http:HttpClient) {
    this._token = localStorage.getItem("token");
    if (this.getReady())
      this._ready.next(true);
    //window['oauth']=this;
  }

  logIn(perm:boolean = true):void {
    let state:string = Math.random().toString().replace(".","");
    localStorage.setItem('state', state);
    window.location.href = `https://www.reddit.com/api/v1/authorize?client_id=${environment.clientId}&response_type=code&state=${encodeURIComponent(state)}&redirect_uri=${encodeURIComponent(environment.redirectUrl)}&scope=${encodeURIComponent(environment.scope)}&duration=${perm?"permanent":"temporary"}`;
  }

  logOut(redirect:string|null = "/"):void {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("tokenExpiration");
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
    this._token=token;
    localStorage.setItem("token",token);
    this._ready.next(true);
    let exp =  Date.now() + delay*1000;
    localStorage.setItem("tokenExpiration", (exp).toString() );
  }

  setRefreshToken(token:string) {
    localStorage.setItem("refreshToken",token);
  }

  getState():string|null {
    return localStorage.getItem("state");
  }

  getToken():string|null {
    return this._token;
  }

  getRefreshToken():string|null {
    return localStorage.getItem("refreshToken");
  }

  getTokenExpiration():number|null {
    let s = localStorage.getItem("tokenExpiration");
    if (!s)
      return null;
    return parseInt(s);
  }

  getLoggedIn():boolean {
    if (this.getToken()) {
      return true;
    }
    return false;
  }

  shouldRefresh():boolean {
    let exp:number|null = this.getTokenExpiration();
    if (!exp)
      return false;
    return Date.now() > exp - EXPIRATION_PADDING;
  }

  getReady():boolean {
    return this.getLoggedIn() && !this.shouldRefresh();
  }

  isReady():Observable<boolean> {
    if (this.getLoggedIn() && this.shouldRefresh() && !this._refreshing) {
      this._ready.next(false);
      this.refresh();
    }
    return this._ready.asObservable();
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
      if (res.error) {
        return <AuthenticationError> res;
      }
      else {
        return <AuthenticationResult> res;
      }
    }));
  }

  private refresh():void {   
    this._refreshing = true;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(environment.clientId + ':'),
      }),
    };
  
    const grantType = environment.refreshType;
    const redirectUri = environment.redirectUrl;
    const code = this.getRefreshToken();
    
    const postdata = `grant_type=${grantType}&refresh_token=${code}&redirect_uri=${redirectUri}`;
  
    this.http.post(environment.tokenEndpoint, postdata, httpOptions).pipe(map( (res:any) => {
      if (res.error)
        return <AuthenticationError> res;
      else
        return <AuthenticationResult> res;
    })).subscribe( (res:AuthenticationResult|AuthenticationError) => {
      this._refreshing = false;
      if ("error" in res) {
        this._ready.next(false);
        alert(res.error);
      } else {
        res = <AuthenticationResult> res;
        //alert(res.access_token);
        this.setToken(res.access_token, res.expires_in);
      }
    }, (err:any)=> {
      console.log(err);
      this._refreshing = false;
    });
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