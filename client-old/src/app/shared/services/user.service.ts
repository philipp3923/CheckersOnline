import { Injectable } from '@angular/core';
import {UserModel} from "../models/user.model";
import {TokenService} from "./token.service";
import {ApiService, AuthType} from "./api.service";
import {AuthResponse} from "../../profile/models/auth-response.model";
import {LoginRequest} from "../../profile/models/login-request.model";
import {RegisterRequest} from "../../profile/models/register-request.model";

const USER_KEY = "user";

@Injectable({
  providedIn: 'root'
})
export class UserService {


  constructor(private tokenService: TokenService, private apiService: ApiService) {
    try{
      const user = this.getUser();
      this.tokenService.updateRefreshToken();
      this.tokenService.updateAccessToken();
    }catch{
      this.logout();
      this.guest();
    }
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

  logout(){
    window.localStorage.clear();
    window.sessionStorage.clear();
  }

  public login(loginRequest: LoginRequest){
    this.apiService.post<AuthResponse>(AuthType.NONE, "auth/login", loginRequest).subscribe({
      next: (res) => {
        this.tokenService.saveRefreshToken(res.refreshToken);
        this.tokenService.saveAccessToken(res.accessToken);
        this.save(res.user);
      },
      error: (res) => {
        console.log(res)
      }
    });
  }

  register(registerRequest: RegisterRequest){
    this.apiService.post<AuthResponse>(AuthType.NONE, "auth/register",registerRequest).subscribe({
      next: (res) => {
        console.log("REGISTER");
        console.log(res);
      },
      error: (res) => {
        console.log(res)
      }
    });
  }

  guest(){
    this.apiService.post<AuthResponse>(AuthType.NONE, "auth/guest").subscribe({
      next: (res) => {
        this.tokenService.saveRefreshToken(res.refreshToken);
        this.tokenService.saveAccessToken(res.accessToken);
        this.save(res.user);
      },
      error: (res) => {
        console.log(res)
      }
    });
  }

}
