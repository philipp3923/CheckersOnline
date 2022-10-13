import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, Observer, Subscription} from "rxjs";
import {StorageService} from "./storage.service";
import {DataService} from "./data.service";
import {SocketService} from "./socket.service";

export interface AuthResponse {
  accessToken: TokenObject,
  refreshToken: TokenObject,
  user: User,
}

interface AccessTokenResponse {
  accessToken: TokenObject
}

interface RefreshTokenResponse {
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

  private authObserver: Observer<AuthResponse> = {
    next: (res) => {
      console.log(res);
      this.dataService.changeUser(res.user);
      this.storageService.saveUser(res.user);
      this.storageService.saveRefreshToken(res.refreshToken);
      this.storageService.saveAccessToken(res.accessToken);
      this.socketService.connect();
    },
    error: (err) => {
      console.table(err);
    },
    complete: () => {}
  };

  constructor(private http: HttpClient, private storageService: StorageService, private dataService: DataService, private socketService: SocketService) {
  }

  public login(name: string, password: string): Subscription {
    return this.http.post<AuthResponse>(API + 'auth/login', {
      name,
      password
    }, httpOptions).subscribe(this.authObserver);
  }

  public guest(): Subscription {
    return this.http.post<AuthResponse>(API + 'auth/guest', {}, httpOptions).subscribe(this.authObserver);
  }

  //#TODO implement logout request

  public register(username: string, email: string, password: string): Subscription {
    return this.http.post<AuthResponse>(API + 'auth/register', {
      username,
      email,
      password
    }, httpOptions).subscribe({next: (res)=>{
      this.login(email, password);
      }});
  }

  public updateAccessToken() {
    return this.http.post<AccessTokenResponse>(API + "auth/update/accessToken", {}, this.httpOptions_useRefreshToken()).subscribe({
      next: (res) => {
        this.storageService.saveAccessToken(res.accessToken);
      },
      error: (err) => {
        console.table(err)
      },
    });
  }

  public updateRefreshToken() {
    return this.http.post<RefreshTokenResponse>(API + "auth/update/refreshToken", {}, this.httpOptions_useRefreshToken()).subscribe({
      next: (res) => {
        this.storageService.saveRefreshToken(res.refreshToken);
      },
      error: (err) => {
        console.table(err)
      },
    });
  }

  private httpOptions_useAccessToken() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        "Authorization": "Bearer " + this.storageService.getAccessToken()?.token
      })
    }
  }

  private httpOptions_useRefreshToken() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        "Authorization": "Bearer " + this.storageService.getRefreshToken()?.token
      })
    }
  }

}
