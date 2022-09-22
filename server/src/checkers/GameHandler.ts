import Game from "./Game";

export default class GameHandler {
    active_games: Map<string, Game>;
    searching_games: string[];
    live_games: number;
    id_seed: number;

    constructor() {
        this.active_games = new Map<string, Game>();
        this.live_games = 0;
        this.id_seed = this.generate_random(0, 46655);
        this.searching_games = [];
    }

    addGame(game: Game, searching: boolean) {
        this.active_games.set(game.id, game);

        if(searching){
            this.searching_games.push(game.id);
        }
    }

    getGameByUser(user: User): Game | null {
        console.table(this.active_games);
        for (const game of this.active_games.values()) {
            for (const player of game.players) {
                if (player?.user.email === user.email) {
                    return game;
                }
            }
        }
        return null;
    }

    generateGameID() {
        const id = this.generate_pad((this.id_seed % 46655).toString(36), 3) + this.generate_pad(this.generate_random(0, 1295).toString(36), 2);
        this.id_seed++;
        return id.toUpperCase();
    }

    generate_pad(word: string, size: number) {
        while (word.length < size) word = "0" + word;
        return word;
    }

    generate_random(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
}



