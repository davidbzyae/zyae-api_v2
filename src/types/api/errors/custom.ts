import { AppError } from "./AppError";
import { ErrorDetail } from "./ErrorDetail";

// 4xx

export class BadRequestError extends AppError {
  constructor(message: string, details?: ErrorDetail[], errors?: any[]) {
    super("BadRequestError", 400, message, details, errors);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string, details?: ErrorDetail[], errors?: any[]) {
    super("UnauthorizedError", 401, message, details, errors);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string, details?: ErrorDetail[], errors?: any[]) {
    super("ForbiddenError", 403, message, details, errors);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string, details?: ErrorDetail[], errors?: any[]) {
    super("NotFoundError", 404, message, details, errors);
  }
}

export class ConflictError extends AppError {
  constructor(message: string, details?: ErrorDetail[], errors?: any[]) {
    super("ConflictError", 409, message, details, errors);
  }
}

// 5xx

export class InternalServerError extends AppError {
  constructor(message: string, details?: ErrorDetail[], errors?: any[]) {
    super("InternalServerError", 500, message, details, errors);
  }
}
