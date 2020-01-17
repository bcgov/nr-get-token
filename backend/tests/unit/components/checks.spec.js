const config = require('config');
const log = require('npmlog');

const checks = require('../../../src/components/checks');
const utils = require('../../../src/components/utils');

log.level = config.get('server.logLevel');

describe('getWebAdeOauth2Status', () => {
  const username = config.get('serviceClient.getokInt.username');
  const password = config.get('serviceClient.getokInt.password');
  const scope = 'WEBADE-REST';
  const webadeEnv = 'INT';

  const spy = jest.spyOn(utils, 'getWebAdeToken');
  jest.mock('../../../src/components/utils');

  afterEach(() => {
    spy.mockClear();
  });

  it('should return the state of endpoint', async () => {
    utils.getWebAdeToken.mockResolvedValue({
      access_token: '00000000-0000-0000-0000-000000000000',
      token_type: 'bearer',
      expires_in: 43199,
      scope: 'WEBADE-REST.UPDATEAPPLICATIONS',
      jti: '00000000-0000-0000-0000-000000000000'
    });

    const result = await checks.getWebAdeOauth2Status();

    expect(result).toBeTruthy();
    expect(result.authenticated).toBeTruthy();
    expect(result.authorized).toBeTruthy();
    expect(result.healthCheck).toBeTruthy();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(username, password, scope, webadeEnv);
  });

  it('should gracefully fail and return the state of the endpoint', async () => {
    utils.getWebAdeToken.mockRejectedValue('Unauthorized');

    const result = await checks.getWebAdeOauth2Status();

    expect(result).toBeTruthy();
    expect(result.authenticated).toBeFalsy();
    expect(result.authorized).toBeFalsy();
    expect(result.healthCheck).toBeFalsy();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(username, password, scope, webadeEnv);
  });
});
