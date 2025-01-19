import { NextFunction, Request, Response } from "express";

export default (myFunc: any) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(myFunc(req, res, next)).catch(next);
  };
