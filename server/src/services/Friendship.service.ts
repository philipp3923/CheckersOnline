import FriendshipRepository from "../repositories/Friendship.repository";
import SocketService from "./Socket.service";
import AccountRepository from "../repositories/Account.repository";

interface Friendship {
    user: string;
    friend: string;
    status: "ACTIVE" | "REQUEST" | "DELETED";
    online?: boolean;
}

export default class FriendshipService {
    constructor(
        private friendshipRepository: FriendshipRepository,
        private accountRepository: AccountRepository,
        private socketService: SocketService
    ) {
    }

    public async request(user_id: string, friend_id: string) {
        if (user_id === friend_id) {
            throw new Error("A User cannot be a friend of himself");
        }

        await this.friendshipRepository.requestFriend(user_id, friend_id);
        const friendship: Friendship = {
            user: user_id,
            friend: friend_id,
            status: "REQUEST",
        };

        this.socketService.sendTo(user_id, "friendRequest", friendship);
        this.socketService.sendTo(friend_id, "friendRequest", friendship);
    }

    public async accept(user_id: string, friend_id: string) {
        if (user_id === friend_id) {
            throw new Error("A User cannot be a friend of himself");
        }

        if (await this.exists(user_id, friend_id)) {
            throw new Error("Cannot deny active friendship");
        }

        await this.friendshipRepository.acceptFriend(user_id, friend_id);
        const friendship_user: Friendship = {
            user: user_id,
            friend: friend_id,
            status: "ACTIVE",
            online: this.socketService.isOnline(friend_id)
        };
        const friendship_friend: Friendship = {
            user: friend_id,
            friend: user_id,
            status: "ACTIVE",
            online: this.socketService.isOnline(user_id)
        };

        this.socketService.sendTo(user_id, "friendAccept", friendship_user);
        this.socketService.sendTo(friend_id, "friendAccept", friendship_friend);
    }

    public async delete(user_id: string, friend_id: string) {
        if (user_id === friend_id) {
            throw new Error("A User cannot be a friend of himself");
        }

        await this.friendshipRepository.deleteFriend(user_id, friend_id);
        const friendship: Friendship = {
            user: user_id,
            friend: friend_id,
            status: "DELETED",
        };

        this.socketService.sendTo(user_id, "friendDelete", friendship);
        this.socketService.sendTo(friend_id, "friendDelete", friendship);
    }

    public async getFriends(user_id: string): Promise<Friendship[]> {
        const friends = await this.friendshipRepository.getFriends(user_id);

        return await Promise.all(
            friends.map(async (friendship) => {
                const user_acc = await this.accountRepository.getByID(
                    friendship.user.id_account
                );
                const friend_acc = await this.accountRepository.getByID(
                    friendship.friend.id_account
                );

                if (user_acc === null || friend_acc === null) {
                    throw new Error("User has no account");
                }

                const friend_id = user_acc.ext_id === user_id ? friend_acc.ext_id : user_acc.ext_id;

                if(friendship.type === "ACTIVE"){
                    return {
                        user: user_acc.ext_id,
                        friend: friend_acc.ext_id,
                        status: <any>friendship.type,
                        online: this.socketService.isOnline(friend_id)
                    };
                }

                return {
                    user: user_acc.ext_id,
                    friend: friend_acc.ext_id,
                    status: <any>friendship.type,
                };
            })
        );
    }

    public async exists(user_id: string, friend_id: string) {
        return await this.friendshipRepository.friendshipExists(user_id, friend_id);
    }
}
