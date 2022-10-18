import express, {Express, NextFunction, Request} from "express";
import Router from "../objects/Router";
import AbstractController, {RequestType} from "../controller/Abstract.controller";

export default class ApiRepository{
    private readonly router: Router[];

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
                const handle = this.wrapHandle(controller);

                switch (controller.getRequestType()){
                    case RequestType.GET:
                        expressRouter.get(controller.getPath(), handle);
                        break
                    case RequestType.POST:
                        expressRouter.post(controller.getPath(), handle);
                        break
                    case RequestType.DELETE:
                        expressRouter.delete(controller.getPath(), handle);
                        break
                    case RequestType.PUT:
                        expressRouter.put(controller.getPath(), handle);
                        break
                }
            }

            this.api.use(router.getPath(), expressRouter);
        }
    }

    private wrapHandle(controller: AbstractController){
        return async (req: Request, res: any, next: NextFunction) => {
            const response = await controller.handle(req.headers, req.body);
            res.status(response.status);
            res.json(response.json);
            next();
        }
    }
}