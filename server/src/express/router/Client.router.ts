import AbstractRouter from "./Abstract.router";
import express, {Router} from "express";
import path from "path";

export default class ClientRouter extends AbstractRouter {

    constructor(route_path: string, app: Router) {
        super(route_path, app);

        this.router.use("/", express.static(process.env.CLIENT_DIST_PATH!));

        this.router.use((req, res) => {
            res.sendFile(path.resolve(process.env.CLIENT_DIST_PATH!, 'index.html'))
        });

    }
}