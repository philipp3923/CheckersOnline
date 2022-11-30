import GameRepository from "../repositories/Game.repository";
import IdentityRepository from "../repositories/Identity.repository";
import SocketService from "./Socket.service";
import {Play} from "../models/Board.model";
import UserGame from "../models/UserGame.model";
import StaticGame from "../models/StaticGame.model";
import Game, {GameType} from "../models/Game.model";
import DynamicGame from "../models/DynamicGame.model";

export enum TimeType {
    STATIC, DYNAMIC
}

export default class GameService {
    private readonly games: { [key: string]: UserGame };

    constructor(private gameRepository: GameRepository, private identityRepository: IdentityRepository, private socketService: SocketService) {
        this.games = {};
    }

    public async start(game: UserGame) {
        const white = game.getWhite();
        const black = game.getBlack();
        if (white === null || black === null) {
            throw new Error("Not full game cannot be started");
        }
        await this.gameRepository.saveGame(white.id, black.id, game.getID(), game.getType(), game.getTime());
    }

    public async finish(game: UserGame) {
        const winner = game.getWinner();
        if (winner === null) {
            throw new Error("Game has no winner!");
        }
        await this.gameRepository.finishGame(game.getID(), winner);
    }

    /**
     * @deprecated Memory leak when removing game, as game persists in Connection object of each player until these players both disconnect
     */
    public remove(game: UserGame) {

    }

    public async savePlay(game: UserGame, play: Play, index: number) {
        if (typeof play.time === "undefined") {
            throw new Error("play.time is not defined");
        }
        await this.gameRepository.savePlay(game.getID(), play.color, play.capture, play.start, play.target, play.time, index);
    }

    public async createGame(gameType: GameType, timeType: number, time?: number, increment?: number): Promise<Game> {
        if (gameType === GameType.COMPUTER) {
            throw new Error("Not yet implemented");
        } else {
            if (typeof time !== "number" || typeof increment !== "number") {
                throw new Error("time or increment not defined");
            }
            const game = await this.createUserGame(GameType.CUSTOM, timeType, time, increment);
            return game;
        }

    }

    public getGame(key: string): Game | null {
        return this.games[key] ?? null;
    }

    public emitGameState(game: UserGame) {
        this.socketService.sendIn(game.getKey(), "gameState", game.getGameState());
    }

    private async createUserGame(gameType: GameType, timeType: TimeType, time: number, increment?: number) {
        const id = await this.identityRepository.generateGameID();
        const key = this.generateKey();
        let game = null;
        if (gameType === GameType.COMPUTER) {
            throw new Error("Cannot create ComputerGame as UserGame");
        }

        //#TODO temporary blocker for unimplemented gameTypes
        if (gameType === GameType.RANKED) {
            throw new Error("Not implemented");
        }

        switch (timeType) {
            case TimeType.STATIC:
                game = new StaticGame(this, id, key, gameType, time);
                break
            case TimeType.DYNAMIC:
                if (typeof increment === "undefined") {
                    throw new Error("Increment undefined");
                }
                game = new DynamicGame(this, id, key, gameType, time, increment);
                break
            default:
                throw new Error("Illegal timeType");
        }
        this.games[key] = game;
        return game;
    }

    public invitePlayer(game: UserGame, invitation: string){
        game.invite(invitation);
        this.socketService.sendTo(invitation, "invite", game.getKey());
    }

    private generateKey(): string {
        let key = this.identityRepository.generateKey();
        while (typeof this.games[key] !== "undefined") {
            key = this.identityRepository.generateKey();
        }
        return key;
    }

}