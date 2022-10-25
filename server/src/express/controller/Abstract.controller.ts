import express, {Request, Response, NextFunction} from "express";


export default abstract class AbstractController{

    /**
     * @deprecated not implemented
     */
    public async get(req: Request, res: Response, next: NextFunction): Promise<void>{
        throw new Error("not implemented");
    }

    /**
     * @deprecated not implemented
     */
    public async post(req: Request, res: Response, next: NextFunction): Promise<void>{
        throw new Error("not implemented");
    }

    /**
     * @deprecated not implemented
     */
    public async delete(req: Request, res: Response, next: NextFunction): Promise<void>{
        throw new Error("not implemented");
    }

    /**
     * @deprecated not implemented
     */
    public async patch(req: Request, res: Response, next: NextFunction): Promise<void>{
        throw new Error("not implemented");
    }

    /**
     * @deprecated not implemented
     */
    public async put(req: Request, res: Response, next: NextFunction): Promise<void>{
        throw new Error("not implemented");
    }

}