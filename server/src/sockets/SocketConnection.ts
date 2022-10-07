import {Server} from "socket.io";
import GameHandler from "../checkers/GameHandler";
import Game from "../checkers/Game";
import UserSocketDictionary from "./UserSocketDictionary";

export default function socketConnection(io: Server, socket: AuthSocket, gameHandler: GameHandler, userSocketDictionary: UserSocketDictionary) {

    if (!socket.user) {
        return;
    }

    userSocketDictionary.add(socket.user, socket.id);

    for (const current_game of gameHandler.getGamesByUser(socket.user)) {
        socket.join(current_game.id);
    }

/*
    socket.on("disconnect", on_disconnect);
    socket.on("createGame", on_createGame);
    socket.on("joinGame", on_joinGame);
    socket.on("playGame", on_playGame);
    socket.on("message", on_message);

    function on_joinGame(gameid: unknown) {
        if (gameHandler.getGamesByUser(<User>socket.user).length >= 10) {
            emit_to(<User>socket.user, "joinGame", error(1, "You are in the maximum amount of concurrent games (10)."));
            return;
        }

        if (typeof gameid !== "string") {
            emit_to(<User>socket.user, "joinGame", error(1, "GameID is not a string."));
            return;
        }

        current_games.push(gameHandler.getGameByID(gameid));

        if (current_games === null) {
            emit_to(<User>socket.user, "joinGame", error(1, "Game " + gameid + " does not exist."));
            return;
        }

        if (current_games.isFull()) {
            emit_to(<User>socket.user, "joinGame", error(1, "Game " + gameid + " is full."));
            return;
        }

        current_games.addPlayer(<User>socket.user);
        current_games.start();

        socket.join(current_games.id);

        emit_in(current_games.id, "lobby", response({status: "connect", user: socket.user?.username}))

        //#TODO send game state to players
    }


    function on_playGame() {
        if (current_games !== null) {
            emit_to(<User>socket.user, "playGame", error(1, "You are in a game."));
            return;
        }
    }

    function on_createGame(time: unknown) {
        if (current_games !== null) {
            emit_to(<User>socket.user, "createGame", error(1, "You are in a game."));
            return;
        }

        if (!Number.isInteger(time) || <number>time < 0) {
            emit_to(<User>socket.user, "createGame", error(2, "Time is not a number."));
            return;
        }

        const safe_time: number = Math.round(<number>time);

        if (safe_time < 0) {
            emit_to(<User>socket.user, "createGame", error(3, "Time is a negative number."));
            return;
        }

        if (safe_time != 0 && safe_time < 30 || safe_time > 3000000) {
            emit_to(<User>socket.user, "createGame", error(2, "Time is not 0 or between 30 and 3.000.000"));
            return;
        }

        current_games = new Game(gameHandler.generateGameID(), safe_time);

        current_games.addPlayer(<User>socket.user);

        gameHandler.addGame(current_games, false);

        emit_to(<User>socket.user, "createGame", response({id: current_games.id}));

        socket.join(current_games.id);
        emit_in(current_games.id, "lobby", response({status: "connect", user: socket.user?.username}))


    }

    function on_disconnect() {
        if (current_games !== null) {
            emit_in(current_games.id, "lobby", response({status: "disconnect", user: socket.user?.username}))
        }

        userSocketDictionary.delete(<User>socket.user, socket.id);
    }

    function on_message(message: unknown) {
        if (current_games === null) {
            emit_to(<User>socket.user, "message", error(1, "You are not in a game."));
            return;
        }

        if (typeof message !== "string") {
            emit_to(<User>socket.user, "message", error(1, "Message is not a string."));
            return;
        }

        emit_in(current_games.id, "message", response({message: message, user: socket.user?.username}))


    }

    function error(code: number, msg: string) {
        return {timestamp: Date.now(), type: "error", content: {code, msg}};
    }

    function response(args: Object) {
        return {timestamp: Date.now(), type: "success", content: args};
    }
*/

    function emit_to(user: User, channel: string, message: Object) {
        for (const id in userSocketDictionary.get(user)) {
            io.to(id).emit(channel, message);
        }
    }

    function emit_in(id: string, channel: string, message: Object) {
        io.in(id).emit(channel, message);
    }



}
