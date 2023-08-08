import {
  AppError,
  ConflictError,
  ErrorDetail,
  UnauthorizedError,
} from "@/types";
import { NextFunction, Request, Response } from "express";
import { authenticateUser, checkDuplicateSession } from "../services";
import { findOneUser, saveSession, validate } from "@/shared";

import Joi from "joi";
import { newInternalError } from "@/utils";
import { sessionCookieOptions } from "@/config";

export default async (req: Request, res: Response, next: NextFunction) => {
  type Body = {
    email: string;
    password: string;
  };

  try {
    validate(
      "CreateSession",
      req.body,
      "body",
      Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
      })
    );

    const body: Body = req.body;

    const user = await authenticateUser("CreateSession", body);

    await checkDuplicateSession("CreateSession", req.cookies);
    const session = await saveSession("CreateSession", user);

    res
      .cookie("sid", session.id, sessionCookieOptions)
      .cookie("at", session.accessToken, sessionCookieOptions)
      .cookie("rt", session.refreshToken, sessionCookieOptions)
      .json({
        data: {
          message: "Created session",
        },
      });
  } catch (err) {
    if (err instanceof AppError) return next(err);
    else return next(newInternalError("CreateSession", err));
  }
};
