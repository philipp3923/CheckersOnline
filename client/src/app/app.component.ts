import {Component, OnInit} from '@angular/core';
import {StorageService} from "./_services/storage.service";
import {ApiService} from "./_services/api.service";
import {DataService} from "./_services/data.service";
import {SocketService} from "./_services/socket.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'client';

  constructor(private storageService: StorageService, private apiService: ApiService, private dataService: DataService, private socketService: SocketService) {
  }

  ngOnInit(): void {
    const refreshToken = this.storageService.getRefreshToken();

    if (refreshToken === null || Date.now() - refreshToken.creation > 2592000000) {
      this.storageService.signOut();
      this.apiService.guest()
      return;

    } else {
      this.apiService.updateRefreshToken().add(() => this.apiService.updateAccessToken().add(() => this.socketService.connect()));
      this.dataService.changeUser(this.storageService.getUser());
    }
  }
}
