import { Request, Response } from 'express';
import { BadRequestError } from '../errors/errors';
import { createUser } from '../db/queries/users';
import { hashPassword } from '../auth';
import { NewUser } from '../db/schema';

type CreateUserParams = {
  email: string;
  password: string;
}

type User = Omit<NewUser, "hashedPassword">;

export const createNewUser = async (req: Request, res: Response) => {
  const { email, password } = req.body as CreateUserParams;
  if (!email) {
    throw new BadRequestError('Email is required');
  }
  if (!password) {
    throw new BadRequestError('Password is required');
  }
  const returnedPassword = await hashPassword(password);

  const user = await createUser({email, hashedPassword: returnedPassword});
  const { hashedPassword, ...userResponse } = user;
  const userWithoutPassword: User = userResponse;

  if (!user) {
    throw new Error('Failed to create user');
  }

  res.status(201).json(userWithoutPassword);
}
