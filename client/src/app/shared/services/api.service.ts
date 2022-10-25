import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {TokenModel} from "../models/token.model";

const API = "/api/";

export enum AuthType {
  NONE, ACCESS, REFRESH
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private getRefreshToken: () => TokenModel;
  private getAccessToken: () => TokenModel;


  constructor(private http: HttpClient) {
    this.getAccessToken = () => {
      throw new Error("No Method provided");
    };
    this.getRefreshToken = () => {
      throw new Error("No Method provided");
    };
  }

  public insertTokenGetters(getRefreshToken: () => TokenModel, getAccessToken: () => TokenModel) {
    this.getAccessToken = getAccessToken;
    this.getRefreshToken = getRefreshToken;
  }

  public post<T>(authType: AuthType, url: string, body?: any) {
    return this.http.post<T>(API + url, body, this.httpOptions(authType));
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
