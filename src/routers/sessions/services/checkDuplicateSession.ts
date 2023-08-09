import { AppError, ConflictError, CookieTokens, ErrorDetail } from "@/types";

import { getSession } from "@/shared";
import { newInternalError } from "@/utils";

export const checkDuplicateSession = async (
  process: string,
  tokens: CookieTokens
) => {
  try {
    process = process + ".CheckDuplicateSession";
    const session = await getSession(
      process,
      {
        id: tokens.sid,
      },
      {
        checkExists: false,
        checkExpired: false,
      }
    );
    if (session)
      throw new ConflictError("Active session already exists", [
        new ErrorDetail("Duplicate", "Active session already exists", {
          process,
        }),
      ]);
  } catch (err) {
    if (err instanceof AppError) throw err;
    else throw newInternalError(process, err);
  }
};
