import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BadRequestError, UnauthorizedError } from '../errors/errors';

const {
  getUserByEmailMock,
  checkPasswordHashMock,
  makeJWTMock,
  makeRefreshTokenMock,
  insertRefreshTokenMock,
} = vi.hoisted(() => ({
  getUserByEmailMock: vi.fn(),
  checkPasswordHashMock: vi.fn(),
  makeJWTMock: vi.fn(),
  makeRefreshTokenMock: vi.fn(),
  insertRefreshTokenMock: vi.fn(),
}));

vi.mock('../db/queries/users', () => ({
  getUserByEmail: getUserByEmailMock,
}));

vi.mock('../db/queries/refreshTokens', () => ({
  insertRefreshToken: insertRefreshTokenMock,
}));

vi.mock('../auth', () => ({
  checkPasswordHash: checkPasswordHashMock,
  makeJWT: makeJWTMock,
  makeRefreshToken: makeRefreshTokenMock,
}));

vi.mock('../config', () => ({
  config: {
    apiConfig: {
      SECRET: 'test-secret',
    },
  },
}));

import { login } from './login';

const makeReq = (body: Record<string, unknown>) => ({
  body,
}) as any;

const makeRes = () => {
  const res = {
    status: vi.fn(),
    json: vi.fn(),
  } as any;

  res.status.mockReturnValue(res);
  res.json.mockReturnValue(res);

  return res;
};

describe('login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('stores a refresh token with a future expiration and returns both tokens', async () => {
    const now = Date.now();
    const sixtyDaysInMilliseconds = 60 * 24 * 60 * 60 * 1000;

    getUserByEmailMock.mockResolvedValue({
      id: 'user-123',
      email: 'saul@example.com',
      hashedPassword: 'hashed-password',
    });
    checkPasswordHashMock.mockResolvedValue(true);
    makeJWTMock.mockReturnValue('new-access-token');
    makeRefreshTokenMock.mockReturnValue('new-refresh-token');
    insertRefreshTokenMock.mockImplementation(async (tokenRecord) => tokenRecord);

    const req = makeReq({ email: 'saul@example.com', password: 'better-call-saul' });
    const res = makeRes();

    await login(req, res);

    expect(makeJWTMock).toHaveBeenCalledWith('user-123', 3600, 'test-secret');
    expect(insertRefreshTokenMock).toHaveBeenCalledTimes(1);

    const savedRefreshToken = insertRefreshTokenMock.mock.calls[0][0];
    expect(savedRefreshToken).toMatchObject({
      token: 'new-refresh-token',
      userId: 'user-123',
    });
    expect(savedRefreshToken.expiresAt).toBeInstanceOf(Date);
    expect(savedRefreshToken.expiresAt.getTime()).toBeGreaterThan(now);
    expect(savedRefreshToken.expiresAt.getTime()).toBeGreaterThanOrEqual(now + sixtyDaysInMilliseconds - 1_000);
    expect(savedRefreshToken.expiresAt.getTime()).toBeLessThanOrEqual(now + sixtyDaysInMilliseconds + 1_000);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      userResponse: {
        id: 'user-123',
        email: 'saul@example.com',
      },
      token: 'new-access-token',
      refreshToken: 'new-refresh-token',
    });
  });

  it('rejects invalid credentials', async () => {
    getUserByEmailMock.mockResolvedValue({
      id: 'user-123',
      email: 'saul@example.com',
      hashedPassword: 'hashed-password',
    });
    checkPasswordHashMock.mockResolvedValue(false);

    const req = makeReq({ email: 'saul@example.com', password: 'wrong-password' });
    const res = makeRes();

    await expect(login(req, res)).rejects.toThrow(UnauthorizedError);
    expect(insertRefreshTokenMock).not.toHaveBeenCalled();
  });

  it('requires an email', async () => {
    const req = makeReq({ password: 'better-call-saul' });
    const res = makeRes();

    await expect(login(req, res)).rejects.toThrow(BadRequestError);
  });
});