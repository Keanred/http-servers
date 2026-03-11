import { Request, Response } from 'express';
import { BadRequestError, UnauthorizedError } from '../errors/errors';
import { createUser, updateUser } from '../db/queries/users';
import { getBearerToken, hashPassword, validateJWT } from '../auth';
import { User } from '../db/schema';
import { config } from '../config';

type CreateUserParams = {
  email: string;
  password: string;
}

type NewUser = Omit<User, "hashedPassword">;

export const createNewUser = async (req: Request, res: Response) => {
  const { email, password } = req.body as CreateUserParams;
  if (!email) {
    throw new BadRequestError('Email is required');
  }
  if (!password) {
    throw new BadRequestError('Password is required');
  }
  const returnedPassword = await hashPassword(password);

  const user = await createUser({ email, hashedPassword: returnedPassword });
  if (!user) {
    throw new Error('Failed to create user');
  }

  const { hashedPassword, ...userResponse } = user;
  const userWithoutPassword: NewUser = userResponse;

  res.status(201).json(userWithoutPassword);
}

export const updateExistingUser = async (req: Request, res: Response) => {
  const { email, password } = req.body as CreateUserParams;
  if (!email) {
    throw new BadRequestError('Email is required');
  }
  if (!password) {
    throw new BadRequestError('Password is required');
  }
  const token = getBearerToken(req);

  const hashedPassword = await hashPassword(password);

  const userId = validateJWT(token, config.apiConfig.SECRET);
  if (!userId) {
    throw new UnauthorizedError('Invalid token');
  }

  const user = await updateUser(userId, { email, hashedPassword });
  const { hashedPassword: _, ...userResponse } = user;

  res.status(200).json(userResponse);
}
