import {Injectable} from '@angular/core';
import FriendshipModel from "../../models/friendship.model";
import {BehaviorSubject} from "rxjs";
import UserInfoModel from "../../models/user-info.model";
import {ApiService} from "./api.service";
import {SocketService} from "./socket.service";
import {MessageService, MessageType} from "./message.service";

@Injectable({
  providedIn: 'root'
})

export class FriendsService {

  private onlineFriends: BehaviorSubject<UserInfoModel[]>;
  private offlineFriends: BehaviorSubject<UserInfoModel[]>;
  private outgoingRequests: BehaviorSubject<UserInfoModel[]>;
  private incomingRequests: BehaviorSubject<UserInfoModel[]>;
  private userID: string;

  constructor(private apiService: ApiService, private socketService: SocketService, private messageService: MessageService) {
    this.userID = "";
    this.onlineFriends = new BehaviorSubject<UserInfoModel[]>([]);
    this.offlineFriends = new BehaviorSubject<UserInfoModel[]>([]);
    this.outgoingRequests = new BehaviorSubject<UserInfoModel[]>([]);
    this.incomingRequests = new BehaviorSubject<UserInfoModel[]>([]);

    this.socketService.addFriendRequestListener((friendship) => this.updateRequestFriend(friendship));
    this.socketService.addFriendAcceptListener((friendship) => this.updateAcceptFriend(friendship));
    this.socketService.addFriendDeleteListener((friendship) => this.updateDeleteFriend(friendship));

    this.socketService.addFriendOnlineListener((id) => this.setFriendOnline(id));
    this.socketService.addFriendOfflineListener((id) => this.setFriendOffline(id));
  }

  public reset() {
    this.userID = "";
    this.onlineFriends.next([]);
    this.offlineFriends.next([]);
    this.outgoingRequests.next([]);
    this.incomingRequests.next([]);
  }

  public getOnlineFriendsObserver() {
    return this.onlineFriends.asObservable();
  }

  public getOfflineFriendsObserver() {
    return this.offlineFriends.asObservable();
  }

  public getOutgoingRequestsObserver() {
    return this.outgoingRequests.asObservable();
  }

  public getIncomingRequestsObserver() {
    return this.incomingRequests.asObservable();
  }

  public getOnlineFriends() {
    return this.onlineFriends.value;
  }

  public getOfflineFriends() {
    return this.offlineFriends.value;
  }

  public getOutgoingRequests() {
    return this.outgoingRequests.value;
  }

  public getIncomingRequests() {
    return this.incomingRequests.value;
  }

  public deleteFriend(id: string) {
    this.socketService.deleteFriend(id, (args) => {
      if (!args.success) {
        console.log(args);
      } else {
        this.messageService.addMessage(MessageType.INFO, "Deleted friend.");
      }
    });
  }

  public isFriend(id: string) {
    const onlineIndex = this.onlineFriends.value.map((f) => f.id).indexOf(id);
    const offlineIndex = this.offlineFriends.value.map((f) => f.id).indexOf(id);
    return onlineIndex >= 0 || offlineIndex >= 0;
  }

  public isIncoming(id: string) {
    console.log(this.incomingRequests.value);
    return this.incomingRequests.value.map((f) => f.id).indexOf(id) >= 0;
  }

  public isOutgoing(id: string) {
    return this.outgoingRequests.value.map((f) => f.id).indexOf(id) >= 0;
  }

  public acceptFriend(id: string) {
    console.log(id);
    this.socketService.acceptFriend(id, (args) => {
      if (!args.success) {
        console.log(args);
      }

    });
  }

  public init(userID: string, friendships: FriendshipModel[]) {
    this.userID = userID;
    const offlineFriends: UserInfoModel[] = [];
    const onlineFriends: UserInfoModel[] = [];
    const incomingRequests: UserInfoModel[] = [];
    const outgoingRequests: UserInfoModel[] = [];
    for (let friendship of friendships) {
      if (friendship.status === "ACTIVE") {
        this.getFriendInfo(friendship.friend).then((info) => {
          if (friendship.online) {
            onlineFriends.push(info);
          } else {
            offlineFriends.push(info);
          }
        })
        continue;
      }
      if (friendship.status === "REQUEST") {
        if (friendship.user === this.userID) {
          this.getFriendInfo(friendship.friend).then((info) => {
            outgoingRequests.push(info);
          })
          continue;
        }
        if (friendship.friend === this.userID) {
          this.getFriendInfo(friendship.user).then((info) => {
            incomingRequests.push(info);
          })
          continue;
        }
      }
      console.log("ERROR IN INIT");
      console.log(friendship);
    }
    this.offlineFriends.next(offlineFriends);
    this.onlineFriends.next(onlineFriends);
    this.outgoingRequests.next(outgoingRequests);
    this.incomingRequests.next(incomingRequests);
  }

