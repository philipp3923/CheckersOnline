import {Component, OnInit} from '@angular/core';
import {StorageService} from "./_services/storage.service";
import {ApiService} from "./_services/api.service";
import {DataService} from "./_services/data.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'client';

  constructor(private storageService: StorageService, private apiService: ApiService, private dataService: DataService) {
  }

  ngOnInit(): void {
    const refreshToken = this.storageService.getRefreshToken();

    if (refreshToken === null) {
      return;
    }

    if (Date.now() - refreshToken.creation > 2592000000) {
      this.storageService.signOut();
      return;
    } else {
      // INFO: updateRefreshToken automatically updates accessToken after completion. Prevents error due to async call of two functions -> trys to generate new accesstoken with invalid refreshtoken
      this.apiService.updateRefreshToken();
      this.dataService.changeUser(this.storageService.getUser());
    }
  }
}
