import {PrismaClient} from "@prisma/client";

export default class UserRepository {

    constructor(private prismaClient: PrismaClient) {
    }

    public async create(id: string, email: string, username: string, password: string){
            const account = await this.prismaClient.account.create({data: {ext_id: id, active: true, role: "USER"}});
            const user = await this.prismaClient.user.create({
                data: {
                    username: username,
                    email: email,
                    password: password,
                    account: {connect: {id: account.id}}
                }
            });
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