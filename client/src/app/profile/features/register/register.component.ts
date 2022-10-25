import {Component} from '@angular/core';
import {RegisterRequest} from "../../models/register-request.model";
import {UserService} from "../../../shared/services/user.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent{
  form: RegisterRequest;


  constructor(private userService: UserService) {
    this.form = {username: "", email: "", password: ""};
  }

  //#TODO show if username/ email already taken
  //#TODO display REQUIRED in UI
  onSubmit() {
    if(this.form.email.length < 1 ||  this.form.username.length < 1|| this.form.password.length < 1){
      console.log("REQUIRED");
      return;
    }
    this.userService.register(this.form);
  }

}
