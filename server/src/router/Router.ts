import ApiService from "../services/Api.service";
import AbstractController from "../controller/Abstract.controller";

export default class Router{
    private readonly controller: AbstractController[];

    constructor(private apiService : ApiService, private path : string) {
        this.controller = [];
        this.apiService.addRouter(this);
    }

    public getPath(){
        return this.path;
    }

    public addController(controller : AbstractController){
        this.controller.push(controller);
    }

    public getController() : AbstractController[]{
        return this.controller;
    }

    public getMiddleware(){

    }

}