import IdentityRepository from "../repositories/Identity.repository";

/**
 * @deprecated The class should not be used
 */
export default class IdentityService{

    constructor(private identityRepository: IdentityRepository) {

    }

    public async generateGuestID(){
        return this.identityRepository.generateGuestID();
    }

    public async generateGameID(){
        return this.identityRepository.generateGameID();
    }

    public async generateUserID(){
        return this.identityRepository.generateUserID();
    }


}