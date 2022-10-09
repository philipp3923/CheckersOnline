import Account from "./Account";
import User from "./User";
import Guest from "./Guest";

const online_accounts: Account[] = [];

export function getUser(id: string){

}

export function generateGuest(): Guest {
    return new Guest();
}

export function generateUser(email: string, username: string, password: string): User | null{

}

export function loadUser(id: string): User | null {

}