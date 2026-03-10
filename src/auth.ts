import { hash, verify } from 'argon2';
import jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';
import { UnauthorizedError } from './errors/errors';

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
  jwt.verify(token, secret);
  const payload = jwt.decode(token) as payload;
  if (!payload || !payload.sub) {
    throw new UnauthorizedError('Invalid token');
  }
  return payload.sub;
};
