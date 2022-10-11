import UserRepository from "../repositories/User.repository";
import EncryptionRepository from "../repositories/Encryption.repository";
import IdentityRepository from "../repositories/Identity.repository";

export default class UserService{

    constructor(private userRepository: UserRepository, private encryptionRepository: EncryptionRepository, private identRepository: IdentityRepository) {}

    public async create(email: string, username: string, password: string): Promise<string>{
        if(!this.validatePassword(password) || !this.validateUsername(username) || !this.validateEmail(email)){
            throw new Error("Illegal arguments provided");
        }
        if(await this.getByEmail(email) !== null || await this.getByUsername(username) !== null){
            throw new Error("User already exists");
        }

        const hashedPassword = this.encryptionRepository.hashPassword(password);
        const id = await this.identRepository.generateUserID();

        try{
            await this.userRepository.create(id,email, username, hashedPassword);
        }catch (e){
            throw new Error("User generation failed");
        }

        return id;
    }

    public delete(id: string){

    }

    public async authenticate(name: string, password: string): Promise<boolean>{
        const userPassword = await this.userRepository.getPassword(name);

        if(userPassword === null){
            throw new Error("User does not exist");
        }

        return this.encryptionRepository.comparePasswords(password, userPassword);
    }

    public async getByUsername(username: string): Promise<string | null>{
        return await this.userRepository.getByUsername(username);
    }

    public async getByEmail(email: string): Promise<string | null>{
        return await this.userRepository.getByEmail(email);
    }

    public async getByUsernameOrEmail(name: string){
        return await this.userRepository.getByEmailOrUsername(name);

    }

    public changePassword(id: string){

    }

    public changeUsername(id: string){

    }

    public changeEmail(id: string){

    }

    public validateUsername(username: string): boolean{
        let result = true;

        if(username.length < 4){
            result = false;
        }

        return result;
    }

    public validateEmail(email: string): boolean{
        let result = true;

        if(email.length < 4){
            result = false;
        }

        return result;
    }

    public validatePassword(password: string): boolean{
        let result = true;
        const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,100}$/;

        if(!password.match(regex)){
            result = false;
        }

        return result;
    }

}