  private async setFriendOnline(id: string) {
    const newFriend = await this.getFriendInfo(id);

    const newOnlineFriends = this.getOnlineFriends();
    newOnlineFriends.push(newFriend);
    this.onlineFriends.next(newOnlineFriends);

    const newOfflineFriends = this.removeFriend(this.offlineFriends.value, id);
    if (newOfflineFriends) {
      this.offlineFriends.next(newOfflineFriends);
    }
  }

  private async setFriendOffline(id: string) {
    const newFriend = await this.getFriendInfo(id);

    const newOfflineFriends = this.getOfflineFriends();
    newOfflineFriends.push(newFriend);
    this.offlineFriends.next(newOfflineFriends);

    const newOnlineFriends = this.removeFriend(this.onlineFriends.value, id);
    if (newOnlineFriends) {
      this.onlineFriends.next(newOnlineFriends);
    }
  }

  private async updateAcceptFriend(friendship: FriendshipModel) {
    let newFriend = friendship.user === this.userID ? await this.getFriendInfo(friendship.friend) : await this.getFriendInfo(friendship.user);

    const newIncomingRequests = this.removeFriend(this.incomingRequests.value, newFriend.id);
    if (newIncomingRequests !== null) {
      this.incomingRequests.next(newIncomingRequests);
      this.messageService.addMessage(MessageType.INFO, "You and " + newFriend.username + " are now friends.");
    }

    const newOutgoingRequests = this.removeFriend(this.outgoingRequests.value, newFriend.id);
    if (newOutgoingRequests !== null) {
      this.outgoingRequests.next(newOutgoingRequests);
      this.messageService.addMessage(MessageType.INFO, newFriend.username + " accepted your friend request.");
    }

    if (friendship.online) {
      const newOnlineFriends = this.getOnlineFriends();
      newOnlineFriends.push(newFriend);
      this.onlineFriends.next(newOnlineFriends);
    } else {
      const newOfflineFriends = this.getOfflineFriends();
      newOfflineFriends.push(newFriend);
      this.offlineFriends.next(newOfflineFriends);
    }

  }

  private updateDeleteFriend(friendship: FriendshipModel) {
    const friend = friendship.user === this.userID ? friendship.friend : friendship.user;

    const newOnlineFriends = this.removeFriend(this.onlineFriends.value, friend);
    const newOfflineFriends = this.removeFriend(this.offlineFriends.value, friend);
    const newIncomingRequests = this.removeFriend(this.incomingRequests.value, friend);
    const newOutgoingRequests = this.removeFriend(this.outgoingRequests.value, friend);

    if (newOnlineFriends) {
      this.onlineFriends.next(newOnlineFriends);
    }
    if (newOfflineFriends) {
      this.offlineFriends.next(newOfflineFriends);
    }
    if (newIncomingRequests) {
      this.incomingRequests.next(newIncomingRequests);
    }
    if (newOutgoingRequests) {
      this.outgoingRequests.next(newOutgoingRequests);
    }
  }

  private removeFriend(array: UserInfoModel[], id: string) {
    const index = array.map((f) => f.id).indexOf(id);
    if (index > -1) {
      array.splice(index, 1);
      return array;
    }
    return null;
  }

  private async updateRequestFriend(friendship: FriendshipModel) {
    if (friendship.user === this.userID) {
      const outgoingRequests = this.getOutgoingRequests();
      const info = await this.getFriendInfo(friendship.friend);
      outgoingRequests.push(info);
      this.outgoingRequests.next(outgoingRequests);
      this.messageService.addMessage(MessageType.INFO, "You sent a friend request to " + info.username + ".");
      return;
    }
    if (friendship.friend === this.userID) {
      const incomingRequests = this.getIncomingRequests();
      const info = await this.getFriendInfo(friendship.user);
      incomingRequests.push(info);
      this.incomingRequests.next(incomingRequests);
      this.messageService.addMessage(MessageType.INFO, info.username + " sent you a friend request.");
      return;
    }
    console.log("ERROR IN REQUEST FRIEND");
    console.log(friendship);
  }

  private async getFriendInfo(id: string) {
    const info = await this.apiService.getUser(id);
    return info;
  }
}
