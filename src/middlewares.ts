import { NextFunction, Request, Response } from 'express';
import { config } from './config.js';
import type { Middleware } from './types/Middleware.js';

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

  const customErrors = ['BadRequestError', 'UnauthorizedError', 'ForbiddenError', 'NotFoundError'];

  if (customErrors.includes(err.name)) {
    if (err.name === 'BadRequestError') {
      status = 400;
    } else if (err.name === 'UnauthorizedError') {
      status = 401;
    } else if (err.name === 'ForbiddenError') {
      status = 403;
    } else if (err.name === 'NotFoundError') {
      status = 404;
    }
    message = err.message;
    res.status(status).json({ error: message });
  } else {
    res.status(status).json({ error: message });
  }
};
