import { Request, Response } from "express";
import { BadRequestError, UnauthorizedError } from "../errors/errors";
import { getUserByEmail } from '../db/queries/users';
import { checkPasswordHash, makeJWT, makeRefreshToken } from '../auth';
import { config } from '../config';
import { insertRefreshToken } from '../db/queries/refreshTokens';

type LoginParams = {
  email: string;
  password: string;
}

const EXPIRATION_TIME_SECONDS = 3600;
const REFRESH_TOKEN_EXPIRATION_SECONDS = 60 * 24 * 60 * 60;
const MILLISECONDS_PER_SECOND = 1000;

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body as LoginParams;
  if (!email) {
    throw new BadRequestError('Email is required');
  }
  if (!password) {
    throw new BadRequestError('Password is required');
  }

  const user = await getUserByEmail(email);
  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }
  const isPasswordValid = await checkPasswordHash(password, user.hashedPassword);
  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const token = makeJWT(user.id,  EXPIRATION_TIME_SECONDS, config.apiConfig.SECRET);
  const refreshToken = makeRefreshToken();
  const refreshTokenExpiresAt = new Date(
    Date.now() + REFRESH_TOKEN_EXPIRATION_SECONDS * MILLISECONDS_PER_SECOND,
  );
  const returnedRefreshToken = await insertRefreshToken({
    token: refreshToken,
    userId: user.id,
    expiresAt: refreshTokenExpiresAt,
  });

  if (!returnedRefreshToken) {
    throw new Error('Failed to create refresh token');
  }

  const { hashedPassword, ...userResponse } = user;

  res.status(200).json({...userResponse, token, refreshToken});
}
