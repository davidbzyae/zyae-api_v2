import { BadRequestError, ErrorDetail, ErrorReason } from "@/types";

import { AnySchema } from "joi";

const getErrorMetaData = (
  type: string
): { process: string; reason: ErrorReason; message: string } => {
  switch (type) {
    case "body":
      return {
        process: "ValidateBody",
        reason: "BadContent",
        message: "Bad request body",
      };
    case "params":
      return {
        process: "ValidateParams",
        reason: "InvalidParameter",
        message: "Bad request parameters",
      };
    case "query":
      return {
        process: "ValidateQuery",
        reason: "InvalidQuery",
        message: "Bad request query",
      };
    case "cookies":
      return {
        process: "ValidateCookies",
        reason: "BadContent",
        message: "Bad request cookies",
      };
    case "data":
      return {
        process: "ValidateRequestData",
        reason: "BadContent",
        message: "Bad request data",
      };
  }
};

export const validate = (
  process: string,
  value: any,
  valueType: "body" | "params" | "query" | "cookies" | "data" = "data",
  validator: AnySchema
) => {
  const errorMetaData = getErrorMetaData(valueType);
  process = process + `.${errorMetaData.process}`;

  const { error } = validator.validate(value, { abortEarly: false });

  if (error) {
    throw new BadRequestError(
      errorMetaData.message,
      // details,
      [
        new ErrorDetail(errorMetaData.reason, error.message, {
          process,
        }),
      ],
      [error]
    );
  }
};
