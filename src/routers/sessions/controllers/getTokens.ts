import { NextFunction, Request, Response } from "express";

import { AppError } from "@/types";
import { newInternalError } from "@/utils";
import { refreshSessionAccess } from "../services/refreshSessionAccess";
import { sessionCookieOptions } from "@/config";

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = await refreshSessionAccess("GetTokens", res.locals.session);

    res
      .cookie("sid", session.id, sessionCookieOptions)
      .cookie("at", session.accessToken, sessionCookieOptions)
      .cookie("rt", session.refreshToken, sessionCookieOptions)
      .json({
        data: {
          message: "Set tokens",
        },
      });
  } catch (err) {
    if (err instanceof AppError) return next(err);
    else return next(newInternalError("GetTokens", err));
  }
};
