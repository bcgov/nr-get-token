const axios = require('axios');
const config = require('config');
const crypto = require('crypto');
const cryptico = require('cryptico-js');
const MockAdapter = require('axios-mock-adapter');

const helper = require('../../common/helper');

const utils = require('../../../src/components/utils');

helper.logHelper();

const mockAxios = new MockAdapter(axios);

const webadeList = require('./fixtures/webadeList.json');
const webadeListWithInsecurePrefs = require('./fixtures/webadeListWithInsecurePrefs.json');

describe('filterForInsecurePrefs', () => {
  it('should return a list of webade configs with insecure prefs', async () => {

    const result = await utils.filterForInsecurePrefs(webadeListWithInsecurePrefs, 'password|secret');

    expect(result).toBeTruthy();
    expect(result).toHaveLength(2);
    expect(result[0].applicationAcronym).toEqual('ALTERNATE_API');
    expect(result[1].applicationAcronym).toEqual('TEST_APP');
    expect(result[0].preferences).toHaveLength(2);
    expect(result[1].preferences).toHaveLength(1);
  });

  it('should not return a list of webade configs when there are 0 insecure prefs', async () => {
    const result = await utils.filterForInsecurePrefs(webadeList, 'password|secret');
    expect(result).toHaveLength(0);
  });

  it('should exception on an empty list', () => {
    expect(() => { utils.filterForInsecurePrefs([], 'password|secret'); }).toThrow(Error);
  });
});

describe('filterWebAdeDependencies', () => {
  it('should return a list of webade config dependencies', async () => {

    const result = await utils.filterWebAdeDependencies(webadeList, 'DMS');

    expect(result).toBeTruthy();
    expect(result).toHaveLength(1);
    expect(result[0].applicationAcronym).toEqual('EXAMPLE2_API');
  });

  it('should throw on bad input', async () => {
    expect(() => { utils.filterWebAdeDependencies(undefined, 'DMS'); }).toThrow(Error);
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

describe('getKeyCloakToken', () => {
  const endpoint = config.get('serviceClient.ches.tokenEndpoint');
  const username = config.get('serviceClient.ches.username');
  const password = config.get('serviceClient.ches.password');

  beforeEach(() => {
    mockAxios.resetHistory();
  });

  it('should call KC endpoint to get a token', async () => {
    const tkn = 'hsdfs79fsdiufhew89ijsdf9.dshufu9dshf98dsfhsdf.89sdhfs8d9hfuh';
    mockAxios.onPost().reply(200, {
      data: {
        'access_token': tkn,
        'expires_in': 300,
        'refresh_expires_in': 1800,
        'refresh_token': 'sdklfjkdskjf87.sdiohfsduh8.sdfioj898',
        'token_type': 'bearer',
        'not-before-policy': 0,
        'session_state': 'f4464085-3cbc-498b-96d3-0a33837d2ae8',
        'scope': ''
      }
    });

    const result = await utils.getKeyCloakToken(username, password, endpoint);

    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');

    expect(result.data).toBeTruthy();
    expect(result.data.access_token).toEqual(tkn);
    expect(mockAxios.history.post).toHaveLength(1);
    expect(mockAxios.history.post[0].auth).toEqual({
      username: username,
      password: password
    });
    expect(mockAxios.history.post[0].headers['Content-Type'])
      .toMatch('application/x-www-form-urlencoded');
  });

  it('should gracefully fail if endpoint is down', async () => {
    mockAxios.onPost().reply(400, {
      data: {
        'error': 'invalid_request',
        'error_description': 'Invalid grant_type'
      }
    });

    const result = await utils.getKeyCloakToken(username, password, endpoint);

    expect(result).toBeTruthy();
    expect(mockAxios.history.post).toHaveLength(1);
  });
});

describe('getWebAdeToken', () => {
  const endpoint = config.get('serviceClient.webAde.int.endpoint');
  const username = config.get('serviceClient.webAde.int.username');
  const password = config.get('serviceClient.webAde.int.password');
  const scope = 'WEBADE-REST';
  const url = endpoint.replace('webade-api', 'oauth2') + '/oauth/token';

  beforeEach(() => {
    mockAxios.resetHistory();
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
    expect(mockAxios.history.get).toHaveLength(1);
    expect(mockAxios.history.get[0].auth).toEqual({
      username: username,
      password: password
    });
    expect(mockAxios.history.get[0].params).toEqual({
      disableDeveloperFilter: true,
      grant_type: 'client_credentials',
      scope: scope
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
    expect(mockAxios.history.get).toHaveLength(1);
    expect(mockAxios.history.get[0].auth).toEqual({
      username: username,
      password: password
    });
    expect(mockAxios.history.get[0].params).toEqual({
      disableDeveloperFilter: true,
      grant_type: 'client_credentials',
      scope: 'GARBAGE'
    });
  });
});
