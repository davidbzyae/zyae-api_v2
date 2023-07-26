import { NextFunction, Request, Response } from "express";
import Joi from "joi";

import { validateObjectId } from "@/schemas";
import { getUserById, validate } from "@/shared";
import { AppError } from "@/types";
import { newInternalError } from "@/utils";

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    validate(
      "GetUser",
      req.params,
      "params",
      Joi.object({
        userId: Joi.custom(validateObjectId).required(),
      }).required()
    );

    const user = await getUserById("GetUser", req.params.userId, {
      lean: true,
      throwNotFound: true,
    });
    delete user.auth.password;

    res.status(200).json({
      data: {
        user,
      },
    });
  } catch (err) {
    if (err instanceof AppError) return next(err);
    else return next(newInternalError("GetUser", err));
  }
};
