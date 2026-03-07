import type { Request, Response } from 'express';

export const readinessHandler = (req: Request, res: Response) => {
  res.status(200).set('Content-Type', 'text/plain; charset=utf8').send('OK');
};
