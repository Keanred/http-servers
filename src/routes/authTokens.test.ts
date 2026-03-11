import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BadRequestError, UnauthorizedError } from '../errors/errors';

const {
  getUserFromRefreshTokenMock,
  getRefreshTokenMock,
  revokeRefreshTokenMock,
  makeJWTMock,
} = vi.hoisted(() => ({
  getUserFromRefreshTokenMock: vi.fn(),
  getRefreshTokenMock: vi.fn(),
  revokeRefreshTokenMock: vi.fn(),
  makeJWTMock: vi.fn(),
}));

vi.mock('../db/queries/refreshTokens', () => ({
  getUserFromRefreshToken: getUserFromRefreshTokenMock,
  getRefreshToken: getRefreshTokenMock,
  revokeRefreshToken: revokeRefreshTokenMock,
}));

vi.mock('../auth', () => ({
  getBearerToken: vi.fn((req: { get: (name: string) => string | undefined }) => {
    const authHeader = req.get('Authorization');

    if (!authHeader) {
      throw new UnauthorizedError('Missing Authorization header');
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer' || !parts[1] || parts[1].trim() === '') {
      throw new UnauthorizedError('Invalid Authorization header format');
    }

    return parts[1];
  }),
  makeJWT: makeJWTMock,
}));

vi.mock('../config', () => ({
  config: {
    apiConfig: {
      SECRET: 'test-secret',
    },
  },
}));

import { refreshToken } from './refresh';
import { revokeToken } from './revoke';

const makeReq = (headerValue?: string) => {
  return {
    get: (name: string) => {
      if (name === 'Authorization') {
        return headerValue;
      }

      return undefined;
    },
  } as any;
};

const makeRes = () => {
  const res = {
    status: vi.fn(),
    json: vi.fn(),
    send: vi.fn(),
  } as any;

  res.status.mockReturnValue(res);
  res.json.mockReturnValue(res);
  res.send.mockReturnValue(res);

  return res;
};

describe('refreshToken', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns a newly created one hour access token for the refresh token user', async () => {
    getUserFromRefreshTokenMock.mockResolvedValue({
      refreshToken: {
        revokedAt: null,
        expiresAt: new Date(Date.now() + 60_000),
      },
      user: {
        id: 'user-123',
      },
    });
    makeJWTMock.mockReturnValue('new-access-token');

    const req = makeReq('Bearer refresh-token');
    const res = makeRes();

    await refreshToken(req, res);

    expect(getUserFromRefreshTokenMock).toHaveBeenCalledWith('refresh-token');
    expect(makeJWTMock).toHaveBeenCalledWith('user-123', 3600, 'test-secret');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ token: 'new-access-token' });
  });

  it('rejects revoked refresh tokens', async () => {
    getUserFromRefreshTokenMock.mockResolvedValue({
      refreshToken: {
        revokedAt: new Date(),
        expiresAt: new Date(Date.now() + 60_000),
      },
      user: {
        id: 'user-123',
      },
    });

    const req = makeReq('Bearer refresh-token');
    const res = makeRes();

    await expect(refreshToken(req, res)).rejects.toThrow(UnauthorizedError);
    expect(makeJWTMock).not.toHaveBeenCalled();
  });

  it('rejects refresh tokens that are not in the database', async () => {
    getUserFromRefreshTokenMock.mockResolvedValue(undefined);

    const req = makeReq('Bearer missing-refresh-token');
    const res = makeRes();

    await expect(refreshToken(req, res)).rejects.toThrow(UnauthorizedError);
    expect(makeJWTMock).not.toHaveBeenCalled();
  });

  it('rejects expired refresh tokens', async () => {
    getUserFromRefreshTokenMock.mockResolvedValue({
      refreshToken: {
        revokedAt: null,
        expiresAt: new Date(Date.now() - 60_000),
      },
      user: {
        id: 'user-123',
      },
    });

    const req = makeReq('Bearer refresh-token');
    const res = makeRes();

    await expect(refreshToken(req, res)).rejects.toThrow(UnauthorizedError);
    expect(makeJWTMock).not.toHaveBeenCalled();
  });
});

describe('revokeToken', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('revokes the matching refresh token and returns 204', async () => {
    getRefreshTokenMock.mockResolvedValue({
      token: 'refresh-token',
    });
    revokeRefreshTokenMock.mockResolvedValue({
      token: 'refresh-token',
    });

    const req = makeReq('Bearer refresh-token');
    const res = makeRes();

    await revokeToken(req, res);

    expect(getRefreshTokenMock).toHaveBeenCalledWith('refresh-token');
    expect(revokeRefreshTokenMock).toHaveBeenCalledWith('refresh-token');
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  it('requires a bearer token header', async () => {
    const req = makeReq(undefined);
    const res = makeRes();

    await expect(revokeToken(req, res)).rejects.toThrow(UnauthorizedError);
    expect(revokeRefreshTokenMock).not.toHaveBeenCalled();
  });
});