import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../../../core/services/api.service";
import {UserService} from "../../../core/services/user.service";

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


  constructor(private router: Router, private route: ActivatedRoute, private apiService: ApiService, private userService: UserService) {
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

  login() {
    if (!this.isLoginInputValid()) {
      return;
    }

    const username = this.passwordInput?.nativeElement.value ?? "";
    const password = this.passwordInput?.nativeElement.value ?? "";

    this.apiService.loginUser(username, password)
      .then((res) => this.userService.login(res.user, res.accessToken, res.refreshToken))
      .catch(err => console.log(err))
      .then(()=>this.router.navigate(["/profile"]));
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

  register() {
    console.log("TEST")
    if (!this.isRegisterInputValid()) {
      return
    }
    const username = this.passwordInput?.nativeElement.value ?? "";
    const email = this.emailInput?.nativeElement.value ?? "";
    const password = this.passwordInput?.nativeElement.value ?? "";

    this.apiService.registerUser(email, username, password)
      .catch((err) => console.log(err))
      .then(() => this.apiService.loginUser(username, password))
      .then((res) => this.userService.login(res.user, res.accessToken, res.refreshToken))
      .then(()=>this.router.navigate(["/profile"]));
  }

  ngOnInit(): void {
  }

}
