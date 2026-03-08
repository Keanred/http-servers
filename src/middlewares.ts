import { NextFunction, Request, Response } from 'express';
import { config } from './config.js';
import type { Middleware } from './types/middleware.js';
import { BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError } from './errors/errors';

export const middlewareLogResponses: Middleware = (req: Request, res: Response, next: NextFunction): void => {
  res.on('finish', () => {
    if (res.statusCode !== 200) {
      console.log(`[NON-OK] ${req.method} ${req.path} - Status: ${res.statusCode}`);
    }
  });
  next();
};

export const middlewareMetricsInc: Middleware = (req: Request, res: Response, next: NextFunction): void => {
  config.serverHits += 1;
  next();
};

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  console.log(err);

  let status = 500;
  let message = 'Internal Server Error';

  if (err instanceof BadRequestError) {
    status = 400;
    message = err.message;
  } else if (err instanceof UnauthorizedError) {
    status = 401;
    message = err.message;
  } else if (err instanceof ForbiddenError) {
    status = 403;
    message = err.message;
  } else if (err instanceof NotFoundError) {
    status = 404;
    message = err.message;
  }
  res.status(status).json({ error: message });
};
