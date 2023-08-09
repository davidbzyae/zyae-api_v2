import { AppError, CookieTokens } from "@/types";
import { NextFunction, Request, Response } from "express";
import { getSession, validateSessionTokens } from "../services";

import { newInternalError } from "@/utils";

export default (
    flags: { checkExists: boolean; checkExpired: boolean } = {
      checkExists: true,
      checkExpired: true,
    }
  ) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      validateSessionTokens("middleware.AttachSession", req.cookies);

      const tokens: CookieTokens = req.cookies;

      const session = await getSession(
        "middleware.AttachSession",
        {
          id: tokens.sid,
        },
        flags
      );

      if (session) res.locals.session = session;
      next();
    } catch (err) {
      if (err instanceof AppError) next(err);
      else next(newInternalError(err, "middleware.AttachSession"));
    }
  };
