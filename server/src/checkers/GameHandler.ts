import Game from "./Game";
import {generate_pad, generate_random} from "../utils/KeyGeneration";

export default class GameHandler {
    active_games: Map<string, Game>;
    searching_games: string[];
    live_games: number;
    live_id_seed: number;

    constructor() {
        this.active_games = new Map<string, Game>();
        this.live_games = 0;
        this.live_id_seed = generate_random(0, 46655);
        this.searching_games = [];
    }

    addGame(game: Game, searching: boolean) {
        this.active_games.set(game.id, game);

        if(searching){
            this.searching_games.push(game.id);
        }
    }

    getGamesByUser(user: User): Game[] {
        const games: Game[] = [];
        for (const game of this.active_games.values()) {
            for (const player of game.players) {
                if (player.user.email === user.email) {
                    games.push(game);
                }
            }
        }
        return games;
    }

    getGameByID(id: string): Game | null{
        return this.active_games.get(id) ?? null;
    }

    getGameByIDWithUser(id: string,user: User): Game | null{
        const game = this.getGameByID(id);

        if(game !== null){
            for (const player of game.players) {
                if (player.user.email === user.email) {
                    return game;
                }
            }
        }

        return null;
    }

    generateGameID() {
        const id = generate_pad((this.live_id_seed % 46655).toString(36), 3) + generate_pad(generate_random(0, 1295).toString(36), 2);
        this.live_id_seed++;
        return id.toUpperCase();
    }
}



