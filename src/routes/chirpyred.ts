import { Request, Response } from 'express';
import { setChirpyRed } from '../db/queries/users';
import { getAPIKey } from '../auth';
import { config } from '../config';
import { UnauthorizedError } from '../errors/errors';

type ChirpyRedWebhookParams = {
  event: string;
  data: {
    userId: string;
  }
};

export const chirpyRedWebhook = async (req: Request, res: Response) => {
  const { event, data } = req.body as ChirpyRedWebhookParams;
  const apiKey = getAPIKey(req);
  if (apiKey !== config.apiConfig.POLKA_KEY) {
    throw new UnauthorizedError('Invalid API key');
  }
  if (event === "user.upgraded") {
    const result = await setChirpyRed(data.userId, true);
    if (!result) {
      return res.status(404).send();
    }
    return res.status(204).send();
  }
  res.status(204).send();
}
