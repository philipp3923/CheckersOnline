import {compareSync, genSaltSync, hashSync} from "bcrypt";

export default class EncryptionRepository {

    constructor(private saltRounds: number) {}

    public hashPassword(password: string){
        return hashSync(password, this.saltRounds);
    }

    public comparePasswords(password1: string, password2: string){
        return compareSync(password1, password2);
    }

}