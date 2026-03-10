import { Request, Response } from "express";
import { BadRequestError, UnauthorizedError } from "src/errors/errors";
import { getUserByEmail } from '../db/queries/users';
import { checkPasswordHash } from '../auth';
import { makeJWT } from '../auth';
import { config } from '../config';

type LoginParams = {
  email: string;
  password: string;
  expiresInSeconds?: number;
}

export const login = async (req: Request, res: Response) => {
  const { email, password, expiresInSeconds } = req.body as LoginParams;
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

  const token = makeJWT(user.id, expiresInSeconds || 3600, config.apiConfig.SECRET);

  const { hashedPassword, ...userResponse } = user;

  res.status(200).json({userResponse, token});
}
