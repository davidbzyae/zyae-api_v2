import mongoose from "mongoose";

import config from "../config";
import { Logger } from "./logger";

export const mongooseLoader = async (): Promise<mongoose.mongo.Db> => {
  const connection = await mongoose.connect(config.mongodbUrl);

  mongoose.set("strictQuery", true);

  Logger.info(
    `Connected to mongodb '${mongoose.connection.name}' on address: '${mongoose.connection.host}:${mongoose.connection.port}'`
  );

  return connection.connection.db;
};
