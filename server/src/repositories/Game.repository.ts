import {PrismaClient} from "@prisma/client";
import Game, {GameType} from "../objects/Game";

export default class GameRepository{
    private readonly liveGames: Game[];

    constructor(private prismaClient: PrismaClient) {
        this.liveGames = [];
    }

    public async saveGame(white: string, black: string, id: string, type: GameType, time: number){
        //@ts-ignore
        await this.prismaClient.game.create({data: {ext_id: id, black : {connect: {ext_id: black}}, white : {connect: {ext_id: white}}, type : GameType[type], time_limit: time}});
    }



}