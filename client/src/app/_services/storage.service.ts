import {Injectable} from '@angular/core';

const ACCESS_TOKEN_KEY = "access-token";
const REFRESH_TOKEN_KEY = "refresh-token";
const USER_KEY = "user";

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() {
  }

  public signOut(): void {
    window.localStorage.clear();
    window.sessionStorage.clear();
  }

  public saveRefreshToken(token: TokenObject): void {
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
    window.localStorage.setItem(REFRESH_TOKEN_KEY, JSON.stringify(token));
  }

  public getRefreshToken(): TokenObject | null {
    const token = window.localStorage.getItem(REFRESH_TOKEN_KEY);
    if (token) {
      return JSON.parse(token);
    }
    return null;
  }

  public saveAccessToken(token: TokenObject): void {
    window.sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    window.sessionStorage.setItem(ACCESS_TOKEN_KEY, JSON.stringify(token));
  }

  public getAccessToken(): TokenObject | null {
    const token = window.sessionStorage.getItem(ACCESS_TOKEN_KEY);
    if (token) {
      return JSON.parse(token);
    }
    return null;
  }

  public saveUser(user: User): void {
    window.localStorage.removeItem(USER_KEY);
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): User | null {
    const user = window.localStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return null;
  }

}
