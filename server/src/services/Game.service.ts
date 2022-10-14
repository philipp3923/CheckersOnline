import GameRepository from "../repositories/Game.repository";
import Game, {GameType} from "../objects/Game";
import IdentityRepository from "../repositories/Identity.repository";

export default class GameService{
    private readonly games: {[key: string]: Game};

    constructor(private gameRepository: GameRepository, private identityRepository: IdentityRepository) {
        this.games= {};
    }

    public start(game: Game){
        const white = game.getWhite();
        const black = game.getBlack();
        if(white === null || black === null){
            throw new Error("Not full game cannot be started");
        }
        this.gameRepository.saveGame(white, black, game.getID(), game.getType(), game.getTime());
    }

    /**
     * @deprecated Memory leak when removing game, as game persists in Connection object of each player until these players both disconnect
     */
    public remove(game: Game){

    }

    public async createCustom(time: number){
        const id = await this.identityRepository.generateGameID();
        const key = this.generateKey();
        const game = new Game(this, id, key, GameType.CUSTOM, time);
        this.games[key] = game;
        return game;
    }

    public getCustom(key: string): Game | null{
        return this.games[key]?.getType() === GameType.CUSTOM ? this.games[key] : null;
    }

    private generateKey(): string{
        let key = this.identityRepository.generateKey();
        while(typeof this.games[key] !== "undefined"){
            key = this.identityRepository.generateKey();
        }
        return key;
    }

}