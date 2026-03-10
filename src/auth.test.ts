import { getBearerToken } from './auth';
import { UnauthorizedError } from './errors/errors';
import { describe, it, expect, beforeAll } from 'vitest';
import { makeJWT, validateJWT, hashPassword, checkPasswordHash } from './auth';

describe('Hashing Tests', () => {
  const password1 = 'my_secure_password';
  const password2 = 'another_secure_password';
  let hash1: string;
  let hash2: string;

  beforeAll(async () => {
    hash1 = await hashPassword(password1);
    hash2 = await hashPassword(password2);
  });

  it('should return true for the correct password', async () => {
    const result = await checkPasswordHash(password1, hash1);
    expect(result).toBe(true);
  });

  it('should return false for an incorrect password', async () => {
    const result = await checkPasswordHash(password1, hash2);
    expect(result).toBe(false);
  });

  it('should handle empty password', async () => {
    const emptyHash = await hashPassword('');
    const result = await checkPasswordHash('', emptyHash);
    expect(result).toBe(true);
    const wrongResult = await checkPasswordHash('notempty', emptyHash);
    expect(wrongResult).toBe(false);
  });

  it('should handle special characters', async () => {
    const special = '!@#$%^&*()_+-=~`';
    const specialHash = await hashPassword(special);
    const result = await checkPasswordHash(special, specialHash);
    expect(result).toBe(true);
    const wrongResult = await checkPasswordHash('wrong', specialHash);
    expect(wrongResult).toBe(false);
  });

  it('should handle very long passwords', async () => {
    const long = 'a'.repeat(1000);
    const longHash = await hashPassword(long);
    const result = await checkPasswordHash(long, longHash);
    expect(result).toBe(true);
    const wrongResult = await checkPasswordHash('b'.repeat(1000), longHash);
    expect(wrongResult).toBe(false);
  });
});

describe('JWT Tests', () => {
  const secret = 'my_secret_key';
  const userID = 'user123';
  let token: string;

  beforeAll(() => {
    token = makeJWT(userID, 3600, secret);
  });

  it('should validate a valid token', () => {
    const result = validateJWT(token, secret);
    expect(result).toBe(userID);
  });

  it('should throw an error for an invalid token', () => {
    expect(() => validateJWT(token + 'invalid', secret)).toThrow();
  });

  it('should throw for expired token', () => {
    const expiredToken = makeJWT(userID, -1, secret); // negative expiry
    expect(() => validateJWT(expiredToken, secret)).toThrow();
  });

  it('should throw for token with wrong secret', () => {
    expect(() => validateJWT(token, 'wrong_secret')).toThrow();
  });

  it('should throw for malformed token', () => {
    expect(() => validateJWT('not.a.jwt', secret)).toThrow();
  });

  it('should throw for missing userID', () => {
    const noUserToken = makeJWT('', 3600, secret);
    expect(() => validateJWT(noUserToken, secret)).toThrow();
  });
});

const makeReq = (headerValue?: string) => {
  return {
    get: (name: string) => {
      if (name === 'Authorization') return headerValue;
      return undefined;
    }
  } as any;
};

describe('getBearerToken', () => {
  it('should return the token when Authorization header is valid', () => {
    const req = makeReq('Bearer mytoken123');
    const token = getBearerToken(req);
    expect(token).toBe('mytoken123');
  });

  it('should throw UnauthorizedError if Authorization header is missing', () => {
    const req = makeReq(undefined);
    expect(() => getBearerToken(req)).toThrow(UnauthorizedError);
  });

  it('should throw UnauthorizedError if Authorization header is malformed (no Bearer)', () => {
    const req = makeReq('mytoken123');
    expect(() => getBearerToken(req)).toThrow(UnauthorizedError);
  });

  it('should throw UnauthorizedError if Authorization header uses lowercase bearer', () => {
    const req = makeReq('bearer mytoken123');
    expect(() => getBearerToken(req)).toThrow(UnauthorizedError);
  });

  it('should throw UnauthorizedError if Authorization header has extra spaces', () => {
    const req = makeReq('Bearer    spacedtoken');
    expect(() => getBearerToken(req)).toThrow(UnauthorizedError);
  });

  it('should throw UnauthorizedError if Authorization header has missing token', () => {
    const req = makeReq('Bearer ');
    expect(() => getBearerToken(req)).toThrow(UnauthorizedError);
  });

  it('should throw UnauthorizedError if Authorization header has too many parts', () => {
    const req = makeReq('Bearer token extra');
    expect(() => getBearerToken(req)).toThrow(UnauthorizedError);
  });
});
