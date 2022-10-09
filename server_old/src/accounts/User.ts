import Account from "./Account";
import {generate_userid} from "../utils/KeyGeneration";

interface Args{
    email: string,
    username: string,
    password: string,
}

export default class User extends Account{

    constructor(id: string) {
        super(id);
    }


}