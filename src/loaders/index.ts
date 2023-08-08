import { Express } from "express";
import { Server } from "http";
import { expressLoader } from "./express";
import mongoose from "mongoose";
import { mongooseLoader } from "./mongoose";
import { redisLoader } from "./redis";
import { socketLoader } from "./socketio";

export * from "./logger";
export * from "./mongoose";
export * from "./redis";
export * from "./socketio";

export const loaders = async ({
  app,
  httpServer,
}: {
  app: Express;
  httpServer: Server;
}) => {
  const io = socketLoader({ httpServer });
  await redisLoader({ io });
  await mongooseLoader();
  expressLoader({ app });
};
