import { AppError, Client, DeviceInfo } from "@/types";
import { NextFunction, Request, Response } from "express";
import { appendClient, getGeoLocation } from "../services";

import Joi from "joi";
import { newInternalError } from "@/utils";
import { validate } from "@/shared";

export default async (req: Request, res: Response, next: NextFunction) => {
  type Body = { client: Omit<Client, "ipAddress" | "geoLocation"> };

  try {
    validate(
      "AppendClient",
      req.body,
      "body",
      Joi.object({
        client: Joi.object<Client>({
          app: Joi.string().valid("idle", "bytes", "music").required(),
          socketId: Joi.string().required(),
          userAgent: Joi.string().required(),
          deviceInfo: Joi.object<DeviceInfo>({
            os: Joi.string().required(),
            browser: Joi.string().required(),
          }),
        }).required(),
      })
    );

    const body: Body = req.body;
    var ip = req.ip;

    // assign local ip to random ip for testing
    if (ip == "::ffff:127.0.0.1") ip = "::ffff:161.123.154.78";

    const geoLocation = getGeoLocation("AppendClient", ip);

    const client: Client = {
      app: body.client.app,
      socketId: body.client.socketId,
      ipAddress: ip,
      userAgent: body.client.userAgent,
      deviceInfo: body.client.deviceInfo,
      geoLocation: geoLocation || null,
    };

    await appendClient("AppendClient", res.locals.session.id, client);
    res.status(201).json({
      data: {
        client,
      },
    });
  } catch (err) {
    if (err instanceof AppError) return next(err);
    else return next(newInternalError("AppendClient", err));
  }
};
