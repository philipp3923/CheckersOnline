import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {StorageService} from "./storage.service";

export interface AuthResponse {
  accessToken: TokenObject,
  refreshToken: TokenObject,
  user: User,
}

interface AccessTokenResponse{
  accessToken: TokenObject
}

interface RefreshTokenResponse{
  refreshToken: TokenObject
}

const API = "/api/";

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient, private storageService: StorageService) {
  }

  public login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(API + 'auth/login', {
      email,
      password
    }, httpOptions);
  }

  //#TODO implement logout request

  public register(username: string, email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(API + 'auth/register', {
      username,
      email,
      password
    }, httpOptions);
  }

  public updateAccessToken() {
    this.http.post<AccessTokenResponse>(API + "auth/update/access_token", {}, this.httpOptions_useRefreshToken()).subscribe({
      next: (res) => {
        this.storageService.saveAccessToken(res.accessToken);
      },
      error: (err) => {
        console.table(err)
      },
    });
  }

  public updateRefreshToken() {
    this.http.post<RefreshTokenResponse>(API + "auth/update/refresh_token", {}, this.httpOptions_useRefreshToken()).subscribe({
      next: (res) => {
        this.storageService.saveRefreshToken(res.refreshToken);
        this.updateAccessToken();
      },
      error: (err) => {
        console.table(err)
      },
    });
  }

  private httpOptions_useAccessToken() {
    return {
      headers: new HttpHeaders({'Content-Type': 'application/json', "Authorization": "Bearer " + this.storageService.getAccessToken()?.token})
    }
  }

  private httpOptions_useRefreshToken() {
    return {
      headers: new HttpHeaders({'Content-Type': 'application/json', "Authorization": "Bearer " + this.storageService.getRefreshToken()?.token})
    }
  }

}
