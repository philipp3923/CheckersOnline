
export default abstract class Account{
    readonly id: string;
    private sockets: string[];

    constructor(id: string) {
        this.id = id;
        this.sockets = [];
    }

    public removeSocket(socket: string){
        this.sockets.splice(this.sockets.indexOf(socket), 1);
    }

    public addSocket(socket: string){
        this.sockets.push(socket);
    }

    public getSockets(): string[]{
        return this.sockets;
    }

}