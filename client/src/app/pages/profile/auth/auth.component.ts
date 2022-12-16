import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../../../core/services/api.service";
import {UserService} from "../../../core/services/user.service";
import {MessageService, MessageType} from "../../../core/services/message.service";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  public isLogin: boolean;

  @ViewChild("password_input") passwordInput: ElementRef<HTMLInputElement> | undefined;
  @ViewChild("email_input") emailInput: ElementRef<HTMLInputElement> | undefined;
  @ViewChild("name_input") nameInput: ElementRef<HTMLInputElement> | undefined;


  constructor(private router: Router, private route: ActivatedRoute, private apiService: ApiService, private userService: UserService, private messageService: MessageService) {
    this.isLogin = true;
    this.route.url.subscribe((data) => this.onRouteChange(data[0].path));
  }

  onRouteChange(path: string) {
    if (path === "login") {
      this.isLogin = true;
      return;
    }
    if (path === "register") {
      this.isLogin = false;
      return;
    }
  }

  async login() {
    if (!this.isLoginInputValid()) {
      this.messageService.addMessage(MessageType.WARNING, "Please fill out all fields.");
      return;
    }

    const username = this.nameInput?.nativeElement.value ?? "";
    const password = this.passwordInput?.nativeElement.value ?? "";

    try{
      const res = await this.apiService.loginUser(username, password);
      await this.userService.login(res.user, res.accessToken, res.refreshToken);
      await this.router.navigate(["/"]);
    } catch(e) {
      this.messageService.addMessage(MessageType.ERROR, "Wrong username or password.");
    }
  }

  isLoginInputValid() {
    return (this.passwordInput?.nativeElement.value.length ?? 0 > 0) &&
      (this.nameInput?.nativeElement.value.length ?? 0 > 0);
  }

  isRegisterInputValid() {
    return (this.passwordInput?.nativeElement.value.length ?? 0 > 0) &&
      (this.nameInput?.nativeElement.value.length ?? 0 > 0) &&
      (this.emailInput?.nativeElement.value.length ?? 0 > 0);
  }

  async register() {
    if (!this.isRegisterInputValid()) {
      this.messageService.addMessage(MessageType.WARNING, "Please fill out all fields.");
      return
    }
    const username = this.nameInput?.nativeElement.value ?? "";
    const email = this.emailInput?.nativeElement.value ?? "";
    const password = this.passwordInput?.nativeElement.value ?? "";

    try{
      const reg_res = await this.apiService.registerUser(email, username, password);
      this.login();
    }catch (e){
      this.messageService.addMessage(MessageType.ERROR, "Username or E-Mail is already in use.");
    }
  }

  ngOnInit(): void {
  }

}
