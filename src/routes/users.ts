import { Request, Response } from 'express';
import { BadRequestError } from '../errors/errors';
import { createUser } from 'src/db/queries/users';

type params = {
  email: string;
}

export const createNewUser = async (req: Request, res: Response) => {
  const email: params = req.body.email;
  if (!email) {
    throw new BadRequestError('Email is required');
  }

  const user = await createUser(email);

  if (!user) {
    throw new Error('Failed to create user');
  }

  res.status(201).json(user);
}
