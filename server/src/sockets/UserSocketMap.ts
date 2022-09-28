
export default class UserSocketMap{
    map: Map<string, string>;

    constructor() {
        this.map = new Map<string, string>();
    }

    set(user: User, socket_id: string){
        this.map.set(user.username, socket_id);
    }

    get(user: User): string | null{
        return this.map.get(user.username) ?? null;
    }

    delete(user: User){
        this.map.delete(user.username);
    }


}