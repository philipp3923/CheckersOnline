import { NextFunction, Request, Response } from "express";

export default interface InterfaceMiddleware {
  handle: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
