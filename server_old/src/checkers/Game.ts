import Board from "./Board";

export default class Game {
    readonly id: string;
    readonly time: number;
    start_time: number | null;
    board: Board;
    turns: Checkers.Turn[];
    next_turn: 1 | 2 | null;
    next_possible_turns: Checkers.Turn[];
    players: Checkers.Player[];

    constructor(id: string, time: number) {
        this.id = id;
        this.time = time;
        this.board = new Board();
        this.turns = [];
        this.next_turn = null;
        this.players = [];
        this.start_time = null;
        this.next_possible_turns = [];
    }

    start(): boolean{
        if (this.players.length != 2) {
            return false;
        }
        this.start_time = Date.now();
        this.next_turn = 1;

        return true;
    }

    addPlayer(user: User) {
        if (this.players.length > 2) {
            return;
        }
        if (Math.random() >= 0.5) {
            this.players.push({user: user, time_left: this.time});
        } else {
            this.players.unshift({user: user, time_left: this.time});
        }
    }

    isFull(): boolean{
        return this.players.length >= 2;
    }

}