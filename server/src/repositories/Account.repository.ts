import {PrismaClient} from "@prisma/client";
import {Role} from "../services/Token.service";

export default class AccountRepository{

    constructor(private prismaClient: PrismaClient) {
    }

    public async create(id: string, role: Role){
        const account = await this.prismaClient.account.create({data: {ext_id: id, active: true, role: role}});
    }

    public async login(id: string){
        await this.prismaClient.account.update({data: {loginAt: new Date()},where : {ext_id: id}});
    }

}