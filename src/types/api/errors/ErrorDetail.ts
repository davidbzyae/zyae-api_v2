// Refer to https://developers.google.com/webmaster-tools/v1/errors
export type ErrorReason =
  | "Error"
  // 4xx
  | "BadRequest" // 400
  | "InvalidParameter" // 400
  | "BadContent" // 400
  | "InvalidQuery" // 400
  | "Unauthorized" // 401
  | "Forbidden" // 403
  | "NotFound" // 404
  | "Conflict" // 409
  | "Duplicate" // 409
  // 5xx
  | "InternalError";

type ErrorDetailMetadata = {
  route?: string; // Represents the architectual route where the error occurred (e.g., db.users, auth.sessions)
  process: string; // Represents the specific process where the error occurred (e.g., GetUser.FormatUserData, CreateUser.ValidateBody)
  flags?: object; // Represents set middleware/helper flags where the error occurred (e.g., { 'throwNotFound': true, 'checkExpired': false })
};

export class ErrorDetail {
  public reason: ErrorReason;
  public message: string;
  public metadata?: ErrorDetailMetadata;
  /**
   * @param reason Unique identifier for this error. Different from the error.code property in that this is not an http response code.
   * @param message A human readable message providing more details about the error. If there is only one error, this field will match error.message.
   * @param metadata Additional contextual information related to the error.
   */
  constructor(
    reason: ErrorReason,
    message: string,
    metadata?: ErrorDetailMetadata
  ) {
    this.reason = reason;
    this.message = message;
    this.metadata = metadata;
  }
}
