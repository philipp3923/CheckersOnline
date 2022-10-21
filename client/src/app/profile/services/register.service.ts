import { Injectable } from '@angular/core';
import {RegisterRequest} from "../models/register-request.model";
import {AuthErrorModel} from "../models/auth-error.model";
import {AuthResponse} from "../models/auth-response.model";
import {ApiService} from "../../shared/services/api.service";

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private apiService: ApiService) { }

  register(registerRequest: RegisterRequest, callback: (error: AuthErrorModel)=> void){
    this.apiService.post<AuthResponse>("auth/register",registerRequest).subscribe({
      next: (res) => {console.log(res)},
      error: (res) => {
        console.log(res);
        switch (res.status){
          case 409:
            callback(AuthErrorModel.TAKEN);
            break
        }
      }
    });
  }
}
