import {PrismaClient} from "@prisma/client";
import UserRepository from "./User.repository";

export default class FriendshipRepository {

    constructor(private prismaClient: PrismaClient, private userRepository: UserRepository) {
    }

    public async requestFriend(user_id_ext: string, friend_id_ext: string) {
        const user = await this.userRepository.getByAccountID(user_id_ext);
        const friend = await this.userRepository.getByAccountID(friend_id_ext);

        if (user === null || friend === null) {
            throw new Error("User does not exist");
        }

        if ((await this.getFriend(user.id, friend.id)).length > 0 || (await this.getFriend(friend.id, user.id)).length > 0) {
            throw new Error("Request already exists");
        }

        return await this.prismaClient.friend.create({
            data: {
                type: "REQUEST",
                id_user: user.id ?? 0,
                id_friend: friend.id ?? 0
            }
        });
    }

    public async acceptFriend(user_id_ext: string, friend_id_ext: string) {
        const user = await this.userRepository.getByAccountID(user_id_ext);
        const friend = await this.userRepository.getByAccountID(friend_id_ext);

        if (user === null || friend === null) {
            throw new Error("User does not exist");
        }

        if ((await this.getFriend(user.id, friend.id)).length > 0) {
            throw new Error("Cannot accept own request");
        }

        await this.prismaClient.friend.create({
            data: {
                type: "REQUEST",
                id_user: user.id ?? 0,
                id_friend: friend.id ?? 0
            }
        });

        return await this.prismaClient.friend.updateMany({
            data: {
                updatedAt: new Date(),
                type: "ACTIVE"
            },
            where: {
                OR: [
                    {AND: [{id_user: user.id}, {id_friend: friend.id}]},
                    {AND: [{id_user: friend.id}, {id_friend: user.id}]}
                ]
            }
        })
    }

    public async deleteFriend(user_id_ext: string, friend_id_ext: string) {
        const user = await this.userRepository.getByAccountID(user_id_ext);
        const friend = await this.userRepository.getByAccountID(friend_id_ext);

        if (user === null || friend === null) {
            throw new Error("User does not exist");
        }

        console.log(user);
        console.log(friend);

        await this.prismaClient.friend.deleteMany({
            where:
                {AND: [{id_user: user.id}, {id_friend: friend.id}]},
        });

        await this.prismaClient.friend.deleteMany({
            where:
                {AND: [{id_user: friend.id}, {id_friend: user.id}]}
        });


    }

    public async getFriends(user_id_ext: string) {
        const user = await this.userRepository.getByAccountID(user_id_ext);

        if (user === null) {
            throw new Error("User does not exist");
        }

        return await this.prismaClient.friend.findMany({
            where: {
                OR: [
                    {id_user: user.id},
                    {
                        AND: [
                            {id_friend: user.id},
                            {type: "REQUEST"}
                        ]
                    }
                ]
            },
            include: {
                user: true,
                friend: true
            }
        });
    }

    public async friendshipExists(user_id_ext: string, friend_id_ext: string) {
        const user = await this.userRepository.getByAccountID(user_id_ext);
        const friend = await this.userRepository.getByAccountID(friend_id_ext);

        if (user === null || friend === null) {
            return false;
        }

        return (await this.getFriend(user.id, friend.id)).length > 0 && (await this.getFriend(user.id, friend.id)).length > 0;
    }

    private async getFriend(user_id: number, friend_id: number) {
        return await this.prismaClient.friend.findMany({
            where: {AND: [{id_user: user_id}, {id_friend: friend_id}]}
        });
    }

}