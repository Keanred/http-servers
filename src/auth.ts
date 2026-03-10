import { hash, verify } from 'argon2';
import jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';
import { UnauthorizedError } from './errors/errors';
import { Request } from 'express';

type payload = Pick<JwtPayload, 'iss' | 'sub' | 'iat' | 'exp'>;

export const hashPassword = async (password: string): Promise<string> => {
  return await hash(password);
};

export const checkPasswordHash = async (password: string, hash: string): Promise<boolean> => {
  return await verify(hash, password);
};

export const makeJWT = (userID: string, expiresIn: number, secret: string): string => {
  const expiresInSeconds = expiresIn > 3600 ? 3600 : expiresIn;
  const payload: payload = {
    iss: 'chirpy',
    sub: userID,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
  };
  return jwt.sign(payload, secret);
}

export const validateJWT = (token: string, secret: string): string => {
  jwt.verify(token, secret);
  const payload = jwt.decode(token) as payload;
  if (!payload || !payload.sub) {
    throw new UnauthorizedError('Invalid token');
  }
  return payload.sub;
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
