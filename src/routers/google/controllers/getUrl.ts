import { NextFunction, Request, Response } from "express";

import { AppError } from "@/types";
import { newInternalError } from "@/utils";

import { client } from "../services";
import { generateAuthUrl } from "../services/generateAuthUrl";

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const url = generateAuthUrl();

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
