import AccountRepository from "../repositories/Account.repository";


export default class AccountService {

    constructor(private accountRepository: AccountRepository) {
    }

    public async logout(id: string) {
        await this.accountRepository.logout(id);
    }

    public async get(id: string) {
        return await this.accountRepository.getByExtID(id);
    }

}