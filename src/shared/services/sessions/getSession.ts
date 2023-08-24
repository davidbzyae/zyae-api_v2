import {
  AppError,
  DeepPartial,
  ErrorDetail,
  NotFoundError,
  Session,
  UnauthorizedError,
} from "@/types";

import { matchRedisKeys } from "@/shared";
import { newInternalError } from "@/utils";

type SessionDoc<CheckExists extends boolean> = CheckExists extends true
  ? Session
  : void | Session;

export const getSession = async <T extends boolean>(
  process: string,
  filter: DeepPartial<Session>,
  flags: {
    checkExists: T;
    checkExpired: boolean;
  }
): Promise<SessionDoc<T>> => {
  try {
    process = process + ".GetSession";

    const session = (
      await matchRedisKeys<Session>(process, "session", filter)
    )[0];

    if (flags.checkExists && !session)
      throw new (flags.checkExpired ? UnauthorizedError : NotFoundError)(
        "Session not found",
        [
          new ErrorDetail(
            flags.checkExpired ? "Unauthorized" : "NotFound",
            "Session not found",
            {
              process,
              flags,
            }
          ),
        ]
      );

    if (
      session &&
      flags.checkExpired &&
      new Date() > new Date(session.expiresAt)
    )
      throw new UnauthorizedError("Session access expired", [
        new ErrorDetail("Unauthorized", "Session access expired", {
          process,
          flags,
        }),
      ]);

    return session as SessionDoc<T>;
  } catch (err) {
    if (err instanceof AppError) throw err;
    else throw newInternalError(process, err);
  }
};
