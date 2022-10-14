import Router from "../objects/Router";

export interface Response{
    status: number, json?: Object
}

export enum RequestType{
    GET, POST, PUT, DELETE,
}

export default abstract class AbstractController{

    constructor(private router: Router, private requestType : RequestType, private path: string) {
        this.router.addController(this);
    }

    public getRequestType(){
        return this.requestType;
    }

    public abstract handle(headers: any, body: any): Promise<Response>;

    public getPath(){
        return this.path;
    }
}