import { Request, Response } from 'express';
import { config } from '../config.js';

export const reset = (req: Request, res: Response) => {
  config.serverHits = 0;
  res.status(200).set('Content-Type', 'text/plain; charset=utf8').send(`OK`);
};
