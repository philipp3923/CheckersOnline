import {Component, Input, OnInit} from '@angular/core';
import {FriendsService} from "../../../core/services/friends.service";
import {SocketService} from "../../../core/services/socket.service";
import {UserService} from "../../../core/services/user.service";

@Component({
  selector: 'app-friend-action',
  templateUrl: './friend-action.component.html',
  styleUrls: ['./friend-action.component.css']
})
export class FriendActionComponent implements OnInit {

  @Input() other_id: string | undefined;
  public display: string;

  constructor(private userService: UserService, private friendService: FriendsService, private socketService: SocketService) {
    this.display = "";
  }

  ngOnInit(): void {
    if (typeof this.other_id === "undefined" || this.other_id === null) {
      setTimeout(() => this.ngOnInit(), 50);
      return;
    }

    if (!this.userService.isUser()) {
      this.display = "NO_USER";
      return;
    }
    if (this.userService.getUser().id === this.other_id) {
      this.display = "THIS_USER";
      return;
    }
    if (this.friendService.isFriend(this.other_id)) {
      this.display = "FRIENDS";
      return;
    }
    if (this.friendService.isOutgoing(this.other_id)) {
      this.display = "OUTGOING";
      return;
    }
    if (this.friendService.isIncoming(this.other_id)) {
      this.display = "INCOMING";
      return;
    }
    this.display = "NOT_RELATED";
  }

  public requestFriend() {
    this.socketService.requestFriend(this.other_id ?? "", (args) => {
    });
    setTimeout(() => this.ngOnInit(), 100);
  }

  public removeFriend() {
    this.socketService.deleteFriend(this.other_id ?? "", (args) => {
    });
    setTimeout(() => this.ngOnInit(), 100);
  }

  public acceptFriend() {
    this.socketService.acceptFriend(this.other_id ?? "", (args) => {
    });
    setTimeout(() => this.ngOnInit(), 100);
  }


}
