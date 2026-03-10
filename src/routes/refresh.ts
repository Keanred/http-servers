import { Request, Response } from "express";
import { UnauthorizedError } from "../errors/errors";
import { getBearerToken, makeJWT } from "../auth";
import { config } from "../config";
import { getUserFromRefreshToken } from "../db/queries/refreshTokens";

const ACCESS_TOKEN_EXPIRATION_SECONDS = 60 * 60;

export const refreshToken = async (req: Request, res: Response) => {
  const token = getBearerToken(req);

  const refreshTokenRecord = await getUserFromRefreshToken(token);
  if (!refreshTokenRecord) {
    throw new UnauthorizedError('Invalid refresh token');
  }

  if (refreshTokenRecord.refreshToken.revokedAt) {
    throw new UnauthorizedError('Refresh token has been revoked');
  }

  if (refreshTokenRecord.refreshToken.expiresAt < new Date()) {
    throw new UnauthorizedError('Refresh token has expired');
  }

  const tokenResponse = makeJWT(
    refreshTokenRecord.user.id,
    ACCESS_TOKEN_EXPIRATION_SECONDS,
    config.apiConfig.SECRET,
  );

  res.status(200).json({ token: tokenResponse });
}
