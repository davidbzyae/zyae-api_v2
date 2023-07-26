import { ErrorDetail, InternalServerError } from "@/types";

export const newInternalError = (process: string, err: any) =>
  new InternalServerError(
    err.message,
    [
      new ErrorDetail(err.name || "InternalError", err.message, {
        process,
      }),
    ],
    [err]
  );
