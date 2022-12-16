import GameService from "../services/Game.service";
import {Color, Play} from "./Board.model";
import GameModel, {GameType} from "./Game.model";

export interface Player {
    id: string,
    time: number
}

export interface GameState {
    white: Player,
    black: Player,
    key: string,
    id: string,
    board: number[][],
    possibleTurns: Play[],
    nextColor: number | null,
    winner: number | null,
    plays: Play[],
    timestamp: number,
    timeType: number,
    time: number,
    increment: number,

}

export default abstract class UserGameModel extends GameModel {
    private readonly player: Player[];
    private timeout: any | null;
    private invitation: string | null;

    constructor(private gameService: GameService, id: string, key: string, type: GameType, private time: number) {
        super(id, key, type);
        this.player = [];
        this.timeout = null;
        this.invitation = null;
    }

    public static isValidTime(time?: number, increment?: number): boolean {
        return false;
    }

    public async invite(id: string) {
        this.invitation = id;
    }

    public getIncrement() {
        return 0;
    }

    public getTimeType() {
        return "STATIC";
    }

    public async join(player: string): Promise<void> {
        if (this.player.length >= 2) {
            throw new Error("Game is full");
        }
        if (this.player[0]?.id === player || this.player[1]?.id === player) {
            throw new Error("Cannot join the same game twice");
        }
        if (this.invitation !== null && this.invitation !== player) {
            throw new Error("Uninvited player cannot join game");
        }
        if (Math.random() >= 0.5) {
            this.player.push({id: player, time: this.time});
        } else {
            this.player.unshift({id: player, time: this.time});
        }
        if (this.player.length >= 2) {
            await this.start();
        }
    }

    public getWinner() {
        return this.board.getWinner();
    }

    public setWinner(color: Color) {
        this.finished = true;
        if (this.timeout !== null) {
            clearTimeout(this.timeout);
        }
        this.board.setWinner(color);
    }

    public async play(index: number) {
        if (this.finished) {
            return false;
        }

        const newTimestamp = Date.now();
        const possiblePlays = this.board.getPossibleTurns();
        const selectedPlay = possiblePlays[index];

        if (typeof selectedPlay === "undefined") {
            return false;
        }

        if (this.timeout !== null) {
            clearTimeout(this.timeout);
        }

        const player = this.getPlayerFromColor(selectedPlay.color);

        if (player === null) {
            throw new Error("Player is null in game")
        }


        if (this.plays.length === 0) {
            selectedPlay.time = 0;
        } else {
            selectedPlay.time = newTimestamp - this.timestamp;

            if (player.time - selectedPlay.time <= 0) {
                await this.handleTimeout(selectedPlay.color);
                return false;
            }

            this.updateTime(player, selectedPlay);
        }
        this.board.play(index);
        this.plays.push(selectedPlay);
        await this.gameService.savePlay(this, selectedPlay, this.plays.length - 1);

        if (this.board.getWinner() !== null) {
            await this.finish();
            return false;
        }

        const nextColor = this.board.getNextTurn();

        if (nextColor === null) {
            throw new Error("No player won and no next player exists")
        }

        const nextPlayer = this.getPlayerFromColor(nextColor);

        if (nextPlayer === null) {
            throw new Error("Player does not exist")
        }

        this.timeout = setTimeout(() => this.handleTimeout(nextColor), nextPlayer.time);
        this.timestamp = Date.now();
        this.gameService.emitGameState(this);
        return true;
    }

    public getBlack(): Player | null {
        return this.player[1] ?? null;
    }

    public getWhite(): Player | null {
        return this.player[0] ?? null;
    }

    public getTime() {
        return this.time;
    }

    public getGameState() {
        const state: any = super.getGameState();
        state.white = this.getWhite();
        state.black = this.getBlack();
        return state;
    }

    public getNext(): string | null {
        const color = this.board.getNextTurn();
        if (color === null) {
            return null;
        }
        return this.getPlayerFromColor(color)?.id ?? null;
    }

    protected async start() {
        await this.gameService.start(this);
        this.gameService.emitGameState(this);
    }

    protected async finish() {
        this.finished = true;
        this.board.setNextTurnNull();
        this.gameService.emitGameState(this);
        await this.gameService.finish(this);
    }

    protected getPlayerFromColor(color: Color) {
        return color === Color.BLACK ? this.getBlack() : this.getWhite();
    }

    protected abstract updateTime(player: Player, play: Play): void;

    private async handleTimeout(color: Color) {
        if (this.finished) {
            return;
        }
        this.finished = true;
        this.board.setWinner(this.switchColor(color));
        const lostPlayer = this.getPlayerFromColor(color);
        if (lostPlayer === null) {
            throw new Error("Player does not exist")
        }


        lostPlayer.time = 0;
        await this.finish();
    }

}