import { Request, Response } from 'express';
import { setChirpyRed } from '../db/queries/users';
import { getAPIKey } from '../auth';

type ChirpyRedWebhookParams = {
  event: string;
  data: {
    userId: string;
  }
};

export const chirpyRedWebhook = async (req: Request, res: Response) => {
  const { event, data } = req.body as ChirpyRedWebhookParams;
  const apiKey = getAPIKey(req);
  if (apiKey !== process.env.POLKA_KEY) {
    return res.status(401).send();
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
