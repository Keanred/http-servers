export class ForbiddenError extends Error {
  constructor(message: string = 'Forbidden') {
    super(message);
    this.name = 'ForbiddenError';
    Error.captureStackTrace?.(this, ForbiddenError);
  }
}
