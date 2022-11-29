import {Component, OnInit} from '@angular/core';
import {ApiService} from "./shared/services/api.service";
import {TokenService} from "./shared/services/token.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'client-old';

  constructor(private apiService: ApiService, private tokenService: TokenService) {
  }

  ngOnInit(): void {
    this.apiService.insertTokenGetters(() => {
      return this.tokenService.getRefreshToken();
    }, () => {
      return this.tokenService.getAccessToken();
    });
    /*
    const refreshToken = this.storageService.getRefreshToken();

    if (refreshToken === null || Date.now() - refreshToken.creation > 2592000000) {
      this.storageService.signOut();
      this.apiService.guest()
      return;

    } else {
      this.apiService.updateRefreshToken().add(() => this.apiService.updateAccessToken().add(() => this.socketService.connect()));
      this.dataService.changeUser(this.storageService.getUser());
    }*/
  }
}
