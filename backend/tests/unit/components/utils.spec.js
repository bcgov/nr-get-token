const axios = require('axios');
const config = require('config');
const crypto = require('crypto');
const cryptico = require('cryptico-js');
const log = require('npmlog');
const MockAdapter = require('axios-mock-adapter');

const utils = require('../../../src/components/utils');

log.level = config.get('server.logLevel');
const mockAxios = new MockAdapter(axios);

describe('getWebAdeToken', () => {
  const endpoint = config.get('serviceClient.getokInt.endpoint');
  const username = config.get('serviceClient.getokInt.username');
  const password = config.get('serviceClient.getokInt.password');
  const scope = 'WEBADE-REST';
  const url = endpoint.replace('webade-api', 'oauth2') + '/oauth/token';

  const spy = jest.spyOn(axios, 'get');

  afterEach(() => {
    spy.mockClear();
  });

  it('should call WebADE endpoint to get a token', async () => {
    mockAxios.onGet(url).reply(200, {
      data: {
        'access_token': '00000000-0000-0000-0000-000000000000',
        'token_type': 'bearer',
        'expires_in': 43199,
        'scope': 'scopes',
        'jti': '00000000-0000-0000-0000-000000000000'
      }
    });

    const result = await utils.getWebAdeToken(username, password, scope);

    expect(result).toBeTruthy();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(url, {
      auth: {
        username: username,
        password: password
      },
      params: {
        disableDeveloperFilter: true,
        grant_type: 'client_credentials',
        scope: scope
      }
    });
  });

  it('should gracefully fail if endpoint is down', async () => {
    mockAxios.onGet(url).reply(400, {
      data: {
        'error': 'invalid_scope',
        'error_description': 'Invalid application authority: GARBAGE. Client has not been granted the requested application authority...',
        'scope': ''
      }
    });

    const result = await utils.getWebAdeToken(username, password, 'GARBAGE');

    expect(result).toBeTruthy();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(url, {
      auth: {
        username: username,
        password: password
      },
      params: {
        disableDeveloperFilter: true,
        grant_type: 'client_credentials',
        scope: 'GARBAGE'
      }
    });
  });
});

describe('getOidcDiscovery', () => {
  const url = config.get('oidc.discovery');
  const spy = jest.spyOn(axios, 'get');

  afterEach(() => {
    spy.mockClear();
  });

  it('should gracefully fail if endpoint is down', async () => {
    mockAxios.onGet(url).networkErrorOnce();

    const result = await utils.getOidcDiscovery();

    expect(result).toBeFalsy();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(url);
  });

  it('should get and cache OIDC Discovery data', async () => {
    mockAxios.onGet(url).reply(200, {
      data: {
        issuer: 'issuerurl',
        authorization_endpoint: 'authurl',
        token_endpoint: 'tokenurl'
      }
    });

    await utils.getOidcDiscovery();
    const result = await utils.getOidcDiscovery();

    expect(result).toBeTruthy();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(url);
  });
});

describe('generateEncryptPassword', () => {
  const uniqueSeed = crypto.randomBytes(20).toString('hex');
  const pubKey = cryptico.generateRSAKey(uniqueSeed, 1024);
  const pubKeyString = cryptico.publicKeyString(pubKey);

  it('should generate a password of a specified length', () => {
    const result = utils.generateEncryptPassword(pubKeyString, 15);

    expect(result.password).toBeTruthy();
    expect(result.password).toHaveLength(15);
  });

  it('should yield a valid value encrypted by a key', () => {
    const result = utils.generateEncryptPassword(pubKeyString);
    const decrypted = cryptico.decrypt(result.encryptedPassword, pubKey);

    expect(result.password).toBeTruthy();
    expect(result.encryptedPassword).toBeTruthy();
    expect(decrypted.plaintext).toEqual(result.password);
  });
});

describe('prettyStringify', () => {
  const obj = {
    foo: 'bar'
  };

  it('should return a formatted json string with 2 space indent', () => {
    const result = utils.prettyStringify(obj);

    expect(result).toBeTruthy();
    expect(result).toEqual('{\n  "foo": "bar"\n}');
  });

  it('should return a formatted json string with 4 space indent', () => {
    const result = utils.prettyStringify(obj, 4);

    expect(result).toBeTruthy();
    expect(result).toEqual('{\n    "foo": "bar"\n}');
  });
});

describe('toPascalCase', () => {
  it('should return a string', () => {
    const string = 'test foo bar';
    const result = utils.toPascalCase(string);

    expect(result).toBeTruthy();
    expect(result).toMatch(/[A-Z][a-z]+(?:[A-Z][a-z]+)*/);
  });
});


describe('filterAppAcronymRoles', () => {
  it('should return the filtered acronym list', () => {
    const roles = ['offline_access','uma_authorization','WEBADE_CFG_READ','WEBADE_CFG_READ_ALL','DOMO','MSSC'];
    const result = utils.filterAppAcronymRoles(roles);

    expect(result).toBeTruthy();
    expect(result).toHaveLength(2);
  });

  it('should handle an empty array', () => {
    const roles = [];
    const result = utils.filterAppAcronymRoles(roles);
    expect(result).toBeTruthy();
    expect(result).toHaveLength(0);
  });
});
