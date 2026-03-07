import { NextFunction, Request, Response } from 'express';
import { config } from './config.js';

type Middleware = (req: Request, res: Response, next: NextFunction) => void;

export const middlewareLogResponses: Middleware = (req: Request, res: Response, next: NextFunction): void => {
  res.on('finish', () => {
    if (res.statusCode !== 200) {
      console.log(`[NON-OK] ${req.method} ${req.path} - Status: ${res.statusCode}`);
    }
  });
  next();
}

export const middlewareMetricsInc: Middleware = (req: Request, res: Response, next: NextFunction): void => {
  config.serverHits += 1;
  next();
}
