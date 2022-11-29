import { Injectable } from '@angular/core';
import {TokenModel} from "../../models/token.model";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, firstValueFrom, throwError} from "rxjs";

const API = "/api/";

enum AuthType {
  NONE, ACCESS, REFRESH
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private getRefreshToken: () => Promise<TokenModel>;
  private getAccessToken: () => Promise<TokenModel>;

  constructor(private http: HttpClient) {
    this.getAccessToken = () => {
      throw new Error("No Method provided");
    };
    this.getRefreshToken = () => {
      throw new Error("No Method provided");
    };
  }

  public setGetTokens(getRefreshToken: () => Promise<TokenModel>, getAccessToken: () => Promise<TokenModel>) {
    this.getAccessToken = getAccessToken;
    this.getRefreshToken = getRefreshToken;
  }

  public async updateAccessToken(): Promise<TokenModel> {
    return (await this.post<{accessToken: TokenModel}>(AuthType.REFRESH, "auth/update/accesstoken", null)).accessToken;
  }

  public async updateRefreshToken(): Promise<TokenModel> {
    return (await this.post<{refreshToken: TokenModel}>(AuthType.REFRESH, "auth/update/refreshtoken", null)).refreshToken;

  }

  private post<T>(authType: AuthType, url: string, body?: any) : Promise<T>  {
    return firstValueFrom(this.http.post<T>(API + url, body, this.httpOptions(authType)).pipe(
      catchError((err: any) => {
        console.log('In Service:', err);
        return throwError(err);
      })));
  }

  private httpOptions(authType: AuthType){
    let httpOptions = null;
    switch (authType) {
      case AuthType.NONE:
        httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
        break
      case AuthType.ACCESS:
        httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            "Authorization": "Bearer " + this.getAccessToken()
          })
        }
        break
      case AuthType.REFRESH:
        httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            "Authorization": "Bearer " + this.getRefreshToken()
          })
        }
        break
      default:
        throw new Error("Invalid auth type");
    }
    return httpOptions;
  }
}
