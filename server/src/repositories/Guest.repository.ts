import {PrismaClient} from "@prisma/client";
import {Role} from "../services/Token.service";
import AccountRepository from "./AccountRepository";

export default class GuestRepository{

    constructor(private prismaClient: PrismaClient, private accountRepository : AccountRepository) {
    }

    public async create(id: string){
        await this.accountRepository.create(id, Role.GUEST);
        await this.accountRepository.login(id);
    }



}