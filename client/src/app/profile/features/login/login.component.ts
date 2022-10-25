import {Component} from '@angular/core';
import {LoginRequest} from "../../models/login-request.model";
import {UserService} from "../../../shared/services/user.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  form: LoginRequest;

  constructor(private userService: UserService) {
    this.form = {user: "", password: ""};
  }

  //#TODO display REQUIRED in UI
  onSubmit() {
    if(this.form.user.length < 1 || this.form.password.length < 1){
      console.log("REQUIRED");
      return;
    }
    this.userService.login(this.form);

  }
}
