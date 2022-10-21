import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'client';

  constructor() {
  }

  ngOnInit(): void {
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
