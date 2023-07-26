import { NextFunction, Request, Response } from "express";

import { AppError } from "@/types";
import { newInternalError } from "@/utils";

import { deleteSession } from "../services";

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
