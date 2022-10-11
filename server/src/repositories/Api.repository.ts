import express, {Express, NextFunction, Request} from "express";
import Router from "../router/Router";
import {RequestType, Response} from "../controller/Abstract.controller";

export default class ApiRepository{
    private router: Router[];

    constructor(private api : Express) {
        this.api.use(express.json());
        this.router = [];
    }

    public addRouter(router: Router){
        this.router.push(router);
    }

    public start(){
        for(const router of this.router){
            const expressRouter = express.Router();

            for(const controller of router.getController()){
                switch (controller.getRequestType()){
                    case RequestType.GET:
                        expressRouter.get(controller.getPath(), (req, res, next) => this.wrapHandle(req, res, next, controller.handle));
                        break
                    case RequestType.POST:
                        expressRouter.post(controller.getPath(), (req, res, next) => this.wrapHandle(req, res, next, controller.handle));
                        break
                    case RequestType.DELETE:
                        expressRouter.delete(controller.getPath(), (req, res, next) => this.wrapHandle(req, res, next, controller.handle));
                        break
                    case RequestType.PUT:
                        expressRouter.put(controller.getPath(), (req, res, next) => this.wrapHandle(req, res, next, controller.handle));
                        break
                }
            }

            this.api.use(router.getPath(), expressRouter);
        }
    }

    private async wrapHandle(req: Request, res: any, next: NextFunction, handle : (body: unknown) => Promise<Response>){
        const response = await handle(req.body);
        res.status(response.status);
        res.json(response.json);
        next();
    }
}