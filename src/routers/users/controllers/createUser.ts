import { NextFunction, Request, Response } from "express";
import { checkEmailAvailable, hashPassword, saveUser } from "../services";

import { AppError } from "@/types";
import Joi from "joi";
import { newInternalError } from "@/utils";
import { validate } from "@/shared";

export default async (req: Request, res: Response, next: NextFunction) => {
  type Body = {
    password: string;
    email: string;
    displayName: string;
  };

  try {
    validate(
      "CreateUser",
      req.body,
      "body",
      Joi.object({
        password: Joi.string().required(),
        email: Joi.string().email().required(),
        displayName: Joi.string().required(),
      }).required()
    );

    const body: Body = req.body;

    await checkEmailAvailable("CreateUser", body.email);
    const passwordHash = await hashPassword("CreateUser", body.password);
    const user = await saveUser("CreateUser", body, passwordHash);

    res.status(201).json({
      data: {
        user,
      },
    });
  } catch (err) {
    if (err instanceof AppError) return next(err);
    else return next(newInternalError("CreateUser", err));
  }
};
