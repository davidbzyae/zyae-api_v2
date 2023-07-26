import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Express, NextFunction, Request, Response } from "express";

import config from "@/config";
import { googleRouter, sessionsRouter, usersRouter } from "@/routers/";
import middleware from "@/shared/middleware";
import {
  AppError,
  AppErrorResponse,
  ForbiddenError,
  NotFoundError,
} from "@/types";

import { Logger } from "./logger";

export const expressLoader = ({ app }: { app: Express }) => {
  app.disable("x-powered-by");
  app.enable("trust proxy");
  app.use(express.json());
  app.use(cookieParser());
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || config.corsWhitelist.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new ForbiddenError("Cross-Origin request blocked"), false);
        }
      },
      credentials: true,
    })
  );

  // routes

  // auth
  app.use("/auth/google", middleware.appendRoute("auth.google"), googleRouter);
  app.use(
    "/auth/sessions",
    middleware.appendRoute("auth.sessions"),
    sessionsRouter
  );

  // db
  app.use("/db/users", middleware.appendRoute("db.users"), usersRouter);

  // errors

  app.all("*", (req, res, next) => next(new NotFoundError("Route not found")));

  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    next(err);
    Logger.error(err);
  });

  // handle AppError
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      const responseError: AppErrorResponse = {
        code: err.code,
        message: err.message,
        status: err.name,
      };

      if (err.details.length > 0) {
        const details = err.details.map((detail) => {
          if (detail.reason == "Error") detail.reason = "InternalError";
          detail.metadata = {
            route: res.locals.route,
            process: detail.metadata.process,
            flags: detail.metadata.flags,
          };

          return detail;
        });
        responseError.details = details;
      }
      // only include errors container if service is in development mode
      if (process.env.NODE_ENV == "development" && err.errors.length > 0)
        responseError.errors = err.errors.map((err) => ({
          name: err.name,
          message: err.message,
          stack: err.stack,
          raw: err,
        }));

      res.status(responseError.code).json({ error: responseError });
    } else next(err);
  });

  // handle SyntaxError
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof SyntaxError) {
      const responseError: AppErrorResponse = {
        code: 400,
        message: err.message,
        status: err.name,
      };

      if (process.env.NODE_ENV == "development") responseError.errors = [err];

      res.status(responseError.code).json({ error: responseError });
    } else next(err);
  });

  // handle unknown errors
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const responseError: AppErrorResponse = {
      code: err.statusCode || err.code || err.status,
      message: err.message || "Unexpected error occured",
      status: err.name || "InternalError",
    };

    if (typeof responseError.code !== "number") responseError.code = 500;
    if (process.env.NODE_ENV == "development") responseError.errors = [err];

    res.status(responseError.code).json({ error: responseError });
  });
};
