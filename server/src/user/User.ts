
export default class User{
    private readonly id: string;
    private readonly guest: boolean;
    private sockets: string[];

    constructor(id: string, guest: boolean) {
        this.id = id;
        this.guest = guest;
        this.sockets = [];
    }

    removeSocket(socket: string){
        this.sockets.splice(this.sockets.indexOf(socket), 1);
    }

    addSocket(socket: string){
        this.sockets.push(socket);
    }

    getSockets(){
        return this.sockets;
    }


}