import { Request, Response } from "express";
import { UnauthorizedError } from "../errors/errors";
import { getRefreshToken, revokeRefreshToken } from '../db/queries/refreshTokens';
import { getBearerToken } from '../auth';

export const revokeToken = async (req: Request, res: Response) => {
  const token = getBearerToken(req);

  const refreshToken = await getRefreshToken(token);
  if (!refreshToken) {
    throw new UnauthorizedError('Invalid refresh token');
  }

  await revokeRefreshToken(token);

  res.status(204).send();
}
