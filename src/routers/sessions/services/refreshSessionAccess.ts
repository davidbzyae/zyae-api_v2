import { generateToken, newInternalError } from "@/utils";

import { Session } from "@/types";
import { redis } from "@/loaders";

export const refreshSessionAccess = async (
  process: string,
  session: Session
) => {
  try {
    const date = new Date();

    const refreshedSession: Session = {
      ...session,
      accessToken: generateToken(),
      refreshToken: generateToken(),
      expiresAt: new Date(date.getTime() + 1000 * 60 * 10), // 10 minutes
      updatedAt: date,
    };
    redis.json.set(`session:${session.id}`, ".", refreshedSession as any);
    return refreshedSession;
  } catch (err) {
    throw newInternalError(process, err);
  }
};
