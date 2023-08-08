import {
  BadRequestError,
  ErrorDetail,
  ErrorReason,
  UnauthorizedError,
} from "@/types";

import { AnySchema } from "joi";
import { cookieTokensSchema } from "@/schemas";

export const validateSessionTokens = (process: string, cookies: any) => {
  process = process + `.ValidateSessionTokens`;

  const { error } = cookieTokensSchema.validate(cookies, { abortEarly: false });

  if (error) {
    throw new UnauthorizedError(
      "Invalid session tokens",
      [
        new ErrorDetail("BadContent", error.message, {
          process,
        }),
      ],
      [error]
    );
  }
};
