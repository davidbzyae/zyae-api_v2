import { AppError } from "./AppError";
import { ErrorDetail } from "./ErrorDetail";

export interface AppErrorResponse
  extends Omit<AppError, "name" | "details" | "errors"> {
  status: string;
  details?: ErrorDetail[];
  errors?: any[];
}
