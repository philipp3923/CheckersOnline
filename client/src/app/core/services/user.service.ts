import { Injectable } from '@angular/core';
import {TokenService} from "./token.service";
import {ApiService} from "./api.service";
import {UserModel} from "../../models/user.model";
import {SocketService} from "./socket.service";

//#TODO move USER_KEY to Constants File
const USER_KEY = "user";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private tokenService: TokenService, private apiService: ApiService, private socketService: SocketService) {
    this.auth().then(r => null);
  }

  private async auth(){
    try{
      await this.tokenService.saveRefreshToken(await this.apiService.updateRefreshToken());
      await this.tokenService.saveAccessToken(await this.apiService.updateAccessToken());
      this.socketService.connect((await this.tokenService.getAccessToken()).string);
    }catch{
      this.tokenService.removeTokens();
      this.logout();
      await this.guest();
    }
  }

  private logout(){
    this.tokenService.removeTokens();
    this.socketService.disconnect();
    window.localStorage.clear();
    window.sessionStorage.clear();
  }

  private save(user: UserModel){
    window.localStorage.removeItem(USER_KEY);
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): UserModel {
    const user = window.localStorage.getItem(USER_KEY);
    if (!user) {
      throw new Error("No users exists");
    }
    return JSON.parse(user);
  }

  private async guest(){
    const authResponse = await this.apiService.authGuest();
    console.log(authResponse);
    await this.tokenService.saveAccessToken(authResponse.accessToken);
    await this.tokenService.saveRefreshToken(authResponse.refreshToken);
    this.socketService.connect((await this.tokenService.getAccessToken()).string);
    this.save(authResponse.user);
  }
}
