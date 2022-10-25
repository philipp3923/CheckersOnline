import express, {Express, Router} from "express";

export default abstract class AbstractRouter {
    protected readonly router: Router;

    constructor( private path: string, private app: Router) {
        this.router = express.Router();
        this.app.use(this.path, this.router);
    }

}