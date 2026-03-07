import { Request, Response } from 'express';
import { config } from 'src/config.js';

export const metricsHandler = (req: Request, res: Response) => {
  res.status(200).set('Content-Type', 'text/plain; charset=utf8').send(`Hits: ${config.serverHits}`);
};
