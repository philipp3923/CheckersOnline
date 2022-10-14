import ApiRepository from "../repositories/Api.repository";
import Router from "../objects/Router";

export default class ApiService{

    constructor(private apiRepository: ApiRepository) {
    }

    public addRouter(router: Router){
        this.apiRepository.addRouter(router);
    }

    public start() {
        this.apiRepository.start();
    }
}