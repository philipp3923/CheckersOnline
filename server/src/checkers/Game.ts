import Board from "./Board";

export default class Game {
    readonly id: string;
    readonly time: number;
    board: Board;
    turns: Checkers.Turn[];
    next_turn: 1 | 2 | null;
    players: Checkers.Player[];

    constructor(id: string, time: number) {
        this.id = id;
        this.time = time;
        this.board = new Board();
        this.turns = [];
        this.next_turn = 1;
        this.players = [];
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

}