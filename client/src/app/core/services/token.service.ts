import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { TokenModel } from '../../models/token.model';

//#TODO move KEYS to Constants File
const ACCESS_TOKEN_KEY = 'access-token';
const REFRESH_TOKEN_KEY = 'refresh-token';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private refreshTokenUpdater: undefined | NodeJS.Timeout;
  private accessTokenUpdater: undefined | NodeJS.Timeout;

  constructor(private apiService: ApiService) {
    this.apiService.setGetTokens(
      () => this.getRefreshToken(),
      () => this.getAccessToken()
    );
    this.refreshTokenUpdater = undefined;
    this.accessTokenUpdater = undefined;
  }

  public async saveRefreshToken(token: TokenModel): Promise<void> {
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
    window.localStorage.setItem(REFRESH_TOKEN_KEY, JSON.stringify(token));
    clearTimeout(this.refreshTokenUpdater);
    this.refreshTokenUpdater = setTimeout(
      async () =>
        this.saveRefreshToken(await this.apiService.updateRefreshToken()),
      86400000
    );
  }

  public async getRefreshToken(): Promise<TokenModel> {
    const tokenString = window.localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!tokenString) {
      throw new Error('RefreshToken does not exist');
    }
    const token: TokenModel = JSON.parse(tokenString);

    if (Date.now() - token.timestamp > 2505600000) {
      this.removeTokens();
      throw new Error('RefreshToken outdated');
    }
    if (Date.now() - token.timestamp > 864000000) {
      await this.saveRefreshToken(await this.apiService.updateRefreshToken());
    }
    return token;
  }

  public saveAccessToken(token: TokenModel): void {
    window.sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    window.sessionStorage.setItem(ACCESS_TOKEN_KEY, JSON.stringify(token));
    clearTimeout(this.accessTokenUpdater);
    this.accessTokenUpdater = setTimeout(
      async () =>
        this.saveAccessToken(await this.apiService.updateAccessToken()),
      600000
    );
  }

  public async getAccessToken(): Promise<TokenModel> {
    const tokenString = window.sessionStorage.getItem(ACCESS_TOKEN_KEY);
    if (!tokenString) {
      throw new Error('AccessToken does not exist');
    }
    const token: TokenModel = JSON.parse(tokenString);
    if (Date.now() - token.timestamp > 1080000) {
      this.saveAccessToken(await this.apiService.updateAccessToken());
      return this.getAccessToken();
    }
    return token;
  }

  public removeTokens() {
    clearTimeout(this.accessTokenUpdater);
    clearTimeout(this.refreshTokenUpdater);
    this.accessTokenUpdater = undefined;
    this.refreshTokenUpdater = undefined;
    window.sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}
