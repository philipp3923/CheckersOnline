import {PrismaClient} from "@prisma/client";
import {Color, Location} from "../models/Board.model";
import {GameType} from "../models/Game.model";

export default class GameRepository{

    constructor(private prismaClient: PrismaClient) {
    }

    public async saveGame(white: string, black: string, id: string, type: GameType, time: number, increment: number, timeType: string){
        //@ts-ignore
        await this.prismaClient.game.create({data: {ext_id: id, black : {connect: {ext_id: black}}, white : {connect: {ext_id: white}}, type : GameType[type],time_type: timeType, time_limit: time, time_increment: increment}});
    }

    public async savePlay(id: string, color: Color, capture: boolean, start: Location, target: Location, time: number, time_left: number, index: number){
        //@ts-ignore
        await this.prismaClient.play.create({data: {index: index, timestamp: time, time_left: time_left, capture: capture, color: Color[color], start_x: start.x, start_y: start.y, target_x: target.x, target_y: target.y, game: {connect: {ext_id: id}}}});
    }

    public async finishGame(id: string, color: Color){
        //@ts-ignore
        await this.prismaClient.game.update({data: {winner: Color[color]}, where: {ext_id: id}});
    }

    public async getActiveGames(){
        return await this.prismaClient.game.findMany({where: {winner: null}, include: {plays: {orderBy: {index: "asc"}}}});
    }

    public async deleteActiveGames(){
        const games = await this.prismaClient.game.findMany({where: {winner: null}});
        for(let game of games){
            await this.prismaClient.play.deleteMany({where: {id_game: game.id}});
        }
        return await this.prismaClient.game.deleteMany({where: {winner: null}});
    }

    public async getGame(id: string){
        return await this.prismaClient.game.findUnique({where: {ext_id: id}, include: {plays: {orderBy: {index: "asc"}}}});
    }

    public async getGamesByAccountID(id: number){
        return await this.prismaClient.game.findMany({where: {AND: [{OR: [{id_black: id}, {id_white: id}]}, {NOT : {winner: null}}]}, orderBy: {startedAt: "desc"}, take: 50});
    }

}