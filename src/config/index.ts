import { CookieOptions } from "express";
import dotenv from "dotenv";

process.title = "zyae-api_v2";
process.env.NODE_ENV = process.env.NODE_ENV || "development";
Error.stackTraceLimit = process.env.NODE_ENV === "production" ? -1 : 10;

const envFound = dotenv.config();
if (envFound.error) {
  throw new Error("Couldn't find .env file");
}

export default {
  port: parseInt(process.env.PORT, 10),
  mongodbUrl: process.env.MONGODB_URI,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  logs: {
    level: process.env.LOG_LEVEL || "silly",
  },
  corsWhitelist: ["https://zyae.net:3000", "https://zyae.net:3001"],
};

export const sessionCookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: "strict",
  secure: true,
  maxAge: 1000 * 60 * 60 * 24 * 2, // 2 days
};
