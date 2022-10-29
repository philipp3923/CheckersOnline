import {PrismaClient} from "@prisma/client";
import {Role} from "../services/Token.service";
import AccountRepository from "./Account.repository";

export default class UserRepository {

    constructor(private prismaClient: PrismaClient, private accountRepository: AccountRepository) {
    }

    public async create(id: string, email: string, username: string, password: string){
            await this.accountRepository.create(id, Role.USER);
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
        await this.accountRepository.login(id);
    }

    public async getByUsername(username: string): Promise<string | null>{
        const user =  await this.prismaClient.user.findUnique({where: {username: username}, include: {account: true}});
        return user ? user.account.ext_id : null;
    }

    public async getByAccountID(id: string){
        const account = await this.prismaClient.account.findUnique({
            where: {ext_id: id},
            include: {user: true}
        });
        return account?.user ?? null;
    }

    public async getByEmail(email: string): Promise<string | null>{
        const user =  await this.prismaClient.user.findUnique({where: {email: email}, include: {account: true}});
        return user ? user.account.ext_id : null;
    }

    public async getPassword(id: string): Promise<string | null>{
        let account = await this.prismaClient.account.findUnique({where: {ext_id: id}, include: {user: true}});
        return account?.user?.password ?? null;
    }

    public async getByEmailOrUsername(name: string) {
        let user =  await this.prismaClient.user.findFirst({where: {OR: [{email: name}, {username: name}]}, include: {account: true}});
        return user? user.account.ext_id: null;
    }


}