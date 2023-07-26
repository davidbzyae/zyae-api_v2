import crypto from "crypto";

import { redis } from "@/loaders";
import { User } from "@/models";
import { Session } from "@/types";
import { newInternalError } from "@/utils";

export const saveSession = async (
  process: string,
  user: User
): Promise<Session> => {
  process = process + ".SaveSession";

  const generateToken = () => crypto.randomBytes(64).toString("base64");

  try {
    const date = new Date();

    const sessionData: Session = {
      id: generateToken(),
      user,
      userId: user._id.toString(),
      clients: [],
      accessToken: generateToken(),
      refreshToken: generateToken(),
      expiresAt: new Date(date.getTime() + 1000 * 60 * 0.1), // 10 minutes
      updatedAt: date,
    };

    // Session data is asserted as `any` here because RedisJSON expects data to have an index signature.
    // Interfaces do not have an index signature so type `Session` (which contains interface `User` and `Date`) result in a type conflict.
    await redis.json.set(`session:${sessionData.id}`, ".", sessionData as any);

    return sessionData;
  } catch (err) {
    throw newInternalError(process, err);
  }
};
