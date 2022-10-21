import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {LoginRequest} from "../../models/login-request.model";
import {AuthErrorModel} from "../../models/auth-error.model";
import {LoginService} from "../../services/login.service";
import {ErrorContainerComponent} from "../../../shared/features/error-container/error-container.component";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  form: LoginRequest;

  @ViewChild(ErrorContainerComponent) errorContainer : ErrorContainerComponent | undefined;

  constructor(private loginService: LoginService) {
    this.form = {user: "", password: ""};
  }

  onSubmit() {
    if(this.form.user.length < 1 || this.form.password.length < 1){
      this.errorContainer?.add(AuthErrorModel[AuthErrorModel.REQUIRED]);
      return;
    }
    this.loginService.login(this.form, (error) => {this.errorContainer?.add(AuthErrorModel[error])});

  }
}
