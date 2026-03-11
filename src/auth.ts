import { hash, verify } from 'argon2';
import jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';
import { UnauthorizedError } from './errors/errors';
import { Request } from 'express';
import { randomBytes } from 'node:crypto';

type payload = Pick<JwtPayload, 'iss' | 'sub' | 'iat' | 'exp'>;

export const hashPassword = async (password: string): Promise<string> => {
  return await hash(password);
};

export const checkPasswordHash = async (password: string, hash: string): Promise<boolean> => {
  return await verify(hash, password);
};

export const makeJWT = (userID: string, expiresIn: number, secret: string): string => {
  const payload: payload = {
    iss: 'chirpy',
    sub: userID,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + expiresIn,
  };
  return jwt.sign(payload, secret);
}

export const validateJWT = (token: string, secret: string): string => {
  try {
    const decoded = jwt.verify(token, secret) as payload | string;
    if (!decoded || typeof decoded === 'string' || !decoded.sub) {
      throw new UnauthorizedError('Invalid token');
    }

    return decoded.sub;
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw error;
    }

    throw new UnauthorizedError('Invalid token');
  }
};

export const getBearerToken = (req: Request): string => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    throw new UnauthorizedError('Missing Authorization header');
  }
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    throw new UnauthorizedError('Invalid Authorization header format');
  }
  const token = parts[1];
  if (!token || token.trim() === '') {
    throw new UnauthorizedError('Missing Bearer token');
  }
  return token;
}

export const makeRefreshToken = () => {
    return randomBytes(32).toString('hex');
}

export const getAPIKey = (req: Request): string => {
  // Authorization: ApiKey THE_KEY_HERE
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    throw new UnauthorizedError('Missing Authorization header');
  }
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'ApiKey') {
    throw new UnauthorizedError('Invalid Authorization header format');
  }
  const token = parts[1];
  if (!token || token.trim() === '') {
    throw new UnauthorizedError('Missing API key');
  }
  return token;
}
