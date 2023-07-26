import { NextFunction, Request, Response } from "express";

import { AppError, CookieTokens } from "@/types";
import { newInternalError } from "@/utils";

import { getSession, validateSessionTokens } from "../services";

export default (
    flags: { authRequired: boolean; validateSession: boolean } = {
      authRequired: true,
      validateSession: true,
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
