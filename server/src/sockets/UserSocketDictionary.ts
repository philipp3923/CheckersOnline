interface UserDictionary<TValue> {
    [userid: string]: TValue;
}

export default class UserSocketDictionary {
    dict: UserDictionary<string[]>;

    constructor() {
        this.dict = {};
    }

    add(user: User, socket_id: string) {
        if (this.dict[user.username] == null) {
            this.dict[user.username] = [socket_id];
        } else {
            this.dict[user.username].push(socket_id);
        }
    }

    get(user: User): string[] | null {
        return this.dict[user.username] ?? null;
    }

    delete(user: User, socket_id: string) {
        if (this.dict[user.username] == null) {
            return;
        }

        const index = this.dict[user.username].indexOf(socket_id);
        if (index > -1) {
            this.dict[user.username].splice(index, 1);
        }

        if(this.dict[user.username].length < 1){
            delete this.dict[user.username];
        }
    }


}