import {PrismaClient} from "@prisma/client";
import {Color, Location} from "../objects/Board";
import {GameType} from "../objects/Game";

export default class GameRepository{

    constructor(private prismaClient: PrismaClient) {
    }

    public async saveGame(white: string, black: string, id: string, type: GameType, time: number){
        //@ts-ignore
        await this.prismaClient.game.create({data: {ext_id: id, black : {connect: {ext_id: black}}, white : {connect: {ext_id: white}}, type : GameType[type], time_limit: time}});
    }

    public async savePlay(id: string, color: Color, capture: boolean, start: Location, target: Location, time: number, index: number){
        //@ts-ignore
        await this.prismaClient.play.create({data: {index: index, time: time, capture: capture, color: Color[color], start_x: start.x, start_y: start.y, target_x: target.x, target_y: target.y, game: {connect: {ext_id: id}}}});
    }

    public async finishGame(id: string, color: Color){
        //@ts-ignore
        await this.prismaClient.game.update({data: {winner: Color[color]}, where: {ext_id: id}});
    }



}