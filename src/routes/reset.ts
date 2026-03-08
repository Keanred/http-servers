import { Request, Response } from 'express';
import { config } from '../config.js';
import { deleteUsers } from 'src/db/queries/users.js';

export const reset = async (req: Request, res: Response) => {
  if (config.apiConfig.platform !== 'dev') {
    res.status(403).set('Content-Type', 'text/plain; charset=utf8').send(`Forbidden`);
    return;
  }
  config.apiConfig.serverHits = 0;
  await deleteUsers();
  res.status(200).set('Content-Type', 'text/plain; charset=utf8').send(`OK`);
};
