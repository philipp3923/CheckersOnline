import {Component, ViewChild} from '@angular/core';
import {AuthErrorModel} from "../../models/auth-error.model";
import {LoginService} from "../../services/login.service";
import {RegisterService} from "../../services/register.service";
import {RegisterRequest} from "../../models/register-request.model";
import {ErrorContainerComponent} from "../../../shared/features/error-container/error-container.component";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent{
  form: RegisterRequest;

  @ViewChild(ErrorContainerComponent) errorContainer : ErrorContainerComponent | undefined;

  constructor(private registerService: RegisterService) {
    this.form = {username: "", email: "", password: ""};
  }

  private setError(error: AuthErrorModel){
  }

  onSubmit() {
    if(this.form.email.length < 1 ||  this.form.username.length < 1|| this.form.password.length < 1){
      this.errorContainer?.add(AuthErrorModel[AuthErrorModel.REQUIRED]);
      return;
    }
    this.registerService.register(this.form,(error) => {this.errorContainer?.add(AuthErrorModel[error])});
  }

}
