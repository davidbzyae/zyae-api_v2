import { NextFunction, Request, Response } from "express";

import { AppError } from "@/types";
import { deleteSession } from "../services";
import { newInternalError } from "@/utils";

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteSession("DeleteSession", res.locals.session.id);

    res.json({
      data: {
        message: "Deleted session",
      },
    });
  } catch (err) {
    if (err instanceof AppError) return next(err);
    else return next(newInternalError("DeleteSession", err));
  }
};
