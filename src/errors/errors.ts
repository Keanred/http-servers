export class BadRequestError extends Error {
  constructor(message: string = 'Bad Request') {
    super(message);
    this.name = 'BadRequestError';
    Error.captureStackTrace?.(this, BadRequestError);
  }
}

export class ForbiddenError extends Error {
  constructor(message: string = 'Forbidden') {
    super(message);
    this.name = 'ForbiddenError';
    Error.captureStackTrace?.(this, ForbiddenError);
  }
}

export class NotFoundError extends Error {
  constructor(message: string = 'Not Found') {
    super(message);
    this.name = 'NotFoundError';
    Error.captureStackTrace?.(this, NotFoundError);
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
    Error.captureStackTrace?.(this, UnauthorizedError);
  }
}
