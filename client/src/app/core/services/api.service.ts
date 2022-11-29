import {Injectable} from '@angular/core';
import {TokenModel} from "../../models/token.model";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, firstValueFrom, throwError} from "rxjs";
import {AuthResponse} from "../../models/auth-response.model";

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
    return (await this.post<TokenModel>(await this.authTypeRefresh(), "auth/token/access", null));
  }

  public async updateRefreshToken(): Promise<TokenModel> {
    return (await this.post<TokenModel>(await this.authTypeRefresh(), "auth/token/refresh", null));
  }

  public async authGuest(): Promise<AuthResponse> {
    return (await this.post<AuthResponse>(await this.authTypeNone(), "auth/guest", null));
  }

  private async authTypeNone() {
    return new HttpHeaders({'Content-Type': 'application/json'});
  }

  private async authTypeAccess() {
    return new HttpHeaders({
      'Content-Type': 'application/json', "Authorization": "Bearer " + (await this.getAccessToken()).string
    })
  }

  private async authTypeRefresh() {
    return new HttpHeaders({
      'Content-Type': 'application/json', "Authorization": "Bearer " + (await this.getRefreshToken()).string
    })
  }

  private async post<T>(headers: HttpHeaders, url: string, body?: any): Promise<T> {
    return firstValueFrom(this.http.post<T>(API + url, body, {headers: headers}).pipe(catchError((err: any) => {
      console.log('In Service:', err);
      return throwError(err);
    })));
  }


  private async get<T>(headers: HttpHeaders, url: string): Promise<T> {
    return firstValueFrom(this.http.get<T>(API + url, {headers: headers}).pipe(catchError((err: any) => {
      console.log('In Service:', err);
      return throwError(err);
    })));
  }
}
