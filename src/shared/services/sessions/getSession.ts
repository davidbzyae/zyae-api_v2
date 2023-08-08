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

type SessionDoc<Validated extends boolean> = Validated extends true
  ? Session
  : void | Session;

export const getSession = async <T extends boolean>(
  process: string,
  filter: DeepPartial<Session>,
  flags: {
    authRequired: boolean;
    validateSession: T;
  }
): Promise<SessionDoc<T>> => {
  try {
    process = process + ".GetSession";

    const session = (
      await matchRedisKeys<Session>(process, "session", filter)
    )[0];

    if (
      flags.validateSession &&
      (!session || new Date() > new Date(session.expiresAt))
    ) {
      const expired = !!session;

      throw new (
        flags.authRequired || expired ? UnauthorizedError : NotFoundError
      )(expired ? "Session access expired" : "Session not found", [
        new ErrorDetail(
          flags.authRequired || expired ? "Unauthorized" : "NotFound",
          expired ? "Session access expired" : "Session not found",
          {
            process,
            flags,
          }
        ),
      ]);
    }

    return session as SessionDoc<T>;
  } catch (err) {
    if (err instanceof AppError) throw err;
    else throw newInternalError(process, err);
  }
};
