import { NextFunction, Request, Response } from "express";
import Joi from "joi";

import { sessionCookieOptions } from "@/config";
import { UserModel } from "@/models";
import { findOneUser, getSession, saveSession, validate } from "@/shared";
import { AppError, BadRequestError, ErrorDetail } from "@/types";
import { newInternalError } from "@/utils";

import { getGoogleTokens, getGoogleUser } from "../services";
import { saveGoogleUser } from "../services/saveGoogleUser";

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    validate(
      "Cb",
      req.query,
      "query",
      Joi.object({
        code: Joi.string().required(),
        scope: Joi.string().required(),
        authuser: Joi.string().required(),
        prompt: Joi.string().required(),
      }).required()
    );

    const code = req.query.code as string; // code is of type string per above validation

    const tokens = await getGoogleTokens("Cb", code);
    const googleUser = await getGoogleUser("Cb", tokens);

    var user = await findOneUser(
      "Cb",
      {
        "auth.googleId": googleUser.id,
      },
      { lean: true, throwNotFound: false }
    );
    if (!user) user = await saveGoogleUser("Cb", googleUser);

    var session = await getSession(
      "Cb",
      { userId: user._id.toString() },
      { authRequired: false, validateSession: false }
    );
    if (!session) session = await saveSession("Cb", user);

    res
      .cookie("sid", session.id, sessionCookieOptions)
      .cookie("at", session.accessToken, sessionCookieOptions)
      .cookie("rt", session.refreshToken, sessionCookieOptions)
      .redirect(`https://zyae.net/api/db/users/${user._id}`);
  } catch (err) {
    if (err instanceof AppError) return next(err);
    else return next(newInternalError("Cb", err));
  }
};