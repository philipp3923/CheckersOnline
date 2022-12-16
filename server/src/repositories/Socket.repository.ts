import { Server, Socket } from "socket.io";
import {
  AuthenticatableSocket,
  Socket as ConnectionSocket,
  SocketEventListener,
} from "../services/Socket.service";
import GameRepository from "./Game.repository";
import Connection from "../models/Connection.model";

export interface ExtendedAuthenticatedSocket extends Socket {
  connection?: Connection;
}

export default class SocketRepository {
  private readonly eventListeners: SocketEventListener[];
  private readonly connections: { [ext_id: string]: Connection };

  constructor(private io: Server, private gameRepository: GameRepository) {
    this.eventListeners = [];
    this.connections = {};
  }

  public addMiddleware(
    fn: (socket: AuthenticatableSocket, next: Function) => void
  ) {
    this.io.use((socket, next) => {
      (<AuthenticatableSocket>socket).token = socket.handshake.auth.token;
      fn(<AuthenticatableSocket>socket, next);
    });
  }

  public addEvent(socketEventListener: SocketEventListener) {
    this.eventListeners.push(socketEventListener);
  }

  public onConnection() {
    this.io.on("connection", async (socket: ExtendedAuthenticatedSocket) => {
      if (typeof socket.connection === "undefined") {
        throw new Error("Socket without account connected");
      }

      const connectionSocket: ConnectionSocket = {
        id: socket.id,
        join: (room: string) => socket.join(room),
        leave: (room: string) => socket.leave(room),
        send: (event: string, msg: any) => socket.emit(event, msg),
        disconnect: () => socket.disconnect(),
      };

      await socket.connection.addSocket(connectionSocket);

      for (const eventListener of this.eventListeners) {
        socket.on(eventListener.event, (args, callback) => {
          eventListener.fn(
            <Connection>socket.connection,
            args,
            callback ? callback : (args) => null
          );
        });
      }

      socket.on(
        "disconnect",
        async () => await socket.connection?.removeSocket(socket.id)
      );
    });
  }

  public addConnection(connection: Connection) {
    this.connections[connection.getID()] = connection;
  }

  public removeConnection(connection: string) {
    delete this.connections[connection];
  }

  public getConnection(id: string): Connection | null {
    return this.connections[id] ?? null;
  }

  public emitIn(room: string, event: string, msg: any) {
    this.io.in(room).emit(event, msg);
  }

  public emitTo(id: string, event: string, msg: any) {
    this.io.to(id).emit(event, msg);
  }
}
