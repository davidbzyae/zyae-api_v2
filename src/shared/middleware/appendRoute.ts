import { NextFunction, Request, Response } from "express";

export default (update: string) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!res.locals.route) res.locals.route = update;
    else res.locals.route += `.${update}`;
    return next();
  };
