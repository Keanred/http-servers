import { Request, Response } from "express";
import { BadRequestError, UnauthorizedError } from "../errors/errors";
import { getRefreshToken, revokeRefreshToken } from '../db/queries/refreshTokens';

export const revokeToken = async (req: Request, res: Response) => {
  const authorizationHeader = req.get('Authorization');
  if (!authorizationHeader) {
    throw new BadRequestError('Missing Authorization header');
  }
  const splitHeader = authorizationHeader.split(' ');
  if (splitHeader.length !== 2 || splitHeader[0] !== 'Bearer') {
    throw new BadRequestError('Invalid Authorization header format');
  }
  const token = splitHeader[1];
  if (!token || token.trim() === '') {
    throw new BadRequestError('Missing Bearer token');
  }

  const refreshToken = await getRefreshToken(token);
  if (!refreshToken) {
    throw new UnauthorizedError('Invalid refresh token');
  }

  await revokeRefreshToken(token);

  res.status(204).send();
}
