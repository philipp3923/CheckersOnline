import Game from "./Game";

export default class GameHandler{
    active_games: Game[];
    searching_games: string[];
    open_games: number;

    constructor() {
        this.active_games = [];
        this.open_games = 0;
        this.searching_games = [];
    }

}



