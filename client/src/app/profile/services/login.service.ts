import {Injectable} from '@angular/core';
import {LoginRequest} from "../models/login-request.model";
import {ApiService} from "../../shared/services/api.service";
import {AuthResponse} from "../models/auth-response.model";
import {AuthErrorModel} from "../models/auth-error.model";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private apiService: ApiService) { }

  login(loginRequest: LoginRequest, callback: (error: AuthErrorModel)=> void){
    this.apiService.post<AuthResponse>("auth/login", loginRequest).subscribe({
      next: (res) => {console.log(res)},
      error: (res) => {
        console.log(res);
        switch (res.status){
          case 409:
            callback(AuthErrorModel.INVALID);
            break
        }
      }
    });
  }

}
