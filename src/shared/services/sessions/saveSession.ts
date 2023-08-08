import { Session } from "@/types";
import { User } from "@/models";
import crypto from "crypto";
import { newInternalError } from "@/utils";
import { redis } from "@/loaders";

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
      expiresAt: new Date(date.getTime() + 1000 * 60 * 10), // 10 minutes
      updatedAt: date,
    };

    // Session data is asserted as `any` here because RedisJSON expects data to have an index signature.
    // Interfaces do not have an index signature so type `Session` (which contains interface `User` and `Date`) results in a type conflict.
    await redis.json.set(`session:${sessionData.id}`, ".", sessionData as any);

    return sessionData;
  } catch (err) {
    throw newInternalError(process, err);
  }
};
