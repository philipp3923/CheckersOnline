import GameRepository from "../repositories/Game.repository";
import IdentityRepository from "../repositories/Identity.repository";
import SocketService from "./Socket.service";
import { Color, Play } from "../models/Board.model";
import UserGame from "../models/UserGame.model";
import StaticGame from "../models/StaticGame.model";
import Game, { GameType } from "../models/Game.model";
import DynamicGame from "../models/DynamicGame.model";
import GameSchema from "../schemas/Game.schema";
import AccountRepository from "../repositories/Account.repository";
import PlaySchema from "../schemas/Play.schema";
import UserGameModel from "../models/UserGame.model";

export enum TimeType {
  STATIC,
  DYNAMIC,
}

export default class GameService {
  private readonly games: { [key: string]: UserGame };

  constructor(
    private accountRepository: AccountRepository,
    private gameRepository: GameRepository,
    private identityRepository: IdentityRepository,
    private socketService: SocketService
  ) {
    this.games = {};
    this.gameRepository.deleteActiveGames().then(() => {});
  }

  public async start(game: UserGame) {
    const white = game.getWhite();
    const black = game.getBlack();
    if (white === null || black === null) {
      throw new Error("Not full game cannot be started");
    }
    await this.gameRepository.saveGame(
      white.id,
      black.id,
      game.getID(),
      game.getType(),
      game.getTime(),
      game.getIncrement(),
      game.getTimeType()
    );
  }

  public async finish(game: UserGame) {
    const winner = game.getWinner();
    if (winner === null) {
      throw new Error("Game has no winner!");
    }
    await this.remove(game);
    await this.gameRepository.finishGame(game.getID(), winner);
  }

  public async remove(game: Game) {
    delete this.games[game.getKey()];
    if (game instanceof UserGameModel) {
      this.socketService
        .getConnectionByAccountID(game.getBlack()?.id ?? "")
        ?.removeGame(game);
      this.socketService
        .getConnectionByAccountID(game.getWhite()?.id ?? "")
        ?.removeGame(game);
    }
  }

  public async savePlay(game: UserGame, play: Play, index: number) {
    if (typeof play.time === "undefined") {
      throw new Error("play.time is not defined");
    }
    const player =
      play.color === Color.WHITE ? game.getWhite() : game.getBlack();
    await this.gameRepository.savePlay(
      game.getID(),
      play.color,
      play.capture,
      play.start,
      play.target,
      play.time,
      player?.time ?? 0,
      index
    );
  }

  public async createGame(
    gameType: GameType,
    timeType: number,
    time?: number,
    increment?: number
  ): Promise<Game> {
    if (gameType === GameType.COMPUTER) {
      throw new Error("Not yet implemented");
    } else {
      if (typeof time !== "number" || typeof increment !== "number") {
        throw new Error("time or increment not defined");
      }
      const game = await this.createUserGame(
        GameType.CUSTOM,
        timeType,
        time,
        increment
      );
      return game;
    }
  }

  public getGame(key: string): Game | null {
    return this.games[key] ?? null;
  }

  public getGamesByUserID(user_id: string): { [key: string]: UserGame } {
    const result: { [key: string]: UserGame } = {};
    for (let key of Object.keys(this.games)) {
      if (
        this.games[key].getBlack()?.id === user_id ||
        this.games[key].getWhite()?.id === user_id
      ) {
        result[key] = this.games[key];
      }
    }
    return result;
  }

  public emitGameState(game: UserGame) {
    this.socketService.sendIn(game.getKey(), "gameState", game.getGameState());
  }

  private async createUserGame(
    gameType: GameType,
    timeType: TimeType,
    time: number,
    increment?: number
  ) {
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
        break;
      case TimeType.DYNAMIC:
        if (typeof increment === "undefined") {
          throw new Error("Increment undefined");
        }
        game = new DynamicGame(this, id, key, gameType, time, increment);
        break;
      default:
        throw new Error("Illegal timeType");
    }
    this.games[key] = game;
    return game;
  }

  public async getFinishedGamesOfUser(
    id: string
  ): Promise<GameSchema[] | null> {
    const user = await this.accountRepository.getByExtID(id);
    if (!user) {
      return null;
    }
    const games = await this.gameRepository.getGamesByAccountID(user.id);

    if (!games) {
      return null;
    }

    return await Promise.all(
      games.map(async (game): Promise<GameSchema> => {
        return {
          black:
            (await this.accountRepository.getByID(game.id_black))?.ext_id ?? "",
          start: game.startedAt.getTime(),
          timeIncrement: game.time_increment,
          timeLimit: game.time_limit,
          timeType: game.time_type,
          type: game.type,
          white:
            (await this.accountRepository.getByID(game.id_white))?.ext_id ?? "",
          winner: game.winner ?? "",
          id: game.ext_id,
        };
      })
    );
  }

  public async getFinishedGame(id: string): Promise<GameSchema | null> {
    const game = await this.gameRepository.getGame(id);
    if (!game || !game.winner || game.plays.length <= 0) {
      return null;
    }

    const plays: PlaySchema[] = game.plays.map((play) => {
      return {
        timestamp: play.timestamp,
        start: { x: play.start_x, y: play.start_y },
        target: { x: play.target_x, y: play.target_y },
        capture: play.capture,
        color: play.color,
        time_left: play.time_left,
      };
    });

    return {
      black:
        (await this.accountRepository.getByID(game.id_black))?.ext_id ?? "",
      plays: plays,
      start: game.startedAt.getTime(),
      timeIncrement: game.time_increment,
      timeLimit: game.time_limit,
      timeType: game.time_type,
      type: game.type,
      white:
        (await this.accountRepository.getByID(game.id_white))?.ext_id ?? "",
      winner: game.winner,
      id: game.ext_id,
    };
  }

  public async invitePlayer(game: UserGame, invitation: string) {
    await game.invite(invitation);
    this.socketService.sendTo(invitation, "invite", game.getKey());
  }

  private generateKey(): string {
    let key = this.identityRepository.generateKey();
    while (typeof this.games[key] !== "undefined") {
      key = this.identityRepository.generateKey();
    }
    return key;
  }

  async leaveGame(game_key: string, player_id: string) {
    const game = this.getGame(game_key);
    if (game === null) {
      throw new Error("Game does not exist");
    }
    await this.socketService.sendIn(game_key, "leave", {
      key: game_key,
      id: player_id,
    });
    if (!(game instanceof UserGameModel)) {
      await this.remove(game);
      return;
    }
    if (!game.getWhite() || !game.getBlack()) {
      await this.remove(game);
      return;
    }

    if (game.getPlays().length < 1) {
      await this.remove(game);
      return;
    }

    game.setWinner(
      game.getWhite()?.id === player_id ? Color.BLACK : Color.WHITE
    );
    await this.finish(game);
  }
}
