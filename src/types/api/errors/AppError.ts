import { ErrorDetail } from "./ErrorDetail";

export class AppError extends Error {
  public code: number; // Represents the code for this error. This property value will usually represent the HTTP response code. If there are multiple errors, code will be the error code for the first error.
  public message: string; // A human readable message providing more details about the error. If there are multiple errors, message will be the message for the first error.
  public details: ErrorDetail[]; // Container for any additional information regarding the error. If the service returns multiple errors, each element in the details array represents a different error.
  public errors: any[]; // Container for any additional errors. If the service is in production mode this property will not be returned.

  constructor(
    name: string,
    code: number,
    message: string,
    details?: ErrorDetail[],
    errors?: any[]
  ) {
    super(message);
    this.name = name;
    this.code = code;
    this.message = message;
    this.details = details || [];
    this.errors = errors || [];
  }
}
