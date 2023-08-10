import { NextFunction, Request, Response } from "express";

import { AppError } from "@/types";
import { client } from "../services";
import { generateAuthUrl } from "../services/generateAuthUrl";
import { newInternalError } from "@/utils";

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const redirectUrl = req.query.rd;

    const url = generateAuthUrl(redirectUrl?.toString() || "https://zyae.net/");

    res.json({
      data: {
        url,
      },
    });
  } catch (err) {
    if (err instanceof AppError) return next(err);
    else return next(newInternalError("GetUrl", err));
  }
};
