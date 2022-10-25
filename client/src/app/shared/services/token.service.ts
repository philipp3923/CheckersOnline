import {Injectable} from '@angular/core';
import {TokenModel} from "../models/token.model";
import {ApiService, AuthType} from "./api.service";

const ACCESS_TOKEN_KEY = "access-token";
const REFRESH_TOKEN_KEY = "refresh-token";

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(private apiService: ApiService) {
  }

  public saveRefreshToken(token: TokenModel): void {
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
    window.localStorage.setItem(REFRESH_TOKEN_KEY, JSON.stringify(token));
  }

  public getRefreshToken(): TokenModel {
    const tokenString = window.localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!tokenString) {
      throw new Error("RefreshToken does not exist");
    }
    const token : TokenModel  = JSON.parse(tokenString);
    if(Date.now() - token.creation < 10000){
      this.removeTokens();
      throw new Error("RefreshToken outdated");
    }
    return token;
  }

  public saveAccessToken(token: TokenModel): void {
    window.sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    window.sessionStorage.setItem(ACCESS_TOKEN_KEY, JSON.stringify(token));
  }

  public getAccessToken(): TokenModel {
    const tokenString = window.sessionStorage.getItem(ACCESS_TOKEN_KEY);
    if (!tokenString) {
      throw new Error("AccessToken does not exist");
    }
    const token : TokenModel  = JSON.parse(tokenString);
    if(Date.now() - token.creation < 10000){
      this.updateAccessToken();
      return this.getAccessToken();
    }
    return token;
  }

  public removeTokens(){
    window.sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  }

  //#TODO create time based auto update function
  public updateAccessToken(){
    this.apiService.post<{accessToken: TokenModel}>(AuthType.REFRESH, "auth/update/accesstoken", null).subscribe({
      next: res => {this.saveAccessToken(res.accessToken)},
      error: err => {console.log(err)}
    })
  }

  public updateRefreshToken(){
    this.apiService.post<{refreshToken: TokenModel}>(AuthType.REFRESH, "auth/update/refreshtoken", null).subscribe({
      next: res => {this.saveRefreshToken(res.refreshToken)},
      error: err => {console.log(err)}
    })
  }

}
