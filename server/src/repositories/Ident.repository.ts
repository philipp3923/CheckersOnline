import {PrismaClient} from "@prisma/client";
import prisma from "../db/client";

export default class IdentRepository{

    constructor(private prismaClient: PrismaClient) {}

    public async generateUserID(){
        let id: string = "GUEST-" +this.generateID();

        while (await prisma.account.findUnique({where: {ext_id: id}}) !== null) {
            id = "GUEST-" +this.generateID();
        }

        return id;
    }

    public async generateGuestID(){
        let id: string = "USER-" +this.generateID();

        while (await prisma.account.findUnique({where: {ext_id: id}}) !== null) {
            id = "USER-" +this.generateID();
        }

        return id;
    }

    public async generateGameID(){
        let id: string = "GAME-" +this.generateID();

        while (await prisma.game.findUnique({where: {ext_id: id}}) !== null) {
            id = "GAME-" +this.generateID();
        }

        return id;
    }

    private generateID(){
        return `${Date.now().toString(36)}${this.generatePad(this.generateRandom(0, 1679616).toString(36), 8)}`.toUpperCase();
    }

    private generatePad(word: string, size: number) {
        while (word.length < size) word = "0" + word;
        return word;
    }

    private generateRandom(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

}