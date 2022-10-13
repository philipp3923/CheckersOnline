import {PrismaClient} from "@prisma/client";
import {Role} from "../services/Token.service";
import AccountRepository from "./AccountRepository";

export default class UserRepository {

    constructor(private prismaClient: PrismaClient, private accountRepository: AccountRepository) {
    }

    public async create(id: string, email: string, username: string, password: string){
            await this.accountRepository.create(id, Role.GUEST);
            const user = await this.prismaClient.user.create({
                data: {
                    username: username,
                    email: email,
                    password: password,
                    account: {connect: {ext_id: id}}
                }
            });
    }

    public async login(id: string){
        this.accountRepository.login(id);
    }

    public async getByUsername(username: string): Promise<string | null>{
        const user =  await this.prismaClient.user.findUnique({where: {username: username}, include: {account: true}});
        return user ? user.account.ext_id : null;
    }

    public async getByEmail(email: string): Promise<string | null>{
        const user =  await this.prismaClient.user.findUnique({where: {email: email}, include: {account: true}});
        return user ? user.account.ext_id : null;
    }

    public async getPassword(name: string): Promise<string | null>{
        let user =  await this.prismaClient.user.findFirst({where: {OR: [{email: name}, {username: name}]}});
        return user? user.password: null;
    }

    public async getByEmailOrUsername(name: string) {
        let user =  await this.prismaClient.user.findFirst({where: {OR: [{email: name}, {username: name}]}, include: {account: true}});
        return user? user.account.ext_id: null;
    }


}