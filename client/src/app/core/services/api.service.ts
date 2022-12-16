import { Injectable } from '@angular/core';
import { TokenModel } from '../../models/token.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { AuthResponse } from '../../models/auth-response.model';
import UserInfoModel from '../../models/user-info.model';
import GameModel from '../../models/game.model';

const API = '/api/';

enum AuthType {
  NONE,
  ACCESS,
  REFRESH,
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private getRefreshToken: () => Promise<TokenModel>;
  private getAccessToken: () => Promise<TokenModel>;

  constructor(private http: HttpClient) {
    this.getAccessToken = () => {
      throw new Error('No Method provided');
    };
    this.getRefreshToken = () => {
      throw new Error('No Method provided');
    };
  }

  public setGetTokens(
    getRefreshToken: () => Promise<TokenModel>,
    getAccessToken: () => Promise<TokenModel>
  ) {
    this.getAccessToken = getAccessToken;
    this.getRefreshToken = getRefreshToken;
  }

  public async updateAccessToken(): Promise<TokenModel> {
    return await this.post<TokenModel>(
      await this.authTypeRefresh(),
      'auth/token/access',
      null
    );
  }

  public async updateRefreshToken(): Promise<TokenModel> {
    return await this.post<TokenModel>(
      await this.authTypeRefresh(),
      'auth/token/refresh',
      null
    );
  }

  public async changeUsername(user_id: string, username: string) {
    return await this.patch(
      await this.authTypeAccess(),
      `/user/${user_id}/username`,
      { username: username }
    );
  }

  public async changeEmail(user_id: string, email: string) {
    return await this.patch(
      await this.authTypeAccess(),
      `/user/${user_id}/email`,
      { email: email }
    );
  }

  public async changePassword(
    user_id: string,
    password_old: string,
    password_new: string
  ) {
    return await this.patch(
      await this.authTypeAccess(),
      `/user/${user_id}/password`,
      { password_old: password_old, password_new: password_new }
    );
  }

  public async getUser(user_id: string) {
    return await this.get<UserInfoModel>(
      await this.authTypeNone(),
      `user/${user_id}`
    );
  }

  public async getUserEmail(user_id: string) {
    return await this.get<{ email: string }>(
      await this.authTypeAccess(),
      `user/${user_id}/email`
    );
  }

  public async loginUser(username: string, password: string) {
    return await this.post<AuthResponse>(
      await this.authTypeNone(),
      'auth/login',
      { username: username, password: password }
    );
  }

  public async logoutUser() {
    return await this.post(await this.authTypeRefresh(), 'auth/logout');
  }

  public async registerUser(email: string, username: string, password: string) {
    return await this.post(await this.authTypeNone(), 'auth/register', {
      email: email,
      username: username,
      password: password,
    });
  }

  public async deleteUser(user_id: string, password: string) {
    return await this.delete(
      await this.authTypeAccess(),
      `user/${user_id}?password=${password}`
    );
  }

  public async findUserByUsername(username: string) {
    return await this.get<{ user: UserInfoModel[] }>(
      await this.authTypeAccess(),
      `user?username=${username}`
    );
  }

  public async findUserByEmail(email: string) {
    return await this.get<{ user: UserInfoModel[] }>(
      await this.authTypeAccess(),
      `user?email=${email}`
    );
  }

  public async getFinishedGame(id: string) {
    return await this.get<GameModel>(await this.authTypeNone(), `/game/${id}`);
  }

  public async getFinishedGamesOfUser(id: string) {
    return await this.get<GameModel[]>(
      await this.authTypeNone(),
      `/user/${id}/games`
    );
  }

  public async authGuest(): Promise<AuthResponse> {
    return await this.post<AuthResponse>(
      await this.authTypeNone(),
      'auth/guest',
      null
    );
  }

  private async authTypeNone() {
    return new HttpHeaders({ 'Content-Type': 'application/json' });
  }

  private async authTypeAccess() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + (await this.getAccessToken()).string,
    });
  }

  private async authTypeRefresh() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + (await this.getRefreshToken()).string,
    });
  }

  private async post<T>(
    headers: HttpHeaders,
    url: string,
    body?: any
  ): Promise<T> {
    return firstValueFrom(
      this.http.post<T>(API + url, body, { headers: headers }).pipe(
        catchError((err: any) => {
          //console.log('In Service:', err);
          return throwError(err);
        })
      )
    );
  }

  private async patch<T>(
    headers: HttpHeaders,
    url: string,
    body?: any
  ): Promise<T> {
    return firstValueFrom(
      this.http.patch<T>(API + url, body, { headers: headers }).pipe(
        catchError((err: any) => {
          //console.log('In Service:', err);
          return throwError(err);
        })
      )
    );
  }

  private async delete<T>(headers: HttpHeaders, url: string): Promise<T> {
    return firstValueFrom(
      this.http.delete<T>(API + url, { headers: headers }).pipe(
        catchError((err: any) => {
          //console.log('In Service:', err);
          return throwError(err);
        })
      )
    );
  }

  private async get<T>(headers: HttpHeaders, url: string): Promise<T> {
    return firstValueFrom(
      this.http.get<T>(API + url, { headers: headers }).pipe(
        catchError((err: any) => {
          //console.log('In Service:', err);
          return throwError(err);
        })
      )
    );
  }
}
