import {Server} from "socket.io";
import GameHandler from "../checkers/GameHandler";
import Game from "../checkers/Game";
import UserSocketMap from "./UserSocketMap";

export default function socketConnection(io: Server, socket: AuthSocket, gameHandler: GameHandler, userSocketMap: UserSocketMap) {

    if (!socket.user) {
        return;
    }
    //#TODO handle if map has a socket id already saved => other device is connected! => disconnect other device
    userSocketMap.set(socket.user, socket.id);
    console.log(socket.user.username + " CONNECTED")

    let current_game: Game | null = gameHandler.getGameByUser(socket.user);

    if(current_game !== null){
        socket.join(current_game.id);

        io.in(current_game.id).emit("lobby", response({status: "reconnect", user: socket.user.username}))
    }

    socket.on("disconnect", on_disconnect);
    socket.on("createGame", on_createGame);
    socket.on("joinGame", on_joinGame);
    socket.on("playGame", on_playGame);
    socket.on("message", on_message);

    function on_joinGame(gameid: unknown) {
        if (current_game !== null) {
            io.to(socket.id).emit("joinGame", error(1, "You are in a game."));
            return;
        }

        if(typeof gameid !== "string"){
            io.to(socket.id).emit("joinGame", error(1, "GameID is not a string."));
            return;
        }

        current_game = gameHandler.getGameByID(gameid);

        if(current_game === null){
            io.to(socket.id).emit("joinGame", error(1, "Game "+gameid+" does not exist."));
            return;
        }

        if(current_game.isFull()){
            io.to(socket.id).emit("joinGame", error(1, "Game "+gameid+" is full."));
            return;
        }

        current_game.addPlayer(<User>socket.user);
        current_game.start();

        socket.join(current_game.id);

        io.in(current_game.id).emit("lobby", response({status: "connect", user: socket.user?.username}))

        //#TODO send game state to players
    }



    function on_playGame() {
        if (current_game !== null) {
            io.to(socket.id).emit("playGame", error(1, "You are in a game."));
            return;
        }
    }

    function on_createGame(time: unknown) {
        if (current_game !== null) {
            io.to(socket.id).emit("createGame", error(1, "You are in a game."));
            return;
        }

        if (!Number.isInteger(time) || <number>time < 0) {
            io.to(socket.id).emit("createGame", error(2, "Time is not a number."));
            return;
        }

        const safe_time: number = Math.round(<number>time);

        if (safe_time < 0) {
            io.to(socket.id).emit("createGame", error(3, "Time is a negative number."));
            return;
        }

        if (safe_time != 0 && safe_time < 30 || safe_time > 3000000) {
            io.to(socket.id).emit("createGame", error(2, "Time is not 0 or between 30 and 3.000.000"));
            return;
        }

        current_game = new Game(gameHandler.generateGameID(), safe_time);

        current_game.addPlayer(<User>socket.user);

        gameHandler.addGame(current_game, false);

        io.to(socket.id).emit("createGame", response({id: current_game.id}));

        socket.join(current_game.id);
        io.in(current_game.id).emit("lobby", response({status: "connect", user: socket.user?.username}))


    }

    function on_disconnect() {
        if(current_game !== null){
            io.in(current_game.id).emit("lobby", response({status: "disconnect", user: socket.user?.username}))
        }

        userSocketMap.delete(<User>socket.user);
    }

    function on_message(message: unknown){
        if(current_game === null){
            io.to(socket.id).emit("message", error(1, "You are not in a game."));
            return;
        }

        if(typeof message !== "string"){
            io.to(socket.id).emit("message", error(1, "Message is not a string."));
            return;
        }

        io.in(current_game.id).emit("message", response({message: message, user: socket.user?.username}))


    }

    function error(code: number, msg: string) {
        return {timestamp: Date.now(), type: "error", content: {code, msg}};
    }

    function response(args: Object) {
        return {timestamp: Date.now(), type: "success", content: args};
    }

}
