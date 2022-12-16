import {Injectable} from '@angular/core';
import {TokenService} from "./token.service";
import {ApiService} from "./api.service";
import {UserModel} from "../../models/user.model";
import {SocketService} from "./socket.service";
import {TokenModel} from "../../models/token.model";
import {FriendsService} from "./friends.service";

//#TODO move USER_KEY to Constants File
const USER_KEY = "user";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private tokenService: TokenService, private apiService: ApiService, private socketService: SocketService, private friendsService: FriendsService) {
    this.auth().then(r => null);
    this.socketService.addWelcomeListener((args) => this.welcome(args));
  }

  private welcome(args: any){
    if(this.isUser()){
      this.friendsService.init(this.getUser().id, args.friends);
    }
  }

  public isUser() {
    try {
      return this.getUser().role === "USER";
    } catch (e) {
      return false;
    }
  }

  public getUser(): UserModel {
    const user = window.localStorage.getItem(USER_KEY);
    if (!user) {
      throw new Error("No users exists");
    }
    return JSON.parse(user);
  }

  public async login(user: UserModel, accessToken: TokenModel, refreshToken: TokenModel) {
    await this.logout();
    this.socketService.clearPendingEmits();
    this.socketService.connect(accessToken.string);
    await this.tokenService.saveAccessToken(accessToken);
    await this.tokenService.saveRefreshToken(refreshToken);
    this.save(user);
  }

  private async auth() {
    try {
      await this.tokenService.saveRefreshToken(await this.apiService.updateRefreshToken());
      await this.tokenService.saveAccessToken(await this.apiService.updateAccessToken());
      this.socketService.connect((await this.tokenService.getAccessToken()).string);
    } catch {
      window.localStorage.clear();
      window.sessionStorage.clear();
      this.tokenService.removeTokens();
      await this.logout();
      await this.guest();
    }
  }

  public async logout() {
    if(this.isUser()){
      await this.apiService.logoutUser();
    }
    this.socketService.disconnect();
    this.tokenService.removeTokens();
    this.friendsService.reset();
    window.localStorage.clear();
    window.sessionStorage.clear();
  }

  private save(user: UserModel) {
    window.localStorage.removeItem(USER_KEY);
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public async guest() {
    const authResponse = await this.apiService.authGuest();
    //console.log(authResponse);
    await this.tokenService.saveAccessToken(authResponse.accessToken);
    await this.tokenService.saveRefreshToken(authResponse.refreshToken);
    this.socketService.connect((await this.tokenService.getAccessToken()).string);
    this.save(authResponse.user);
  }

  public async getInfo(): Promise<{id: string, username: string, email: string}>{
    const id = this.getUser().id;
    const publicInfo = await this.apiService.getUser(id);
    const email = await this.apiService.getUserEmail(id);
    return {id: id, username: publicInfo.username, email: email.email};
  }

  public async changePassword(oldPassword: string, newPassword: string): Promise<boolean>{
    const id = this.getUser().id;
    try{
      await this.apiService.changePassword(id, oldPassword, newPassword);
      return true;
    }
    catch (e) {
      return false;
    }
  }

  public async changeUsername(username: string): Promise<boolean>{
    const id = this.getUser().id;
    try{
      await this.apiService.changeUsername(id, username);
      return true;
    }
    catch (e) {
      //console.log(e);
      return false;
    }
  }

  public async changeEmail(email: string): Promise<boolean>{
    const id = this.getUser().id;
    try{
      await this.apiService.changeEmail(id, email);
      return true;
    }
    catch (e) {
      //console.log(e);
      return false;
    }
  }

  public async deleteUser(password: string){
    const id = this.getUser().id;
    try{
      await this.apiService.deleteUser(id, password);
      await this.logout();
      await this.guest();
      return true;
    }
    catch (e) {
      //console.log(e);
      return false;
    }
  }
}
