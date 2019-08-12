const axios = require('axios');
const config = require('config');
const log = require('npmlog');
const MockAdapter = require('axios-mock-adapter');

const auth = require('../../../src/components/auth');
const {
  acronymService,
  userService
} = require('../../../src/services');
const utils = require('../../../src/components/utils');

log.level = config.get('server.logLevel');
const mockAxios = new MockAdapter(axios);

const userId = '00000000-0000-0000-0000-000000000000';
const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjF9.2H0EJnt58ApysedXcvNUAy6FhgBIbDmPfq9d79qF4yQ';
const endlessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjB9.JWKPB-5Q8rTYzl-MfhRGpP9WpDpQxC7JkIAGFMDZnpg';
const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTksInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJNU1NDIiwib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiIsIkRPTU8iXX19.4YqQAETI2DnYVsQ7a4R998z5OUyRVcUQIAV7GY3LwG0';

describe('isTokenExpired', () => {
  it('should return true if expired', async () => {
    const result = auth.isTokenExpired(expiredToken);
    expect(result).toBeTruthy();
  });

  it('should return false if no expiry', () => {
    const result = auth.isTokenExpired(endlessToken);
    expect(result).toBeFalsy();
  });

  it('should return false if not expired yet', () => {
    const result = auth.isTokenExpired(validToken);
    expect(result).toBeFalsy();
  });
});

describe('isRenewable', () => {
  it('should return false if expired', async () => {
    const result = auth.isRenewable(expiredToken);
    expect(result).toBeFalsy();
  });

  it('should return true if no expiry', () => {
    const result = auth.isRenewable(endlessToken);
    expect(result).toBeTruthy();
  });

  it('should return true if not expired yet', () => {
    const result = auth.isRenewable(validToken);
    expect(result).toBeTruthy();
  });
});

describe('renew', () => {
  const url = 'http://token.endpoint';
  const discovery = {
    token_endpoint: url,
    scopes_supported: ['openid', 'offline_access'],
  };

  const spy = jest.spyOn(utils, 'getOidcDiscovery');
  jest.mock('../../../src/components/utils');

  afterEach(() => {
    spy.mockClear();
  });

  it('should return new access and refresh tokens', async () => {
    utils.getOidcDiscovery.mockResolvedValue(discovery);
    mockAxios.onPost(url).reply(200, {
      access_token: validToken,
      refresh_token: endlessToken
    });

    const result = await auth.renew(endlessToken);

    expect(result).toBeTruthy();
    expect(result.jwt).toEqual(validToken);
    expect(result.refreshToken).toEqual(endlessToken);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith();
  });

  it('should gracefully return the error response', async () => {
    utils.getOidcDiscovery.mockResolvedValue(discovery);
    mockAxios.onPost(url).reply(400, {
      error: 'invalid_grant',
      error_description: 'Maximum allowed refresh token reuse exceeded'
    });

    const result = await auth.renew(endlessToken);

    expect(result).toBeTruthy();
    expect(result.error).toEqual('invalid_grant');
    expect(result.error_description).toEqual('Maximum allowed refresh token reuse exceeded');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith();
  });
});

describe('refreshJWT', () => {
  const spy = jest.spyOn(auth, 'renew');
  jest.mock('../../../src/components/auth');

  afterEach(() => {
    spy.mockClear();
  });

  it('should not have a user if no user or jwt exists', async () => {
    const result = await auth.refreshJWT({}, null, () => {});
    expect(result).toBeUndefined();
  });

  it('should not have a user if jwt is still valid', async () => {
    const result = await auth.refreshJWT({
      user: {
        jwt: validToken,
        refreshToken: endlessToken
      }
    }, null, () => {});
    expect(result).toBeUndefined();
  });

  it('should not have a user if jwt and refresh token are expired', async () => {
    const result = await auth.refreshJWT({
      user: {
        jwt: expiredToken,
        refreshToken: expiredToken
      }
    }, null, () => {});
    expect(result).toBeUndefined();
  });

  it('should have a user if refresh token is renewable', async () => {
    auth.renew.mockResolvedValue({
      jwt: validToken,
      refreshToken: endlessToken
    });

    const result = await auth.refreshJWT({
      user: {
        jwt: expiredToken,
        refreshToken: endlessToken
      }
    }, null, () => {});
    expect(result).toBeUndefined();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(endlessToken);
  });

  it('should gracefully fail and continue', async () => {
    auth.renew.mockRejectedValue({
      error: 'invalid_grant',
      error_description: 'Maximum allowed refresh token reuse exceeded'
    });

    const result = await auth.refreshJWT({
      user: {
        jwt: expiredToken,
        refreshToken: endlessToken
      }
    }, null, () => {});
    expect(result).toBeUndefined();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(endlessToken);
  });
});

describe('updateDBFromToken', () => {
  it('should be a pass-through if there is no user', async () => {
    const result = await auth.updateDBFromToken({}, null, () => {});
    expect(result).toBeUndefined();
  });

  it('should be a pass-through if there is no jwt', async () => {
    const result = await auth.updateDBFromToken({
      user: {}
    }, null, () => {});
    expect(result).toBeUndefined();
  });

  it('should add users and acronyms to DB if they do not exist', async () => {
    acronymService.findOrCreateList = jest.fn().mockResolvedValue();
    userService.findOrCreate = jest.fn().mockResolvedValue();
    userService.addAcronym = jest.fn().mockResolvedValue();

    const spyFindOrCreateList = jest.spyOn(acronymService, 'findOrCreateList');

    const spyFindOrCreate = jest.spyOn(userService, 'findOrCreate');
    const spyAddAcronym = jest.spyOn(userService, 'addAcronym');

    const result = await auth.updateDBFromToken({
      user: {
        _json: {},
        id: userId,
        jwt: validToken
      }
    }, null, () => {});
    expect(result).toBeUndefined();
    expect(spyFindOrCreateList).toHaveBeenCalledTimes(1);
    expect(spyFindOrCreate).toHaveBeenCalledTimes(1);
    expect(spyAddAcronym).toHaveBeenCalledTimes(2);
  });
});
