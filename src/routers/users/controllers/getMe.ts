import { NextFunction, Request, Response } from "express";

import { AppError } from "@/types";
import { getUserById } from "@/shared";
import { newInternalError } from "@/utils";

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await getUserById("GetMe", res.locals.session.userId, {
      lean: true,
      throwNotFound: true,
    });
    delete user.auth.password;

    res.json({
      data: {
        user,
      },
    });
  } catch (err) {
    if (err instanceof AppError) return next(err);
    else return next(newInternalError("GetMe", err));
  }
};
