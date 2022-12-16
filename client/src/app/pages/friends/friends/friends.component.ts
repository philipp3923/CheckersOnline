import {Component, OnInit} from '@angular/core';
import {FriendsService} from "../../../core/services/friends.service";
import UserInfoModel from "../../../models/user-info.model";

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {
  public onlineFriends: UserInfoModel[];
  public offlineFriends: UserInfoModel[];
  public outgoingRequests: UserInfoModel[];
  public incomingRequests: UserInfoModel[];

  constructor(public friendsService: FriendsService) {
    this.onlineFriends = this.friendsService.getOnlineFriends();
    this.offlineFriends = this.friendsService.getOfflineFriends();
    this.outgoingRequests = this.friendsService.getOutgoingRequests();
    this.incomingRequests = this.friendsService.getIncomingRequests();

    this.friendsService.getOnlineFriendsObserver().subscribe((value) => {
      this.onlineFriends = value;
    });
    this.friendsService.getOfflineFriendsObserver().subscribe((value) => {
      this.offlineFriends = value;
    });
    this.friendsService.getOutgoingRequestsObserver().subscribe((value) => {
      this.outgoingRequests = value;
    });
    this.friendsService.getIncomingRequestsObserver().subscribe((value) => {
      this.incomingRequests = value;
    });
  }

  ngOnInit(): void {
  }

}
