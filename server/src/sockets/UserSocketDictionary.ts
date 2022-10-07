interface UserDictionary<TValue> {
    [userid: string]: TValue;
}

export default class UserSocketDictionary {
    dict: UserDictionary<string[]>;

    constructor() {
        this.dict = {};
    }

    add(user: User, socket_id: string) {
        if (this.dict[user.id] == null) {
            this.dict[user.id] = [socket_id];
        } else {
            this.dict[user.id].push(socket_id);
        }
    }

    get(user: User): string[] | null {
        return this.dict[user.id] ?? null;
    }

    delete(user: User, socket_id: string) {
        if (this.dict[user.id] == null) {
            return;
        }

        const index = this.dict[user.id].indexOf(socket_id);
        if (index > -1) {
            this.dict[user.id].splice(index, 1);
        }

        if(this.dict[user.id].length < 1){
            delete this.dict[user.id];
        }
    }


}