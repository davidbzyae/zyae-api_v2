import { Logger } from "./logger";
import config from "../config";
import mongoose from "mongoose";

export const mongooseLoader = async (): Promise<mongoose.mongo.Db> => {
  const connection = await mongoose.connect(config.mongodbUrl);

  mongoose.set("strictQuery", true);

  Logger.info(
    `Connected to mongodb '${mongoose.connection.name}' on address: '${mongoose.connection.host}:${mongoose.connection.port}'`
  );

  return connection.connection.db;
};
